---
id: conc-atomic-ordering-release-acquire-1
categorySlug: concurrency
title: "Acquire-Release Memory Ordering"
difficulty: 3
tags: [concurrency, atomics, memory-ordering, acquire-release]
---

# Prompt
How do `Ordering::Release` and `Ordering::Acquire` synchronize across threads in Rust?

# Options
- [ ] A) Acquire stores synchronize with Release load operations
- [ ] B) Release and Acquire enforce total sequential consistency
- [x] C) Release stores synchronize with Acquire loads on same atom
- [ ] D) Relaxed ordering provides mutual exclusion across threads

# Hint
A store-Release establishes a happens-before relationship with a load-Acquire observing that store.

# Explanation
A store with `Ordering::Release` synchronizes-with a load with `Ordering::Acquire` that reads the stored value, ensuring all prior writes are visible to the acquiring thread.
