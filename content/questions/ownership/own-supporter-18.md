---
id: own-supporter-18
categorySlug: ownership
title: "Drop Flags in Stack Memory"
difficulty: 3
tags: [ownership, drop-flags, runtime]
---

# Prompt
How does the runtime know whether `val` needs to be dropped after conditional moves?

# Code
```rust
fn process(cond: bool) {
    let val = String::from("resource");
    if cond {
        drop(val);
    }
    // runtime drop check here
}
```

# Options
- [ ] A) It polls global memory allocators for allocation state during execution
- [x] B) It checks runtime drop flags stored on the stack frame
- [ ] C) It executes both branches speculatively in CPU cache in code
- [ ] D) It queries operating system page tables on function exit

# Hint
When moves are conditional, the compiler introduces hidden boolean stack flags.

# Explanation
When a variable might or might not be moved based on runtime conditions (e.g. `if cond`), the compiler generates a hidden boolean drop flag on the stack frame to track initialization status.
