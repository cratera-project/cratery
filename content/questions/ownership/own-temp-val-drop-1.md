---
id: own-temp-val-drop-1
categorySlug: ownership
title: "Temporary Value Scope"
difficulty: 2
tags: [ownership, temporary, drop]
---

# Prompt
When are temporary values created inside an expression dropped by default?

# Options
- [x] A) At the end of the enclosing statement delimiter
- [ ] B) At the exit point of the entire enclosing function
- [ ] C) Immediately when the temporary is first evaluated
- [ ] D) When the garbage collector sweeps unreferenced data

# Hint
Temporaries live until the semicolon of the enclosing statement.

# Explanation
In Rust, temporary values created within an expression are dropped at the end of the statement (the semicolon), unless extended by a `let` binding.
