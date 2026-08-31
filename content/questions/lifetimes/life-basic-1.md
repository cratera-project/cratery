---
id: life-basic-1
categorySlug: lifetimes
title: "Lifetime Annotations"
difficulty: 2
tags: [lifetimes, syntax]
---

# Prompt
What is the purpose of the lifetime parameter `'a` here?

# Code
```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}
```

# Options
- [ ] A) Force both inputs to be heap-allocated strings
- [x] B) Relate the return borrow to the input borrows
- [ ] C) Extend `x` and `y` past the caller’s scope in code
- [ ] D) Make the returned reference always `'static` in code

# Hint
Lifetimes describe relationships, not storage.

# Explanation
Lifetime parameters do not keep values alive longer. The shared `'a` means the returned reference is borrowed from one of the inputs and is only usable for as long as that borrow remains valid; in practice, the overlap of the two concrete input lifetimes.
