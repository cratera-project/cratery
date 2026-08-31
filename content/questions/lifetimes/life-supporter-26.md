---
id: life-supporter-26
categorySlug: lifetimes
title: "Static Bound vs Static Reference"
difficulty: 3
tags: [lifetimes, static-bound, generics]
---

# Prompt
How does T: 'static differ from &'static T?

# Code
```rust
fn check<T: 'static>(_val: T) {
    // ...
}
```

# Options
- [x] A) T: 'static can be an owned value containing no non-static borrows
- [ ] B) T: 'static forces T to be stored in the binary read-only segment in code
- [ ] C) T: 'static requires _val to be an immutable reference pointer in code
- [ ] D) Both expressions are completely identical in Rust type semantics in code

# Hint
An owned String satisfies T: 'static because it contains no non-static references.

# Explanation
T: 'static is a type bound meaning T contains no non-'static borrows (e.g. String, i32, Vec<u8>). In contrast, &'static T is specifically a reference pointing to data that lives forever.
