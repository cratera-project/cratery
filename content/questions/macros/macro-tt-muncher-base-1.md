---
id: macro-tt-muncher-base-1
categorySlug: macros
title: "TT Muncher Pattern"
difficulty: 3
tags: [macros, tt-muncher, design-patterns]
---

# Prompt
What characterizes the "TT muncher" macro design pattern?

# Options
- [ ] A) Parsing all input tokens at once into dynamic hash maps
- [x] B) Processing tokens one item at a time through recursion
- [ ] C) Disabling hygiene checks for all generated identifiers
- [ ] D) Generating procedural macros directly from macro_rules!

# Hint
TT munchers match a single token tree at a time and recursively process the tail.

# Explanation
A TT (token tree) muncher pattern matches the leading token tree(s), transforms or stores them, and recursively invokes the macro on the remaining tail until empty.
