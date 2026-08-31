---
id: own-box-1
categorySlug: ownership
title: "Box Move"
difficulty: 2
tags: [ownership, box, move]
---

# Prompt
What happens to `b1` after this assignment?

# Code
```rust
fn main() {
    let b1 = Box::new(String::from("hi"));
    let b2 = b1;
    // println!("{b1}");
    println!("{b2}");
}
```

# Options
- [ ] A) `Box` is `Copy`, so both bindings stay valid
- [ ] B) Assignment clones the heap `String` automatically
- [x] C) Ownership of the `Box` moves; `b1` is invalid
- [ ] D) `b1` becomes a dangling raw pointer value

# Hint
`Box<T>` owns heap data; it is not `Copy`.

# Explanation
`Box<T>` is an owning pointer. Assigning `b2 = b1` moves that ownership so only one `Box` will free the allocation. `b1` cannot be used afterward; use `.clone()` if you need two owned boxes.
