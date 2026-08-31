---
id: own-drop-glue-order-1
categorySlug: ownership
title: "Struct Field Drop Order"
difficulty: 2
tags: [ownership, drop, fields]
---

# Prompt
In what order does Rust drop the individual fields of a struct when the struct is dropped?

# Options
- [ ] A) Struct fields are dropped in reverse definition order
- [ ] B) Struct fields are dropped in arbitrary random order
- [x] C) Struct fields are dropped in direct declaration order
- [ ] D) Struct fields are all dropped simultaneously in parallel

# Hint
Struct fields are dropped in the exact order they are declared in source code.

# Explanation
According to the Rust reference (§Destructors), the fields of a struct are dropped in declaration order (first field declared is dropped first).
