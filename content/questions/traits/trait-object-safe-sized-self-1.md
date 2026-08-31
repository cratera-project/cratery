---
id: trait-object-safe-sized-self-1
categorySlug: traits
title: "Self: Sized on Trait Methods"
difficulty: 3
tags: [traits, object-safety, sized]
---

# Prompt
Why do traits with `where Self: Sized` on specific methods retain dyn object safety?

# Options
- [x] A) The method is excluded from dyn vtables when Self: Sized
- [ ] B) The trait object can still call the method via dynamic
- [ ] C) The method triggers a compiler warning on implementation
- [ ] D) The trait becomes completely impossible to implement on

# Hint
Methods requiring Self: Sized are omitted from the vtable, keeping the trait dyn-safe.

# Explanation
Adding `where Self: Sized` to a method excludes it from the `dyn Trait` vtable, allowing the overall trait to remain object safe while providing non-dyn methods for sized types.
