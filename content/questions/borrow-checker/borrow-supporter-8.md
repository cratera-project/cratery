---
id: borrow-supporter-8
categorySlug: borrow-checker
title: "Iterating While Mutating Vector Error"
difficulty: 2
tags: [borrow-checker, vec, iterator-invalidation]
---

# Prompt
Why does modifying a `Vec` while iterating over `&vec` cause a compile-time error?

# Code
```rust
fn main() {
    let mut vec = vec![1, 2, 3];
    for x in &vec {
        if *x == 2 {
            // vec.push(10); // compile error
        }
    }
}
```

# Options
- [ ] A) Vector elements are immutable by default in all for loop statements during standard program runtime execution
- [x] B) `push` takes `&mut vec` which could reallocate the buffer, invalidating the iterator's `&vec` references
- [ ] C) Pushing to a vector during a loop causes a hardware CPU stall during standard program runtime execution in code
- [ ] D) The compiler disables push methods when capacity is non-zero during standard program runtime execution in code

# Hint
Pushing can reallocate the backing buffer, which would cause dangling pointers in the iterator.

# Explanation
Iterating with `for x in &vec` holds a shared borrow of `vec`. Calling `vec.push(...)` requires an exclusive `&mut vec` borrow because `push` might reallocate the heap buffer, which would leave `x` pointing to deallocated memory.
