---
id: trait-sized-1
categorySlug: traits
title: "Implicit Sized Bound"
difficulty: 2
tags: [traits, sized]
---

# Prompt
Why does this generic need `T: ?Sized`?

# Code
```rust
fn print_len<T: ?Sized + AsRef<str>>(x: &T) {
    println!("{}", x.as_ref().len());
}

fn main() {
    print_len("hi"); // unsized str behind a reference
}
```

# Options
- [x] A) Generics default to `T: Sized`; `?Sized` relaxes that
- [ ] B) `?Sized` makes `T` allocate on the heap automatically
- [ ] C) Without `?Sized`, references to `T` are always illegal
- [ ] D) `AsRef` only works when `T` is marked `?Sized`

# Hint
Type parameters are `Sized` unless you opt out.

# Explanation
By default, generic `T` has an implicit `Sized` bound. `T: ?Sized` allows unsized types like `str` or `dyn Trait` when they appear behind pointers/references. It does not allocate by itself.
