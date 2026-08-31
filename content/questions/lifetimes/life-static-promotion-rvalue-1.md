---
id: life-static-promotion-rvalue-1
categorySlug: lifetimes
title: "Rvalue Static Promotion"
difficulty: 2
tags: [lifetimes, rvalue-promotion, static]
---

# Prompt
How does Rust promote values like `&42` or `&"hello"` to `&'static` without explicit constants?

# Options
- [ ] A) Only variables declared with static mut qualify for static
- [ ] B) The expression is evaluated at runtime and cached in memory
- [ ] C) The reference is cloned into a new thread-local storage key
- [x] D) Const qualifying rvalue expressions are promoted to static

# Hint
Rvalue static promotion evaluates const expressions into read-only binary memory.

# Explanation
Rust automatically applies "rvalue static promotion" to immutable references of compile-time evaluatable expressions with no destructors, placing them in static program memory.
