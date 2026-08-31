---
id: err-boxed-error-1
categorySlug: error-handling
title: "Boxed Error Trait Objects"
difficulty: 2
tags: [error-handling, dyn]
---

# Prompt
Why might an app use `Box<dyn Error>` as its error type?

# Code
```rust
use std::error::Error;

fn run() -> Result<(), Box<dyn Error>> {
    let _f = std::fs::File::open("cfg.toml")?;
    Ok(())
}
```

# Options
- [x] A) It erases concrete error types for easy `?` mixing
- [ ] B) It makes every error cheaper than a custom enum
- [ ] C) It is required by the language for all `main` fns
- [ ] D) It preserves matchable variants across crate edges

# Hint
Ergonomics vs structured matching is the trade-off.

# Explanation
`Box<dyn Error>` (or `anyhow::Error`) lets many error types convert via `?` without a unifying enum. You lose easy matching on variants, which is fine for apps but often wrong for library APIs that need structured errors.
