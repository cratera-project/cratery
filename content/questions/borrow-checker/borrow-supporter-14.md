---
id: borrow-supporter-14
categorySlug: borrow-checker
title: "Interior Mutability Escape Hatch"
difficulty: 2
tags: [borrow-checker, interior-mutability, refcell]
---

# Prompt
Why does `RefCell<T>` allow mutating data behind a shared reference `&T`?

# Code
```rust
use std::cell::RefCell;

struct Logger {
    logs: RefCell<Vec<String>>,
}

impl Logger {
    fn log(&self, msg: &str) {
        self.logs.borrow_mut().push(msg.to_string());
    }
}
```

# Options
- [ ] A) It tells the compiler to disable all aliasing checks permanently in runtime memory
- [ ] B) It allocates the inner vector on the operating system kernel heap in runtime memory
- [ ] C) It converts the struct methods into static thread functions in runtime memory
- [x] D) It defers borrow checking from compile time to runtime using `UnsafeCell`

# Hint
Interior mutability moves borrow rule enforcement from compile-time to runtime.

# Explanation
Types offering interior mutability (like `RefCell`, `Cell`, `Mutex`) wrap `UnsafeCell<T>`, allowing mutation through `&self` by enforcing aliasing rules dynamically at runtime rather than statically at compile time.
