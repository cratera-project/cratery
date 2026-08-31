---
id: trait-supporter-2
categorySlug: traits
title: "Object Safety and Sized Bound"
difficulty: 3
tags: [traits, object-safety, sized]
---

# Prompt
Why does adding `where Self: Sized` on a trait method preserve object safety for the trait?

# Code
```rust
trait Builder {
    fn build(self) -> Vec<u8> where Self: Sized;
    fn name(&self) -> &str;
}
```

# Options
- [ ] A) It forces all implementing structs to be dynamically sized in code
- [ ] B) It converts the method into a macro during compilation in code
- [ ] C) It enables multithreaded dispatch for dynamic calls in runtime memory
- [x] D) It removes the non-object-safe method from the trait vtable

# Hint
Methods with Self: Sized bounds are omitted from dynamic dispatch vtables.

# Explanation
Methods taking `self` by value or generic parameters violate object safety. Adding `where Self: Sized` excludes that method from the `dyn Trait` vtable while keeping it available on concrete sized types.
