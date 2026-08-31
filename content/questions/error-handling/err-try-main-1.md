---
id: err-try-main-1
categorySlug: error-handling
title: "Result-Returning main"
difficulty: 2
tags: [error-handling, termination]
---

# Prompt
Why can `main` return `Result<(), io::Error>`?

# Code
```rust
fn main() -> Result<(), std::io::Error> {
    let _f = std::fs::File::open("missing.txt")?;
    Ok(())
}
```

# Options
- [ ] A) The linker maps every `Result` to exit code 0
- [ ] B) `main` may return `Result` only under `no_std`
- [x] C) `Result` implements `Termination` as status
- [ ] D) `?` in `main` is rewritten into `process::exit`

# Hint
The std runtime turns `main`’s return value into an exit code.

# Explanation
`std::process::Termination` is implemented for `()`, `ExitCode`, and `Result<T, E>` (with `T: Termination` and `E: Debug`). `Ok` becomes success; `Err` prints the error and returns a failure code. That is why `?` works in `main` on std. It is not limited to `no_std`, and `?` still returns from `main` rather than calling `exit` itself.
