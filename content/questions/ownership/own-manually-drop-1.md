---
id: own-manually-drop-1
categorySlug: ownership
title: "ManuallyDrop Wrapper"
difficulty: 2
tags: [ownership, manually-drop]
---

# Prompt
What is the behavior of a `ManuallyDrop<T>` when it goes out of scope?

# Options
- [ ] A) The compiler will panic at runtime on scope exit
- [x] B) The inner destructor is inhibited and not executed
- [ ] C) The memory is bitwise zeroed out by the compiler
- [ ] D) The wrapped instance is cloned to stack memory

# Hint
ManuallyDrop tells the compiler not to call drop automatically.

# Explanation
`ManuallyDrop<T>` disables the automatic destructor call for `T` when the wrapper goes out of scope, leaving cleanup responsibility to the programmer.
