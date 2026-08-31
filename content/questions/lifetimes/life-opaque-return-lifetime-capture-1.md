---
id: life-opaque-return-lifetime-capture-1
categorySlug: lifetimes
title: "RPIT Lifetime Capture in Rust 2024"
difficulty: 3
tags: [lifetimes, rpit, rust-2024]
---

# Prompt
How does Rust 2024 change lifetime capture rules for return position `impl Trait`?

# Options
- [x] A) Rust 2024 captures all in-scope generic lifetime parameters
- [ ] B) Rust 2024 ignores all lifetime parameters on opaque returns
- [ ] C) Rust 2024 requires explicit + 'static on all impl Trait fns
- [ ] D) Rust 2024 boxes all opaque return types on system heap node

# Hint
Rust 2024 captures all in-scope lifetime parameters in RPIT by default (use `use<..>` to prune).

# Explanation
In Rust 2024, return position `impl Trait` captures all in-scope lifetime parameters by default, simplifying async functions and trait returns unless restricted using `+ use<'a>`.
