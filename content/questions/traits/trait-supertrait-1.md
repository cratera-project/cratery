---
id: trait-supertrait-1
categorySlug: traits
title: "Supertraits"
difficulty: 2
tags: [traits, supertraits]
---

# Prompt
What does this supertrait bound mean?

# Code
```rust
trait OutlinePrint: Display {
    fn outline_print(&self) {
        let output = self.to_string();
        println!("{output}");
    }
}
```

# Options
- [x] A) Implementors must also implement `Display`
- [ ] B) `OutlinePrint` automatically impls `Display`
- [ ] C) `Display` methods become `unsafe` to call
- [ ] D) Only `Display` types may define any new traits

# Hint
Supertraits are extra requirements on implementors.

# Explanation
`trait OutlinePrint: Display` means any type that implements `OutlinePrint` must also implement `Display`. The default method can then call `Display`/`ToString` APIs. It does not auto-implement `Display`.
