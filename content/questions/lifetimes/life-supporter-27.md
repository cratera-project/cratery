---
id: life-supporter-27
categorySlug: lifetimes
title: "Lifetime in Associated Const"
difficulty: 2
tags: [lifetimes, const, traits]
---

# Prompt
Can an associated constant on a trait reference a generic lifetime?

# Code
```rust
trait HasDefault {
    const DEFAULT: &'static str;
}

struct App;
impl HasDefault for App {
    const DEFAULT: &'static str = "ready";
}
```

# Options
- [ ] A) No, constants cannot hold reference types under any circumstance during execution
- [x] B) Yes, associated constants can use static references &'static str
- [ ] C) Only if the struct is marked with the unsafe keyword in runtime memory
- [ ] D) Only if the trait is object-safe for dynamic dispatch in runtime memory

# Hint
Associated constants frequently hold &'static str values.

# Explanation
Associated constants can hold reference types as long as the lifetime is 'static (const DEFAULT: &'static str), ensuring the data is available for any evaluation context.
