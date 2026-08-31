---
id: life-static-bound-1
categorySlug: lifetimes
title: "T: 'static vs &'static T"
difficulty: 2
tags: [lifetimes, static]
---

# Prompt
Why does `hold(String::from("ok"))` compile?

# Code
```rust
fn hold<T: 'static>(_t: T) {}

fn main() {
    hold(String::from("ok"));
    hold("lit");
    // let s = String::from("no");
    // hold(&s); // error
}
```

# Options
- [x] A) Owned `String` contains no short-lived borrows
- [ ] B) Every function argument is implicitly `'static`
- [ ] C) `String` is stored in the binary like a literal
- [ ] D) `T: 'static` forbids dropping the value ever

# Hint
A bound `T: 'static` is not the same as a `&'static T` argument.

# Explanation
`T: 'static` means `T` can be held indefinitely: it has no non-`'static` borrows. Owned types like `String` satisfy that even though they are dropped at the end of `hold`. `&'static T` is a reference that must remain valid for the rest of the program. `hold(&s)` fails because `&s` only lasts as long as the local `s`.
