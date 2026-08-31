---
id: own-supporter-1
categorySlug: ownership
title: "ManuallyDrop Destructure"
difficulty: 3
tags: [ownership, manually-drop, memory]
---

# Prompt
What happens to the heap allocation when `ManuallyDrop::new` drops?

# Code
```rust
use std::mem::ManuallyDrop;
fn main() {
    let s = ManuallyDrop::new(String::from("rust"));
    let _ = s;
}
```

# Options
- [x] A) The String buffer is leaked without dropping memory
- [ ] B) The String destructor runs normally at scope exit
- [ ] C) The compiler moves the String into static storage
- [ ] D) ManuallyDrop panics if inner value is not taken

# Hint
ManuallyDrop suppresses the automatic drop glue for the wrapped value.

# Explanation
`ManuallyDrop<T>` inhibits the compiler from running the destructor of `T`. When `s` goes out of scope, its memory buffer is not freed unless `ManuallyDrop::drop(&mut s)` is called explicitly with `unsafe`.
