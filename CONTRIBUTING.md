# Contributing to Cratery

Thank you for your interest in contributing to Cratery! Whether you are adding new Rust questions, fixing typos, creating tutorial chapters, or improving the interactive coding harness, we welcome your contributions.

---

## Code of Conduct & Standards

1. Rust's type system and borrow checker are precise. Every question, explanation, and code snippet must be verified with modern Rust (Edition 2024).
2. Enforce automated quality gates (`npm run check`) to ensure questions do not have length bias, ambiguous answers, or unbalanced option distributions.
3. Quizzes and interactive trials must run client-side or evaluate in local `rustc` / Firecracker microVMs without heavy bloat.

---

## Local Development Workflow

Cratery is designed to run locally on **macOS, Linux, and Windows** with zero external backend dependencies:

```bash
# 1. Clone the repository
git clone https://github.com/cratera-project/cratery
cd cratery

# 2. Install dependencies
npm install

# 3. Start local development server with host rustc execution
npm run dev
```

Visit `http://localhost:5173`. Code runs and grades locally using your machine's `rustc`.

---

## Submitting Questions, Contests, or Tutorials

To add new content:
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
