---
id: conc-once-cell-lazy-init-1
categorySlug: concurrency
title: "OnceLock Thread-Safe Initialization"
difficulty: 1
tags: [concurrency, once-lock, lazy]
---

# Prompt
What guarantee does `std::sync::OnceLock::get_or_init` provide?

# Options
- [ ] A) It requires manual lock acquisition and unlock calls
- [x] B) It guarantees the initializer runs at most once total
- [ ] C) It evaluates initialization eagerly on thread spawn
- [ ] D) It allocates every initialized struct on system heap

# Hint
OnceLock initializes a value lazily and thread-safely exactly once.

# Explanation
`OnceLock::get_or_init` guarantees that even under concurrent multi-threaded access, the initialization closure is executed at most once, safely sharing the result.
