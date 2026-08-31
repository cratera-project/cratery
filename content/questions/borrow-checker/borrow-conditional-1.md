---
id: borrow-conditional-1
categorySlug: borrow-checker
title: "Conditional Borrows"
difficulty: 3
tags: [borrowing, control-flow]
---

# Prompt
Why does this compile?

# Code
```rust
let mut x = 5;
let r = if x > 0 { &x } else { &x };
println!("{r}");
x += 1;
```

# Options
- [ ] A) Both branches copy `x`, so no borrow remains afterward
- [ ] B) `if` expressions erase borrow tracking for integers
- [x] C) The shared borrow through `r` ends after `println!`
- [ ] D) Assigning `x += 1` clones through the live reference

# Hint
NLL cares about last use of `r`, not the end of the block.

# Explanation
Both branches borrow `x` immutably into `r`. That borrow only needs to last until `r`’s last use (`println!`). Afterward NLL ends it, so `x += 1` is allowed.
