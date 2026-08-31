---
id: err-anyhow-vs-thiserror-1
categorySlug: error-handling
title: "Library vs Application Errors"
difficulty: 2
tags: [error-handling, design]
---

# Prompt
Which error style fits a reusable library API best?

# Code
```rust
// Library boundary
pub fn load(path: &Path) -> Result<Config, ConfigError> { /* ... */ }

// Application main
fn main() -> anyhow::Result<()> { /* ... */ }
```

# Options
- [x] A) A precise typed error at the public library boundary
- [ ] B) Always `String` errors so callers skip matching
- [ ] C) Always `anyhow::Error` so libraries stay untyped
- [ ] D) Only `panic!`; libraries should not return `Result`

# Hint
Libraries expose matchable errors; apps often prefer ergonomic boxing.

# Explanation
Libraries usually return structured error types so dependents can match and react. `anyhow`/`eyre`-style boxed errors are popular in applications and binaries. `String` errors lose structure; panics are not an API for expected failures.
