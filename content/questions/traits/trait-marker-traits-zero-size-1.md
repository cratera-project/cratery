---
id: trait-marker-traits-zero-size-1
categorySlug: traits
title: "Marker Traits and Zero Cost"
difficulty: 1
tags: [traits, marker-traits]
---

# Prompt
What characterizes a marker trait (such as `Send`, `Sync`, or `Copy`) in Rust?

# Options
- [x] A) They have no methods or associated items at compile time
- [ ] B) They can only be implemented on primitive scalar numbers
- [ ] C) They allocate dynamic vtables in process executable text
- [ ] D) They require the compiler to disable all optimizations

# Hint
Marker traits have an empty body and convey type properties to the compiler with zero runtime cost.

# Explanation
Marker traits declare no methods or associated items. They serve as zero-overhead compile-time tags indicating structural properties (e.g. thread safety or bitwise copyability).
