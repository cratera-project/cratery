---
id: conc-atomic-ordering-1
categorySlug: concurrency
title: "Relaxed Atomics"
difficulty: 3
tags: [concurrency, atomics]
---

# Prompt
What does `Ordering::Relaxed` guarantee for an atomic op?

# Code
```rust
use std::sync::atomic::{AtomicUsize, Ordering};

fn main() {
    let x = AtomicUsize::new(0);
    x.store(1, Ordering::Relaxed);
}
```

# Options
- [x] A) Atomicity of the op, without sync with other memory
- [ ] B) Full sequential consistency with all other atomics
- [ ] C) Acquire-release pairing with matching loads/stores
- [ ] D) Visibility of the write only on a single-core CPU

# Hint
Atomicity and synchronization ordering are separate ideas.

# Explanation
`Relaxed` operations are still indivisible, but they do not create happens-before edges with other memory ops. Use stronger orderings (or fences) when one thread must publish data another must observe.
