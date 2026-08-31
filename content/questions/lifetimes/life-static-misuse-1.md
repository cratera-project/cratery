---
id: life-static-misuse-1
categorySlug: lifetimes
title: "Misusing 'static"
difficulty: 3
tags: [lifetimes, static]
---

# Prompt
What is the correct assessment of this function?

# Code
```rust
fn bad_static() -> &'static str {
    let s = String::from("nope");
    s.as_str()
}
```

# Options
- [x] A) It fails: local data is not `'static`
- [ ] B) It works: the compiler upgrades `s` to static
- [ ] C) It works if you add `move` in the body
- [ ] D) It works: every `String` is always static

# Hint
`'static` is a promise about data duration.

# Explanation
`'static` means the referent can live for the whole program. A `String` created in the function is dropped on return, so a reference into it cannot be `'static`. Prefer returning `String` or borrowing caller-owned data.
