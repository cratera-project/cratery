---
id: life-supporter-2
categorySlug: lifetimes
title: "Invariance of Mutable References"
difficulty: 3
tags: [lifetimes, invariance, mutable-references]
---

# Prompt
Why is &mut T invariant over T?

# Code
```rust
fn overwrite<'a>(dest: &mut &'a str, src: &'a str) {
    *dest = src;
}
```

# Options
- [x] A) To prevent writing shorter-lived references into longer-lived slots
- [ ] B) To allow writing shorter-lived references without memory checks in code
- [ ] C) Because mutable references cannot cross thread boundaries safely in code
- [ ] D) Because exclusive references cannot be reborrowed inside loops in code

# Hint
If &mut T were covariant over T, you could write a short-lived reference into a long-lived variable.

# Explanation
If &mut T were covariant over T, a caller could pass &mut &'static str to a function expecting &mut &'a str, which could then write a short-lived &'a str into what the caller believes is a 'static slot.
