-- =============================================================================
-- Cratery: full database schema (fresh Supabase project)
--
-- Setup: run this file in the Supabase SQL Editor.
-- For schema changes on an existing project, edit this file and apply the
-- relevant CREATE OR REPLACE / ALTER statements in the SQL Editor.
--
-- Auth model:
--   - Browser uses the anon key + custom JWTs (Cloudflare Worker), not Supabase Auth.
--   - auth.uid() is NULL for client requests.
--   - Quest writes go through Cloudflare Worker (/api/quest-*).
--   - Public RPCs are read-only aggregates (SECURITY DEFINER where they touch
--     quest_answer_stats / quest_answers). Guests never write quest_answers rows.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;

-- =============================================================================
-- TABLES
-- =============================================================================

CREATE TABLE public.custom_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    username TEXT NOT NULL,
    display_name TEXT,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    newsletter_opt_in BOOLEAN NOT NULL DEFAULT TRUE,

    verification_token TEXT,
    verification_expires TIMESTAMPTZ,

    reset_token TEXT,
    reset_expires TIMESTAMPTZ,

    -- JWTs with iat before this timestamp are rejected (set on password reset).
    tokens_valid_after TIMESTAMPTZ NOT NULL DEFAULT 'epoch',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login TIMESTAMPTZ,

    CONSTRAINT custom_users_username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 20),
    CONSTRAINT custom_users_username_format CHECK (username ~ '^[a-zA-Z0-9_]+$'),
    CONSTRAINT custom_users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Migration for databases created before newsletter preferences were added.
ALTER TABLE public.custom_users
    ADD COLUMN IF NOT EXISTS newsletter_opt_in BOOLEAN NOT NULL DEFAULT TRUE;

CREATE UNIQUE INDEX idx_custom_users_email_ci ON public.custom_users (lower(email));
CREATE UNIQUE INDEX idx_custom_users_username_ci ON public.custom_users (lower(username));
CREATE INDEX idx_custom_users_verification_token ON public.custom_users (verification_token)
    WHERE verification_token IS NOT NULL;
CREATE INDEX idx_custom_users_reset_token ON public.custom_users (reset_token)
    WHERE reset_token IS NOT NULL;

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES public.custom_users (id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    avatar JSONB,
    author_xp INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT profiles_author_xp_range CHECK (author_xp >= 0 AND author_xp <= 1000000)
);

CREATE INDEX idx_profiles_username ON public.profiles (username);

-- Signed-in progress only. Guests bump quest_answer_stats without inserting here.
CREATE TABLE public.quest_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
    question_id TEXT NOT NULL,
    category_slug TEXT NOT NULL,
    selected_index INT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    xp_earned INT NOT NULL DEFAULT 0,
    answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT quest_answers_selected_index_range CHECK (selected_index >= 0 AND selected_index <= 3),
    CONSTRAINT quest_answers_xp_range CHECK (xp_earned >= 0 AND xp_earned <= 10),
    CONSTRAINT quest_answers_user_question UNIQUE (user_id, question_id)
);

CREATE INDEX idx_quest_answers_user_id ON public.quest_answers (user_id);
CREATE INDEX idx_quest_answers_question_id ON public.quest_answers (question_id);
CREATE INDEX idx_quest_answers_category ON public.quest_answers (category_slug);
CREATE INDEX idx_quest_answers_answered_at ON public.quest_answers (answered_at);

-- Public attempt counters (signed-in rows + guest increments). One row per question.
CREATE TABLE public.quest_answer_stats (
    question_id TEXT PRIMARY KEY,
    solve_count BIGINT NOT NULL DEFAULT 0,
    correct_count BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT quest_answer_stats_counts_nonneg CHECK (solve_count >= 0 AND correct_count >= 0),
    CONSTRAINT quest_answer_stats_correct_lte_solve CHECK (correct_count <= solve_count)
);

CREATE TABLE public.quest_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
    question_id TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT quest_ratings_user_question UNIQUE (user_id, question_id)
);

CREATE INDEX idx_quest_ratings_user_id ON public.quest_ratings (user_id);
CREATE INDEX idx_quest_ratings_question_id ON public.quest_ratings (question_id);

-- Best accepted full-submit per user per contest. Ranked by run_ms, then memory_kb.
-- run_ms stores microseconds of /tmp/job (column name kept).
CREATE TABLE public.contest_scores (
    user_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
    contest_id TEXT NOT NULL,
    run_ms INT NOT NULL,
    memory_kb INT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, contest_id),
    CONSTRAINT contest_scores_id_format CHECK (
        contest_id ~ '^[a-z0-9][a-z0-9-]{1,78}[a-z0-9]$'
    ),
    CONSTRAINT contest_scores_run_ms_range CHECK (run_ms >= 0 AND run_ms <= 60000000),
    CONSTRAINT contest_scores_memory_kb_range CHECK (memory_kb >= 0 AND memory_kb <= 2097152)
);

CREATE INDEX idx_contest_scores_board
    ON public.contest_scores (contest_id, run_ms, memory_kb, updated_at);

-- One row per contest_id after a successful Customer.io weekly broadcast trigger.
CREATE TABLE public.contest_email_sends (
    contest_id TEXT PRIMARY KEY,
    triggered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT contest_email_sends_id_format CHECK (
        contest_id ~ '^[a-z0-9][a-z0-9-]{1,78}[a-z0-9]$'
    )
);

-- =============================================================================
-- ROW LEVEL SECURITY + GRANTS
-- =============================================================================

ALTER TABLE public.custom_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_answer_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_email_sends ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.custom_users FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.profiles FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.quest_answers FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.quest_answer_stats FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.quest_ratings FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.contest_scores FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.contest_email_sends FROM PUBLIC, anon, authenticated;

