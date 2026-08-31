---
id: own-supporter-24
categorySlug: ownership
title: "Ownership in Closure Captures"
difficulty: 2
tags: [ownership, closures, capture]
---

# Prompt
What capture mode is used for `s` in `let c = || println!("{s}");`?

# Code
```rust
fn main() {
    let s = String::from("hello");
    let c = || println!("{s}");
    c();
    println!("still valid: {s}");
}
```

# Options
- [ ] A) To prevent automatic stack deallocation on drop
- [ ] B) To force immediate memory deallocation on drop
- [ ] C) To reallocate the inner buffer on the system heap
- [x] D) To convert the instance into a thread-safe mutex

# Hint
Closures capture variables with the least restrictive mode required by their body.

# Explanation
Because `println!("{s}")` only needs read-only access to `s`, the closure captures `s` by shared reference `&s`. Thus `s` remains fully valid in `main` after calling `c()`.
