---
id: own-supporter-30
categorySlug: ownership
title: "ManuallyDrop::into_inner"
difficulty: 3
tags: [ownership, manually-drop, inner]
---

# Prompt
What does `ManuallyDrop::into_inner(slot)` return?

# Code
```rust
use std::mem::ManuallyDrop;

fn main() {
    let slot = ManuallyDrop::new(String::from("data"));
    let value: String = ManuallyDrop::into_inner(slot);
    println!("{value}");
}
```

# Options
- [ ] A) A shared reference to the inner value without moving in runtime memory
- [x] B) The contained value by value, restoring normal drop semantics
- [ ] C) An unsafe raw pointer pointing to the heap buffer during runtime execution
- [ ] D) A cloned copy of the value while keeping slot alive in runtime memory

# Hint
into_inner extracts the wrapped value out of the ManuallyDrop container.

# Explanation
`ManuallyDrop::into_inner` consumes the `ManuallyDrop<T>` wrapper and extracts the contained `T` by value. Normal destructor semantics are restored for the returned value.
