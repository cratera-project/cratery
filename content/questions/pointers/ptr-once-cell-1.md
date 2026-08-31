---
id: ptr-once-cell-1
categorySlug: pointers
title: "OnceCell Write-Once"
difficulty: 2
tags: [pointers, oncecell]
---

# Prompt
What happens on the second `set`?

# Code
```rust
use std::cell::OnceCell;
fn main() {
    let cell = OnceCell::new();
    assert_eq!(cell.set(92), Ok(()));
    assert_eq!(cell.set(62), Err(62));
    assert_eq!(cell.get(), Some(&92));
}
```

# Options
- [x] A) It returns `Err` with the unused new value
- [ ] B) It overwrites 92 with 62 and returns `Ok`
- [ ] C) It panics because cells cannot be written twice
- [ ] D) It waits until `get` runs on another thread

# Hint
The cell is write-once; the first value stays.

# Explanation
`OnceCell::set` initializes an empty cell (`Ok(())`) and returns `Err(value)` if it was already set, leaving the original contents. `get` then yields `&T` without `RefCell`-style runtime borrow flags. `OnceCell` is `!Sync`; the thread-safe counterpart is `OnceLock`.
