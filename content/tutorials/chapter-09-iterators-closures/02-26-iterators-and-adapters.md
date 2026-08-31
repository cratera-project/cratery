---
id: 26-iterators-and-adapters
chapterId: iterators-closures
chapterNumber: 9
lessonNumber: 2
title: "Iterators & Functional Adapters"
tagline: "Lazy evaluation, zero-cost transformations, and consumer pipelines."
readTimeMinutes: 8
difficulty: intermediate
tags: [iterators, map, filter, fold, collect, lazy]
---

# Overview
In Rust, iterators are **lazy**: they have no effect until you call methods that consume the iterator to use it up. Iterator adapters like `map`, `filter`, and `fold` are optimized by rustc into tight loops equivalent to hand-written assembly.

# Sections

## The `Iterator` Trait & Lazy Adapters
All iterators implement the standard `Iterator` trait, which requires defining a `next()` method:
```rust
pub trait Iterator {
    type Item;
    fn next(&mut self) -> Option<Self::Item>;
}
```
- **Adapters** (`map`, `filter`, `zip`, `take`): Transform iterators lazily.
- **Consumers** (`collect`, `sum`, `fold`, `count`): Drive the iterator to completion.

```rust caption="Chaining iterator adapters into zero-cost functional pipelines."
let v = vec![1, 2, 3, 4, 5, 6];

// Functional processing pipeline
let sum_of_even_squares: i32 = v.iter()
    .filter(|&&x| x % 2 == 0)
    .map(|&x| x * x)
    .sum();

println!("Sum: {}", sum_of_even_squares); // 2^2 + 4^2 + 6^2 = 4 + 16 + 36 = 56
```

# Common Mistakes

### Forgetting that iterators are lazy (unused adapters)
**Bad:**
```rust
let mut v = vec![1, 2, 3];
v.iter().map(|x| println!("{}", x)); // Warning: unused `Map` that must be used (does nothing!)
```
**Explanation:** Because `map` is lazy, nothing is executed until a consumer (like `for_each` or `collect`) drives it.

**Good:**
```rust
let mut v = vec![1, 2, 3];
v.iter().for_each(|x| println!("{}", x)); // Executes immediately
```
**Explanation:** Use `.for_each()` or a `for in` loop when performing side-effects.

# Key Takeaways
- Iterators in Rust are lazy: no computation happens until consumed.
- `.iter()` borrows (`&T`), `.iter_mut()` borrows mutably (`&mut T`), and `.into_iter()` consumes (`T`).
- Rust compiles iterator chains into assembly loops as fast as raw C `for` loops.

# Quests

## Quest: tut-26-pipeline-transform
**Type:** coding
**Title:** Functional Data Pipeline
**Prompt:** Implement `process_scores(scores: &[i32]) -> i32`. Using iterator methods: filter out negative scores, multiply all remaining scores by 2, keep only those greater than 10, and return their sum. (Do not use explicit `for` loops).
**Signature:** `pub fn process_scores(scores: &[i32]) -> i32`

### Starter Code
```rust
pub fn process_scores(scores: &[i32]) -> i32 {
    // TODO: Use scores.iter().filter(...).map(...).sum()
    todo!()
}
```

### Test Harness
```rust
{{SOLUTION}}

fn main() {
    assert_eq!(process_scores(&[3, 6, -2, 10, 4]), 32); // (6*2=12) + (10*2=20) = 32
    assert_eq!(process_scores(&[-5, -10]), 0);
    assert_eq!(process_scores(&[1, 2, 3]), 0); // 2, 4, 6 (none > 10)
    println!("all tests passed");
}
```

### Solution
```rust
pub fn process_scores(scores: &[i32]) -> i32 {
    scores
        .iter()
        .copied()
        .filter(|&x| x >= 0)
        .map(|x| x * 2)
        .filter(|&x| x > 10)
        .sum()
}
```

### Walkthrough
The iterator pipeline filters non-negatives, doubles values, filters values strictly greater than 10, and sums the results with zero intermediate allocations.

### Hints
- `scores.iter().copied().filter(|&x| x >= 0).map(|x| x * 2).filter(|&x| x > 10).sum()`

## Quest: tut-26-quiz-lazy-iter
**Type:** quiz
**Title:** Concept Check: Iterator Laziness
**Prompt:** What happens when you call `let it = (0..10).map(|x| x * 2);` without consuming `it`?

### Options
- [ ] A) All 10 numbers are doubled immediately and stored in an array.
- [x] B) Nothing is calculated yet because iterators are lazy and only execute when values are requested by next() or a consumer.
- [ ] C) A background thread is launched to compute the values.
- [ ] D) The program panics with a lazy iterator exception.

**Hint:** Remember that Rust iterators do not evaluate until pulled.

**Explanation:** In Rust, iterator adapters produce an iterator struct that calculates items on-demand when `.next()` is called. Without a consumer like `.collect()`, `.sum()`, or a `for` loop, no work is performed.
