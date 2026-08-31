---
id: life-supporter-5
categorySlug: lifetimes
title: "Static Promotion of Const Literals"
difficulty: 2
tags: [lifetimes, static-promotion, const]
---

# Prompt
Why does let r: &'static i32 = &42; compile in safe Rust?

# Code
```rust
fn get_answer() -> &'static i32 {
    &42
}

fn main() {
    println!("{}", get_answer());
}
```

# Options
- [ ] A) The compiler allocates the integer on the global heap in runtime memory
- [ ] B) Integers implement the Copy trait across return boundaries in code
- [ ] C) The reference is converted into a raw pointer transparently in code
- [x] D) Constant expressions without interior mutability are promoted

# Hint
References to const-evaluable rvalues are promoted to static memory.

# Explanation
Rust performs 'rvalue static promotion': taking a reference to a constant expression (like &42 or &'hello') that contains no interior mutability automatically places the data in read-only static memory, giving it lifetime 'static.
