---
id: trait-supporter-29
categorySlug: traits
title: "PhantomData and Send/Sync"
difficulty: 2
tags: [traits, phantom-data, send]
---

# Prompt
How does `PhantomData<std::rc::Rc<()>>` affect the `Send` implementation of a struct?

# Code
```rust
use std::marker::PhantomData;
use std::rc::Rc;

struct NotSend {
    _marker: PhantomData<Rc<()>>,
}
```

# Options
- [ ] A) It forces the struct to be allocated on the thread-local heap in runtime memory
- [ ] B) It implements `Send` only when compiled in release optimization mode in code
- [x] C) It prevents the struct from automatically implementing `Send` and `Sync`
- [ ] D) It converts the struct into a shared atomic reference counter in runtime memory

# Hint
Rc is !Send and !Sync, so PhantomData<Rc<()>> makes the container !Send and !Sync.

# Explanation
Because `Rc` is `!Send` and `!Sync`, including `PhantomData<Rc<()>>` causes the containing struct to also become `!Send` and `!Sync` by auto trait derivation rules.
