---
id: own-supporter-28
categorySlug: ownership
title: "Destructuring Non-Copy Struct in Match"
difficulty: 2
tags: [ownership, match, destructuring]
---

# Prompt
What happens to `p` after `match p { Point { x, y } => ... }`?

# Code
```rust
struct Point {
    x: String,
    y: String,
}

fn main() {
    let p = Point { x: String::from("1"), y: String::from("2") };
    match p {
        Point { x, y } => println!("{x}, {y}"),
    }
    // p used here?
}
```

# Options
- [ ] A) `p` remains valid because matching creates temporary shared borrows
- [ ] B) `p` fields are cloned and original `p` remains untouched on stack
- [ ] C) `p` is promoted to a static heap reference by the compiler in runtime memory
- [x] D) `p` is moved into `x` and `y`, making `p` unavailable after match

# Hint
By-value pattern matching moves non-Copy fields out of the matched value.

# Explanation
Matching `Point { x, y }` by value moves both `x` and `y` out of `p`. Because `String` is not `Copy`, `p` is fully consumed and cannot be used after the `match` block.
