---
id: iter-supporter-25
categorySlug: iterators-closures
title: "Iterator::skip_while Behavior"
difficulty: 2
tags: [iterators-closures, skip-while, combinators]
---

# Prompt
What does `iter.skip_while(predicate)` do once the predicate returns `false`?

# Code
```rust
fn main() {
    let nums = vec![1, 2, 5, 2, 1];
    let skipped: Vec<_> = nums.into_iter().skip_while(|&x| x < 4).collect();
    assert_eq!(skipped, vec![5, 2, 1]);
}
```

# Options
- [ ] A) Terminates iteration and immediately returns `None` under current compiler safety rules
- [ ] B) Continues evaluating the predicate on subsequent elements like `filter` in runtime memory
- [ ] C) Reverses the collection order and searches from the rear under current compiler safety rules
- [x] D) Yields that element and all remaining elements without checking the predicate again

# Hint
skip_while ignores items until the first false, then yields all remaining items unchecked.

# Explanation
`Iterator::skip_while` ignores items as long as `predicate` is `true`. As soon as it encounters the first `false`, it yields that element and all subsequent elements without ever calling the predicate again.
