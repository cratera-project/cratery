---
id: iter-supporter-31
categorySlug: iterators-closures
title: "Iterator::unzip Tuple Split"
difficulty: 2
tags: [iterators-closures, unzip, tuples]
---

# Prompt
What does `iter.unzip()` do on an iterator yielding pairs `(A, B)`?

# Code
```rust
fn main() {
    let pairs = vec![(1, "a"), (2, "b")];
    let (nums, letters): (Vec<i32>, Vec<&str>) = pairs.into_iter().unzip();
    assert_eq!(nums, vec![1, 2]);
    assert_eq!(letters, vec!["a", "b"]);
}
```

# Options
- [ ] A) Decompresses a compressed binary byte stream in memory within local thread memory
- [x] B) Splits an iterator of pairs into two separate collections `(ColA, ColB)`
- [ ] C) Interleaves two collections into a single sorted vector within local thread memory
- [ ] D) Converts pairs into a hash table key-value map during runtime execution in code

# Hint
unzip converts an iterator of tuples (A, B) into a tuple of collections (Vec<A>, Vec<B>).

# Explanation
`Iterator::unzip` takes an iterator of tuples `(A, B)` and separates them into two collections, extending the first collection with `a` and the second with `b`.
