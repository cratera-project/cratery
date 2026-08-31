---
id: ptr-supporter-29
categorySlug: pointers
title: "Deref vs DerefMut Target Type"
difficulty: 2
tags: [pointers, deref, target]
---

# Prompt
Can `DerefMut` have a different `Target` associated type than `Deref`?

# Code
```rust
use std::ops::{Deref, DerefMut};

struct MySmart<T>(T);

impl<T> Deref for MySmart<T> {
    type Target = T;
    fn deref(&self) -> &Self::Target { &self.0 }
}
impl<T> DerefMut for MySmart<T> {
    fn deref_mut(&mut self) -> &mut Self::Target { &mut self.0 }
}
```

# Options
- [x] A) No; `DerefMut` inherits `type Target` directly from `Deref`
- [ ] B) Yes; `DerefMut` defines its own independent `TargetMut` type
- [ ] C) Only if the struct implements the `AsMut` conversion trait in code
- [ ] D) Only when compiled for 32-bit embedded target systems in code

# Hint
DerefMut has Deref as a supertrait and reuses Deref::Target.

# Explanation
`DerefMut` is defined as `pub trait DerefMut: Deref { fn deref_mut(&mut self) -> &mut Self::Target; }`. It does not declare a new associated type; it reuses `Deref::Target`.
