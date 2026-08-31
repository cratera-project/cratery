---
id: own-supporter-25
categorySlug: ownership
title: "move Keyword on Closures"
difficulty: 2
tags: [ownership, closures, move]
---

# Prompt
How does adding the `move` keyword alter closure variable captures?

# Code
```rust
fn main() {
    let s = String::from("data");
    let c = move || println!("{s}");
    c();
    // println!("{s}"); // error: use of moved value
}
```

# Options
- [x] A) Forces all captured variables to be moved by value
- [ ] B) Allows the closure to mutate immutable outer bindings
- [ ] C) Promotes closure stack frames to the global heap in code
- [ ] D) Converts closure invocations into background threads

# Hint
The move keyword forces ownership of referenced variables into the closure.

# Explanation
The `move` keyword forces a closure to take ownership of all referenced outer variables by value (moving non-`Copy` types and copying `Copy` types), even if the body only reads them.
