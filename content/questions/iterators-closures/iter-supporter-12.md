---
id: iter-supporter-12
categorySlug: iterators-closures
title: "Iterator::peekable and Peek Mutability"
difficulty: 2
tags: [iterators-closures, peekable, peek_mut]
---

# Prompt
Can you mutably modify the peeked value via `peek_mut()` on `Peekable`?

# Code
```rust
fn main() {
    let mut iter = vec![1, 2, 3].into_iter().peekable();
    if let Some(val) = iter.peek_mut() {
        *val = 42;
    }
    assert_eq!(iter.next(), Some(42));
}
```

# Options
- [ ] A) No, peekable values are strictly read-only immutable references in runtime memory
- [ ] B) Only if the collection elements implement the `Copy` trait in runtime memory
- [x] C) Yes, `peek_mut()` returns `Option<&mut Item>` allowing in-place mutation
- [ ] D) Only inside unsafe blocks with raw pointer dereferencing within local thread memory

# Hint
peek_mut() yields a mutable reference &mut T to the buffered next element.

# Explanation
`Peekable::peek_mut` returns `Option<&mut I::Item>`, enabling callers to inspect and modify the buffered next item in place before extracting it with `next()`.
