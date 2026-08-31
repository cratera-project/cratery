---
id: err-context-anyhow-1
categorySlug: error-handling
title: "Contextual Error Wrapping"
difficulty: 1
tags: [error-handling, anyhow, context]
---

# Prompt
What is the primary benefit of `.context("...")` when working with `anyhow::Context`?

# Options
- [x] A) It attaches descriptive context to an existing error
- [ ] B) It converts any error into a synchronous thread panic
- [ ] C) It stores stack traces in OS kernel event trace logs
- [ ] D) It allocates an isolated shared memory region on heap

# Hint
Context adds high-level context to lower-level failures without discarding root causes.

# Explanation
`Context::context` wraps errors in a chain of descriptive failure messages, preserving the underlying source error for backtraces.
