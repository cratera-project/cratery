---
id: closure-capture-scope-1
categorySlug: iterators-closures
title: "Closure Capture Scope"
difficulty: 2
tags: [closures, capture]
---

# Prompt
Which bindings do these closures capture?

# Code
```rust
fn process(data: &[i32], threshold: i32) {
    let factor = 2;
    let _result: Vec<_> = data
        .iter()
        .filter(|&&x| x > threshold)
        .map(|&x| x * factor)
        .collect();
}
```

# Options
- [ ] A) None; adapter closures never capture outer names
- [ ] B) Only `factor`; parameters are never captures
- [ ] C) `data`, `threshold`, and `factor` all get captured
- [x] D) `threshold` and `factor` from the enclosing scope

# Hint
Capture means the closure body names that binding.

# Explanation
The `filter` closure reads `threshold`; the `map` closure reads `factor`. `data` is used to build the iterator, not inside those closures, so it is not captured by them.
