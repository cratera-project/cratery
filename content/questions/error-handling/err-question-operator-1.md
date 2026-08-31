---
id: err-question-operator-1
categorySlug: error-handling
title: "Early Return with ?"
difficulty: 2
tags: [error-handling, question-operator]
---

# Prompt
How does `?` differ from `.unwrap()` on `Err`?

# Code
```rust
fn parse_config() -> Result<Config, Error> {
    let file = File::open("config.toml")?;
    // vs File::open("config.toml").unwrap()
    Ok(Config::from_reader(file)?)
}
```

# Options
- [ ] A) `?` works only with `Option`, never with `Result`
- [ ] B) Both panic; `?` just logs the error before dying
- [x] C) `?` returns the error; `unwrap` panics on `Err`
- [ ] D) `?` ignores errors; `unwrap` converts them to `Ok`

# Hint
One propagates; the other asserts success.

# Explanation
In a function returning `Result` (or `Option`), `?` early-returns the failure to the caller, optionally via `From`. `unwrap`/`expect` panic on `Err`/`None`. Prefer `?` for recoverable errors.
