---
id: own-supporter-17
categorySlug: ownership
title: "Reborrowing in Loop"
difficulty: 3
tags: [ownership, reborrow, loops]
---

# Prompt
Why does reborrowing `&mut *slice` inside a loop compile without move errors?

# Code
```rust
fn modify(s: &mut [i32]) {
    for _ in 0..3 {
        let r = &mut *s;
        r[0] += 1;
    }
}
```

# Options
- [x] A) Reborrowing creates a temporary shorter borrow per iteration
- [ ] B) The compiler moves `s` into `r` and restores it on drop in code
- [ ] C) Mutable references implement Copy inside loop statements in code
- [ ] D) Loop iterations execute sequentially on distinct threads in code

# Hint
Reborrowing &mut *s does not move the reference; it creates a shorter sub-borrow.

# Explanation
In Rust, `&mut *s` reborrows from `s` for a shorter lifetime matching each loop iteration. Because the reborrow expires at the end of each iteration, `s` is available for the next iteration.
