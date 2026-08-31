---
id: own-destructure-ref-mut-1
categorySlug: ownership
title: "Disjoint Tuple Borrowing"
difficulty: 2
tags: [ownership, borrowing, destructuring]
---

# Prompt
What is the result of compiling and running this code?

# Code
```rust
fn main() {
    let mut pair = (String::from("a"), String::from("b"));
    let (ref mut x, ref y) = pair;
    x.push_str("!");
    println!("{x} and {y}");
}
```

# Options
- [ ] A) Fails to compile because mut and shared borrows overlap
- [x] B) Prints a! and b because tuple fields borrow disjointly
- [ ] C) Fails because destructuring always moves tuple contents
- [ ] D) Panics at runtime due to a simultaneous borrow conflict

# Hint
Check whether the two references point to the exact same field.

# Explanation
Rust's borrow checker understands disjoint field access for tuples and structs. In `let (ref mut x, ref y) = pair`, `x` holds an exclusive reference to `pair.0` (`&mut pair.0`) and `y` holds a shared reference to `pair.1` (`&pair.1`). Because the borrows target separate fields, they do not conflict and both are valid.
