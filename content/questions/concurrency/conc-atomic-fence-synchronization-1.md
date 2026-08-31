---
id: conc-atomic-fence-synchronization-1
categorySlug: concurrency
title: "Atomic Fences Synchronization"
difficulty: 3
tags: [concurrency, atomics, fence]
---

# Prompt
What does `std::sync::atomic::fence(Ordering)` do in concurrent algorithms?

# Options
- [ ] A) Fences lock all CPU hardware cores in a global busy loop
- [ ] B) Fences allocate dynamic synchronization barriers on heap
- [ ] C) Fences replace atomic instructions with operating mutexes
- [x] D) Fences establish memory ordering without modifying memory

# Hint
An atomic fence establishes memory ordering constraints on prior/subsequent operations without an atomic read/write.

# Explanation
`atomic::fence` establishes synchronization and memory ordering constraints between threads without performing an atomic operation on a specific memory location.
