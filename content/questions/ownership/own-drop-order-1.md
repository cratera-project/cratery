---
id: own-drop-order-1
categorySlug: ownership
title: "Local Drop Order"
difficulty: 2
tags: [ownership, drop]
---

# Prompt
What does this program print?

# Code
```rust
struct D(&'static str);
impl Drop for D {
    fn drop(&mut self) {
        println!("{}", self.0);
    }
}
fn main() {
    let a = D("first");
    let b = D("second");
}
```

# Options
- [ ] A) `first` then `second` (declaration order)
- [x] B) `second` then `first` (reverse order)
- [ ] C) Only `second`; `a` is moved into `b`
- [ ] D) Nothing; locals skip `Drop` until `exit`

# Hint
Locals and struct fields do not use the same drop order.

# Explanation
When a block ends, locals are dropped in reverse declaration order, so `b` prints `second` then `a` prints `first` (Reference, Destructors). Struct fields, by contrast, drop in declaration order. Leading-underscore names still drop; only a wildcard `let _ = ...` drops immediately.
