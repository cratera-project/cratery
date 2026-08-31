---
id: life-supporter-30
categorySlug: lifetimes
title: "Lifetime in Cow"
difficulty: 2
tags: [lifetimes, cow, borrow]
---

# Prompt
What does the lifetime parameter 'a in Cow<'a, str> represent?

# Code
```rust
use std::borrow::Cow;

fn get_name<'a>(input: &'a str) -> Cow<'a, str> {
    if input.is_empty() {
        Cow::Borrowed("default")
    } else {
        Cow::Borrowed(input)
    }
}
```

# Options
- [x] A) The lifetime of borrowed data if Cow is in Borrowed variant
- [ ] B) The lifetime of the heap allocator backing the owned variant
- [ ] C) The duration of the main program execution thread during runtime execution
- [ ] D) An anonymous lifetime enforced only during debug builds in code

# Hint
Cow<'a, B> can hold a borrowed reference &'a B or an owned version.

# Explanation
Cow<'a, B> ('Clone on Write') has a lifetime 'a representing the duration of the borrowed variant (Cow::Borrowed(&'a B)). If owned (Cow::Owned), the data is independent of 'a.
