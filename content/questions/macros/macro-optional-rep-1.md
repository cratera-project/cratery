---
id: macro-optional-rep-1
categorySlug: macros
title: "Optional Macro Repetition"
difficulty: 2
tags: [macros, repetition]
---

# Prompt
What does `$(, $bang:literal)?` match?

# Code
```rust
macro_rules! greet {
    ($name:expr $(, $bang:literal)?) => {
        concat!($name $(, $bang)?)
    };
}

fn main() {
    assert_eq!(greet!("hi"), "hi");
    assert_eq!(greet!("hi", "!"), "hi!");
}
```

# Options
- [ ] A) One or more extra literals, comma-separated
- [ ] B) A required second argument of any token type
- [ ] C) Zero or more bangs, including extra commas
- [x] D) Zero or one extra literal after a comma

# Hint
`?` is the “at most once” Kleene operator.

# Explanation
In `macro_rules!`, `$( … )?` matches zero or one time (Reference, Macros by example). Unlike `*`/`+`, `?` cannot take a separator token. `$(,)?` after a list is the usual trailing-comma matcher; here the comma is inside the optional group so the second argument itself is optional.
