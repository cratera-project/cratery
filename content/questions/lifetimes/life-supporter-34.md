---
id: life-supporter-34
categorySlug: lifetimes
title: "Lifetime in Trait Implementation"
difficulty: 2
tags: [lifetimes, traits, impl]
---

# Prompt
Why can impl<'a> Trait for &'a str implement a trait for references?

# Code
```rust
trait Inspector {
    fn inspect(&self);
}

impl<'a> Inspector for &'a str {
    fn inspect(&self) {
        println!("str len: {}", self.len());
    }
}

fn main() {
    let s = "hello";
    s.inspect();
}
```

# Options
- [x] A) References are first-class concrete types in Rust's type system
- [ ] B) The compiler turns reference traits into macro definitions in code
- [ ] C) Trait implementations on references require unsafe blocks in code
- [ ] D) Only static string slices are allowed to implement traits in code

# Hint
&'a T is a valid type in Rust that can implement traits like any other type.

# Explanation
In Rust, reference types like &'a str or &'a mut [u8] are first-class types. You can implement traits directly on them with generic lifetime parameters on the impl block.
