---
id: life-variance-fn-arg-1
categorySlug: lifetimes
title: "Function Argument Variance"
difficulty: 3
tags: [lifetimes, variance]
---

# Prompt
What is the variance of a function pointer `fn(&'a T)` with respect to `'a`?

# Options
- [ ] A) Function arguments are covariant over their lifetime parameter
- [ ] B) Function arguments are invariant over their lifetime parameter
- [x] C) Function arguments are contravariant over their lifetime bounds
- [ ] D) Function arguments ignore lifetime variance during compilation

# Hint
Function arguments flip subtyping direction (contravariance).

# Explanation
Function arguments are contravariant over their lifetimes. A function expecting a short lifetime can accept a function accepting a longer lifetime.
