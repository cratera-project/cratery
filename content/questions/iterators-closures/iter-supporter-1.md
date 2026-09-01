---
id: iter-supporter-1
categorySlug: iterators-closures
title: "Iterator::by_ref Adapter"
difficulty: 2
tags: [iterators-closures, by-ref, adapters]
---

# Prompt
How does `iter.by_ref()` allow partially consuming an iterator without losing ownership?

# Code
```rust
fn main() {
    let mut iter = 1..=10;
    let head: Vec<_> = iter.by_ref().take(3).collect();
    assert_eq!(head, vec![1, 2, 3]);
    assert_eq!(iter.next(), Some(4));
}
```

# Options
- [x] A) It creates a mutable reference adapter `&mut I` that implements `Iterator`
- [ ] B) It duplicates the iterator state onto the thread-local stack memory buffer
- [ ] C) It converts the iterator into a clone-on-write Cow buffer during execution
- [ ] D) It freezes the iterator until all borrowed elements are dropped in scope

# Hint
by_ref borrows the iterator mutably (&mut iter) so adapters like take() do not consume the iterator.

# Explanation
Docs: `by_ref(&mut self) -> &mut Self` creates a by-reference adapter. `take` takes `self` by value, so without `by_ref` it would consume `iter`. `&mut I` implements `Iterator`, so `take(3).collect()` consumes the adapter, not `iter`. After that expression, `iter` is still usable (`next()` is `Some(4)`).
