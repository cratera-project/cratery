---
id: iter-peekable-peek-mut-1
categorySlug: iterators-closures
title: "In-Place Mutation with peek_mut"
difficulty: 2
tags: [iterators-closures, peekable, peek_mut]
---

# Prompt
What does `Peekable::peek_mut(&mut self)` allow on an iterator?

# Options
- [x] A) It allows in-place mutation of the upcoming next element
- [ ] B) It consumes the next item and stores it in thread heap
- [ ] C) It clones the next element into an immutable shared box
- [ ] D) It reverses the iteration direction towards collection head

# Hint
peek_mut returns a mutable reference &mut to the peeked item without consuming it.

# Explanation
`peek_mut()` returns a `PeekMut` guard holding a mutable reference to the next element, allowing you to modify the peeked value before it is consumed.
