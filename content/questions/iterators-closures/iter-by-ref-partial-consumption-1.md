---
id: iter-by-ref-partial-consumption-1
categorySlug: iterators-closures
title: "Iterator by_ref Adapter"
difficulty: 2
tags: [iterators, by-ref, take]
---

# Prompt
What is printed by this program?

# Code
```rust
fn main() {
    let mut numbers = 1..=6;
    let first_two: Vec<_> = numbers.by_ref().take(2).collect();
    let next_val = numbers.next();
    println!("{:?}, {:?}", first_two, next_val);
}
```

# Options
- [x] A) [1, 2], Some(3) because by_ref borrows the iterator
- [ ] B) [1, 2], None because take(2) consumes base iterator
- [ ] C) [1, 2], Some(1) because by_ref restarts the sequence
- [ ] D) Compile error because numbers is moved into take(2)

# Hint
What does by_ref do to avoid consuming the iterator by value?

# Explanation
`Iterator::by_ref` creates an adapter that borrows the underlying iterator mutably (`&mut I`). When `take(2).collect()` runs, it advances `numbers` by two elements and drops the `take` adapter without consuming `numbers` by value. Subsequent calls to `numbers.next()` resume directly at the third element (`Some(3)`).
