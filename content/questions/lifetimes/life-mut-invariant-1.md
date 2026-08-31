---
id: life-mut-invariant-1
categorySlug: lifetimes
title: "Mutable Reference Invariance"
difficulty: 3
tags: [lifetimes, variance]
---

# Prompt
Why is `assign(&mut forever, &short)` rejected?

# Code
```rust
fn assign<'a>(dst: &mut &'a str, src: &'a str) {
    *dst = src;
}

fn main() {
    let mut forever: &'static str = "long";
    let short = String::from("tmp");
    assign(&mut forever, &short); // error
    println!("{forever}");
}
```

# Options
- [ ] A) `&str` can never be written through a `&mut`
- [ ] B) `'static` borrows cannot be shortened at all
- [ ] C) `String` does not coerce to `&str` here at all
- [x] D) Invariance of `&mut T` forbids shrinking `T`

# Hint
Shared `&T` is covariant in `T`; exclusive `&mut T` is not.

# Explanation
`&'a mut T` is covariant in `'a` but invariant in `T` (Reference, Subtyping). If `T` could shrink from `&'static str` to `&'short str`, `assign` could store `&short` into `forever` and leave a dangling `'static` after `short` drops. Shared `&T` is covariant in `T`, which is why `&'static str` can be used as `&'a str`.
