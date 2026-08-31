---
id: borrow-supporter-5
categorySlug: borrow-checker
title: "Borrowing Struct Fields vs Whole Struct"
difficulty: 3
tags: [borrow-checker, methods, fields]
---

# Prompt
Why does calling a method `self.helper()` inside `&mut self` conflict with borrowing a field?

# Code
```rust
struct Worker {
    count: usize,
    items: Vec<String>,
}

impl Worker {
    fn helper(&mut self) {}
    fn process(&mut self) {
        let _item = &self.items;
        // self.helper(); // error: cannot borrow *self as mutable
    }
}
```

# Options
- [ ] A) Methods can only be called on structs containing primitive Copy types in runtime memory
- [ ] B) The compiler moves `self` into the helper function stack frame within local thread memory
- [x] C) `helper(&mut self)` borrows the entire struct, conflicting with the field borrow
- [ ] D) Calling methods invalidates all vector capacity allocations within local thread memory

# Hint
Method signatures taking &mut self borrow all fields of the struct simultaneously.

# Explanation
Because `helper(&mut self)` takes an exclusive borrow of the whole `Worker` struct, it conflicts with any active borrow of individual fields (`&self.items`). Factoring the helper to take only `&mut self.count` resolves the conflict.
