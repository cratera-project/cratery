---
id: err-recoverable-1
categorySlug: error-handling
title: "Recoverable vs Unrecoverable"
difficulty: 2
tags: [error-handling, design]
---

# Prompt
How should missing or malformed settings usually be handled?

# Code
```rust
fn load_settings(path: &Path) -> /* ? */ {
    // file may be missing
    // file may be invalid
}
```

# Options
- [ ] A) `Option` for missing file; `panic!` for bad bytes
- [ ] B) `panic!` for both cases as hard program failures
- [x] C) `Result` so the caller chooses how to recover
- [ ] D) Swallow both errors and silently use defaults

# Hint
Reserve panics for bugs, not expected I/O/parse failures.

# Explanation
Missing or invalid config is typically recoverable: return `Result` and let the caller retry, prompt, or fall back. `panic!` is for broken invariants/programmer errors. Silent defaults hide failures unless that is an explicit policy.
