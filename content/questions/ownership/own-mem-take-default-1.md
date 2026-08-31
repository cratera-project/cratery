---
id: own-mem-take-default-1
categorySlug: ownership
title: "std::mem::take Semantics"
difficulty: 2
tags: [ownership, mem, take]
---

# Prompt
What is the behavior of `std::mem::take(&mut dest)` for a type implementing `Default`?

# Options
- [x] A) It replaces the destination with Default::default()
- [ ] B) It zeroes out destination memory using byte writes
- [ ] C) It clones the destination value into a new heap box
- [ ] D) It marks the borrowed location as completely invalid

# Hint
mem::take replaces the value at a mutable reference with its default.

# Explanation
`std::mem::take` moves the owned value out of `dest` and replaces it with `Default::default()`, leaving a valid value in the reference without allocating.
