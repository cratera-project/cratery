---
id: life-struct-1
categorySlug: lifetimes
title: "Structs with References"
difficulty: 2
tags: [lifetimes, structs]
---

# Prompt
Why does a struct holding a reference need a lifetime?

# Code
```rust
struct ImportantExcerpt<'a> {
    part: &'a str,
}
```

# Options
- [x] A) So the referent must outlive the struct value
- [ ] B) So the struct can store `&mut` fields by default
- [ ] C) So referenced data is cloned into the struct body
- [ ] D) So the struct becomes `Send` without other bounds

# Hint
The struct must not outlive what it points at.

# Explanation
A struct field `&'a str` borrows data owned elsewhere. The lifetime parameter ties the struct’s validity to that borrow so the compiler can reject dangling references when the struct would outlive its referent.
