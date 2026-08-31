---
id: closure-fn-traits-1
categorySlug: iterators-closures
title: "Fn vs FnMut vs FnOnce"
difficulty: 3
tags: [closures, traits]
---

# Prompt
Which trait best describes calling this closure repeatedly?

# Code
```rust
let mut count = 0;
let mut closure = || {
    count += 1;
    count
};
```

# Options
- [ ] A) `Fn` only, because it never takes ownership of data
- [ ] B) `FnOnce` only, because each call consumes `count`
- [ ] C) No Fn traits; mutable captures are unsupported
- [x] D) `FnMut`, because it mutably borrows `count`

# Hint
Ask whether the call needs `&`, `&mut`, or ownership of the capture.

# Explanation
Mutating a captured variable requires `FnMut`. All closures implement `FnOnce`; this one is not limited to a single call. It does not implement `Fn`, which allows calling through a shared `&self`.
