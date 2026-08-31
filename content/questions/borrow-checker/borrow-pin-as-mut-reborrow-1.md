---
id: borrow-pin-as-mut-reborrow-1
categorySlug: borrow-checker
title: "Pin Reborrowing via as_mut"
difficulty: 3
tags: [borrow-checker, pin, as-mut]
---

# Prompt
What does `Pin::as_mut(&mut self)` accomplish on a `Pin<&mut T>`?

# Options
- [ ] A) It moves the pinned value out of its heap allocation
- [ ] B) It drops the pinned value and initializes a new struct
- [x] C) It reborrows a Pin<&mut T> with a shorter lifetime scope
- [ ] D) It casts the pinned reference into a raw static pointer

# Hint
as_mut reborrows the pinned reference without consuming the original Pin.

# Explanation
`Pin::as_mut` reborrows the inner `&mut T` into a new `Pin<&mut T>` with a shorter lifetime, allowing multiple pinned method calls without consuming the outer `Pin`.
