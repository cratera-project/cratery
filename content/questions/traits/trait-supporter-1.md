---
id: trait-supporter-1
categorySlug: traits
title: "Trait Object Upcasting"
difficulty: 2
tags: [traits, upcasting, dyn]
---

# Prompt
How does modern Rust support casting a sub-trait object `dyn Sub` to its supertrait `dyn Super`?

# Code
```rust
trait Super {}
trait Sub: Super {}

struct Node;
impl Super for Node {}
impl Sub for Node {}

fn upcast(s: Box<dyn Sub>) -> Box<dyn Super> {
    s
}
```

# Options
- [ ] A) Explicit clone and reconstruction of the box
- [ ] B) Unsafe memory transmutation with std::mem
- [x] C) Direct coercion via trait object upcasting
- [ ] D) Runtime reflection lookup in the metadata

# Hint
Trait object upcasting allows coercing dyn Sub to dyn Super directly.

# Explanation
Modern Rust supports Trait Object Upcasting, allowing a `dyn Sub` (where `trait Sub: Super`) to be implicitly coerced to `dyn Super` by adjusting the vtable pointer.
