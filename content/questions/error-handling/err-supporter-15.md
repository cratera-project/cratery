---
id: err-supporter-15
categorySlug: error-handling
title: "Option Flatten Nested Option"
difficulty: 2
tags: [error-handling, flatten, option]
---

# Prompt
What does `opt.flatten()` do on `Option<Option<T>>`?

# Code
```rust
fn main() {
    let nested: Option<Option<i32>> = Some(Some(42));
    assert_eq!(nested.flatten(), Some(42));
    let empty: Option<Option<i32>> = Some(None);
    assert_eq!(empty.flatten(), None);
}
```

# Options
- [ ] A) Converts the nested option into a flattened `Vec<T>` in code
- [ ] B) Unwraps the inner value or panics if either layer is None
- [ ] C) Sorts the elements of the inner collection in place in code
- [x] D) Collapses `Option<Option<T>>` into a single `Option<T>`

# Hint
flatten removes one layer of nesting.

# Explanation
`Option::flatten` converts `Option<Option<T>>` to `Option<T>`, returning `Some(v)` if both layers are `Some(Some(v))` and `None` otherwise.
