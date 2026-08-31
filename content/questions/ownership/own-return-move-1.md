---
id: own-return-move-1
categorySlug: ownership
title: "Return Value Ownership"
difficulty: 1
tags: [ownership, functions]
---

# Prompt
What is the ownership flow in this code?

# Code
```rust
fn create_string() -> String {
    let s = String::from("hello");
    s
}

fn main() {
    let my_string = create_string();
    println!("{}", my_string);
}
```

# Options
- [ ] A) Return implicitly clones the local `String` value
- [ ] B) Elision extends `s` past the function return site
- [ ] C) Error: returning a moved local value is forbidden
- [x] D) Ownership moves from the function to the caller

# Hint
Returning by value is a move, not a borrow.

# Explanation
Returning `s` transfers ownership to the caller. No clone or lifetime magic is required; this is the usual way to hand heap data out of a function.
