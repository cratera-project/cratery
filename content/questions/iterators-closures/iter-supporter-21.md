---
id: iter-supporter-21
categorySlug: iterators-closures
title: "Closure Struct Size and Captures"
difficulty: 3
tags: [iterators-closures, closures, memory-layout]
---

# Prompt
What determines `std::mem::size_of_val(&closure)` for a closure instance?

# Code
```rust
fn main() {
    let a: u64 = 1;
    let b: u64 = 2;
    let c = move || a + b;
    assert_eq!(std::mem::size_of_val(&c), 16);
}
```

# Options
- [ ] A) A fixed size of 16 bytes representing fat pointer vtables within local thread memory
- [ ] B) The size of the compiled machine code instructions in RAM within local thread memory
- [ ] C) Zero bytes because closures are evaluated purely at compile time in runtime memory
- [x] D) The combined memory sizes and alignment padding of all captured variables

# Hint
Under the hood, a closure is an anonymous compiler-generated struct holding its captured fields.

# Explanation
In Rust, a closure is desugared into an anonymous struct containing all captured variables (either as references or by-value fields). Its size is the struct layout size of those captured fields.
