---
id: own-slice-borrow-1
categorySlug: ownership
title: "Slice Borrowing"
difficulty: 2
tags: [borrowing, slices]
---

# Prompt
Why does this function compile?

# Code
```rust
fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }
    &s[..]
}
```

# Options
- [ ] A) Slicing allocates a fresh owned substring
- [ ] B) Returning `&str` moves ownership of that span
- [x] C) The output borrow is tied to input `s`
- [ ] D) The compiler promotes the slice to `'static`

# Hint
Elision links the returned `&str` to `s`.

# Explanation
A `&str` is a borrowed view into existing UTF-8 data. Lifetime elision treats this as borrowing from `s`, so the returned slice cannot outlive that input. Nothing is cloned or promoted to `'static`.
