---
id: own-supporter-6
categorySlug: ownership
title: "Pattern Match Guard and Ownership"
difficulty: 3
tags: [ownership, match, guards]
---

# Prompt
Why does moving a value inside a match guard cause a compiler error?

# Code
```rust
fn check(opt: Option<String>) {
    match opt {
        Some(ref s) if s.len() > 2 => println!("large"),
        _ => (),
    }
}
```

# Options
- [ ] A) Match guards only allow calling pure constant functions
- [x] B) Guards cannot move bound values because tests may fail
- [ ] C) Option pattern matches require references exclusively in code
- [ ] D) into_bytes is forbidden inside pattern match branches in code

# Hint
If the guard condition evaluates to false, subsequent arms must still see a valid value.

# Explanation
A pattern match guard cannot move values out of bindings because if the guard evaluates to `false`, matching continues to subsequent arms where the value must still be intact and initialized.
