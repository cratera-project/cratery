---
id: own-rc-try-unwrap-1
categorySlug: ownership
title: "Rc try_unwrap Extraction"
difficulty: 2
tags: [ownership, rc, unwrap]
---

# Prompt
Under what condition does `Rc::try_unwrap(rc)` succeed in returning `Ok(T)`?

# Options
- [x] A) It returns Ok(T) if strong_count is exactly 1
- [ ] B) It clones the inner value if multiple handles exist
- [ ] C) It converts the Rc pointer into an Arc thread handle
- [ ] D) It resets the strong reference counter to zero value

# Hint
try_unwrap extracts the inner value only if no other strong references exist.

# Explanation
`Rc::try_unwrap` returns `Ok(value)` if there is exactly one strong reference (strong count = 1), consuming the `Rc`. Otherwise, it returns `Err(rc)`.
