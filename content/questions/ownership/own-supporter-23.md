---
id: own-supporter-23
categorySlug: ownership
title: "Moving Out of Deref Coercion"
difficulty: 3
tags: [ownership, deref, move]
---

# Prompt
Why is `let s = *box_ref;` rejected when `box_ref` is `&Box<String>`?

# Code
```rust
fn extract(box_ref: &Box<String>) {
    // let s: Box<String> = *box_ref; // compile error
}
```

# Options
- [ ] A) Box pointers cannot be dereferenced with the * operator in code
- [ ] B) String requires manual free before moving its container in code
- [x] C) Cannot move owned Box value out behind a shared reference
- [ ] D) Type inference cannot deduce the target type of dereference

# Hint
You cannot move out of a place behind a shared reference.

# Explanation
Dereferencing `&Box<String>` yields the owned `Box<String>`, but moving out of a shared reference (`&T`) is forbidden because the referent must remain valid for other readers. Clone or borrow instead.
