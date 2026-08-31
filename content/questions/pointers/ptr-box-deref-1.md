---
id: ptr-box-deref-1
categorySlug: pointers
title: "Box Deref Coercion"
difficulty: 2
tags: [pointers, box, deref]
---

# Prompt
Why does `print_len` accept a `Box<String>` here?

# Code
```rust
fn print_len(s: &String) {
    println!("{}", s.len());
}

fn main() {
    let b = Box::new(String::from("hi"));
    print_len(&b);
}
```

# Options
- [ ] A) `Box<T>` is the same type as `T` at the ABI level
- [x] B) `&Box<String>` coerces via `Deref` to `&String`
- [ ] C) `print_len` auto-clones the boxed string to borrow
- [ ] D) All smart pointers implement `Copy` for references

# Hint
`Deref` enables ergonomic method and borrow coercion.

# Explanation
`Box<T>` implements `Deref<Target = T>`, so `&Box<String>` can coerce to `&String`. The types are not identical, and no clone of the `String` is required for this call.
