---
id: life-supporter-24
categorySlug: lifetimes
title: "Trait Bound for References"
difficulty: 3
tags: [lifetimes, hrtb, into-iterator]
---

# Prompt
What does where for<'a> &'a T: IntoIterator mean?

# Code
```rust
fn print_all<T>(collection: &T)
where
    for<'a> &'a T: IntoIterator,
    for<'a> <&'a T as IntoIterator>::Item: std::fmt::Display,
{
    for item in collection {
        println!("{item}");
    }
}
```

# Options
- [ ] A) T must be converted into a static vector on heap
- [ ] B) T must implement IntoIterator by value exclusively
- [x] C) &T can be iterated over for any borrow lifetime
- [ ] D) Iteration occurs across background thread pools

# Hint
for<'a> &'a T: IntoIterator means references of any lifetime can be converted into iterators.

# Explanation
This HRTB specifies that a shared reference &'a T of *any* arbitrary lifetime 'a implements IntoIterator, enabling borrowing and iterating without consuming T.