GRANT SELECT (username) ON TABLE public.custom_users TO anon, authenticated;
CREATE POLICY custom_users_select_username
    ON public.custom_users
    FOR SELECT
    TO anon, authenticated
    USING (true);

GRANT SELECT ON TABLE public.profiles TO anon, authenticated;
CREATE POLICY profiles_select_public
    ON public.profiles
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- No direct SELECT for clients — aggregates via Worker + DEFINER RPCs;
-- personal history via the Worker (service role).
REVOKE SELECT ON TABLE public.quest_answers FROM PUBLIC, anon, authenticated;
CREATE POLICY quest_answers_deny_direct
    ON public.quest_answers
    FOR ALL
    TO anon, authenticated
    USING (false)
    WITH CHECK (false);

REVOKE SELECT ON TABLE public.quest_answer_stats FROM PUBLIC, anon, authenticated;
CREATE POLICY quest_answer_stats_deny_direct
    ON public.quest_answer_stats
    FOR ALL
    TO anon, authenticated
    USING (false)
    WITH CHECK (false);

-- Ratings are personal; load via Worker (/api/my-progress), not PostgREST.
REVOKE SELECT ON TABLE public.quest_ratings FROM PUBLIC, anon, authenticated;
CREATE POLICY quest_ratings_deny_direct
    ON public.quest_ratings
    FOR ALL
    TO anon, authenticated
    USING (false)
    WITH CHECK (false);

REVOKE SELECT ON TABLE public.contest_scores FROM PUBLIC, anon, authenticated;
CREATE POLICY contest_scores_deny_direct
    ON public.contest_scores
    FOR ALL
    TO anon, authenticated
    USING (false)
    WITH CHECK (false);

REVOKE SELECT ON TABLE public.contest_email_sends FROM PUBLIC, anon, authenticated;
CREATE POLICY contest_email_sends_deny_direct
    ON public.contest_email_sends
    FOR ALL
    TO anon, authenticated
    USING (false)
    WITH CHECK (false);

-- =============================================================================
-- PRIVATE TRIGGER HELPERS
-- =============================================================================

CREATE OR REPLACE FUNCTION private.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION private.set_updated_at() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION private.sync_custom_user_to_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF NEW.email_verified = TRUE AND (OLD IS NULL OR OLD.email_verified = FALSE) THEN
        INSERT INTO public.profiles (id, username, created_at)
        VALUES (NEW.id, NEW.username, NEW.created_at)
        ON CONFLICT (id) DO UPDATE SET
            username = EXCLUDED.username,
            updated_at = NOW();
    END IF;
    RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION private.sync_custom_user_to_profile() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER custom_users_set_updated_at
    BEFORE UPDATE ON public.custom_users
    FOR EACH ROW
    EXECUTE FUNCTION private.set_updated_at();

CREATE TRIGGER profiles_set_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION private.set_updated_at();

CREATE TRIGGER quest_answers_set_updated_at
    BEFORE UPDATE ON public.quest_answers
    FOR EACH ROW
    EXECUTE FUNCTION private.set_updated_at();

