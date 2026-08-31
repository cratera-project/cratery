---
id: own-supporter-14
categorySlug: ownership
title: "Pass-by-Value vs Inherent Methods"
difficulty: 2
tags: [ownership, methods, self]
---

# Prompt
What happens when calling `fn consume(self)` on an uncopyable struct?

# Code
```rust
struct Buffer(Vec<u8>);

impl Buffer {
    fn consume(self) -> usize {
        self.0.len()
    }
}

fn main() {
    let buf = Buffer(vec![1, 2, 3]);
    let len = buf.consume();
    println!("{len}");
    // buf.consume(); // error
}
```

# Options
- [ ] A) Creates a deep copy of heap data and updates capacity pointers
- [x] B) Creates a shallow bitwise copy of stack bytes with no heap work
- [ ] C) Transfers ownership and resets the source struct memory to zero
- [ ] D) Allocates a new vector on the thread-local heap allocation pool

# Hint
Methods taking self by value take ownership of the receiver.

# Explanation
Methods taking `self` (by value) move the receiver out of the caller. Once `buf.consume()` completes, `buf` is consumed and can no longer be used.
