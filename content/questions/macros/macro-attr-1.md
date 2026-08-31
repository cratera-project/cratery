---
id: macro-attr-1
categorySlug: macros
title: "Attribute Proc Macros"
difficulty: 2
tags: [macros, procedural, attributes]
---

# Prompt
What kind of procedural macro is `#[tokio::main]`?

# Code
```rust
#[tokio::main]
async fn main() {
    println!("hi");
}
```

# Options
- [ ] A) A derive macro that only implements traits
- [ ] B) A `macro_rules!` matcher using `:item` fragments
- [x] C) An attribute proc macro rewriting the `fn` item
- [ ] D) A built-in keyword handled only by the linker

# Hint
Three proc-macro kinds: derive, attribute, function-like.

# Explanation
Attribute procedural macros take an item (and optional attribute tokens) and emit a new `TokenStream`. `#[tokio::main]` rewrites `async fn main` into a synchronous entry that builds a runtime. It is not a derive.
