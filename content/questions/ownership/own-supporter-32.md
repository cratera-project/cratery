---
id: own-supporter-32
categorySlug: ownership
title: "Temporary Lifetime Extension with ref"
difficulty: 2
tags: [ownership, temporaries, lifetime-extension]
---

# Prompt
Why does `let ref x = 5;` extend the temporary integer lifetime?

# Code
```rust
fn main() {
    let ref x = 5 + 5;
    println!("{x}");
}
```

# Options
- [ ] A) Integers are automatically stored in static binary data in code
- [ ] B) The ref keyword converts numbers into heap allocations in code
- [ ] C) Primitive operations evaluate inside global compiler table
- [x] D) Temporary lifetime extension keeps it alive for the block

# Hint
Binding a temporary expression directly to a reference in a let statement extends its lifetime.

# Explanation
When a temporary expression is directly bound by reference (`let ref x = ...` or `let x = &...`), Rust extends the temporary lifetime to match the scope of the enclosing block.
