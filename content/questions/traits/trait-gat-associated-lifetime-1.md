---
id: trait-gat-associated-lifetime-1
categorySlug: traits
title: "Generic Associated Types (GATs)"
difficulty: 3
tags: [traits, gat, generics]
---

# Prompt
Why can `LendingIterator` yield items that borrow from `&mut self`?

# Code
```rust
trait LendingIterator {
    type Item<'a> where Self: 'a;
    fn next<'a>(&'a mut self) -> Option<Self::Item<'a>>;
}
```

# Options
- [ ] A) It circumvents borrow checking using compiler magic
- [ ] B) It forces all yielded items to have 'static lifetime
- [x] C) Its associated type Item takes a generic lifetime 'a
- [ ] D) It converts &mut self into shared references on call

# Hint
Notice the parameter list on the associated Item declaration.

# Explanation
In standard `std::iter::Iterator`, `type Item` has no lifetime parameter, meaning `Item` must be chosen independently of the `&mut self` borrow in `next()`. Generic Associated Types (GATs) allow declaring `type Item<'a>`, so the yielded item type can explicitly borrow from `&mut self` with lifetime `'a`. This enables lending / streaming iterators.
