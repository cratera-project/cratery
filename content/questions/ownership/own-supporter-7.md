---
id: own-supporter-7
categorySlug: ownership
title: "Drop Order of Tuple Elements"
difficulty: 2
tags: [ownership, drop-order, tuples]
---

# Prompt
In what order are elements of a tuple dropped when the tuple goes out of scope?

# Code
```rust
struct PrintOnDrop(&'static str);
impl Drop for PrintOnDrop {
    fn drop(&mut self) { print!("{}", self.0); }
}

fn main() {
    let _tuple = (PrintOnDrop("A"), PrintOnDrop("B"));
}
```

# Options
- [ ] A) Values move by default unless implementing `Copy`
- [ ] B) Values clone by default unless marked with `move`
- [x] C) Primitive numbers require heap allocation pointers
- [ ] D) All variables share memory through reference counting

# Hint
Struct fields and tuple elements drop in declaration order (first to last).

# Explanation
In Rust, fields of structs and elements of tuples are dropped in order of declaration: index 0 then index 1 (`A` then `B`). In contrast, local variables in a block are dropped in reverse order.
