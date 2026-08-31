---
id: ptr-supporter-17
categorySlug: pointers
title: "Pin::as_mut and Reborrowing"
difficulty: 2
tags: [pointers, pin, as-mut]
---

# Prompt
What does `pin.as_mut()` return for a `Pin<&mut T>`?

# Code
```rust
use std::pin::Pin;

fn modify(mut pin: Pin<&mut i32>) {
    let reborrow: Pin<&mut i32> = pin.as_mut();
    println!("{}", *reborrow);
}
```

# Options
- [x] A) The exact same pointer address offset by the element stride
- [ ] B) A newly allocated heap pointer copy with unique metadata
- [ ] C) A null pointer if the offset extends past buffer capacity
- [ ] D) A boxed pointer instance managed by the system allocator

# Hint
as_mut reborrows a Pin<&mut T> for a shorter lifetime without unpinning.

# Explanation
`Pin::as_mut` reborrows the pinned reference as `Pin<&mut T>` for a shorter lifetime, allowing multiple method calls on the pinned object without consuming the original `Pin` handle.
