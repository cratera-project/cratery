---
id: own-supporter-9
categorySlug: ownership
title: "Destructuring with ref and Value"
difficulty: 2
tags: [ownership, pattern, ref]
---

# Prompt
Why does this pattern match succeed in compiling?

# Code
```rust
fn main() {
    let pair = (String::from("data"), 42);
    let (ref s, n) = pair;
    println!("{s} has number {n}");
    println!("original string is still {}", pair.0);
}
```

# Options
- [x] A) `pair.0` is borrowed via `ref s` while `pair.1` is copied
- [ ] B) `String` implements `Copy` inside tuple patterns during runtime execution
- [ ] C) Tuple destructuring creates clones of all elements in runtime memory
- [ ] D) The compiler promotes `pair` to static program heap in code

# Hint
ref borrows the first element without moving ownership.

# Explanation
`ref s` creates a shared reference `&pair.0` without moving the `String`. `n` copies the `i32` (`Copy`). Because `pair.0` was only borrowed and `pair.1` is `Copy`, `pair.0` remains usable.
