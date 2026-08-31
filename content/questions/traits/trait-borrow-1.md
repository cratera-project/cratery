---
id: trait-borrow-1
categorySlug: traits
title: "Borrow Trait in APIs"
difficulty: 2
tags: [traits, borrow]
---

# Prompt
Why do map lookups take `Q: ?Sized where K: Borrow<Q>`?

# Code
```rust
use std::collections::HashMap;
let mut m: HashMap<String, i32> = HashMap::new();
m.insert("a".into(), 1);
let v = m.get("a"); // &str query, String keys
```

# Options
- [x] A) `Borrow` lets queries use equivalent borrowed forms
- [ ] B) `get` always clones keys into owned `String` values
- [ ] C) `HashMap` can only look up with the exact key type
- [ ] D) `Borrow` converts every `&str` into a mutable key

# Hint
`String` borrows as `str` with matching hash/eq.

# Explanation
`Borrow` relates owned and borrowed views that hash/compare consistently. That is why `HashMap<String, _>::get` accepts `&str`. It does not clone the key for the lookup.
