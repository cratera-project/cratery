---
id: life-supporter-25
categorySlug: lifetimes
title: "Lifetime of Struct Field Borrow"
difficulty: 2
tags: [lifetimes, fields, structs]
---

# Prompt
If x has lifetime 'a, what is the maximum lifetime of &x.field?

# Code
```rust
struct Data {
    num: i32,
}

fn borrow_field<'a>(d: &'a Data) -> &'a i32 {
    &d.num
}
```

# Options
- [ ] A) 'static, because i32 is a primitive integer type in code
- [ ] B) An unbound anonymous lifetime in local register in code
- [ ] C) Strictly shorter than 'a by at least one statement in code
- [x] D) 'a, matching the lifetime of the outer struct borrow

# Hint
Borrowing a field of a struct borrowed for 'a can live up to 'a.

# Explanation
A reference to a field inside a struct borrowed for 'a can be held for up to 'a. It cannot outlive the struct borrow, but can be held for the full duration 'a.
