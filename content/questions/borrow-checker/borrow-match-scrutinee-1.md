---
id: borrow-match-scrutinee-1
categorySlug: borrow-checker
title: "Live Lookup Blocks Insert"
difficulty: 2
tags: [borrowing, hashmap]
---

# Prompt
Why doesn’t this compile?

# Code
```rust
use std::collections::HashMap;
let mut map = HashMap::new();
map.insert("a", 1);
let v = map.get("a");
map.insert("b", 0);
println!("{v:?}");
```

# Options
- [ ] A) `HashMap` forbids inserts after any prior lookup ever
- [x] B) `v` still borrows `map`, so `insert` cannot take `&mut map`
- [ ] C) `insert` moves the map, so `get` cannot borrow it
- [ ] D) String keys must be `'static` before mutation is allowed

# Hint
How long does the shared borrow from `get` last?

# Explanation
`map.get` returns a reference into the map. While `v` is still live (used by `println!`), `insert` cannot take `&mut map`. Drop/end the borrow first, or use the `entry` API for check-then-insert patterns.
