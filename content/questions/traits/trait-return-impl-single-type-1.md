---
id: trait-return-impl-single-type-1
categorySlug: traits
title: "`impl Trait` Return Restriction"
difficulty: 3
tags: [traits, impl-trait]
---

# Prompt
Why can’t both branches return different types here?

# Code
```rust
fn returns_summarizable(switch: bool) -> impl Summary {
    if switch {
        NewsArticle {}
    } else {
        SocialPost {}
    }
}
```

# Options
- [ ] A) `impl Trait` is illegal in return position
- [ ] B) Structs cannot implement user-defined traits
- [ ] C) `if` expressions cannot return trait implementors
- [x] D) `impl Summary` hides exactly one concrete type

# Hint
Opaque return types still name one underlying type.

# Explanation
`-> impl Summary` means “some single concrete type that implements `Summary`.” Returning `NewsArticle` or `SocialPost` depending on `switch` needs a trait object (or an enum) instead.
