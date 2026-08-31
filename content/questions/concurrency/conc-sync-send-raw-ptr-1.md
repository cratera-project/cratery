---
id: conc-sync-send-raw-ptr-1
categorySlug: concurrency
title: "Send and Sync for Raw Pointers"
difficulty: 2
tags: [concurrency, send, sync, raw-pointers]
---

# Prompt
What are the default `Send` and `Sync` implementations for `*const T` and `*mut T`?

# Options
- [ ] A) They are automatically marked Send by the borrow checker
- [x] B) They do not implement Send or Sync without unsafe impl
- [ ] C) They can be sent across threads only if cast to usize
- [ ] D) They implement Sync but require locks to implement Send

# Hint
Raw pointers are !Send and !Sync by default to preserve thread safety.

# Explanation
Raw pointers do not implement `Send` or `Sync` because the compiler cannot verify aliasing or safety across threads. Implementing them requires explicit `unsafe impl`.
