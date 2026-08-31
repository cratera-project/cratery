---
id: iter-peekable-1
categorySlug: iterators-closures
title: "Peekable Lookahead"
difficulty: 2
tags: [iterators, peekable]
---

# Prompt
After `peek()` returns `Some(&10)`, what does `next()` return?

# Code
```rust
fn main() {
    let mut it = [10, 20].into_iter().peekable();
    assert_eq!(it.peek(), Some(&10));
    assert_eq!(it.next(), Some(10));
}
```

# Options
- [ ] A) `Some(20)`, because `peek` already consumed 10
- [ ] B) `None`, because `peek` exhausted the iterator
- [ ] C) `Some(&10)`, leaving the cursor where it was
- [x] D) `Some(10)`, the item `peek` only inspected

# Hint
`peek` looks ahead; `next` is what advances.

# Explanation
`Peekable::peek` returns `Option<&Item>` without advancing. The following `next()` still yields that same item (`Some(10)`). A common mix-up is thinking `peek` consumes, or that `next` would keep returning a reference.
