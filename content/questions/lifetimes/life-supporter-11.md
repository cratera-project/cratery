---
id: life-supporter-11
categorySlug: lifetimes
title: "Trait Object Lifetime Bounds"
difficulty: 2
tags: [lifetimes, trait-objects, defaults]
---

# Prompt
What is the default lifetime bound for Box<dyn Trait>?

# Code
```rust
trait Task {}
fn make_task() -> Box<dyn Task> {
    struct MyTask;
    impl Task for MyTask {}
    Box::new(MyTask)
}
```

# Options
- [ ] A) Box<dyn Task + '_> in code
- [x] B) Box<dyn Task + 'static>
- [ ] C) Box<dyn Task + 'a> in code
- [ ] D) Box<dyn Task + 'empty> in code

# Hint
Trait objects in Box default to 'static lifetime.

# Explanation
By default, trait objects inside Box<dyn Trait> default to Box<dyn Trait + 'static>, meaning the underlying concrete type cannot contain non-'static references unless an explicit bound is specified.
