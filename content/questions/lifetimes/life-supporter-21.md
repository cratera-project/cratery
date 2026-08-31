---
id: life-supporter-21
categorySlug: lifetimes
title: "Reborrow Lifetime vs Original Borrow"
difficulty: 2
tags: [lifetimes, reborrow, scopes]
---

# Prompt
What is the lifetime of a reborrow let r2 = &*r1; relative to r1?

# Code
```rust
fn process<'a>(r1: &'a mut i32) {
    let r2 = &*r1;
    println!("{r2}");
}
```

# Options
- [ ] A) Equal to or shorter than the lifetime of r1 in scope
- [ ] B) Promoted to static lifetime automatically in memory
- [ ] C) Strictly longer than the original reference in scope
- [x] D) Independent of the lifetime of r1 in the execution

# Hint
A reborrow cannot outlive the original reference from which it was derived.

# Explanation
A reborrow produces a new reference whose lifetime is bounded by the original reference. It can be shorter (e.g. limited to a local block), but can never outlive the source borrow.
