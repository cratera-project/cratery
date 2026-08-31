---
id: life-subtype-1
categorySlug: lifetimes
title: "Lifetime Subtyping"
difficulty: 3
tags: [lifetimes, subtyping]
---

# Prompt
Why can a `&'static str` be passed where `&'a str` is expected?

# Code
```rust
fn take<'a>(s: &'a str) {
    println!("{s}");
}

fn main() {
    take("literal");
}
```

# Options
- [ ] A) String literals are copied into a fresh local buffer
- [ ] B) `take` reborrows and upgrades `'a` to `'static`
- [ ] C) All `&str` parameters ignore lifetime differences
- [x] D) Longer-lived borrows subtype shorter `'a` borrows

# Hint
A longer borrow can stand in for a shorter one.

# Explanation
Lifetime subtyping: if data is valid for `'static`, it is valid for any shorter `'a`. Passing a string literal into `take<'a>` coerces `&'static str` to `&'a str`. Lifetimes are not ignored; longer outlives shorter.
