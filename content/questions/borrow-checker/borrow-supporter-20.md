---
id: borrow-supporter-20
categorySlug: borrow-checker
title: "Borrowing vs Moving in If-Let Guards"
difficulty: 2
tags: [borrow-checker, if-let, patterns]
---

# Prompt
Why does `if let Some(ref s) = opt` keep `opt` available in the `else` branch?

# Code
```rust
fn main() {
    let opt = Some(String::from("test"));
    if let Some(ref s) = opt {
        println!("{s}");
    } else {
        println!("was none: {opt:?}");
    }
    println!("{opt:?}"); // Still valid!
}
```

# Options
- [ ] A) `if let` automatically clones values before pattern matching in runtime memory
- [x] B) `ref s` only borrows the contents, leaving ownership of `opt` intact
- [ ] C) The else branch operates in an isolated memory sandbox in runtime memory
- [ ] D) String implements Copy inside pattern matching conditions in runtime memory

# Hint
ref s creates a shared borrow without moving the value.

# Explanation
`ref s` creates a reference `&opt` rather than moving `opt`. Because no move occurred, `opt` remains fully initialized and accessible in both branches and after the `if let`.
