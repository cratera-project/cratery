---
id: trait-where-needed-1
categorySlug: traits
title: "When `where` Is Required"
difficulty: 3
tags: [traits, bounds, where]
---

# Prompt
Why is this `impl` written with a `where` clause?

# Code
```rust
use std::fmt::Debug;

trait PrintInOption {
    fn print_in_option(self);
}

impl<T> PrintInOption for T
where
    Option<T>: Debug,
{
    fn print_in_option(self) {
        println!("{:?}", Some(self));
    }
}
```

# Options
- [ ] A) Blanket `impl`s are illegal unless they use `where`
- [ ] B) `Debug` cannot appear as any kind of trait bound here
- [x] C) The bound is on `Option<T>`, not only on the parameter `T`
- [ ] D) `Option` forces dynamic dispatch unless written with `where`

# Hint
Look at which type appears on the left of the colon in the bound.

# Explanation
Inline `T: Trait` after a type parameter is only a shorthand for bounds on that parameter. A `where` clause can bound arbitrary types, such as `Option<T>: Debug` here (the value being printed). That form cannot be written as a plain `T: …` parameter shorthand. `where` is the general bound syntax; the angle-bracket form is the limited shorthand.
