---
id: iter-by-ref-adapter-1
categorySlug: iterators-closures
title: "Iterator Borrowing with by_ref"
difficulty: 2
tags: [iterators-closures, by-ref]
---

# Prompt
What is the primary use case of calling `iter.by_ref()` in an iterator pipeline?

# Options
- [x] A) It allows chaining adapters without consuming the iterator
- [ ] B) It converts value-yielding iterators to reference streams
- [ ] C) It enforces single-threaded ownership during loop pipeline
- [ ] D) It automatically caches consumed items into memory vector

# Hint
by_ref borrows the iterator mutably so the remaining items can be used later.

# Explanation
`by_ref()` creates a mutable borrow of an iterator, allowing you to apply consumer adapters (like `take(5)`) without moving or consuming the original iterator.
