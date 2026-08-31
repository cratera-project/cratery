---
id: err-supporter-25
categorySlug: error-handling
title: "Option::zip Pair Construction"
difficulty: 2
tags: [error-handling, zip, option]
---

# Prompt
What does `opt_a.zip(opt_b)` produce when both options are `Some`?

# Code
```rust
fn main() {
    let a = Some(1);
    let b = Some("two");
    assert_eq!(a.zip(b), Some((1, "two")));
}
```

# Options
- [ ] A) `Some(vec![a, b])` containing a dynamic vector during runtime execution
- [x] B) `Some((a, b))` containing a tuple of both inner values
- [ ] C) `None` if the two types differ in memory size in runtime memory
- [ ] D) A compressed byte slice in heap storage during runtime execution

# Hint
Option::zip combines Some(a) and Some(b) into Some((a, b)).

# Explanation
`Option::zip` combines two options: if `self` is `Some(a)` and `other` is `Some(b)`, it returns `Some((a, b))`; otherwise it returns `None`.
