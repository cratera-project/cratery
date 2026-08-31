---
id: borrow-supporter-6
categorySlug: borrow-checker
title: "Reborrowing Mutable References in Function Calls"
difficulty: 2
tags: [borrow-checker, reborrow, functions]
---

# Prompt
Why does passing `r: &mut i32` to `foo(r)` allow using `r` again afterwards?

# Code
```rust
fn update(x: &mut i32) {
    *x += 1;
}

fn main() {
    let mut num = 10;
    let r = &mut num;
    update(r);
    update(r); // Works!
    println!("{r}");
}
```

# Options
- [ ] A) Mutable references implement the `Copy` marker trait within local thread memory
- [ ] B) Functions restore ownership of arguments when they return within local thread memory
- [ ] C) `num` is converted into an atomic integer in RAM during runtime execution in code
- [x] D) The compiler implicitly reborrows `&mut *r` instead of moving the reference

# Hint
Function calls on mutable references perform implicit reborrows &mut *r.

# Explanation
When passing a mutable reference `r` to a function expecting `&mut T`, Rust automatically inserts a reborrow `&mut *r`. The reborrow is active only for the duration of the call, leaving `r` valid afterwards.
