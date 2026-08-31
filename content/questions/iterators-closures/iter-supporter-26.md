---
id: iter-supporter-26
categorySlug: iterators-closures
title: "Iterator::step_by Stride"
difficulty: 2
tags: [iterators-closures, step-by, panics]
---

# Prompt
What happens if `step_by(0)` is called on an iterator?

# Code
```rust
// let _ = (0..10).step_by(0); // Panics!
```

# Options
- [x] A) Panics immediately because step size must be non-zero
- [ ] B) Yields the first element infinitely in a loop during runtime execution
- [ ] C) Returns an empty iterator yielding `None` during runtime execution
- [ ] D) Defaults to a step size of 1 automatically during runtime execution

# Hint
step_by(step) requires step > 0 and panics if step == 0.

# Explanation
`Iterator::step_by(step)` requires `step >= 1`. Calling `step_by(0)` panics with an assertion error because a step size of 0 would loop infinitely on the first element.
