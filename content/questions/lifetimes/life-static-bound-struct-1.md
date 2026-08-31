---
id: life-static-bound-struct-1
categorySlug: lifetimes
title: "Static Lifetime Trait Bound"
difficulty: 2
tags: [lifetimes, static, generics]
---

# Prompt
What does the bound `T: 'static` mean on a generic type parameter `T`?

# Options
- [x] A) `T` can be owned or only contain static references
- [ ] B) `T` must be a borrowed reference living forever
- [ ] C) `T` is placed in immutable read-only static text
- [ ] D) `T` cannot be moved across thread spawn boundaries

# Hint
Owned types with no non-static borrows satisfy T: 'static.

# Explanation
`T: 'static` means `T` is capable of living for the entire program duration; it can be an owned type (like `String` or `i32`) or a reference with `'static` lifetime.
