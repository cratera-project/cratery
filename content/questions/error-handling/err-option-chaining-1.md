---
id: err-option-chaining-1
categorySlug: error-handling
title: "Option Combinators"
difficulty: 2
tags: [error-handling, option, combinators]
---

# Prompt
What is the main upside of `map` + `unwrap_or` here?

# Code
```rust
let length = user.name.map(|n| n.len()).unwrap_or(0);
// vs match user.name { Some(n) => n.len(), None => 0 }
```

# Options
- [x] A) A short chain for a simple transform-with-default
- [ ] B) It bypasses borrowing rules that `match` must obey
- [ ] C) Combinators are always faster than pattern matching
- [ ] D) `match` on `Option` is deprecated in modern Rust

# Hint
Style and clarity, not a borrow-checker escape hatch.

# Explanation
For a linear transform plus default, combinators are concise and equivalent in meaning to `match`. They do not weaken borrowing, are not always faster, and `match` remains fully supported, often clearer for multi-branch logic.
