---
id: err-control-flow-break-continue-1
categorySlug: error-handling
title: "std::ops::ControlFlow Pattern"
difficulty: 2
tags: [error-handling, control-flow, try-trait]
---

# Prompt
What design advantage does `std::ops::ControlFlow<B, C>` offer over `Result<C, B>`?

# Options
- [x] A) It models early exit vs continuation without Err bias
- [ ] B) It converts loop iterations into async thread tasks
- [ ] C) It generates a panic if the break variant is returned
- [ ] D) It forces loops to execute exactly once inside memory

# Hint
ControlFlow represents Break and Continue without treating early returns as failure errors.

# Explanation
`ControlFlow` cleanly distinguishes early-exit/break values from continue values without semantic connotation of "success" or "error", integrating with the `?` operator.
