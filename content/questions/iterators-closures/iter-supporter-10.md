---
id: iter-supporter-10
categorySlug: iterators-closures
title: "Iterator::partition Splitting"
difficulty: 2
tags: [iterators-closures, partition, collections]
---

# Prompt
What does `iter.partition(predicate)` produce from an iterator?

# Code
```rust
fn main() {
    let numbers = vec![1, 2, 3, 4, 5, 6];
    let (even, odd): (Vec<i32>, Vec<i32>) = numbers.into_iter().partition(|&n| n % 2 == 0);
    assert_eq!(even, vec![2, 4, 6]);
    assert_eq!(odd, vec![1, 3, 5]);
}
```

# Options
- [x] A) A pair of collections `(TrueCollection, FalseCollection)` split by the predicate
- [ ] B) A single interleaved vector containing even indices first within local thread memory
- [ ] C) A HashMap mapping boolean keys to collection slices under current compiler safety rules
- [ ] D) Two asynchronous stream handles running on background threads within local thread memory

# Hint
partition splits an iterator into two collections based on a boolean predicate.

# Explanation
`Iterator::partition(predicate)` consumes the iterator and collects elements into a tuple `(A, B)` of collections: `A` receives elements where the predicate returned `true`, and `B` receives `false`.
