---
id: life-supporter-10
categorySlug: lifetimes
title: "Lifetime Subtyping with Nested References"
difficulty: 3
tags: [lifetimes, nested, subtyping]
---

# Prompt
What relationship must hold for &'a &'b T to be well-formed?

# Code
```rust
fn check<'a, 'b, T>(_x: &'a &'b T) {}
```

# Options
- [x] A) 'b must outlive 'a ('b: 'a), so inner ref is valid
- [ ] B) 'a must outlive 'b ('a: 'b), so outer ref is valid during execution
- [ ] C) 'a and 'b must be exactly identical static lifetimes
- [ ] D) No relationship is required; nested references are independent

# Hint
The inner reference must remain valid for at least as long as the outer reference borrows it.

# Explanation
For &'a &'b T to be valid, the inner reference must live at least as long as the outer reference that borrows it ('b: 'a). If 'b ended while 'a was still active, the outer reference would point to invalid memory.
