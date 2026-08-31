---
id: own-supporter-29
categorySlug: ownership
title: "Vec::retain Closure Ownership"
difficulty: 2
tags: [ownership, vec, retain]
---

# Prompt
What type of closure parameter is passed to `Vec::retain`?

# Code
```rust
fn main() {
    let mut vec = vec![1, 2, 3, 4];
    vec.retain(|&x| x % 2 == 0);
    println!("{vec:?}");
}
```

# Options
- [x] A) A closure taking each item by reference `&T`
- [ ] B) A closure taking each item by value `T` in code
- [ ] C) A closure taking each item by exclusive ref `&mut T`
- [ ] D) A closure taking the entire vector by slice `&[T]`

# Hint
Vec::retain calls its predicate with a shared reference &T to decide retention.

# Explanation
`Vec::retain` takes `mut f: impl FnMut(&T) -> bool`. It passes a reference `&T` to the predicate so elements can be inspected without being moved out of the vector.
