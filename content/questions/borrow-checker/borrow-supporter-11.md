---
id: borrow-supporter-11
categorySlug: borrow-checker
title: "Borrow Checker and Closure Move Analysis"
difficulty: 2
tags: [borrow-checker, closures, move]
---

# Prompt
Why does passing a closure `move || ...` allow it to outlive the local stack frame?

# Code
```rust
fn make_fn() -> impl Fn() -> i32 {
    let x = 10;
    move || x + 1
}
```

# Options
- [x] A) It transfers ownership of `x` into the closure struct, removing references to the local stack
- [ ] B) It converts the stack frame of `make_fn` into an async heap generator within local thread memory
- [ ] C) It registers the local variable with the process garbage collector under current compiler safety rules
- [ ] D) The compiler inlines the closure directly into the caller during standard program runtime execution

# Explanation
By using `move`, the closure takes ownership of `x` by value. Because the closure contains no borrowed references to the stack frame of `make_fn`, it can be returned and live for 'static.
