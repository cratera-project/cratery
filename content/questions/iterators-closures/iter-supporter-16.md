---
id: iter-supporter-16
categorySlug: iterators-closures
title: "Iterator::flat_map vs map"
difficulty: 2
tags: [iterators-closures, flat-map, combinators]
---

# Prompt
How does `flat_map` differ from calling `map` on an iterator?

# Code
```rust
fn main() {
    let words = vec!["hi", "world"];
    let chars: Vec<char> = words.into_iter().flat_map(|w| w.chars()).collect();
    assert_eq!(chars, vec!['h', 'i', 'w', 'o', 'r', 'l', 'd']);
}
```

# Options
- [ ] A) `flat_map` executes the mapping closure concurrently in Rayon within local thread memory
- [ ] B) `flat_map` removes duplicate items from the resulting collection in runtime memory
- [x] C) `flat_map` flattens each yielded sub-iterator into a continuous single stream
- [ ] D) `flat_map` converts all yielded elements into static slice views in runtime memory

# Hint
flat_map is equivalent to .map(f).flatten().

# Explanation
`Iterator::flat_map(f)` maps each item to an `IntoIterator` and flattens the resulting iterators into a single linear sequence.
