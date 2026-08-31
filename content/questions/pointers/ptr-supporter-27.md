---
id: ptr-supporter-27
categorySlug: pointers
title: "Rc Weak Cycles and Leaks"
difficulty: 2
tags: [pointers, rc, cycles]
---

# Prompt
How does `Rc<RefCell<Node>>` prevent memory leaks in cyclic graph structures?

# Code
```rust
use std::rc::{Rc, Weak};
use std::cell::RefCell;

struct Node {
    parent: Option<Weak<RefCell<Node>>>,
    children: Vec<Rc<RefCell<Node>>>,
}
```

# Options
- [ ] A) By running a background garbage collector on thread idle within local thread memory
- [ ] B) By forcing nodes to be allocated on the call stack exclusively within local thread memory
- [x] C) By storing back-references as `Weak` pointers to break strong reference cycles
- [ ] D) By converting all child pointers into raw C-style pointers within local thread memory

# Hint
Child-to-parent pointers should be Weak to avoid reference count cycles.

# Explanation
Reference cycles (where node A owns node B and node B owns node A via strong `Rc`) prevent reference counts from ever reaching 0, leaking memory. Using `Weak` for back-references breaks the cycle.
