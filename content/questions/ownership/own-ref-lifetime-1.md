---
id: own-ref-lifetime-1
categorySlug: ownership
title: "Reference Validity"
difficulty: 2
tags: [ownership, borrowing, scope]
---

# Prompt
Why does the compiler reject this code?

# Code
```rust
fn main() {
    let r;
    {
        let x = 5;
        r = &x;
    }
    println!("r: {}", r);
}
```

# Options
- [ ] A) References must be initialized when first declared
- [ ] B) Inner scopes can never produce lasting references
- [x] C) `x` is dropped at block end before `r` prints
- [ ] D) Integer references must use the static lifetime

# Hint
A reference cannot outlive its referent.

# Explanation
`x` lives only in the inner block. When that block ends, `x` is dropped, but `r` would still hold a reference to it. The borrow checker rejects this dangling reference.
