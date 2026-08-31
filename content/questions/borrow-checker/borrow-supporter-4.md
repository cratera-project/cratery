---
id: borrow-supporter-4
categorySlug: borrow-checker
title: "Match Ergonomics and Default Binding Modes"
difficulty: 2
tags: [borrow-checker, match-ergonomics, patterns]
---

# Prompt
What binding mode is inferred for `x` in `if let Some(x) = &opt`?

# Code
```rust
fn main() {
    let opt = Some(String::from("data"));
    if let Some(x) = &opt {
        let _r: &String = x;
    }
}
```

# Options
- [ ] A) An owned `String` moved out of the option in code
- [x] B) `ref x` (inferred shared reference `&String`)
- [ ] C) `ref mut x` (inferred exclusive reference) in code
- [ ] D) A raw pointer `*const String` during runtime execution

# Hint
Match ergonomics automatically applies ref or ref mut when matching against references.

# Explanation
Under Match Ergonomics, when matching on a reference (like `&Option<T>`), pattern bindings automatically inherit the reference mode, treating `Some(x)` as `Some(ref x)` without requiring explicit `ref` syntax.
