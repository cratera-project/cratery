---
id: iter-closure-ownership-1
categorySlug: iterators-closures
title: "Closure Ownership"
difficulty: 2
tags: [closures, ownership]
---

# Prompt
How does this closure capture `prefix` by default?

# Code
```rust
let prefix = "Item: ";
let items = vec!["A", "B"];
let labeled: Vec<_> = items
    .iter()
    .map(|item| format!("{prefix}{item}"))
    .collect();
```

# Options
- [ ] A) It always moves captures; `move` is only for threads
- [ ] B) It copies `prefix` because every `&str` is heap data
- [ ] C) It fails unless you write `move` on the closure
- [x] D) It borrows `prefix`; `move` would capture by value

# Hint
Closures capture the least they need unless you force `move`.

# Explanation
By default the closure immutably borrows `prefix`. `move` forces capture by value. Here `prefix: &str` is `Copy`, so `move` copies the reference, not the string bytes.
