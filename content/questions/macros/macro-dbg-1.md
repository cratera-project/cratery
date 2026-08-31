---
id: macro-dbg-1
categorySlug: macros
title: "dbg! Macro Behavior"
difficulty: 2
tags: [macros, stdlib]
---

# Prompt
What does `dbg!(x)` return?

# Code
```rust
fn main() {
    let x = 2;
    let y = dbg!(x) + 1;
    println!("{y}");
}
```

# Options
- [ ] A) The unit value `()` after printing to stderr
- [ ] B) Ownership of `x` moved into a debug-only wrapper
- [x] C) The same value as `x`, after printing debug info
- [ ] D) A string containing the debug formatting of `x`

# Hint
`dbg!` is designed to wrap expressions in place.

# Explanation
`dbg!(expr)` prints file/line and `Debug` output to stderr, then yields `expr`’s value (by move/copy as appropriate). That is why `dbg!(x) + 1` works. It does not return `()` or a `String`.
