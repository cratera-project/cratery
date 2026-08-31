---
id: borrow-reborrow-mut-1
categorySlug: borrow-checker
title: "Mutable Reborrowing"
difficulty: 2
tags: [borrow-checker, reborrow]
---

# Prompt
What happens to the original `&mut T` when a sub-function reborrows `&mut *r`?

# Options
- [x] A) The original mutable borrow is suspended while active
- [ ] B) Both references can write concurrently in same thread
- [ ] C) Reborrowing consumes and invalidates original binding
- [ ] D) The operation creates a shared pointer on stack frame

# Hint
Reborrowing temporarily pauses the parent mutable borrow.

# Explanation
Reborrowing a mutable reference creates a temporary child borrow. The parent borrow cannot be used until the child borrow expires.
