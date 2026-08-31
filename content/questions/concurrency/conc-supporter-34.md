---
id: conc-supporter-34
categorySlug: concurrency
title: "Atomic CAS ABA Problem"
difficulty: 3
tags: [concurrency, atomics, lock-free]
---

# Prompt
What is the ABA problem in lock-free concurrent programming?

# Code
```rust
// Value changes from A -> B -> A; CAS succeeds despite intervening changes
```

# Options
- [ ] A) Two threads deadlocking on atomic variable assignment order under current compiler safety rules
- [ ] B) Bitwise integer overflow causing undefined behavior in release mode within local thread memory
- [x] C) A location changes from A to B and back to A, tricking a CAS into falsely assuming no change
- [ ] D) A compiler bug reordering atomic load instructions ahead of stores under current compiler safety rules

# Hint
ABA occurs when a value looks unchanged to CAS despite intermediate modifications.

# Explanation
The ABA problem occurs when a memory location is read as `A`, modified to `B` by another thread, and then modified back to `A`. A subsequent CAS succeeds because the value is `A`, even though internal state or pointer targets may have changed.
