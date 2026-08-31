---
id: iter-fuse-1
categorySlug: iterators-closures
title: "Fused Iterators"
difficulty: 2
tags: [iterators, fuse]
---

# Prompt
What guarantee does `.fuse()` add?

# Code
```rust
let mut it = [1].into_iter().fuse();
assert_eq!(it.next(), Some(1));
assert_eq!(it.next(), None);
assert_eq!(it.next(), None);
```

# Options
- [x] A) After the first `None`, further `next` calls stay `None`
- [ ] B) The iterator panics if `next` is called after exhaustion
- [ ] C) Items are returned in reverse order until empty
- [ ] D) `fuse` makes iteration run across OS threads automatically

# Hint
Some iterators can yield values again after `None`.

# Explanation
A fused iterator promises that once `next` returns `None`, all later `next` calls also return `None`. `.fuse()` wraps iterators that might not uphold that, which matters for combinators that assume fusion.
