---
id: err-supporter-13
categorySlug: error-handling
title: "Result::copied and Result::cloned"
difficulty: 2
tags: [error-handling, copied, references]
---

# Prompt
What does `res.copied()` do when called on `Result<&T, E>`?

# Code
```rust
fn main() {
    let val = 42;
    let r: Result<&i32, ()> = Ok(&val);
    let owned: Result<i32, ()> = r.copied();
    assert_eq!(owned, Ok(42));
}
```

# Options
- [ ] A) Creates a shallow copy of the entire Result enum on the stack in runtime memory
- [x] B) Converts `Result<&T, E>` into `Result<T, E>` by copying the referenced value
- [ ] C) Copies error metadata into thread-local panic storage within local thread memory
- [ ] D) Converts the reference into a raw pointer `Result<*const T, E>` in runtime memory

# Hint
copied() turns Result<&T, E> into Result<T, E> when T: Copy.

# Explanation
`Result::copied` maps a `Result<&T, E>` to `Result<T, E>` by dereferencing and copying the `T` (requires `T: Copy`).
