---
id: iter-inspect-side-effects-1
categorySlug: iterators-closures
title: "Iterator inspect Debugging"
difficulty: 1
tags: [iterators-closures, inspect]
---

# Prompt
What is the role of `.inspect(|item| ...)` in an iterator pipeline?

# Options
- [ ] A) It filters elements that return false from the inspect fn
- [ ] B) It mutates the yielded elements in place without allocating
- [ ] C) It transforms items into arbitrary output types dynamically
- [x] D) It executes a closure on each item without modifying values

# Hint
inspect allows observing items passing through an iterator chain without modifying them.

# Explanation
`inspect()` takes a closure `&FnMut(&Item)` to perform side-effects (such as logging or debugging) on elements as they pass through without altering the sequence.
