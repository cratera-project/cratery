# Question quality strategy

Inspired by [cppquiz](https://cppquiz.org), [dtolnay/rust-quiz](https://github.com/dtolnay/rust-quiz), and MCQ research (Towns 2014; Haladyna & Downing).

## Rules

1. **One concept** — short Rust snippet (≤25 lines ideal), no trick identifiers, no noise.
2. **Prefer well-defined programs** — compile+run when possible; “does not compile” only when that *is* the lesson.
3. **Equal-length options** — all four choices within ~25% of each other by character length. Never make the correct answer the uniquely longest or most reasoned option.
4. **Put reasoning in `explanation`** — options are short claims; the explanation teaches.
5. **Plausible distractors** — each wrong option is a real misconception (move vs copy, lifetime elision, Send/Sync mix-ups, etc.).
6. **Homogeneous form** — same grammar / structure for all options (all fragments or all full sentences).
7. **Hint is brief** — ≤2 sentences; does not give the answer away.
8. **Difficulty** — 1 = Book basics, 2 = common pitfalls, 3 = subtle / obscure rules.
9. **Docs-aligned** — answers match current stable Rust + The Rust Book / Reference (edition 2021/2024 semantics: NLL, etc.).
10. **Balanced keys** — across a file, `correctIndex` should roughly spread across A–D.

## Anti-patterns (reject)

- Correct option starts with “Because…” and is 2× longer than others
- “Always / never / obsolete” absolute distractors that are cartoonishly wrong
- “All of the above” / “None of the above”
- Compiler-specific or nightly-only behavior without saying so
- Length or detail as a tell for the right answer

## Workflow

1. Write code + prompt + 4 balanced options + explanation (+ optional hint).
2. Run `npm run check:questions`.
3. Fix any length-bias or distribution failures before merging.
