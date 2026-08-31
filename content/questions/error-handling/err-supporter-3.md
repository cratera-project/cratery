---
id: err-supporter-3
categorySlug: error-handling
title: "Option::ok_or and ok_or_else"
difficulty: 2
tags: [error-handling, option, conversion]
---

# Prompt
How does `Option::ok_or(err)` differ from `Option::ok_or_else(err_fn)`?

# Code
```rust
fn main() {
    let opt: Option<i32> = None;
    let _r1 = opt.ok_or("static error");
    let _r2 = opt.ok_or_else(|| String::from("dynamic error"));
}
```

# Options
- [ ] A) `ok_or` returns a Result while `ok_or_else` panics on None values in runtime memory
- [ ] B) `ok_or_else` is only available for errors implementing Display within local thread memory
- [ ] C) `ok_or` clones the option value while `ok_or_else` moves ownership in runtime memory
- [x] D) `ok_or` evaluates error eagerly; `ok_or_else` evaluates closure lazily on None

# Hint
ok_or takes a value eagerly; ok_or_else takes a closure and evaluates only if None.

# Explanation
`Option::ok_or(err)` constructs the error value eagerly. `Option::ok_or_else(|| ...)` computes the error lazily only if the `Option` is `None`, saving unnecessary allocations.
