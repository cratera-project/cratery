---
id: trait-dispatch-static-vs-dynamic-1
categorySlug: traits
title: "Static vs Dynamic Dispatch"
difficulty: 3
tags: [traits, dyn, dispatch]
---

# Prompt
How are `draw` calls resolved through a trait object?

# Code
```rust
fn run(xs: Vec<Box<dyn Draw>>) {
    for x in xs {
        x.draw();
    }
}
```

# Options
- [ ] A) Monomorphize `draw` for each concrete type used
- [x] B) Look up the method via dynamic dispatch
- [ ] C) Reject unless `Draw` also requires `Copy`
- [ ] D) Rewrite each call into a macro expansion

# Hint
`dyn` means the concrete type is known only at runtime.

# Explanation
Calls through `dyn Draw` use dynamic dispatch: the vtable selects the concrete `draw` at runtime. Generics would monomorphize instead.
