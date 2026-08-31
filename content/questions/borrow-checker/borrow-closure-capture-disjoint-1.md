---
id: borrow-closure-capture-disjoint-1
categorySlug: borrow-checker
title: "Disjoint Capture in Closures"
difficulty: 2
tags: [borrow-checker, closure, disjoint]
---

# Prompt
How does Rust 2021 handle closures capturing separate fields of the same struct?

# Options
- [x] A) Rust 2021 captures individual fields independently
- [ ] B) Closures always borrow the entire containing struct
- [ ] C) The borrow checker requires manual field cloning
- [ ] D) Closures cannot borrow struct fields inside loops

# Hint
Rust 2021 introduced disjoint capture for closure fields.

# Explanation
Since Rust 2021, closures only capture the specific struct fields they access, allowing other fields to be borrowed concurrently elsewhere.
