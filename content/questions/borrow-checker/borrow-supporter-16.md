---
id: borrow-supporter-16
categorySlug: borrow-checker
title: "Exclusive Reference Nullability"
difficulty: 1
tags: [borrow-checker, references, nullability]
---

# Prompt
Can an exclusive reference `&mut T` ever be null in safe Rust?

# Code
```rust
fn check(r: &mut i32) {
    // Is r ever null?
}
```

# Options
- [ ] A) Yes, if created from an uninitialized MaybeUninit struct within local thread memory
- [x] B) Never; all references in Rust are guaranteed to be non-null and properly aligned
- [ ] C) Yes, during thread context switches in release builds under current compiler safety rules
- [ ] D) Only if the type `T` does not implement the Copy trait under current compiler safety rules

# Hint
All references in Rust are non-null by language invariant.

# Explanation
In Rust, all references (`&T` and `&mut T`) are guaranteed by the language definition to be non-null, properly aligned, and pointing to valid memory for their entire lifetime.
