---
id: iter-supporter-17
categorySlug: iterators-closures
title: "Closure Coercion to Function Pointer"
difficulty: 2
tags: [iterators-closures, fn-pointer, coercion]
---

# Prompt
When can a closure be coerced to a plain function pointer `fn(T) -> U`?

# Code
```rust
fn apply(f: fn(i32) -> i32, x: i32) -> i32 { f(x) }

fn main() {
    let c = |x| x * 2;
    assert_eq!(apply(c, 5), 10);
}
```

# Options
- [ ] A) Whenever the closure is annotated with the `#[inline]` attribute in code
- [ ] B) Only when the closure argument and return types implement `Copy` in code
- [ ] C) Any closure can be converted to a function pointer via transmutation in code
- [x] D) Only when the closure captures no variables from its outer environment

# Hint
Non-capturing closures have a zero-sized environment and can coerce to fn pointers.

# Explanation
A closure that captures no variables from its environment has an empty environment struct (zero-sized) and can be implicitly coerced to a plain function pointer `fn(...) -> ...`.
