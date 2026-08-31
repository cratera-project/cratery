import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PixelPanel } from '../components/ui/PixelPanel'
import { PixelButton } from '../components/ui/PixelButton'
import { CodeBlock } from '../components/ui/CodeBlock'
import { AnswerOption } from '../components/ui/AnswerOption'
import { AuthModal } from '../components/AuthModal'
import { SEO } from '../components/SEO'
import {
  createUserQuest,
  updateUserQuest,
  listMyQuests,
  type QuestDraft,
  type QuestKind,
  type UserQuest,
} from '../lib/userQuests'
import { optionLengthBias } from '../lib/optionOrder'
import { OPTION_LABELS } from '../lib/quiz'

const EMPTY_MCQ: QuestDraft = {
  kind: 'mcq',
  title: '',
  prompt: '',
  code: '',
  test_harness: '',
  options: ['', '', '', ''],
  correct_index: 0,
  hint: '',
  explanation: '',
  difficulty: 1,
}

const DEFAULT_STARTER = `pub fn add(a: i32, b: i32) -> i32 {
    // TODO
    0
}
`

const DEFAULT_HARNESS = `{{SOLUTION}}

fn main() {
    assert_eq!(add(1, 2), 3);
    assert_eq!(add(-1, 1), 0);
    println!("ok");
}
`

const EMPTY_CODING: QuestDraft = {
  kind: 'coding',
  title: '',
  prompt: 'Implement the function so all asserts pass.',
  code: DEFAULT_STARTER,
  test_harness: DEFAULT_HARNESS,
  options: ['(coding)', '(coding)', '(coding)', '(coding)'],
  correct_index: 0,
  hint: '',
  explanation: '',
  difficulty: 1,
}

const RUST_SHAPE =
  /\b(fn|let|use|impl|struct|enum|match|mod|trait|type|const|static|pub)\b|::|->|#!\[|println!|Result|Option|Vec|String|i32|u32|&str/
const ABUSE =
  /\b(std::(process|net|fs)|Command|TcpStream|UdpSocket|File::|std::os|include(?:_str|_bytes)?!|reqwest|ureq|hyper|tokio::net)\b/

function draftFromQuest(q: UserQuest): QuestDraft {
  return {
    kind: q.kind === 'coding' ? 'coding' : 'mcq',
    title: q.title,
    prompt: q.prompt,
    code: q.code ?? '',
    test_harness: q.test_harness ?? '',
    options: [q.options[0] ?? '', q.options[1] ?? '', q.options[2] ?? '', q.options[3] ?? ''],
    correct_index: q.correct_index ?? 0,
    hint: q.hint ?? '',
    explanation: q.explanation ?? '',
    difficulty: q.difficulty,
  }
}

const inputClass =
  'w-full border-3 border-night-edge bg-night px-3 py-2 font-code text-lg text-ink placeholder:text-ink-faint focus:border-diamond focus:outline-none'

