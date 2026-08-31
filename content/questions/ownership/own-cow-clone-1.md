---
id: own-cow-clone-1
categorySlug: ownership
title: "Cow Clone-on-Write Semantics"
difficulty: 2
tags: [ownership, cow]
---

# Prompt
What is the primary ownership benefit of `std::borrow::Cow`?

# Options
- [x] A) It avoids heap allocation until mutation is needed
- [ ] B) It enforces immutable thread-local caching on read
- [ ] C) It converts borrowed string slices into static strings
- [ ] D) It performs immediate deep cloning on initial creation

# Hint
Cow allows returning borrowed data or cloning lazily.

# Explanation
`Cow` (Clone-on-Write) holds either borrowed data (`Cow::Borrowed`) or owned data (`Cow::Owned`), allocating only when modification (`to_mut()`) is required.
