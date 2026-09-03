# Contributing to Cratery

Thank you for your interest in contributing to Cratery! The easiest way to
contribute is also the most valuable one: **writing quest content**. The whole
platform is driven by markdown files under `content/` — no app code required —
and CI verifies every question against the real Rust compiler.

Browse [good first issues](https://github.com/cratera-project/cratery/labels/good%20first%20issue)
for quest topics waiting for an author.

---

## Code of Conduct & Standards

1. Rust's type system and borrow checker are precise. Every question, explanation, and code snippet must be verified with modern Rust (Edition 2024).
2. Enforce automated quality gates (`npm run check`) to ensure questions do not have length bias, ambiguous answers, or unbalanced option distributions.
3. Quizzes and interactive trials must run client-side or evaluate in local `rustc` / Firecracker microVMs without heavy bloat.

---

## Local Development Workflow

Cratery is designed to run locally on **macOS, Linux, and Windows** with zero external backend dependencies.

**Prerequisites:** Node.js **22 or newer** (check with `node -v`) and a stable
Rust toolchain (`rustup` installs it) so local grading works.

```bash
# 1. Clone the repository
git clone https://github.com/cratera-project/cratery
cd cratery

# 2. Install dependencies
npm install

# 3. Start local development server with host rustc execution
npm run dev
```

Visit `http://localhost:5173`. Code runs and grades locally using your machine's `rustc` — no accounts, no cloud services.

---

## Write your first question in 15 minutes

A concept quest is a single markdown file with frontmatter and five sections.
Here is a complete working example — copy it into
`content/questions/borrow-checker/bor-your-first-quest.md`:

````markdown
---
id: bor-your-first-quest
categorySlug: borrow-checker
title: "Two Mutable Borrows"
difficulty: 2
tags: [borrow-checker, mutable-borrow]
---

# Prompt
What happens when this program is compiled?

# Code
```rust
fn main() {
    let mut s = String::from("hi");
    let a = &mut s;
    let b = &mut s;
    println!("{a} {b}");
}
```

# Options
- [ ] A) It compiles and prints `hi hi` twice
- [x] B) It fails to compile: borrows overlap
- [ ] C) It compiles but panics at runtime
- [ ] D) It compiles only with warnings

# Hint
Mutable borrows are exclusive.

# Explanation
`a` holds an active exclusive borrow of `s`, so taking `b` while `a` is still
used violates the borrow checker. NLL ends `a`'s borrow at its last use, but
`a` is used in the `println!` after `b` is created, so both borrows overlap.
````

Then validate and preview:

```bash
npm run check:questions   # schema + quality gates only, ~seconds
npm run dev               # open http://localhost:5173 and find your quest
```

If the check passes and the quest renders correctly, open a PR — that's it.

### File format reference

| Part | Rules |
| :--- | :--- |
| `id` | `categoryPrefix-topic-name`, unique across the bank. Prefixes: `own-`, `bor-`, `life-`, `trait-`, `conc-`, `point-`, `macro-`, `err-`, `iter-` (see `scripts/lib/questionCategories.mjs`). |
| `categorySlug` | Must match the directory name (`ownership`, `borrow-checker`, `lifetimes`, `traits`, `concurrency`, `pointers`, `macros`, `error-handling`, `iterators-closures`). |
| `difficulty` | 1 = Book basics, 2 = common pitfalls, 3 = subtle/obscure rules. |
| `# Options` | Exactly 4 bullets; `[x]` marks the correct one. Keep all four within ~25% of each other in length. |
| `# Hint` | Optional. ≤2 sentences, doesn't give the answer away. |
| `# Explanation` | The teaching moment — put reasoning here, not in the options. |

**Coding quests** (players write Rust that runs against a test harness) use
`kind: coding` in the frontmatter plus `# Code` (the starter skeleton),
`# Solution` (the reference solution), and `# Test Harness` sections, where
`{{SOLUTION}}` is substituted with the reference solution. See
`content/questions/ownership/own-code-clone-vec.md` for a minimal example.

### Quality gates (what `npm run check` enforces)

- **Schema** — frontmatter fields, exactly 4 options, one `[x]`, valid category.
- **Length bias** — options must be similar length; the correct answer must not be the uniquely-longest option beyond a threshold.
- **Key balance** — correct answers must spread across A–D across the bank.
- **Display runs** — no three consecutive quests in a topic reveal the same letter.
- **rustc harness** — every `# Solution`/`# Test Harness` pair must actually compile and pass against your local stable Rust.
- **Contest IDs** — contest question references must resolve.

The full quality philosophy (plausible distractors, anti-patterns, difficulty
calibration) lives in [`content/questions/README.md`](content/questions/README.md)
— read it before authoring a batch.

### Contests and tutorial chapters

Weekly contests live in `content/contests/`, tutorial chapters in
`content/tutorials/`. Follow the same frontmatter conventions as existing
files in those directories; `npm run check` validates them end to end.

---

## Submitting Questions, Contests, or Tutorials

1. Add or modify `.md` files in `content/questions/<category>/`, `content/contests/`, or `content/tutorials/`.
2. Follow the question quality standards and schema in `content/questions/README.md`.
3. Run the same suite CI runs before submitting:
   ```bash
   npm run check
   ```
   Use `npm run check -- --skip-build` for a faster loop that still compiles content, typechecks, lints, and runs official solutions through `rustc`.

---

## Pull Request Guidelines

- Run `npm run check` locally (this is the GitHub Actions workflow). It must pass with 0 errors.
- Keep pull requests focused on a single feature, quest pack, or bugfix.
- For discussions or technical questions, join the [Cratera Zulip Chat](https://cratera.zulipchat.com) or open a GitHub discussion.
