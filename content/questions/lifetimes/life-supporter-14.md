---
id: life-supporter-14
categorySlug: lifetimes
title: "Lifetime in Associated Types"
difficulty: 3
tags: [lifetimes, gats, streaming-iterator]
---

# Prompt
How do Generic Associated Types (GATs) enable streaming iterators?

# Code
```rust
trait StreamingIterator {
    type Item<'a> where Self: 'a;
    fn next<'a>(&'a mut self) -> Option<Self::Item<'a>>;
}
```

# Options
- [x] A) By allowing yielded items to borrow directly from &'a mut self
- [ ] B) By converting all items into thread-safe static allocations in code
- [ ] C) By executing iterator steps concurrently on Rayon threads in code
- [ ] D) By removing the need for lifetime variance in the compiler in code

# Hint
GATs allow the associated type Item to be parameterized by the borrow lifetime.

# Explanation
Standard Iterator defines type Item; without a lifetime parameter, requiring items to outlive the iterator. GATs allow type Item<'a>, enabling Item to borrow from &'a mut self for each step.
