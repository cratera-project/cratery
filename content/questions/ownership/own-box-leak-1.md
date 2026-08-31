---
id: own-box-leak-1
categorySlug: ownership
title: "Box Leak Behavior"
difficulty: 2
tags: [ownership, box, leak]
---

# Prompt
What happens to the heap allocation when `Box::leak(b)` is called?

# Code
```rust
fn make_static(s: String) -> &'static str {
    let b = s.into_boxed_str();
    Box::leak(b)
}
```

# Options
- [ ] A) The heap memory is instantly deallocated and invalidated
- [ ] B) The heap allocation is transferred to the OS thread pool
- [x] C) The heap buffer is leaked and never freed on scope exit
- [ ] D) The box converts automatically into a static raw pointer

# Hint
Leaking gives up ownership and skips running the destructor.

# Explanation
`Box::leak` consumes the `Box` and returns a mutable reference with `'static` lifetime without dropping the allocated heap memory.
