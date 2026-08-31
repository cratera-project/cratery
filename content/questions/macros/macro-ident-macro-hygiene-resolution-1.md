---
id: macro-ident-macro-hygiene-resolution-1
categorySlug: macros
title: "Identifier Hygiene in macro_rules!"
difficulty: 2
tags: [macros, hygiene, macro_rules]
---

# Prompt
How does macro hygiene protect local variable bindings defined inside `macro_rules!`?

# Options
- [ ] A) Macro identifiers always resolve in global root crate scope
- [ ] B) Identifiers created in macro bodies are visible everywhere
- [ ] C) Hygiene prevents macros from producing executable functions
- [x] D) Identifiers introduced by macros cannot clash with callers

# Hint
Hygiene ensures variables defined in macros do not shadow or clash with caller bindings.

# Explanation
Declarative macros have identifier hygiene: variable bindings declared inside macro bodies cannot shadow or collide with variables in caller scopes.
