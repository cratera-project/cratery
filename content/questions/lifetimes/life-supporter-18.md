---
id: life-supporter-18
categorySlug: lifetimes
title: "Dangling Reference in Function Return"
difficulty: 1
tags: [lifetimes, dangling, borrow-checker]
---

# Prompt
Why does returning a reference to a local variable fail compilation?

# Code
```rust
// fn bad<'a>() -> &'a String {
//     let s = String::from("local");
//     &s
// }
```

# Options
- [x] A) Local variables are dropped at function return; reference dangles
- [ ] B) String references cannot be named with generic lifetimes in runtime memory
- [ ] C) The compiler requires returning Result for all reference types in code
- [ ] D) Functions cannot return references unless marked unsafe in runtime memory

# Hint
The local variable s is destroyed when the function returns.

# Explanation
s is allocated on the local stack frame and dropped when the function exits. Returning &s would produce a dangling reference to deallocated memory, which Rust statically prevents.
