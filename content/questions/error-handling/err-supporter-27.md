---
id: err-supporter-27
categorySlug: error-handling
title: "Option::take vs Option::replace"
difficulty: 2
tags: [error-handling, replace, option]
---

# Prompt
What does `opt.replace(new_val)` return for an `&mut Option<T>`?

# Code
```rust
fn main() {
    let mut opt = Some(10);
    let old = opt.replace(20);
    assert_eq!(old, Some(10));
    assert_eq!(opt, Some(20));
}
```

# Options
- [ ] A) A mutable reference to the newly inserted value during runtime execution
- [ ] B) `None` indicating successful assignment during runtime execution in code
- [ ] C) The boolean status of the memory update during runtime execution in code
- [x] D) The previous `Option<T>` that was in place before the replacement

# Hint
replace inserts Some(new_val) into the option and returns the old Option.

# Explanation
`Option::replace(&mut self, value)` inserts `Some(value)` into `self` and returns the old `Option<T>` that was previously held in `self`.
