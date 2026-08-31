---
id: own-drop-prevent-partial-move-1
categorySlug: ownership
title: "Drop Prevents Partial Move"
difficulty: 2
tags: [ownership, drop, move]
---

# Prompt
Why does moving `p.header` fail to compile?

# Code
```rust
struct Packet {
    header: String,
    body: String,
}

impl Drop for Packet {
    fn drop(&mut self) {}
}

fn main() {
    let p = Packet {
        header: String::from("id:1"),
        body: String::from("data"),
    };
    let h = p.header;
    println!("{h}");
}
```

# Options
- [ ] A) A struct implementing Drop cannot have private fields
- [ ] B) Fields of a struct with Drop are implicitly immutable
- [x] C) Types implementing Drop forbid moving out single fields
- [ ] D) String fields inside structs with Drop must be pinned

# Hint
Types with custom destructors must remain whole when dropped.

# Explanation
Rust forbids moving individual fields out of types that implement the `Drop` trait (compiler error `E0509`). Because `drop(&mut self)` is called on the entire instance when it goes out of scope, leaving partially-moved or uninitialized fields would violate memory safety. To extract a field from a `Drop` type, you must take it through `std::mem::replace`, `Option::take`, or drop the wrapper entirely.
