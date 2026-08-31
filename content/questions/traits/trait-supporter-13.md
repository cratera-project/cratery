---
id: trait-supporter-13
categorySlug: traits
title: "From and Into Dual Implementation"
difficulty: 2
tags: [traits, from, into]
---

# Prompt
Why does implementing `From<T> for U` automatically provide `Into<U> for T`?

# Code
```rust
struct Dollars(u32);
impl From<u32> for Dollars {
    fn from(v: u32) -> Self { Dollars(v) }
}

fn main() {
    let d: Dollars = 50u32.into();
    println!("{}", d.0);
}
```

# Options
- [ ] A) The compiler rewrites all `.into()` calls into `.from()` during AST parsing in runtime memory
- [ ] B) The `From` trait is a macro that generates an `Into` implementation directly in runtime memory
- [x] C) A standard library blanket implementation `impl<T, U> Into<U> for T where U: From<T>`
- [ ] D) Type inference generates virtual into methods in the binary symbol table in runtime memory

# Hint
The standard library includes a blanket implementation of Into for any type implementing From.

# Explanation
The Rust standard library provides a blanket implementation: `impl<T, U> Into<U> for T where U: From<T>`. Implementing `From` automatically grants the corresponding `Into` implementation.
