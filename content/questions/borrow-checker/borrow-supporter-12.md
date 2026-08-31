---
id: borrow-supporter-12
categorySlug: borrow-checker
title: "Borrowing in Nested Pattern Matches"
difficulty: 2
tags: [borrow-checker, patterns, ref]
---

# Prompt
How does `ref` inside nested tuple pattern matching prevent partial moves?

# Code
```rust
fn main() {
    let pair = (String::from("a"), String::from("b"));
    match pair {
        (ref first, _) => println!("{first}"),
    }
    println!("{}", pair.0); // Valid because of ref!
}
```

# Options
- [ ] A) `ref` clones the string allocation onto the heap buffer within local thread memory
- [x] B) `ref first` creates a borrow `&pair.0` without moving ownership out of `pair.0`
- [ ] C) `ref` converts the string into an immutable string literal within local thread memory
- [ ] D) `ref` delays drop checking until the program exits under current compiler safety rules

# Hint
ref binds by reference rather than by value.

# Explanation
`ref first` creates a shared borrow `&pair.0` instead of moving the `String`. Because `pair.0` was not moved, `pair.0` remains fully initialized and accessible after the `match`.
