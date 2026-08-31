---
id: own-pin-drop-1
categorySlug: ownership
title: "Pinning and Drop Guarantee"
difficulty: 3
tags: [ownership, pin, drop]
---

# Prompt
What guarantee does `Pin` enforce regarding value destruction?

# Options
- [ ] A) The pinned value cannot ever implement the `Drop` trait
- [ ] B) The value is guaranteed to drop in a static background thread
- [ ] C) The memory is immediately repurposed prior to destructor run
- [x] D) The value's destructor is run before memory location is freed

# Hint
Memory of a pinned value cannot be reused before Drop completes.

# Explanation
The `Pin` drop guarantee ensures that once a value is pinned, its allocated memory will not be overwritten or reused until its `Drop` implementation is executed.
