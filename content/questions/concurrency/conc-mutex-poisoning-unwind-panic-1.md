---
id: conc-mutex-poisoning-unwind-panic-1
categorySlug: concurrency
title: "Mutex Poisoning Semantics"
difficulty: 2
tags: [concurrency, mutex, poisoning]
---

# Prompt
What happens to a `std::sync::Mutex` if a thread panics while holding the `MutexGuard`?

# Options
- [ ] A) The lock is automatically freed and marked completely sound
- [x] B) The Mutex is poisoned, returning PoisonError on next lock
- [ ] C) The process aborts immediately with a hardware exception
- [ ] D) The locked data is reset to its Default::default() value

# Hint
Panicking with an active lock poisons the Mutex to protect invariants.

# Explanation
When a thread panics while holding a `MutexGuard`, the `Mutex` becomes "poisoned". Subsequent `lock()` attempts return `Err(PoisonError)`, signaling potential invariant corruption.
