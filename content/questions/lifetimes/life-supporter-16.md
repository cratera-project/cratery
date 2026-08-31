---
id: life-supporter-16
categorySlug: lifetimes
title: "PhantomData Covariant Lifetime"
difficulty: 3
tags: [lifetimes, phantom-data, covariance]
---

# Prompt
Which PhantomData marker specifies covariance over T without ownership?

# Code
```rust
use std::marker::PhantomData;

struct MySlice<'a, T> {
    ptr: *const T,
    _marker: PhantomData<&'a T>,
}
```

# Options
- [ ] A) `PhantomData<&'a T>`
- [ ] B) `PhantomData<fn(T)>`
- [x] C) `PhantomData<Cell<T>>`
- [ ] D) `PhantomData<*mut T>`

# Hint
&'a T is covariant in both 'a and T.

# Explanation
PhantomData<&'a T> acts as a phantom shared reference, conveying covariance over both 'a and T without implying ownership or running destructors on T.
