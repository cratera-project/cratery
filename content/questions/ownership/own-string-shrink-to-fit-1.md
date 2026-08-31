---
id: own-string-shrink-to-fit-1
categorySlug: ownership
title: "String Capacity Shrinking"
difficulty: 1
tags: [ownership, string, capacity]
---

# Prompt
What does calling `s.shrink_to_fit()` do on an owned `String`?

# Options
- [ ] A) It clears all characters from the string buffer
- [ ] B) It converts the string slice into a static literal
- [ ] C) It forces the compiler to inline the heap buffer
- [x] D) It reduces buffer capacity to match current length

# Hint
shrink_to_fit requests the allocator to reclaim unused excess capacity.

# Explanation
`shrink_to_fit()` requests the global allocator to reallocate the string's heap buffer to match its current length, releasing excess allocated capacity.
