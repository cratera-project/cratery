---
id: iter-zip-shortest-termination-1
categorySlug: iterators-closures
title: "Iterator zip Termination Condition"
difficulty: 1
tags: [iterators-closures, zip]
---

# Prompt
When does `iter_a.zip(iter_b)` stop yielding elements?

# Options
- [x] A) It terminates immediately as soon as either iterator ends
- [ ] B) It pads the shorter iterator with default None values
- [ ] C) It panics if the two zipped iterators have unequal sizes
- [ ] D) It resets the shorter iterator back to the first element

# Hint
zip stops as soon as either underlying iterator yields None.

# Explanation
`zip()` terminates as soon as either iterator returns `None`. Remaining elements in the longer iterator are not consumed.
