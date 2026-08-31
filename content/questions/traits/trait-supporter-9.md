---
id: trait-supporter-9
categorySlug: traits
title: "GATs with Lifetime Constraints"
difficulty: 3
tags: [traits, gats, lifetimes]
---

# Prompt
What does `type Item<'a> where Self: 'a;` enable in GAT definitions?

# Code
```rust
trait Producer {
    type Item<'a> where Self: 'a;
    fn produce<'a>(&'a self) -> Self::Item<'a>;
}
```

# Options
- [ ] A) It converts `Item` into a static reference across all threads in code
- [ ] B) It mandates that `Item` must implement the Send and Sync traits in code
- [x] C) It guarantees that `Item<'a>` cannot outlive the borrowing `Self`
- [ ] D) It enables parallel evaluation of associated types in rustc in code

# Hint
The where Self: 'a clause ensures the associated type is valid for the borrow of Self.

# Explanation
The clause `where Self: 'a` ensures that `Item<'a>` is only well-formed when `Self` outlives 'a, preventing the associated type from referencing deallocated parts of `Self`.
