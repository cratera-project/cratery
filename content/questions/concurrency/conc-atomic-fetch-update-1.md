---
id: conc-atomic-fetch-update-1
categorySlug: concurrency
title: "Atomic fetch_update Loop"
difficulty: 3
tags: [concurrency, atomics, fetch-update]
---

# Prompt
How does `AtomicI32::fetch_update` achieve lock-free mutation?

# Options
- [ ] A) It acquires a coarse global reader-writer lock mutex
- [ ] B) It allocates temporary atomic tokens in thread memory
- [ ] C) It crashes if another thread modifies value in flight
- [x] D) It applies a closure repeatedly inside an atomic loop

# Hint
fetch_update wraps compare_exchange in a retry loop applying your update function.

# Explanation
`fetch_update` repeatedly loads the current value, computes the new value via closure, and performs `compare_exchange_weak` in a lock-free CAS loop until successful.
