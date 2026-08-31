---
id: own-supporter-33
categorySlug: ownership
title: "Pattern Matching on Box<T>"
difficulty: 3
tags: [ownership, box, pattern]
---

# Prompt
What happens when matching `box s` in `let box s = Box::new(String::from("a"));`?

# Code
```rust
fn main() {
    let b = Box::new(String::from("unboxed"));
    let s = *b;
    println!("{s}");
}
```

# Options
- [x] A) Dereferencing moves the String out and deallocates the Box
- [ ] B) The Box allocation remains alive as a dangling container in code
- [ ] C) String is copied bitwise without freeing the Box pointer in code
- [ ] D) Dereferencing an owned Box is forbidden in safe Rust code in code

# Hint
Dereferencing an owned Box moves the inner value out and frees the Box box allocation.

# Explanation
In safe Rust, `let s = *b;` on an owned `Box<T>` moves the `T` out of the box and immediately deallocates the heap pointer memory without running the destructor on `T` (which is now owned by `s`).
