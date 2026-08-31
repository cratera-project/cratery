---
id: ptr-cell-1
categorySlug: pointers
title: "Cell Basics"
difficulty: 2
tags: [pointers, cell, interior-mutability]
---

# Prompt
What capability does `Cell<T>` provide?

# Code
```rust
use std::cell::Cell;
let c = Cell::new(1);
c.set(2);
let v = c.get();
```

# Options
- [ ] A) Thread-safe mutation without synchronization
- [ ] B) Multiple simultaneous `&mut` into the cell
- [ ] C) Immutability guarantees after first `set`
- [x] D) Interior mutability via shared `&Cell<T>`

# Hint
You mutate through `&self` methods like `set`/`get`.

# Explanation
`Cell<T>` offers simple interior mutability: `set`/`get`/`replace` work through a shared reference. It is not thread-safe and does not hand out long-lived `&mut T` aliases.
