---
id: life-supporter-1
categorySlug: lifetimes
title: "Covariance of Shared References"
difficulty: 3
tags: [lifetimes, subtyping, covariance]
---

# Prompt
Why can a longer lifetime &'static str be passed to a function expecting &'a str?

# Code
```rust
fn display<'a>(s: &'a str) {
    println!("{s}");
}

fn main() {
    let text: &'static str = "forever";
    display(text);
}
```

# Options
- [ ] A) Static strings are coerced into dynamically allocated strings
- [ ] B) The compiler clones the string slice into the local stack
- [ ] C) Lifetimes are erased before type checking occurs in rustc
- [x] D) Shared references are covariant over their lifetime parameter

# Hint
Covariance allows a subtype (longer lifetime) where a supertype is expected.

# Explanation
&'a T is covariant with respect to 'a. Because 'static outlives 'a ('static: 'a), 'static is a subtype of 'a and can safely be substituted wherever 'a is expected.
