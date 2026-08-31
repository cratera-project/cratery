---
id: borrow-supporter-18
categorySlug: borrow-checker
title: "Borrow Checker and Drop Order in Let Chains"
difficulty: 2
tags: [borrow-checker, drop-order, scope]
---

# Prompt
In `let a = make_a(); let b = make_b(&a);`, what is the drop order at scope exit?

# Code
```rust
struct A;
struct B<'a>(&'a A);

fn main() {
    let a = A;
    let _b = B(&a);
}
```

# Options
- [ ] A) `a` drops first, then `_b` drops second (declaration order) in runtime memory
- [ ] B) Both drop concurrently in parallel background threads in runtime memory
- [ ] C) Drop order is non-deterministic and chosen by LLVM within local thread memory
- [x] D) `_b` drops first, then `a` drops second (reverse declaration order)

# Hint
Variables are dropped in reverse order of declaration so borrowers drop before owners.

# Explanation
Local variables drop in reverse order of declaration (LIFO). `_b` (which borrows `a`) is dropped first, ensuring `a` is still valid when `_b`'s destructor runs.
