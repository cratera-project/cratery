---
id: iter-supporter-30
categorySlug: iterators-closures
title: "IntoIterator for Slices (&[T] and &mut [T])"
difficulty: 2
tags: [iterators-closures, slices, into-iterator]
---

# Prompt
What element types are yielded when iterating `(&slice).into_iter()` vs `(&mut slice).into_iter()`?

# Code
```rust
fn main() {
    let mut arr = [1, 2];
    for _x in (&arr).into_iter() {}     // yields &i32
    for _x in (&mut arr).into_iter() {} // yields &mut i32
}
```

# Options
- [x] A) `&T` for shared slices and `&mut T` for mutable slices
- [ ] B) Owned `T` values for both slice variations during runtime execution
- [ ] C) `Option<&T>` and `Option<&mut T>` during runtime execution
- [ ] D) Raw memory pointers `*const T` and `*mut T` during runtime execution

# Hint
&[T] yields &T; &mut [T] yields &mut T.

# Explanation
`IntoIterator` for `&[T]` yields shared references `&T`, while `IntoIterator` for `&mut [T]` yields exclusive mutable references `&mut T`.
