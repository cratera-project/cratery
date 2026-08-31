---
id: err-expect-1
categorySlug: error-handling
title: "expect vs unwrap"
difficulty: 2
tags: [error-handling, panic]
---

# Prompt
Why prefer `expect` over `unwrap` when a panic is intentional?

# Code
```rust
let port: u16 = std::env::var("PORT")
    .expect("PORT must be set")
    .parse()
    .expect("PORT must be a u16");
```

# Options
- [ ] A) `expect` never panics; it returns a default value
- [ ] B) `unwrap` is deprecated and removed on stable Rust
- [ ] C) `expect` is slower, so it should be avoided in apps
- [x] D) `expect` attaches a message that explains the bug

# Hint
Both panic; one documents why the invariant failed.

# Explanation
`unwrap` and `expect` both panic on failure. `expect("…")` adds a clear message for logs and crash reports, which helps when the failure means a broken invariant rather than a handled error.
