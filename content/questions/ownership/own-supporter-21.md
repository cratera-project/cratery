---
id: own-supporter-21
categorySlug: ownership
title: "Option::unwrap_or vs unwrap_or_else"
difficulty: 2
tags: [ownership, option, evaluation]
---

# Prompt
Why does `opt.unwrap_or(make_default())` evaluate `make_default()` eagerly?

# Code
```rust
fn make_default() -> String {
    println!("computed");
    String::from("default")
}

fn main() {
    let opt = Some(String::from("val"));
    let _res = opt.unwrap_or(make_default());
}
```

# Options
- [x] A) Rust evaluates function arguments before entering the call
- [ ] B) Option methods are macros that expand expressions inline in code
- [ ] C) The compiler optimizes away branch conditions in release mode
- [ ] D) String construction is guaranteed to execute at compile time

# Hint
unwrap_or takes a value directly, so the argument expression is evaluated before calling.

# Explanation
Because `unwrap_or` takes `default: T` by value, the expression passed to it is evaluated eagerly before the method is called. To compute defaults lazily only when needed, use `unwrap_or_else(make_default)`.
