---
id: trait-supporter-20
categorySlug: traits
title: "Non-Object-Safe Generic Methods"
difficulty: 3
tags: [traits, object-safety, generics]
---

# Prompt
Why does a generic method `fn transform<T>(&self, x: T)` make a trait non-object-safe?

# Code
```rust
// trait Bad { fn transform<T>(&self, x: T); }
// fn call(b: &dyn Bad) {} // Error
```

# Options
- [ ] A) Generic methods can only be called from background worker threads
- [x] B) The vtable would require infinitely many monomorphized slots
- [ ] C) Trait objects cannot pass pointers through CPU registers in code
- [ ] D) Generic parameters are incompatible with the Sized trait bound

# Hint
A vtable must have a fixed, finite set of function pointers at compile time.

# Explanation
Because `T` could be any type, the compiler cannot generate a finite vtable containing pointers to every possible monomorphized version of `transform<T>`. Thus, generic methods violate object safety unless guarded with `where Self: Sized`.
