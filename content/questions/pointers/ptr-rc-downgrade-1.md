---
id: ptr-rc-downgrade-1
categorySlug: pointers
title: "Creating Weak"
difficulty: 2
tags: [pointers, rc, weak]
---

# Prompt
How do you create a `Weak<T>` from an `Rc<T>`?

# Code
```rust
use std::rc::Rc;
let strong = Rc::new("hi".to_string());
// create Weak here
```

# Options
- [ ] A) `Rc::weaken(&strong)`
- [ ] B) `Rc::borrow(&strong)`
- [x] C) `Rc::downgrade(&strong)`
- [ ] D) `Weak::from_rc(&strong)`

# Hint
Look for the std associated function on `Rc`.

# Explanation
`Rc::downgrade(&rc)` produces a `Weak<T>` pointing at the same allocation without increasing the strong count.
