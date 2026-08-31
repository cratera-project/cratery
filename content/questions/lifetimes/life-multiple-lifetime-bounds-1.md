---
id: life-multiple-lifetime-bounds-1
categorySlug: lifetimes
title: "Outlives Lifetime Constraint"
difficulty: 2
tags: [lifetimes, bounds, outlives]
---

# Prompt
What does the bound `'a: 'b` express between two lifetimes?

# Options
- [ ] A) The lifetimes 'a and 'b must be completely identical
- [ ] B) The lifetime 'b must be an explicit sub-lifetime of 'a
- [x] C) The lifetime 'a must outlive or be at least as long as 'b
- [ ] D) The struct must allocate its inner fields on heap stack

# Hint
Read 'a: 'b as "'a outlives 'b".

# Explanation
The lifetime subtyping bound `'a: 'b` means that lifetime `'a` outlives (is at least as long as) lifetime `'b`.
