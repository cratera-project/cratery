---
id: trait-supporter-32
categorySlug: traits
title: "Default Trait Method Overriding"
difficulty: 1
tags: [traits, defaults, methods]
---

# Prompt
Can an `impl` block override a default method provided in a trait definition?

# Code
```rust
trait Greeter {
    fn hello(&self) { println!("default hello"); }
}

struct Custom;
impl Greeter for Custom {
    fn hello(&self) { println!("custom hello"); }
}
```

# Options
- [ ] A) No; default methods are permanently fixed in traits
- [x] B) Yes; any implementor can provide a custom override
- [ ] C) Only if the trait is marked with the default keyword
- [ ] D) Only if the struct is marked with the unsafe keyword

# Hint
Default method implementations in traits can be freely overridden by implementors.

# Explanation
Default method implementations provide a fallback. Any implementing type can optionally override the default implementation to provide specialized or optimized behavior.
