---
id: ptr-rc-1
categorySlug: pointers
title: "Rc Shared Ownership"
difficulty: 2
tags: [pointers, rc]
---

# Prompt
What does cloning an `Rc<T>` do?

# Code
```rust
use std::rc::Rc;
let a = Rc::new(String::from("hi"));
let b = Rc::clone(&a);
```

# Options
- [ ] A) Deep-copies the `String` into a second allocation
- [x] B) Increments the strong count for shared ownership
- [ ] C) Moves ownership out of `a`, leaving it unusable
- [ ] D) Creates a `Weak` handle that does not keep data alive

# Hint
`Rc::clone` shares; it does not clone the inner `T` by default.

# Explanation
`Rc::clone` bumps the strong reference count so multiple owners share one allocation. The inner `String` is not deep-copied. The value is dropped when the last strong `Rc` goes away.
