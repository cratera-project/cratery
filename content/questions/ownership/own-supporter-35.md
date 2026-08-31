---
id: own-supporter-35
categorySlug: ownership
title: "Option::as_deref Ownership"
difficulty: 2
tags: [ownership, option, deref]
---

# Prompt
What is the return type of `opt.as_deref()` when `opt` is `&Option<String>`?

# Code
```rust
fn check(opt: &Option<String>) {
    let view: Option<&str> = opt.as_deref();
    if let Some(s) = view {
        println!("{s}");
    }
}
```

# Options
- [ ] A) `Option<String>` by cloning the inner string value in code
- [ ] B) `Option<&mut str>` for in-place string modification
- [x] C) `Option<&str>` by dereferencing the inner `&String`
- [ ] D) `&Option<&str>` borrowing the outer option wrapper in code

# Hint
as_deref converts Option<T> or &Option<T> to Option<&T::Target>.

# Explanation
`Option::as_deref` converts `&Option<T>` (or `Option<T>`) into `Option<&T::Target>` by coercing the inner reference via `Deref`. For `String`, it returns `Option<&str>` without cloning or moving.
