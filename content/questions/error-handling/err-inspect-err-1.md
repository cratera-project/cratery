---
id: err-inspect-err-1
categorySlug: error-handling
title: "inspect_err Side Effects"
difficulty: 2
tags: [error-handling, result]
---

# Prompt
What is `inspect_err` for on a `Result`?

# Code
```rust
let r = parse(s).inspect_err(|e| eprintln!("parse failed: {e}"));
```

# Options
- [ ] A) It replaces `Err` with a default `Ok` value silently
- [ ] B) It converts the error type using a `From` impl path
- [ ] C) It panics after printing so callers never see `Err`
- [x] D) It runs a side effect on `Err` without consuming it

# Hint
Logging helpers should not change success/failure.

# Explanation
`inspect_err` borrows the error for a side effect (log, metric) and returns the original `Result` unchanged. It does not recover, convert, or panic. Prefer it over `map_err` when you only need observation.
