---
id: err-option-ok-or-else-lazy-1
categorySlug: error-handling
title: "Lazy Error Generation with ok_or_else"
difficulty: 1
tags: [error-handling, option, lazy]
---

# Prompt
Why is `option.ok_or_else(|| ...)` preferred over `option.ok_or(...)` when error construction is expensive?

# Options
- [ ] A) It executes error closures eagerly before checking values
- [ ] B) It panics immediately if the original Option value is None
- [ ] C) It converts the option into an uncatchable abort signal
- [x] D) It evaluates the fallback error closure lazily upon None

# Hint
ok_or_else computes the error only when the value is None.

# Explanation
`ok_or_else` evaluates its closure lazily only when the `Option` is `None`, avoiding expensive error allocations when the value is `Some`.
