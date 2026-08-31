---
id: own-copy-drop-1
categorySlug: ownership
title: "Copy and Drop"
difficulty: 3
tags: [ownership, copy, drop]
---

# Prompt
Why can’t a type implement both `Copy` and `Drop`?

# Code
```rust
// Illustrating the rule: this combination is rejected:
// #[derive(Copy, Clone)]
// struct Bad;
// impl Drop for Bad { fn drop(&mut self) {} }
```

# Options
- [ ] A) `Copy` forbids any type larger than one word
- [ ] B) `Drop` only works for heap-allocated types
- [ ] C) The traits conflict only inside `unsafe` blocks
- [x] D) `Drop` needs unique ownership for cleanup

# Hint
Implicit copies would break unique cleanup.

# Explanation
`Copy` means assignment duplicates the value freely. `Drop` runs cleanup for a unique owner. If both were allowed, copies could cause double-free or skipped cleanup. The language therefore forbids implementing both.
