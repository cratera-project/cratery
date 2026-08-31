---
id: trait-assoc-const-1
categorySlug: traits
title: "Associated Constants"
difficulty: 2
tags: [traits, associated-const]
---

# Prompt
How is `MAX` provided on `u8` here?

# Code
```rust
trait Max {
    const MAX: u32;
}

impl Max for u8 {
    const MAX: u32 = 255;
}

fn main() {
    assert_eq!(<u8 as Max>::MAX, 255);
}
```

# Options
- [x] A) As an associated constant on the trait impl
- [ ] B) As a `static` the trait imports automatically
- [ ] C) As a default type parameter on `Max` itself
- [ ] D) As a `const fn` that must run inside `main`

# Hint
Traits can carry `const` items, not only methods.

# Explanation
Traits may declare associated constants. Each impl supplies the value (`const MAX: u32 = 255`). Access it as `<Type as Trait>::MAX` (or `Type::MAX` if unambiguous). It is not a `static` item and does not need a runtime call.
