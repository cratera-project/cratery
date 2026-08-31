---
id: own-supporter-3
categorySlug: ownership
title: "Array By-Value Iteration"
difficulty: 2
tags: [ownership, arrays, into-iterator]
---

# Prompt
What happens to `arr` when iterating with `for item in arr` in Rust 2024?

# Code
```rust
fn main() {
    let arr = [String::from("x"), String::from("y")];
    for item in arr {
        println!("{item}");
    }
    // arr used here?
}
```

# Options
- [ ] A) `arr` is borrowed immutably and remains valid after
- [ ] B) `arr` is converted into a dynamically sized slice in code
- [x] C) `arr` ownership is fully moved into the loop scope
- [ ] D) `arr` elements are cloned; original array persists

# Hint
In modern editions, [T; N] implements IntoIterator by value.

# Explanation
In Rust 2021 and 2024 editions, `[T; N]` implements `IntoIterator` yielding owned `T` values. Calling `for item in arr` moves the elements out of `arr`, making `arr` unavailable after the loop.