export function CreateQuestPage() {
  const { questId } = useParams()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [draft, setDraft] = useState<QuestDraft>(EMPTY_MCQ)
  const [existing, setExisting] = useState<UserQuest | null>(null)
  const [loadingQuest, setLoadingQuest] = useState(Boolean(questId))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAuth, setShowAuth] = useState(false)

  const editing = Boolean(questId)

  useEffect(() => {
    if (!questId || !user) return
    let cancelled = false
    listMyQuests()
      .then((quests) => {
        if (cancelled) return
        const found = quests.find((q) => q.id === questId) ?? null
        setExisting(found)
        if (found) setDraft(draftFromQuest(found))
      })
      .finally(() => {
        if (!cancelled) setLoadingQuest(false)
      })
    return () => {
      cancelled = true
    }
  }, [questId, user])

  const lengthBias = useMemo(
    () => optionLengthBias(draft.options, draft.correct_index),
    [draft.options, draft.correct_index]
  )

  const validationError = useMemo(() => {
    if (draft.title.trim().length < 5) return 'Title needs at least 5 characters'
    if (draft.prompt.trim().length < 10) return 'Prompt needs at least 10 characters'
    const code = draft.code.trim()
    if (code.length < 10) return 'Starter / code is required'
    if (!RUST_SHAPE.test(code)) return 'Code should look like Rust (a real snippet, not plain text)'
    if (ABUSE.test(code)) return 'Code cannot use process, filesystem, network, or include! APIs'

    if (draft.kind === 'coding') {
      const harness = draft.test_harness.trim()
      if (harness.length < 20) return 'Test harness is required'
      if (!harness.includes('{{SOLUTION}}')) return 'Harness must include {{SOLUTION}} exactly once'
      if ((harness.match(/\{\{SOLUTION\}\}/g) ?? []).length !== 1) {
        return 'Harness must include {{SOLUTION}} exactly once'
      }
      if (!RUST_SHAPE.test(harness)) return 'Test harness should look like Rust'
      if (ABUSE.test(harness)) {
        return 'Harness cannot use process, filesystem, network, or include! APIs'
      }
      if (!/\bassert(?:_eq|_ne)?!/.test(harness)) {
        return 'Harness needs at least one assert!, assert_eq!, or assert_ne!'
      }
      if (!/\bfn\s+main\s*\(/.test(harness)) {
        return 'Harness must define fn main()'
      }
      return null
    }

    if (draft.options.some((o) => o.trim().length === 0)) return 'All 4 options are required'
    if (draft.explanation.trim().length < 10) return 'Explanation needs at least 10 characters'
    if (lengthBias.error) return lengthBias.error
    return null
  }, [draft, lengthBias.error])

  if (authLoading || (editing && loadingQuest)) {
    return (
      <PixelPanel>
        <SEO title="Create Quest" noIndex />
        <div className="animate-pulse font-code text-lg text-ink-dim">Loading...</div>
      </PixelPanel>
    )
  }

  if (!user) {
    return (
      <PixelPanel title="Create a quest">
        <SEO title="Create Quest" description="Sign in to create and share your own Rust quiz or coding challenge." />
        <p className="read-body text-xl text-ink-dim">
          Sign in to publish a multiple-choice quiz or a coding challenge with required tests.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <PixelButton onClick={() => setShowAuth(true)}>Sign in to create</PixelButton>
          <Link to="/community">
            <PixelButton variant="secondary">Browse community</PixelButton>
          </Link>
        </div>
        <AuthModal
          isOpen={showAuth}
          onClose={() => setShowAuth(false)}
          initialTab="signup"
        />
      </PixelPanel>
    )
  }

  if (editing && !existing) {
    return (
      <PixelPanel title="Quest not found">
        <SEO title="Quest Not Found" noIndex />
        <p className="read-body text-lg text-ink-dim">You can only edit quests you created.</p>
        <div className="mt-4">
          <Link to="/create">
            <PixelButton>New quest</PixelButton>
          </Link>
        </div>
      </PixelPanel>
    )
  }

  const set = <K extends keyof QuestDraft>(key: K, value: QuestDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }))

  const switchKind = (kind: QuestKind) => {
    if (editing) return
    setDraft(kind === 'coding' ? { ...EMPTY_CODING } : { ...EMPTY_MCQ })
  }

  const save = async () => {
    if (validationError || saving) return
    setSaving(true)
    setError(null)
    const res = editing && existing
      ? await updateUserQuest(existing.id, draft)
      : await createUserQuest(draft)
    setSaving(false)
    if (res.error) {
      setError(res.error)
      return
    }
    navigate(`/${user.username}/${res.quest.slug}`)
  }

  return (
    <div className="space-y-5 pb-12">
      <SEO title={editing ? 'Edit Quest' : 'Create Quest'} noIndex />

      <div>
        <h1 className="font-pixel text-sm uppercase tracking-[0.02em] text-ink">
          {editing ? 'Edit quest' : 'Create a new quest'}
        </h1>
        <p className="mt-2 text-sm text-ink-dim">
          Publish a quiz or a coding challenge. Share it at{' '}
          <span className="font-code text-base text-rust-orange">
            cratery.cratera.org/{user.username}/your-quest
          </span>
          . Publishing earns 25 XP. Each signed-in solver who gets it right earns you 5 more.
        </p>
      </div>

      {!editing ? (
        <div className="flex flex-wrap gap-2">
          <PixelButton
            size="sm"
            variant={draft.kind === 'mcq' ? 'primary' : 'secondary'}
            onClick={() => switchKind('mcq')}
          >
            Quiz (MCQ)
          </PixelButton>
          <PixelButton
            size="sm"
            variant={draft.kind === 'coding' ? 'primary' : 'secondary'}
            onClick={() => switchKind('coding')}
          >
            Coding (tests required)
          </PixelButton>
        </div>
      ) : (
        <p className="font-code text-base text-ink-faint">
          Type: {draft.kind === 'coding' ? 'coding challenge' : 'quiz'} (fixed after publish)
        </p>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <PixelPanel title="Quest details">
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1 block font-pixel text-[9px] uppercase text-ink-dim">Title</span>
              <input
                className={inputClass}
                value={draft.title}
                maxLength={120}
                placeholder={
                  draft.kind === 'coding' ? 'e.g. Add two numbers' : 'e.g. Moved value after push'
                }
                onChange={(e) => set('title', e.target.value)}
              />
            </label>

            <label className="block">
              <span className="mb-1 block font-pixel text-[9px] uppercase text-ink-dim">Prompt</span>
              <textarea
                className={`${inputClass} min-h-20`}
                value={draft.prompt}
                maxLength={2000}
                placeholder={
                  draft.kind === 'coding'
                    ? 'Describe the problem. What should their code do?'
                    : 'What does this snippet print?'
                }
                onChange={(e) => set('prompt', e.target.value)}
              />
            </label>

            <label className="block">
              <span className="mb-1 block font-pixel text-[9px] uppercase text-ink-dim">
                {draft.kind === 'coding' ? 'Starter code (editor contents)' : 'Rust code snippet (required)'}
              </span>
              <textarea
                className={`${inputClass} min-h-36 font-code`}
                value={draft.code}
                maxLength={8000}
                spellCheck={false}
                placeholder={'fn main() {\n    let s = String::from("hi");\n}'}
                onChange={(e) => set('code', e.target.value)}
              />
            </label>

            {draft.kind === 'coding' ? (
              <label className="block">
                <span className="mb-1 block font-pixel text-[9px] uppercase text-ink-dim">
                  Test harness (required)
                </span>
                <p className="mb-2 font-code text-base text-ink-faint">
                  Full test harness program. Put{' '}
                  <code className="text-rust-orange">{'{{SOLUTION}}'}</code> where the starter is
                  inserted. Must include <code className="text-ink">fn main</code> and at least one
                  assert.
                </p>
                <textarea
                  className={`${inputClass} min-h-48 font-code`}
                  value={draft.test_harness}
                  maxLength={16000}
                  spellCheck={false}
                  onChange={(e) => set('test_harness', e.target.value)}
                />
              </label>
            ) : (
              <div>
                <span className="mb-1 block font-pixel text-[9px] uppercase text-ink-dim">
                  Options: click the letter to mark the correct one
                </span>
                <p className="mb-2 font-code text-base text-ink-faint">
                  Keep all four similar length. Put reasoning in Explanation; players should not
                  spot the answer by how detailed it is.
                </p>
                <div className="space-y-2">
                  {OPTION_LABELS.map((label, i) => (
                    <div key={label} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => set('correct_index', i)}
                        title={draft.correct_index === i ? 'Correct answer' : 'Mark as correct'}
                        className={`flex h-9 w-9 shrink-0 items-center justify-center border-3 font-pixel text-[10px] transition-colors ${
                          draft.correct_index === i
                            ? 'border-emerald bg-emerald text-stone-darkest'
                            : 'border-night-edge bg-night text-ink-dim hover:border-diamond'
                        }`}
                      >
                        {label}
                      </button>
                      <input
                        className={inputClass}
                        value={draft.options[i]}
                        maxLength={300}
                        placeholder={`Option ${label}`}
                        onChange={(e) => {
                          const options = [...draft.options] as QuestDraft['options']
                          options[i] = e.target.value
                          set('options', options)
                        }}
                      />
                    </div>
                  ))}
                </div>
                {lengthBias.warn && !lengthBias.error ? (
                  <p className="mt-2 font-code text-base text-gold">{lengthBias.warn}</p>
                ) : null}
              </div>
            )}

            <label className="block">
              <span className="mb-1 block font-pixel text-[9px] uppercase text-ink-dim">
                {draft.kind === 'coding' ? 'Private notes (optional, not shown to players)' : 'Explanation'}
              </span>
              <textarea
                className={`${inputClass} min-h-24`}
                value={draft.explanation}
                maxLength={4000}
                placeholder={
                  draft.kind === 'coding'
                    ? 'Your notes when editing later. Put public hints in Hint or the Prompt.'
                    : 'Why the correct answer is correct.'
                }
                onChange={(e) => set('explanation', e.target.value)}
              />
            </label>

            <label className="block">
              <span className="mb-1 block font-pixel text-[9px] uppercase text-ink-dim">
                Hint (optional)
              </span>
              <input
                className={inputClass}
                value={draft.hint}
                maxLength={300}
                placeholder="A nudge, not the answer"
                onChange={(e) => set('hint', e.target.value)}
              />
            </label>

            <div>
              <span className="mb-1 block font-pixel text-[9px] uppercase text-ink-dim">Difficulty</span>
              <div className="flex gap-2">
                {([1, 2, 3] as const).map((d) => (
                  <PixelButton
                    key={d}
                    size="sm"
                    variant={draft.difficulty === d ? 'primary' : 'secondary'}
                    onClick={() => set('difficulty', d)}
                  >
                    {d === 1 ? 'Easy' : d === 2 ? 'Medium' : 'Hard'}
                  </PixelButton>
                ))}
              </div>
            </div>
          </div>
        </PixelPanel>

        <div className="space-y-4">
          <PixelPanel title="Live preview">
            <div className="space-y-4">
              <div className="font-pixel text-[10px] uppercase text-ink-dim">
                {draft.title || 'Untitled quest'}
                <span className="ml-2 text-ink-faint">
                  · {draft.kind === 'coding' ? 'coding' : 'quiz'}
                </span>
              </div>
              {draft.code.trim() ? <CodeBlock code={draft.code} language="rust" /> : null}
              <div className="read-body text-xl leading-snug text-ink">
                {draft.prompt || 'Your prompt appears here.'}
              </div>
              {draft.kind === 'mcq' ? (
                <>
                  <div className="grid gap-2.5">
                    {OPTION_LABELS.map((label, i) => (
                      <AnswerOption
                        key={label}
                        label={label}
                        text={draft.options[i] || `Option ${label}`}
                        selected={draft.correct_index === i}
                        disabled
                        onSelect={() => set('correct_index', i)}
                      />
                    ))}
                  </div>
                  <p className="font-code text-base text-ink-faint">
                    The highlighted option is the correct answer.
                  </p>
                </>
              ) : (
                <p className="font-code text-base text-ink-faint">
                  Players get an in-browser editor to run tests and submit solutions.
                </p>
              )}
            </div>
          </PixelPanel>

          <div className="flex flex-wrap items-center gap-3">
            <PixelButton onClick={() => void save()} disabled={Boolean(validationError) || saving}>
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Publish quest'}
            </PixelButton>
            <Link to="/profile">
              <PixelButton variant="secondary">Cancel</PixelButton>
            </Link>
          </div>
          {validationError ? (
            <p className="font-code text-base text-gold">{validationError}</p>
          ) : null}
          {error ? <p className="font-code text-base text-redstone">{error}</p> : null}
        </div>
      </div>
    </div>
  )
}
