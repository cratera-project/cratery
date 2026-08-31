---
id: own-func-1
categorySlug: ownership
title: "Ownership Transfer"
difficulty: 1
tags: [ownership, functions]
---

# Prompt
What happens to `s` when `takes_ownership` is called?

# Code
```rust
fn main() {
    let s = String::from("hello");
    takes_ownership(s);
    // s used here?
}

fn takes_ownership(some_string: String) {
    println!("{}", some_string);
}
```

# Options
- [ ] A) `s` is passed as a temporary shared reference
- [x] B) Ownership of `s` moves into the parameter
- [ ] C) `s` is cloned; the original stays usable
- [ ] D) `s` becomes immutable but remains accessible

# Hint
By-value parameters are not borrows.

# Explanation
Passing a non-`Copy` value by value moves ownership into the function. `some_string` owns the `String`, and `s` in `main` is invalidated. Borrow with `&s` (or clone) if the caller still needs it.
