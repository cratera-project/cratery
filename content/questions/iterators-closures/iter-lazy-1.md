---
id: iter-lazy-1
categorySlug: iterators-closures
title: "Lazy Evaluation"
difficulty: 3
tags: [iterators, lazy]
---

# Prompt
What does this program print?

# Code
```rust
fn main() {
    let v = vec![1, 2, 3];
    let _iter = v.iter().map(|x| {
        println!("Processing {x}");
        x * 2
    });
    println!("Iterator created");
}
```

# Options
- [ ] A) `Processing` lines first, then `Iterator created`
- [ ] B) A compile error: closures cannot call `println!`
- [x] C) Only `Iterator created` (the map never runs)
- [ ] D) A panic because the iterator was not consumed

# Hint
Adapters are lazy until a consumer pulls values.

# Explanation
Creating a `map` adapter does not run the closure. Work happens when something consumes the iterator (`collect`, `for`, `next`, …). Leaving it unused is fine; there is no panic.
