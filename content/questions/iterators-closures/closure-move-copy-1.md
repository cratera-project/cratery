---
id: closure-move-copy-1
categorySlug: iterators-closures
title: "Move Closures with Copy Types"
difficulty: 2
tags: [closures, ownership, copy]
---

# Prompt
Is `x` still usable after creating this `move` closure?

# Code
```rust
let x = 42;
let closure = move || println!("{x}");
closure();
println!("x is {x}");
```

# Options
- [ ] A) No; `move` always invalidates the original binding
- [ ] B) Yes, but only because `move` still borrows mutably
- [x] C) Yes; `i32: Copy`, so capture copies the value
- [ ] D) No; using `x` afterward is undefined behavior

# Hint
`move` means capture by value; `Copy` types still copy.

# Explanation
`move` forces by-value capture. For `i32`, that value is copied, so `x` remains valid. A non-`Copy` type like `String` would be moved and unusable afterward.
