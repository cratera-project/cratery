---
id: iter-supporter-14
categorySlug: iterators-closures
title: "Iterator::fuse Guarantee"
difficulty: 2
tags: [iterators-closures, fuse, fused-iterator]
---

# Prompt
What does `iter.fuse()` guarantee about calls to `next()` after the first `None`?

# Code
```rust
fn main() {
    let mut iter = (1..=2).fuse();
    assert_eq!(iter.next(), Some(1));
    assert_eq!(iter.next(), Some(2));
    assert_eq!(iter.next(), None);
    assert_eq!(iter.next(), None); // Guaranteed to stay None forever
}
```

# Options
- [x] A) Guarantees that all subsequent calls to `next()` will continue returning `None`
- [ ] B) Re-evaluates the iterator from the beginning upon reaching `None` in runtime memory
- [ ] C) Panics if `next()` is called after `None` has been returned within local thread memory
- [ ] D) Merges multiple iterator streams into an asynchronous channel within local thread memory

# Hint
fuse creates an iterator that continues to return None forever once None is yielded.

# Explanation
Standard `Iterator` contracts do not specify behavior if `next()` is called after returning `None`. `fuse()` wraps the iterator so that once `None` is yielded, all future `next()` calls are guaranteed to return `None`.
