---
id: own-supporter-26
categorySlug: ownership
title: "Temporary Lifetime in Method Chain"
difficulty: 2
tags: [ownership, temporaries, borrow-checker]
---

# Prompt
Why does `let bytes = String::from("hello").as_bytes();` fail to compile?

# Code
```rust
fn main() {
    // let bytes = String::from("hello").as_bytes(); // error
}
```

# Options
- [ ] A) `as_bytes()` requires a mutable reference to the String during execution
- [x] B) The temporary String is dropped at end of the statement
- [ ] C) Byte slices are not allowed to be stored in local let bindings
- [ ] D) String literals cannot be converted directly into byte slices

# Hint
The temporary String created on the right-hand side drops at the semicolon.

# Explanation
`String::from("hello")` is a temporary owned value that is dropped at the end of the `let` statement. The returned `&[u8]` slice would be left pointing to deallocated heap memory, causing a compiler error.
