---
id: life-anonymous-param-ref-1
categorySlug: lifetimes
title: "Anonymous Input Lifetimes"
difficulty: 1
tags: [lifetimes, elision]
---

# Prompt
In `fn parse(a: &str, b: &str)`, how does the compiler elide lifetimes?

# Options
- [x] A) Each elided reference parameter gets a fresh lifetime
- [ ] B) All elided input references share a single lifetime
- [ ] C) Elided parameters are converted into raw pointer values
- [ ] D) Elided reference lifetimes are promoted into 'static

# Hint
Each elided parameter position is given its own distinct lifetime parameter.

# Explanation
Rule 1 of lifetime elision states that each elided lifetime in input parameters is assigned a distinct, unique lifetime parameter (`fn parse<'a, 'b>(&'a str, &'b str)`).
