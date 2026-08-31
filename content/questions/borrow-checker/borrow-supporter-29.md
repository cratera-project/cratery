---
id: borrow-supporter-29
categorySlug: borrow-checker
title: "Borrow Checker Loop Invariant"
difficulty: 2
tags: [borrow-checker, loops, scopes]
---

# Prompt
Why does assigning a new reference `r = &data;` on each iteration compile?

# Code
```rust
fn main() {
    let data = vec![1, 2, 3];
    for _ in 0..3 {
        let r = &data;
        println!("{}", r[0]);
    }
}
```

# Options
- [ ] A) The vector buffer is locked atomically during each loop cycle in code
- [ ] B) Loops in Rust execute as separate isolated microVM tasks in code
- [x] C) The scope of `r` is confined to each individual loop iteration
- [ ] D) Shared references are converted to constants in loop headers in code

# Hint
Variables declared inside the loop body drop at the end of each iteration.

# Explanation
Because `let r = &data;` is inside the loop body, `r` is created and dropped on each iteration. Its borrow does not outlive that single iteration, so subsequent iterations start fresh.
