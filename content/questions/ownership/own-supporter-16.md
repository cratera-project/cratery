---
id: own-supporter-16
categorySlug: ownership
title: "Vec IntoIter Ownership"
difficulty: 2
tags: [ownership, vec, into-iter]
---

# Prompt
What is yielded by `vec.into_iter()` when called on `Vec<String>`?

# Code
```rust
fn main() {
    let items = vec![String::from("alpha"), String::from("beta")];
    for item in items.into_iter() {
        println!("{item}");
    }
}
```

# Options
- [ ] A) Shared references `&String` borrowing the original vector
- [ ] B) Mutable references `&mut String` for in-place editing
- [ ] C) String slice views `&str` pointing to heap buffer in code
- [x] D) Owned `String` values, consuming the original `items`

# Hint
into_iter consumes the collection by value.

# Explanation
`Vec::into_iter` consumes the vector by value and yields owned elements (`String`), transferring ownership of each element to the loop body.
