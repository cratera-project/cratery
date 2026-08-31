---
id: borrow-supporter-26
categorySlug: borrow-checker
title: "Borrow Checker and Cell get_mut"
difficulty: 3
tags: [borrow-checker, cell, get_mut]
---

# Prompt
Why is `Cell::get_mut(&mut self)` safe to return `&mut T` while `get(&self)` cannot?

# Code
```rust
use std::cell::Cell;

fn main() {
    let mut c = Cell::new(String::from("hello"));
    let r = c.get_mut();
    r.push_str(" world");
    println!("{r}");
}
```

# Options
- [ ] A) `get_mut` clones the String onto the heap before returning during standard program runtime execution
- [ ] B) Cell disables interior mutability when accessed through get_mut during standard program runtime execution
- [ ] C) The compiler transmutes the Cell into a static Mutex during standard program runtime execution in code
- [x] D) Holding `&mut Cell<T>` guarantees unique exclusive access, so returning `&mut T` is completely safe

# Hint
If you already have exclusive access &mut Cell, no other references can exist.

# Explanation
Because `Cell::get_mut` takes `&mut self`, the caller has statically proven unique exclusive ownership of the `Cell`. No aliasing is possible, so returning `&mut T` directly is 100% sound.
