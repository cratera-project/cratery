---
id: own-supporter-27
categorySlug: ownership
title: "Drop Trait on Generic Types"
difficulty: 2
tags: [ownership, drop, generics]
---

# Prompt
When is `Drop::drop` executed for a generic container `Wrapper<T>`?

# Code
```rust
struct Wrapper<T>(T);

impl<T> Drop for Wrapper<T> {
    fn drop(&mut self) {
        println!("dropping wrapper");
    }
}
```

# Options
- [ ] A) The inner `T` drops first, followed by `Wrapper::drop` in runtime memory
- [ ] B) Only `Wrapper::drop` runs; inner `T` is never dropped in runtime memory
- [x] C) `Wrapper::drop` runs first, followed by the destructor of `T`
- [ ] D) `Wrapper::drop` only executes if `T` implements the Copy trait

# Hint
Custom drop logic runs before fields are recursively dropped.

# Explanation
When an instance of a type implementing `Drop` is destroyed, its `drop(&mut self)` method is executed first, and then the compiler automatically runs the destructors for all its individual fields.
