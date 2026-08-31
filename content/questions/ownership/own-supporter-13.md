---
id: own-supporter-13
categorySlug: ownership
title: "Partial Move in Pattern with Wildcard"
difficulty: 2
tags: [ownership, patterns, wildcard]
---

# Prompt
Why does `let (a, _) = pair;` allow `a` to move while ignoring the rest?

# Code
```rust
fn main() {
    let pair = (String::from("keep"), String::from("discard"));
    let (a, _) = pair;
    println!("{a}");
}
```

# Options
- [x] A) `_` moves the second element and drops it immediately
- [ ] B) `_` prevents any allocation from occurring on stack in code
- [ ] C) `_` binds by reference without altering variable state
- [ ] D) `_` turns the entire tuple into a static reference in code

# Hint
The wildcard pattern _ drops unmatched values immediately on binding.

# Explanation
In pattern matching, `_` does not bind a variable name. The value corresponding to `_` is moved and dropped immediately, leaving `a` as the sole owned binding.
