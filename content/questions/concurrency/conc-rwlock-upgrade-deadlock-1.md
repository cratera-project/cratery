---
id: conc-rwlock-upgrade-deadlock-1
categorySlug: concurrency
title: "RwLock Upgrade Deadlock Risk"
difficulty: 2
tags: [concurrency, rwlock, deadlock]
---

# Prompt
Why does `std::sync::RwLock` not allow direct lock upgrading from read to write?

# Options
- [ ] A) Upgrading from read to write lock is always lock-free
- [ ] B) The reader lock is silently dropped and re-acquired
- [x] C) Two readers trying to acquire write lock will deadlock
- [ ] D) RwLock prevents multiple readers from reading at once

# Hint
If two threads holding read locks attempt to upgrade simultaneously, neither can proceed.

# Explanation
If multiple threads holding shared read locks attempt to upgrade to exclusive write access, they will mutually wait for each other to release the read lock, causing deadlock.
