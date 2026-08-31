---
id: own-supporter-10
categorySlug: ownership
title: "Box Move vs Box Clone"
difficulty: 2
tags: [ownership, box, move]
---

# Prompt
What happens in memory when `let b2 = b1;` executes for a `Box<[u8; 1024]>`?

# Code
```rust
fn main() {
    let b1 = Box::new([0u8; 1024]);
    let b2 = b1;
    println!("{}", b2[0]);
}
```

# Options
- [ ] A) 1024 bytes are allocated on heap for a second buffer during execution
- [x] B) Only the single pointer on stack is copied and moved
- [ ] C) 1024 bytes are copied onto the stack frame directly in code
- [ ] D) Both b1 and b2 become shared references to the heap in code

# Hint
Moving a Box only moves the stack-allocated pointer itself.

# Explanation
`Box<T>` is a pointer to heap memory. Moving `b1` into `b2` copies only the pointer metadata (usize) on the stack and invalidates `b1`. The 1024-byte heap allocation is untouched.
