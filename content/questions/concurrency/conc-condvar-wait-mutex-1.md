---
id: conc-condvar-wait-mutex-1
categorySlug: concurrency
title: "Condvar wait Mutex Release"
difficulty: 2
tags: [concurrency, condvar, mutex]
---

# Prompt
What happens atomically when calling `condvar.wait(guard)`?

# Options
- [x] A) It unlocks the Mutex and suspends the current thread
- [ ] B) It polls the condition variable in a tight CPU loop
- [ ] C) It converts the Mutex into a non-blocking spin lock
- [ ] D) It spawns a detached background thread to run checks

# Hint
wait releases the mutex lock and blocks the thread atomically.

# Explanation
`Condvar::wait` atomically unlocks the associated `MutexGuard` and blocks the calling thread, re-acquiring the lock before returning when notified.
