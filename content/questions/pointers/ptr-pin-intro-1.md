---
id: ptr-pin-intro-1
categorySlug: pointers
title: "Pin Motivation"
difficulty: 2
tags: [pointers, pin]
---

# Prompt
What problem does `Pin` help address?

# Code
```rust
use std::pin::Pin;
// async state machines / self-referential structs
```

# Options
- [ ] A) Making every value `Copy` without deriving traits
- [ ] B) Replacing `unsafe` with a faster safe allocator API
- [x] C) Preventing moves of values that must stay put
- [ ] D) Turning shared borrows into owned heap allocations

# Hint
Self-referential types break if the struct moves.

# Explanation
`Pin` constrains moving certain values in memory, which is critical for self-referential structs and many `Future` state machines. It is not about making things `Copy` or allocating by itself.
