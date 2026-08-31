---
id: life-elision-impl-block-1
categorySlug: lifetimes
title: "Method Lifetime Elision"
difficulty: 1
tags: [lifetimes, elision, methods]
---

# Prompt
How does lifetime elision handle output references in methods with `&self`?

# Options
- [ ] A) Every method gets a distinct global static lifetime param
- [ ] B) Lifetimes in impl headers must be marked with wildcards
- [ ] C) Methods cannot return references connected to the receiver
- [x] D) Elided method lifetimes connect to &self or get fresh ones

# Hint
When &self is present, elided return references borrow from self.

# Explanation
If there are multiple input lifetimes but one is `&self` or `&mut self`, the lifetime of `self` is assigned to all elided output lifetimes.
