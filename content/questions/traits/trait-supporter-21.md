---
id: trait-supporter-21
categorySlug: traits
title: "Auto Traits Implementation"
difficulty: 2
tags: [traits, auto-traits, concurrency]
---

# Prompt
How are auto traits (like `Send` and `Sync`) implemented for custom types?

# Code
```rust
struct SafeData {
    id: u64,
    name: String,
}
```

# Options
- [ ] A) Only if explicitly declared with `#[derive(Send, Sync)]` in code
- [ ] B) Through manual unsafe implementation blocks exclusively in runtime memory
- [x] C) Automatically derived if all constituent fields implement them
- [ ] D) By registering the type in the global runtime process table in code

# Hint
Auto traits automatically propagate if all fields implement the trait.

# Explanation
Auto traits like `Send` and `Sync` are automatically implemented for a struct if and only if all of its fields implement `Send` and `Sync`. Negative `impl !Send` blocks can opt out.
