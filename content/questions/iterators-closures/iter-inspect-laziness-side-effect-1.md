---
id: iter-inspect-laziness-side-effect-1
categorySlug: iterators-closures
title: "Iterator inspect Laziness"
difficulty: 2
tags: [iterators, laziness, inspect]
---

# Prompt
What value is printed when this program runs?

# Code
```rust
fn main() {
    let mut count = 0;
    let iter = vec![1, 2, 3].into_iter().inspect(|_| {
        count += 1;
    });
    let _ = iter;
    println!("{count}");
}
```

# Options
- [ ] A) 3 because into_iter eagerly drives all iterator elements
- [ ] B) 1 because inspect executes closure on the first item only
- [ ] C) Compile error because inspect closures cannot mutate state
- [x] D) 0 because iterator adaptors are lazy and require consumers

# Hint
Do iterator adapters perform work before elements are pulled?

# Explanation
Iterators in Rust are completely lazy. Adapter methods like `inspect`, `map`, and `filter` do not perform any work until a consuming method (like `next()`, `collect()`, or `for_each()`) actively pulls elements through the iterator chain. Because `iter` is dropped without being polled, `count` remains 0.
