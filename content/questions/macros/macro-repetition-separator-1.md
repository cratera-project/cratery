---
id: macro-repetition-separator-1
categorySlug: macros
title: "Macro Repetition Separator Syntax"
difficulty: 1
tags: [macros, repetition]
---

# Prompt
What does the pattern `$($x:expr),*` match in a declarative macro?

# Options
- [x] A) It matches zero or more comma-separated expressions
- [ ] B) It matches at least one mandatory expression sequence
- [ ] C) It creates a fixed-size stack array containing items
- [ ] D) It splits string literals across comma delimiters

# Hint
* denotes 0 or more repetitions separated by comma.

# Explanation
In `macro_rules!`, `$($x:expr),*` matches zero or more repetitions of `$x:expr` separated by commas.
