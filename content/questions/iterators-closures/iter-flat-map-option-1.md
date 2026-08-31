---
id: iter-flat-map-option-1
categorySlug: iterators-closures
title: "FlatMap with Option Returns"
difficulty: 2
tags: [iterators-closures, flat-map, option]
---

# Prompt
What happens when `.flat_map(|x| ...)` returns an `Option<T>` for each element?

# Options
- [ ] A) It requires all Option items to be unwrapped with panic
- [x] B) It automatically skips None and yields only Some values
- [ ] C) It combines all items into a single heap vector buffer
- [ ] D) It stops iterator evaluation at the very first None item

# Hint
Option implements IntoIterator yielding either 0 or 1 item.

# Explanation
Because `Option<T>` implements `IntoIterator`, `flat_map` flattens `Some(v)` into `v` and silently ignores `None`, functioning similarly to `filter_map`.