-- Single write path for public counters (Worker guests + signed-in insert trigger).
CREATE OR REPLACE FUNCTION public.increment_quest_answer_stats(
    p_question_id TEXT,
    p_is_correct BOOLEAN
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF p_question_id IS NULL OR length(trim(p_question_id)) = 0 THEN
        RAISE EXCEPTION 'question_id required';
    END IF;

    INSERT INTO public.quest_answer_stats (question_id, solve_count, correct_count)
    VALUES (trim(p_question_id), 1, CASE WHEN p_is_correct THEN 1 ELSE 0 END)
    ON CONFLICT (question_id) DO UPDATE SET
        solve_count = public.quest_answer_stats.solve_count + 1,
        correct_count = public.quest_answer_stats.correct_count
            + CASE WHEN p_is_correct THEN 1 ELSE 0 END,
        updated_at = NOW();
END;
$$;

REVOKE ALL ON FUNCTION public.increment_quest_answer_stats(TEXT, BOOLEAN) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_quest_answer_stats(TEXT, BOOLEAN) TO service_role;

CREATE OR REPLACE FUNCTION private.bump_quest_answer_stats_on_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    PERFORM public.increment_quest_answer_stats(NEW.question_id, NEW.is_correct);
    RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION private.bump_quest_answer_stats_on_insert() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER quest_answers_bump_stats_insert
    AFTER INSERT ON public.quest_answers
    FOR EACH ROW
    EXECUTE FUNCTION private.bump_quest_answer_stats_on_insert();

CREATE TRIGGER quest_ratings_set_updated_at
    BEFORE UPDATE ON public.quest_ratings
    FOR EACH ROW
    EXECUTE FUNCTION private.set_updated_at();

CREATE TRIGGER on_custom_user_verified
    AFTER INSERT OR UPDATE ON public.custom_users
    FOR EACH ROW
    EXECUTE FUNCTION private.sync_custom_user_to_profile();

-- =============================================================================
-- PUBLIC RPCs
-- =============================================================================

CREATE OR REPLACE FUNCTION public.check_custom_username_available(p_username TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1
        FROM public.custom_users
        WHERE lower(username) = lower(p_username)
    );
END;
$$;

REVOKE ALL ON FUNCTION public.check_custom_username_available(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_custom_username_available(TEXT) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_user_stats(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_total_xp BIGINT;
    v_total_quests BIGINT;
    v_correct_count BIGINT;
    v_wrong_count BIGINT;
BEGIN
    IF p_user_id IS NULL THEN
        RETURN jsonb_build_object(
            'total_xp', 0,
            'total_quests', 0,
            'correct_count', 0,
            'wrong_count', 0
        );
    END IF;

    SELECT
        COALESCE(SUM(xp_earned), 0),
        COUNT(*),
        COUNT(*) FILTER (WHERE is_correct = TRUE),
        COUNT(*) FILTER (WHERE is_correct = FALSE)
    INTO v_total_xp, v_total_quests, v_correct_count, v_wrong_count
    FROM public.quest_answers
    WHERE user_id = p_user_id;

    RETURN jsonb_build_object(
        'total_xp', v_total_xp,
        'total_quests', v_total_quests,
        'correct_count', v_correct_count,
        'wrong_count', v_wrong_count
    );
END;
$$;

REVOKE ALL ON FUNCTION public.get_user_stats(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_stats(UUID) TO service_role;

-- Durable rate limiter (Worker / service_role only).
CREATE TABLE IF NOT EXISTS public.api_rate_limits (
    bucket_key TEXT PRIMARY KEY,
    hit_count INT NOT NULL DEFAULT 0,
    window_start TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_api_rate_limits_window_start
    ON public.api_rate_limits (window_start);

ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.api_rate_limits FROM PUBLIC, anon, authenticated;
CREATE POLICY api_rate_limits_deny_direct
    ON public.api_rate_limits
    FOR ALL
    TO anon, authenticated
    USING (false)
    WITH CHECK (false);

CREATE OR REPLACE FUNCTION public.consume_rate_limit(
    p_key TEXT,
    p_max INT,
    p_window_seconds INT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_count INT;
    v_now TIMESTAMPTZ := NOW();
BEGIN
    IF p_key IS NULL OR length(trim(p_key)) = 0 OR length(p_key) > 128 THEN
        RETURN FALSE;
    END IF;
    IF p_max IS NULL OR p_max < 1 OR p_window_seconds IS NULL OR p_window_seconds < 1 THEN
        RETURN FALSE;
    END IF;

    -- Keep storage bounded without adding a scheduler or cleanup service.
    -- Under sustained traffic this runs often; under no traffic no rows are added.
    IF random() < 0.01 THEN
        DELETE FROM public.api_rate_limits
        WHERE window_start < v_now - INTERVAL '2 days';
    END IF;

    INSERT INTO public.api_rate_limits (bucket_key, hit_count, window_start)
    VALUES (p_key, 1, v_now)
    ON CONFLICT (bucket_key) DO UPDATE
    SET
        hit_count = CASE
            WHEN public.api_rate_limits.window_start + make_interval(secs => p_window_seconds) < v_now
                THEN 1
            ELSE public.api_rate_limits.hit_count + 1
        END,
        window_start = CASE
            WHEN public.api_rate_limits.window_start + make_interval(secs => p_window_seconds) < v_now
                THEN v_now
            ELSE public.api_rate_limits.window_start
        END
    RETURNING hit_count INTO v_count;

    RETURN v_count <= p_max;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_rate_limit(TEXT, INT, INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_rate_limit(TEXT, INT, INT) TO service_role;

-- =============================================================================
-- USER QUESTS + PUBLIC AGGREGATES
-- =============================================================================

CREATE TABLE public.user_quests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    prompt TEXT NOT NULL,
    -- mcq | coding (coding uses code as starter + test_harness with {{SOLUTION}})
    kind TEXT NOT NULL DEFAULT 'mcq',
    code TEXT,
    test_harness TEXT,
    options JSONB NOT NULL,
    correct_index INT NOT NULL,
    hint TEXT,
    explanation TEXT NOT NULL,
    difficulty INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT user_quests_kind CHECK (kind IN ('mcq', 'coding')),
    CONSTRAINT user_quests_slug_format CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    CONSTRAINT user_quests_slug_length CHECK (char_length(slug) >= 3 AND char_length(slug) <= 60),
    CONSTRAINT user_quests_title_length CHECK (char_length(title) >= 5 AND char_length(title) <= 120),
    CONSTRAINT user_quests_prompt_length CHECK (char_length(prompt) >= 10 AND char_length(prompt) <= 2000),
    CONSTRAINT user_quests_explanation_length CHECK (char_length(explanation) >= 0 AND char_length(explanation) <= 4000),
    CONSTRAINT user_quests_code_length CHECK (code IS NULL OR char_length(code) <= 8000),
    CONSTRAINT user_quests_harness_length CHECK (test_harness IS NULL OR char_length(test_harness) <= 16000),
    CONSTRAINT user_quests_options_shape CHECK (
        jsonb_typeof(options) = 'array' AND jsonb_array_length(options) = 4
    ),
    CONSTRAINT user_quests_correct_index_range CHECK (correct_index >= 0 AND correct_index <= 3),
    CONSTRAINT user_quests_difficulty_range CHECK (difficulty >= 1 AND difficulty <= 3),
    CONSTRAINT user_quests_author_slug UNIQUE (author_id, slug),
    CONSTRAINT user_quests_coding_needs_harness CHECK (
        kind <> 'coding' OR (test_harness IS NOT NULL AND position('{{SOLUTION}}' in test_harness) > 0)
    )
);

CREATE INDEX idx_user_quests_author ON public.user_quests (author_id);
CREATE INDEX idx_user_quests_created ON public.user_quests (created_at DESC);

ALTER TABLE public.user_quests ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.user_quests FROM PUBLIC, anon, authenticated;
-- Public can read the quiz prompt, not the answer key / explanation.
GRANT SELECT (
    id,
    author_id,
    slug,
    title,
    prompt,
    kind,
    code,
    test_harness,
    options,
    hint,
    difficulty,
    created_at,
    updated_at
) ON TABLE public.user_quests TO anon, authenticated;
CREATE POLICY user_quests_select_public
    ON public.user_quests
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE TRIGGER user_quests_set_updated_at
    BEFORE UPDATE ON public.user_quests
    FOR EACH ROW
    EXECUTE FUNCTION private.set_updated_at();

-- Interactive User Notes & Notebooks (Google Colab for Rust)
CREATE TABLE public.user_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    tags TEXT[] NOT NULL DEFAULT '{}',
    cells JSONB NOT NULL DEFAULT '[]'::jsonb,
    views_count BIGINT NOT NULL DEFAULT 0,
    runs_count BIGINT NOT NULL DEFAULT 0,
    forks_count BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT user_notes_author_slug UNIQUE (author_id, slug),
    CONSTRAINT user_notes_slug_format CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    CONSTRAINT user_notes_slug_length CHECK (char_length(slug) >= 2 AND char_length(slug) <= 80),
    CONSTRAINT user_notes_title_length CHECK (char_length(title) >= 2 AND char_length(title) <= 140),
    CONSTRAINT user_notes_description_length CHECK (char_length(description) <= 1000)
);

CREATE INDEX idx_user_notes_author ON public.user_notes (author_id, created_at DESC);
CREATE INDEX idx_user_notes_public ON public.user_notes (is_public, created_at DESC);
CREATE INDEX idx_user_notes_slug ON public.user_notes (slug);
CREATE INDEX idx_user_notes_views ON public.user_notes (views_count DESC);
CREATE INDEX idx_user_notes_runs ON public.user_notes (runs_count DESC);

ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.user_notes TO anon, authenticated;

CREATE POLICY user_notes_select_public
    ON public.user_notes
    FOR SELECT
    TO anon, authenticated
    USING (is_public = TRUE);

CREATE TRIGGER user_notes_set_updated_at
    BEFORE UPDATE ON public.user_notes
    FOR EACH ROW
    EXECUTE FUNCTION private.set_updated_at();

CREATE OR REPLACE FUNCTION public.increment_note_views(p_note_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF p_note_id IS NULL THEN
        RETURN;
    END IF;

    UPDATE public.user_notes
    SET views_count = public.user_notes.views_count + 1
    WHERE id = p_note_id;
END;
$$;

REVOKE ALL ON FUNCTION public.increment_note_views(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_note_views(UUID) TO service_role;

CREATE OR REPLACE FUNCTION public.increment_note_runs(p_note_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF p_note_id IS NULL THEN
        RETURN;
    END IF;

    UPDATE public.user_notes
    SET runs_count = public.user_notes.runs_count + 1
    WHERE id = p_note_id;
END;
$$;

REVOKE ALL ON FUNCTION public.increment_note_runs(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_note_runs(UUID) TO service_role;

-- Quest reports for official + community (Worker inserts only; review in table editor).
-- question_id matches quest_answers: builtin id or uq:{uuid}.
CREATE TABLE public.quest_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id TEXT NOT NULL,
    reason TEXT NOT NULL,
    reporter_id UUID REFERENCES public.profiles (id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT quest_reports_question_id_length CHECK (
        char_length(question_id) >= 1 AND char_length(question_id) <= 80
    ),
    CONSTRAINT quest_reports_reason_length CHECK (
        char_length(reason) >= 3 AND char_length(reason) <= 1000
    )
);

CREATE INDEX idx_quest_reports_created ON public.quest_reports (created_at DESC);
CREATE INDEX idx_quest_reports_question ON public.quest_reports (question_id);

ALTER TABLE public.quest_reports ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.quest_reports FROM PUBLIC, anon, authenticated;
CREATE POLICY quest_reports_deny_direct
    ON public.quest_reports
    FOR ALL
    TO anon, authenticated
    USING (false)
    WITH CHECK (false);

-- Quest comments (official + community). Worker-mediated writes.
CREATE TABLE public.quest_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT quest_comments_question_id_length CHECK (
        char_length(question_id) >= 1 AND char_length(question_id) <= 80
    ),
    CONSTRAINT quest_comments_body_length CHECK (
        char_length(body) >= 1 AND char_length(body) <= 2000
    )
);

CREATE INDEX idx_quest_comments_question_created
    ON public.quest_comments (question_id, created_at ASC);
CREATE INDEX idx_quest_comments_author ON public.quest_comments (author_id);

ALTER TABLE public.quest_comments ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.quest_comments FROM PUBLIC, anon, authenticated;
CREATE POLICY quest_comments_deny_direct
    ON public.quest_comments
    FOR ALL
    TO anon, authenticated
    USING (false)
    WITH CHECK (false);

CREATE TRIGGER quest_comments_set_updated_at
    BEFORE UPDATE ON public.quest_comments
    FOR EACH ROW
    EXECUTE FUNCTION private.set_updated_at();

-- Ownership / thread binding cannot be reassigned even via service_role mistakes.
CREATE OR REPLACE FUNCTION private.quest_comments_immutable_owner()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF NEW.author_id IS DISTINCT FROM OLD.author_id THEN
        RAISE EXCEPTION 'quest_comments.author_id is immutable';
    END IF;
    IF NEW.question_id IS DISTINCT FROM OLD.question_id THEN
        RAISE EXCEPTION 'quest_comments.question_id is immutable';
    END IF;
    RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION private.quest_comments_immutable_owner() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER quest_comments_immutable_owner
    BEFORE UPDATE ON public.quest_comments
    FOR EACH ROW
    EXECUTE FUNCTION private.quest_comments_immutable_owner();

-- Comment reports (Worker inserts only).
CREATE TABLE public.comment_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id UUID NOT NULL REFERENCES public.quest_comments (id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    reporter_id UUID REFERENCES public.profiles (id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT comment_reports_reason_length CHECK (
        char_length(reason) >= 3 AND char_length(reason) <= 1000
    )
);

CREATE INDEX idx_comment_reports_created ON public.comment_reports (created_at DESC);
CREATE INDEX idx_comment_reports_comment ON public.comment_reports (comment_id);

ALTER TABLE public.comment_reports ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.comment_reports FROM PUBLIC, anon, authenticated;
CREATE POLICY comment_reports_deny_direct
    ON public.comment_reports
    FOR ALL
    TO anon, authenticated
    USING (false)
    WITH CHECK (false);

CREATE OR REPLACE FUNCTION public.get_public_profile(p_username TEXT)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_profile RECORD;
    v_stats JSONB;
    v_quests JSONB;
BEGIN
    SELECT id, username, created_at, avatar
    INTO v_profile
    FROM public.profiles
    WHERE lower(username) = lower(p_username);

    IF NOT FOUND THEN
        RETURN NULL;
    END IF;

    v_stats := public.get_user_stats(v_profile.id);

    SELECT COALESCE(jsonb_agg(q ORDER BY q.created_at DESC), '[]'::jsonb)
    INTO v_quests
    FROM (
        SELECT
            uq.id,
            uq.slug,
            uq.title,
            uq.difficulty,
            uq.created_at,
            COALESCE(qas.solve_count, 0) AS solve_count,
            COALESCE(qas.correct_count, 0) AS correct_count
        FROM public.user_quests uq
        LEFT JOIN public.quest_answer_stats qas
            ON qas.question_id = 'uq:' || uq.id::text
        WHERE uq.author_id = v_profile.id
        ORDER BY uq.created_at DESC
    ) q;

    RETURN jsonb_build_object(
        'id', v_profile.id,
        'username', v_profile.username,
        'created_at', v_profile.created_at,
        'avatar', v_profile.avatar,
        'stats', v_stats,
        'quests', v_quests
    );
END;
$$;

REVOKE ALL ON FUNCTION public.get_public_profile(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_profile(TEXT) TO service_role;

CREATE OR REPLACE FUNCTION public.get_leaderboard(p_limit INT DEFAULT 25)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN COALESCE((
        SELECT jsonb_agg(row_data)
        FROM (
            SELECT
                p.id,
                p.username,
                p.avatar,
                COALESCE(SUM(qa.xp_earned), 0) AS total_xp,
                COUNT(qa.id) AS total_quests,
                COUNT(qa.id) FILTER (WHERE qa.is_correct) AS correct_count
            FROM public.profiles p
            LEFT JOIN public.quest_answers qa ON qa.user_id = p.id
            GROUP BY p.id, p.username, p.avatar
            HAVING COUNT(qa.id) > 0
            ORDER BY total_xp DESC, correct_count DESC
            LIMIT LEAST(GREATEST(p_limit, 1), 100)
        ) row_data
    ), '[]'::jsonb);
END;
$$;

REVOKE ALL ON FUNCTION public.get_leaderboard(INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_leaderboard(INT) TO service_role;

CREATE OR REPLACE FUNCTION public.upsert_contest_score(
    p_user_id UUID,
    p_contest_id TEXT,
    p_run_ms INT,
    p_memory_kb INT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_count INT;
BEGIN
    IF p_contest_id IS NULL OR p_contest_id !~ '^[a-z0-9][a-z0-9-]{1,78}[a-z0-9]$' THEN
        RAISE EXCEPTION 'invalid contest_id';
    END IF;
    IF p_run_ms IS NULL OR p_run_ms < 0 OR p_run_ms > 60000000 THEN
        RAISE EXCEPTION 'invalid run_ms';
    END IF;
    IF p_memory_kb IS NULL OR p_memory_kb < 0 OR p_memory_kb > 2097152 THEN
        RAISE EXCEPTION 'invalid memory_kb';
    END IF;

    INSERT INTO public.contest_scores AS s (user_id, contest_id, run_ms, memory_kb)
    VALUES (p_user_id, p_contest_id, p_run_ms, p_memory_kb)
    ON CONFLICT (user_id, contest_id) DO UPDATE SET
        run_ms = EXCLUDED.run_ms,
        memory_kb = EXCLUDED.memory_kb,
        updated_at = NOW()
    WHERE (EXCLUDED.run_ms, EXCLUDED.memory_kb) < (s.run_ms, s.memory_kb);

    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count > 0;
END;
$$;

REVOKE ALL ON FUNCTION public.upsert_contest_score(UUID, TEXT, INT, INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.upsert_contest_score(UUID, TEXT, INT, INT) TO service_role;

CREATE OR REPLACE FUNCTION public.get_contest_leaderboard(
    p_contest_id TEXT,
    p_limit INT DEFAULT 50
)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF p_contest_id IS NULL OR p_contest_id !~ '^[a-z0-9][a-z0-9-]{1,78}[a-z0-9]$' THEN
        RETURN '[]'::jsonb;
    END IF;

    RETURN COALESCE((
        SELECT jsonb_agg(
            jsonb_build_object(
                'id', t.id,
                'username', t.username,
                'avatar', t.avatar,
                'run_ms', t.run_ms,
                'memory_kb', t.memory_kb
            )
            ORDER BY t.run_ms ASC, t.memory_kb ASC, t.updated_at ASC
        )
        FROM (
            SELECT
                p.id,
                p.username,
                p.avatar,
                s.run_ms,
                s.memory_kb,
                s.updated_at
            FROM public.contest_scores s
            JOIN public.profiles p ON p.id = s.user_id
            WHERE s.contest_id = p_contest_id
            ORDER BY s.run_ms ASC, s.memory_kb ASC, s.updated_at ASC
            LIMIT LEAST(GREATEST(COALESCE(p_limit, 50), 1), 100)
        ) t
    ), '[]'::jsonb);
END;
$$;

REVOKE ALL ON FUNCTION public.get_contest_leaderboard(TEXT, INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_contest_leaderboard(TEXT, INT) TO service_role;

-- Global code execution counter and telemetry
CREATE TABLE IF NOT EXISTS public.code_execution_stats (
    id TEXT PRIMARY KEY DEFAULT 'global',
    total_executions BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.code_execution_stats (id, total_executions, updated_at)
VALUES ('global', 0, NOW())
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.code_execution_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS code_execution_stats_deny_direct ON public.code_execution_stats;
REVOKE ALL ON TABLE public.code_execution_stats FROM PUBLIC, anon, authenticated;
CREATE POLICY code_execution_stats_deny_direct
    ON public.code_execution_stats
    FOR ALL
    TO anon, authenticated
    USING (false)
    WITH CHECK (false);

CREATE OR REPLACE FUNCTION public.increment_code_executions(p_count INT DEFAULT 1)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_total BIGINT;
    v_inc INT;
BEGIN
    v_inc := GREATEST(1, COALESCE(p_count, 1));

    INSERT INTO public.code_execution_stats (id, total_executions, updated_at)
    VALUES ('global', v_inc, NOW())
    ON CONFLICT (id) DO UPDATE SET
        total_executions = public.code_execution_stats.total_executions + v_inc,
        updated_at = NOW()
    RETURNING total_executions INTO v_total;

    RETURN v_total;
END;
$$;

REVOKE ALL ON FUNCTION public.increment_code_executions(INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_code_executions(INT) TO service_role;

CREATE OR REPLACE FUNCTION public.get_site_stats()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_members BIGINT;
    v_answers BIGINT;
    v_user_quests BIGINT;
    v_code_executions BIGINT;
BEGIN
    SELECT COUNT(*) INTO v_members FROM public.custom_users;
    SELECT COALESCE(SUM(solve_count), 0) INTO v_answers FROM public.quest_answer_stats;
    SELECT COUNT(*) INTO v_user_quests FROM public.user_quests;
    SELECT COALESCE(SUM(total_executions), 0) INTO v_code_executions FROM public.code_execution_stats;

    RETURN jsonb_build_object(
        'members', v_members,
        'quests_answered', v_answers,
        'quests_created', v_user_quests,
        'code_executions', v_code_executions
    );
END;
$$;

REVOKE ALL ON FUNCTION public.get_site_stats() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_site_stats() TO service_role;

CREATE OR REPLACE FUNCTION public.get_quest_stats(p_question_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_solve BIGINT;
    v_correct BIGINT;
BEGIN
    IF p_question_id IS NULL OR length(trim(p_question_id)) = 0 THEN
        RETURN jsonb_build_object('solve_count', 0, 'correct_count', 0);
    END IF;

    SELECT solve_count, correct_count
    INTO v_solve, v_correct
    FROM public.quest_answer_stats
    WHERE question_id = p_question_id;

    RETURN jsonb_build_object(
        'solve_count', COALESCE(v_solve, 0),
        'correct_count', COALESCE(v_correct, 0)
    );
END;
$$;

REVOKE ALL ON FUNCTION public.get_quest_stats(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_quest_stats(TEXT) TO service_role;

CREATE OR REPLACE FUNCTION public.get_quest_stats_batch(p_question_ids TEXT[])
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN COALESCE((
        SELECT jsonb_object_agg(
            question_id,
            jsonb_build_object(
                'solve_count', solve_count,
                'correct_count', correct_count
            )
        )
        FROM public.quest_answer_stats
        WHERE question_id = ANY (p_question_ids)
    ), '{}'::jsonb);
END;
$$;

REVOKE ALL ON FUNCTION public.get_quest_stats_batch(TEXT[]) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_quest_stats_batch(TEXT[]) TO service_role;

-- =============================================================================
-- FLEX LOOPS (author XP, notifications, 1v1 rivals)
-- Replaces get_user_stats / get_public_profile / get_leaderboard defined above.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
    kind TEXT NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    read_at TIMESTAMPTZ,
    CONSTRAINT notifications_kind_check CHECK (
        kind IN ('quest_solved', 'rival_invite', 'rival_result')
    )
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread
    ON public.notifications (user_id, created_at DESC)
    WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_user_created
    ON public.notifications (user_id, created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.notifications FROM PUBLIC, anon, authenticated;
CREATE POLICY notifications_deny_direct
    ON public.notifications
    FOR ALL
    TO anon, authenticated
    USING (false)
    WITH CHECK (false);

CREATE TABLE IF NOT EXISTS public.rivals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenger_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
    opponent_id UUID REFERENCES public.profiles (id) ON DELETE CASCADE,
    set_payload JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    challenger_correct INT NOT NULL DEFAULT 0,
    opponent_correct INT NOT NULL DEFAULT 0,
    challenger_done_at TIMESTAMPTZ,
    opponent_done_at TIMESTAMPTZ,
    winner_id UUID REFERENCES public.profiles (id) ON DELETE SET NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    CONSTRAINT rivals_status_check CHECK (
        status IN ('pending', 'active', 'complete', 'expired', 'declined')
    ),
    CONSTRAINT rivals_not_self CHECK (opponent_id IS DISTINCT FROM challenger_id),
    CONSTRAINT rivals_correct_nonneg CHECK (
        challenger_correct >= 0 AND opponent_correct >= 0
    )
);

CREATE INDEX IF NOT EXISTS idx_rivals_challenger ON public.rivals (challenger_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rivals_opponent ON public.rivals (opponent_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rivals_status ON public.rivals (status, expires_at);

ALTER TABLE public.rivals ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.rivals FROM PUBLIC, anon, authenticated;
CREATE POLICY rivals_deny_direct
    ON public.rivals
    FOR ALL
    TO anon, authenticated
    USING (false)
    WITH CHECK (false);

CREATE TABLE IF NOT EXISTS public.rival_answers (
    rival_id UUID NOT NULL REFERENCES public.rivals (id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
    question_id TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (rival_id, user_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_rival_answers_user ON public.rival_answers (user_id);

ALTER TABLE public.rival_answers ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.rival_answers FROM PUBLIC, anon, authenticated;
CREATE POLICY rival_answers_deny_direct
    ON public.rival_answers
    FOR ALL
    TO anon, authenticated
    USING (false)
    WITH CHECK (false);

CREATE OR REPLACE FUNCTION public.award_author_xp(p_user_id UUID, p_amount INT)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_new INT;
BEGIN
    IF p_user_id IS NULL OR p_amount IS NULL OR p_amount < 1 OR p_amount > 100 THEN
        RETURN 0;
    END IF;

    UPDATE public.profiles
    SET
        author_xp = LEAST(author_xp + p_amount, 1000000),
        updated_at = NOW()
    WHERE id = p_user_id
    RETURNING author_xp INTO v_new;

    RETURN COALESCE(v_new, 0);
END;
$$;

REVOKE ALL ON FUNCTION public.award_author_xp(UUID, INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.award_author_xp(UUID, INT) TO service_role;

CREATE OR REPLACE FUNCTION public.get_user_stats(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_solve_xp BIGINT;
    v_author_xp INT;
    v_total_quests BIGINT;
    v_correct_count BIGINT;
    v_wrong_count BIGINT;
    v_quests_authored BIGINT;
    v_solves_taught BIGINT;
    v_rival_wins BIGINT;
    v_rival_losses BIGINT;
BEGIN
    IF p_user_id IS NULL THEN
        RETURN jsonb_build_object(
            'total_xp', 0,
            'solve_xp', 0,
            'author_xp', 0,
            'total_quests', 0,
            'correct_count', 0,
            'wrong_count', 0,
            'quests_authored', 0,
            'solves_taught', 0,
            'rival_wins', 0,
            'rival_losses', 0
        );
    END IF;

    SELECT
        COALESCE(SUM(xp_earned), 0),
        COUNT(*),
        COUNT(*) FILTER (WHERE is_correct = TRUE),
        COUNT(*) FILTER (WHERE is_correct = FALSE)
    INTO v_solve_xp, v_total_quests, v_correct_count, v_wrong_count
    FROM public.quest_answers
    WHERE user_id = p_user_id;

    SELECT COALESCE(author_xp, 0) INTO v_author_xp
    FROM public.profiles
    WHERE id = p_user_id;

    SELECT COUNT(*) INTO v_quests_authored
    FROM public.user_quests
    WHERE author_id = p_user_id;

    SELECT COALESCE(SUM(COALESCE(qas.correct_count, 0)), 0)
    INTO v_solves_taught
    FROM public.user_quests uq
    LEFT JOIN public.quest_answer_stats qas
        ON qas.question_id = 'uq:' || uq.id::text
    WHERE uq.author_id = p_user_id;

    SELECT
        COUNT(*) FILTER (WHERE winner_id = p_user_id),
        COUNT(*) FILTER (WHERE winner_id IS NOT NULL AND winner_id IS DISTINCT FROM p_user_id)
    INTO v_rival_wins, v_rival_losses
    FROM public.rivals
    WHERE status = 'complete'
      AND (challenger_id = p_user_id OR opponent_id = p_user_id);

    RETURN jsonb_build_object(
        'total_xp', COALESCE(v_solve_xp, 0) + COALESCE(v_author_xp, 0),
        'solve_xp', COALESCE(v_solve_xp, 0),
        'author_xp', COALESCE(v_author_xp, 0),
        'total_quests', COALESCE(v_total_quests, 0),
        'correct_count', COALESCE(v_correct_count, 0),
        'wrong_count', COALESCE(v_wrong_count, 0),
        'quests_authored', COALESCE(v_quests_authored, 0),
        'solves_taught', COALESCE(v_solves_taught, 0),
        'rival_wins', COALESCE(v_rival_wins, 0),
        'rival_losses', COALESCE(v_rival_losses, 0)
    );
END;
$$;

REVOKE ALL ON FUNCTION public.get_user_stats(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_stats(UUID) TO service_role;

CREATE OR REPLACE FUNCTION public.get_public_profile(p_username TEXT)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_profile RECORD;
    v_stats JSONB;
    v_quests JSONB;
BEGIN
    SELECT id, username, created_at, avatar
    INTO v_profile
    FROM public.profiles
    WHERE lower(username) = lower(p_username);

    IF NOT FOUND THEN
        RETURN NULL;
    END IF;

    v_stats := public.get_user_stats(v_profile.id);

    SELECT COALESCE(jsonb_agg(q ORDER BY q.created_at DESC), '[]'::jsonb)
    INTO v_quests
    FROM (
        SELECT
            uq.id,
            uq.slug,
            uq.title,
            uq.difficulty,
            uq.created_at,
            COALESCE(qas.solve_count, 0) AS solve_count,
            COALESCE(qas.correct_count, 0) AS correct_count
        FROM public.user_quests uq
        LEFT JOIN public.quest_answer_stats qas
            ON qas.question_id = 'uq:' || uq.id::text
        WHERE uq.author_id = v_profile.id
        ORDER BY uq.created_at DESC
    ) q;

    RETURN jsonb_build_object(
        'id', v_profile.id,
        'username', v_profile.username,
        'created_at', v_profile.created_at,
        'avatar', v_profile.avatar,
        'stats', v_stats,
        'quests', v_quests
    );
END;
$$;

REVOKE ALL ON FUNCTION public.get_public_profile(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_profile(TEXT) TO service_role;

CREATE OR REPLACE FUNCTION public.get_leaderboard(p_limit INT DEFAULT 25)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN COALESCE((
        SELECT jsonb_agg(row_data)
        FROM (
            SELECT
                p.id,
                p.username,
                p.avatar,
                COALESCE(SUM(qa.xp_earned), 0) + COALESCE(p.author_xp, 0) AS total_xp,
                COUNT(qa.id) AS total_quests,
                COUNT(qa.id) FILTER (WHERE qa.is_correct) AS correct_count,
                COALESCE(p.author_xp, 0) AS author_xp
            FROM public.profiles p
            LEFT JOIN public.quest_answers qa ON qa.user_id = p.id
            GROUP BY p.id, p.username, p.avatar, p.author_xp
            HAVING COALESCE(SUM(qa.xp_earned), 0) + COALESCE(p.author_xp, 0) > 0
            ORDER BY total_xp DESC, correct_count DESC
            LIMIT LEAST(GREATEST(p_limit, 1), 100)
        ) row_data
    ), '[]'::jsonb);
END;
$$;

REVOKE ALL ON FUNCTION public.get_leaderboard(INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_leaderboard(INT) TO service_role;

CREATE OR REPLACE FUNCTION public.get_creator_leaderboard(p_limit INT DEFAULT 25)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN COALESCE((
        SELECT jsonb_agg(row_data)
        FROM (
            SELECT
                p.id,
                p.username,
                p.avatar,
                COALESCE(p.author_xp, 0) AS author_xp,
                COUNT(uq.id) AS quests_authored,
                COALESCE(SUM(COALESCE(qas.correct_count, 0)), 0) AS solves_taught
            FROM public.profiles p
            JOIN public.user_quests uq ON uq.author_id = p.id
            LEFT JOIN public.quest_answer_stats qas
                ON qas.question_id = 'uq:' || uq.id::text
            GROUP BY p.id, p.username, p.avatar, p.author_xp
            ORDER BY p.author_xp DESC, solves_taught DESC, quests_authored DESC
            LIMIT LEAST(GREATEST(p_limit, 1), 100)
        ) row_data
    ), '[]'::jsonb);
END;
$$;

REVOKE ALL ON FUNCTION public.get_creator_leaderboard(INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_creator_leaderboard(INT) TO service_role;

-- =============================================================================
-- DEVELOPER API KEYS & USAGE TRACKING
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.custom_api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.custom_users (id) ON DELETE CASCADE,
    key_hash TEXT NOT NULL UNIQUE,
    key_prefix TEXT NOT NULL,
    name TEXT NOT NULL DEFAULT 'Default Key',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_used_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_api_keys_user ON public.custom_api_keys (user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON public.custom_api_keys (key_hash);

CREATE TABLE IF NOT EXISTS public.custom_api_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.custom_users (id) ON DELETE CASCADE,
    usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
    request_count INT NOT NULL DEFAULT 0,
    total_run_ms BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unq_user_usage_date UNIQUE (user_id, usage_date)
);

CREATE INDEX IF NOT EXISTS idx_api_usage_user_date ON public.custom_api_usage (user_id, usage_date);

ALTER TABLE public.custom_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_api_usage ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.custom_api_keys FROM PUBLIC, anon, authenticated;
CREATE POLICY custom_api_keys_deny_direct ON public.custom_api_keys FOR ALL USING (false);

REVOKE ALL ON TABLE public.custom_api_usage FROM PUBLIC, anon, authenticated;
CREATE POLICY custom_api_usage_deny_direct ON public.custom_api_usage FOR ALL USING (false);

CREATE OR REPLACE FUNCTION public.consume_developer_quota(
    p_user_id UUID,
    p_daily_limit INT,
    p_run_ms BIGINT DEFAULT 0
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_used INT := 0;
    v_allowed BOOLEAN := FALSE;
    v_today DATE := CURRENT_DATE;
BEGIN
    INSERT INTO public.custom_api_usage (user_id, usage_date, request_count, total_run_ms, updated_at)
    VALUES (p_user_id, v_today, 1, p_run_ms, NOW())
    ON CONFLICT (user_id, usage_date)
    DO UPDATE SET
        request_count = CASE 
            WHEN public.custom_api_usage.request_count < p_daily_limit 
            THEN public.custom_api_usage.request_count + 1 
            ELSE public.custom_api_usage.request_count 
        END,
        total_run_ms = CASE 
            WHEN public.custom_api_usage.request_count < p_daily_limit 
            THEN public.custom_api_usage.total_run_ms + p_run_ms 
            ELSE public.custom_api_usage.total_run_ms 
        END,
        updated_at = NOW()
    RETURNING request_count INTO v_used;

    IF v_used <= p_daily_limit THEN
        v_allowed := TRUE;
    ELSE
        v_allowed := FALSE;
    END IF;

    RETURN jsonb_build_object(
        'allowed', v_allowed,
        'used', v_used,
        'limit', p_daily_limit
    );
END;
$$;

REVOKE ALL ON FUNCTION public.consume_developer_quota(UUID, INT, BIGINT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_developer_quota(UUID, INT, BIGINT) TO service_role;

-- =============================================================================
-- DISCORD BOT INTEGRATION
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.discord_user_keys (
    discord_id TEXT PRIMARY KEY,
    api_key TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.discord_quiz_scores (
    discord_id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    xp INTEGER NOT NULL DEFAULT 0,
    mcq_solves INTEGER NOT NULL DEFAULT 0,
    coding_solves INTEGER NOT NULL DEFAULT 0,
    race_wins INTEGER NOT NULL DEFAULT 0,
    last_active TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_discord_scores_xp ON public.discord_quiz_scores (xp DESC, race_wins DESC);

ALTER TABLE public.discord_user_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discord_quiz_scores ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.discord_user_keys FROM PUBLIC, anon, authenticated;
CREATE POLICY discord_user_keys_deny_direct ON public.discord_user_keys FOR ALL TO service_role USING (true) WITH CHECK (true);

REVOKE ALL ON TABLE public.discord_quiz_scores FROM PUBLIC, anon, authenticated;
CREATE POLICY discord_quiz_scores_select_public ON public.discord_quiz_scores FOR SELECT TO anon, authenticated, service_role USING (true);
CREATE POLICY discord_quiz_scores_service_write ON public.discord_quiz_scores FOR ALL TO service_role USING (true) WITH CHECK (true);

