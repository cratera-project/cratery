---
id: iter-closure-fn-cell-capture-1
categorySlug: iterators-closures
title: "Closure Fn via Interior Mutability"
difficulty: 2
tags: [closures, fn, cell]
---

# Prompt
Why does the closure `bump` implement `Fn` instead of only `FnMut`?

# Code
```rust
use std::cell::Cell;

fn call_twice<F: Fn()>(f: F) {
    f();
    f();
}

fn main() {
    let counter = Cell::new(0);
    let bump = || counter.set(counter.get() + 1);
    call_twice(bump);
    println!("{}", counter.get());
}
```

# Options
- [ ] A) Closures with trivial body expressions always implement Fn
- [x] B) It captures &Cell, mutating state by interior mutability
- [ ] C) The compiler promotes all FnMut closures to Fn in main()
- [ ] D) Cell instances force closure environments to copy by value

# Hint
How is the Cell reference captured in the closure environment?

# Explanation
The closure trait implemented by a closure depends on how it accesses its captured variables. Here, `bump` captures `counter` by shared reference (`&Cell<i32>`). Because `Cell::set` operates on `&self` via interior mutability, the closure's call operator only requires `&self` (`&bump`), allowing it to implement `Fn`.
