---
id: own-reassign-mut-1
categorySlug: ownership
title: "Reassigning Owned Value"
difficulty: 2
tags: [ownership, drop, mut]
---

# Prompt
What happens to the first `String` here?

# Code
```rust
fn main() {
    let mut s = String::from("one");
    s = String::from("two");
    println!("{s}");
}
```

# Options
- [ ] A) Both strings stay alive until `main` ends
- [ ] B) The first string leaks unless `drop` is called
- [ ] C) Reassignment is a move from `s` into itself
- [x] D) The first value is dropped when overwritten

# Hint
A binding holds one owner at a time.

# Explanation
Reassigning `s` drops the previous owned value before storing the new one. The `"one"` allocation is freed at the assignment; `"two"` is what `println!` sees. No leak occurs in safe code.
