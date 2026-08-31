/**
 * Focused security smoke checks (no network). Run: node scripts/security_smoke.mjs
 */
import { execSync } from 'node:child_process'
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
let failed = 0

function assert(cond, msg) {
  if (!cond) {
    console.error('FAIL:', msg)
    failed++
  } else {
    console.log('ok:', msg)
  }
}

// 1) Builtin answers include categorySlug (server-owned metadata)
if (!existsSync(join(root, 'functions/lib/builtinCorrect.ts'))) {
  execSync('node scripts/compile-content.mjs && node scripts/generate-builtin-answers.mjs', {
    cwd: root,
    stdio: 'ignore',
  })
}
const builtin = readFileSync(join(root, 'functions/lib/builtinCorrect.ts'), 'utf8')
assert(builtin.includes('BUILTIN_ANSWERS'), 'builtin answers map present')
assert(builtin.includes('categorySlug'), 'builtin answers include categorySlug')
assert(!builtin.includes('export const BUILTIN_CORRECT'), 'old BUILTIN_CORRECT removed')

// 2) Guests bump counters only (no quest_answers rows); IP rate-limited in auth router
const quest = readFileSync(join(root, 'functions/quest.ts'), 'utf8')
assert(!quest.includes("isCommunity && !userId"), 'community answers allow guests')
assert(quest.includes('increment_quest_answer_stats'), 'guest answers bump quest_answer_stats')
assert(!quest.includes('user_id: null'), 'guests do not insert quest_answers rows')
assert(quest.includes('Never trust client category_slug') || quest.includes('categorySlug = key.categorySlug'), 'server owns category')
assert(quest.includes('Starter / code snippet is required'), 'community quests require code')
assert(quest.includes('quest_reports') || quest.includes("from('quest_reports')"), 'quest reports stored in DB')
assert(quest.includes('quest_comments') || quest.includes("from('quest_comments')"), 'quest comments stored in DB')
assert(quest.includes('comment_reports') || quest.includes("from('comment_reports')"), 'comment reports stored in DB')
assert(quest.includes('question_id'), 'quest reports keyed by question_id')
assert(quest.includes("author_id: authUser.sub"), 'comment create sets session author only')
assert(quest.includes(".eq('author_id', authUser.sub)"), 'comment mutate filters by author_id')
assert(quest.includes('Not your comment'), 'foreign comment mutate rejected')
assert(quest.includes('Cannot report your own comment'), 'self-report comments blocked')
assert(quest.includes('.update({ body: text })'), 'comment update writes body only')

const schema = readFileSync(join(root, 'supabase/schema.sql'), 'utf8')
assert(schema.includes('CREATE TABLE public.quest_answer_stats'), 'quest_answer_stats table present')
assert(schema.includes('increment_quest_answer_stats'), 'increment_quest_answer_stats RPC present')
assert(schema.includes('CREATE TABLE public.quest_comments'), 'quest_comments table present')
assert(schema.includes('CREATE TABLE public.comment_reports'), 'comment_reports table present')
assert(schema.includes('quest_comments_deny_direct'), 'quest_comments deny direct client access')
assert(schema.includes('quest_comments_immutable_owner'), 'comment author/question immutable at DB')
assert(
  schema.includes('question_id TEXT NOT NULL') && schema.includes('quest_reports'),
  'quest_reports use question_id TEXT',
)

const turnstile = readFileSync(join(root, 'functions/lib/turnstile.ts'), 'utf8')
assert(turnstile.includes('challenges.cloudflare.com/turnstile/v0/siteverify'), 'turnstile siteverify URL')
assert(turnstile.includes('TURNSTILE_SECRET'), 'turnstile uses TURNSTILE_SECRET')
assert(turnstile.includes('result.success === true'), 'turnstile checks success === true')
const widget = readFileSync(join(root, 'src/components/TurnstileWidget.tsx'), 'utf8')
const turnstileClient = readFileSync(join(root, 'src/lib/turnstile.ts'), 'utf8')
assert(widget.includes('data-action={TURNSTILE_ACTION}'), 'widget sets data-action')
assert(turnstileClient.includes("turnstile-spin-v2"), 'widget action is turnstile-spin-v2')
const guestClearance = readFileSync(join(root, 'functions/lib/guestClearance.ts'), 'utf8')
assert(guestClearance.includes('cratery_guest'), 'guest clearance cookie name')
assert(guestClearance.includes('hasValidGuestClearance'), 'guest clearance verify helper')
assert(
  readFileSync(join(root, 'functions/quest.ts'), 'utf8').includes('hasValidGuestClearance'),
  'guest answers honor clearance cookie',
)

// 3) Session fail-closed
const session = readFileSync(join(root, 'functions/lib/session.ts'), 'utf8')
assert(session.includes('if (error || !data?.id) return null'), 'session fails closed on missing user')

// 4) No 6-digit code generator
const crypto = readFileSync(join(root, 'functions/lib/crypto.ts'), 'utf8')
assert(!crypto.includes('generateVerificationCode'), '6-digit codes removed')

// 5) Auth is token-only
const auth = readFileSync(join(root, 'functions/auth.ts'), 'utf8')
assert(auth.includes('consume_rate_limit') || auth.includes('consumeRateLimit'), 'DB rate limiter used')
assert(auth.includes('verify-mail:email:'), 'shared verification email rate limit')
assert(auth.includes('requireTurnstile'), 'auth mutations require turnstile')
assert(auth.includes("eq('verification_token', token)"), 'verify by token only')
assert(auth.includes("eq('reset_token', token)"), 'reset by token only')
assert(!auth.includes('verification_code, code') && !auth.includes("eq('verification_code'"), 'no email+code verify path')
assert(!auth.includes("eq('reset_code'"), 'no email+code reset path')

// 6) CORS not wildcard alone without APP_URL logic
const cors = readFileSync(join(root, 'functions/lib/cors.ts'), 'utf8')
assert(cors.includes('APP_URL'), 'CORS uses APP_URL')

// 7) SQL rate limit present
const sql = readFileSync(join(root, 'supabase/schema.sql'), 'utf8')
assert(sql.includes('consume_rate_limit'), 'SQL consume_rate_limit present')
assert(sql.includes('api_rate_limits'), 'SQL api_rate_limits table present')
assert(sql.includes("INTERVAL '2 days'"), 'rate-limit rows are pruned')

// 8) Frontend pages exist
assert(existsSync(join(root, 'src/pages/VerifyEmailPage.tsx')), 'VerifyEmailPage present')
assert(existsSync(join(root, 'src/pages/ResetPasswordPage.tsx')), 'ResetPasswordPage present')

if (failed) {
  console.error(`\n${failed} checks failed`)
  process.exit(1)
}
console.log('\nAll security smoke checks passed')
