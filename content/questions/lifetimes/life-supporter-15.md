---
id: life-supporter-15
categorySlug: lifetimes
title: "PhantomData and Lifetime Variance"
difficulty: 3
tags: [lifetimes, phantom-data, variance]
---

# Prompt
What variance does PhantomData<&'a mut T> produce for 'a and T?

# Code
```rust
use std::marker::PhantomData;

struct MutHolder<'a, T> {
    _marker: PhantomData<&'a mut T>,
}
```

# Options
- [ ] A) Covariant over 'a and invariant over T in memory
- [x] B) Invariant over both 'a and T in memory structures
- [ ] C) Covariant over both 'a and T in memory structures
- [ ] D) Contravariant over 'a and covariant over T here

# Hint
&'a mut T is covariant in 'a and invariant in T.

# Explanation
Because mutable references &'a mut T are covariant in 'a and invariant in T, using PhantomData<&'a mut T> informs the compiler that the struct is covariant with respect to 'a and invariant with respect to T.
