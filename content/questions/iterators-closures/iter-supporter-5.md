---
id: iter-supporter-5
categorySlug: iterators-closures
title: "Iterator Laziness and Side Effects"
difficulty: 1
tags: [iterators-closures, laziness, side-effects]
---

# Prompt
Why does `vec.iter().map(|x| println!("{x}"));` print nothing when executed alone?

# Code
```rust
fn main() {
    let numbers = vec![1, 2, 3];
    let _ = numbers.iter().map(|x| println!("{x}"));
    // Nothing is printed!
}
```

# Options
- [ ] A) The compiler elides printing calls in release optimization mode in runtime memory
- [ ] B) Println statements are buffered and output only on program termination in code
- [ ] C) Vector iterators cannot capture output formatting arguments in runtime memory
- [x] D) Iterator adapters are lazy and do not execute until driven by a consumer

# Hint
Iterator adapters like map, filter, and inspect do nothing until next() or collect() is called.

# Explanation
Rust iterators are completely lazy: calling `.map(...)` simply constructs an iterator adapter struct. No closure code executes until the iterator is driven by calling `.next()`, `.collect()`, or a `for` loop.
