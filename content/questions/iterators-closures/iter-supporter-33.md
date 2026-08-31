---
id: iter-supporter-33
categorySlug: iterators-closures
title: "Fn Trait as Function Parameter"
difficulty: 2
tags: [iterators-closures, fn-traits, generics]
---

# Prompt
Why is `impl Fn(i32) -> i32` preferred over `fn(i32) -> i32` for generic callbacks?

# Code
```rust
fn apply<F: Fn(i32) -> i32>(f: F, x: i32) -> i32 { f(x) }
```

# Options
- [ ] A) It forces dynamic dispatch through virtual function vtables in code
- [ ] B) It allocates the callback closure on the thread-local heap in code
- [ ] C) It allows callbacks to execute asynchronously in the background
- [x] D) It accepts both capturing closures and plain function pointers

# Hint
Generic Fn trait bounds accept capturing closures and function pointers with zero overhead.

# Explanation
`impl Fn(...) -> ...` accepts any callable type (including closures with captured state and plain `fn` pointers), monomorphizing the call with zero heap or indirection overhead.
