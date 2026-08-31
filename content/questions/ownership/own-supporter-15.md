---
id: own-supporter-15
categorySlug: ownership
title: "Box Leak Lifetime"
difficulty: 2
tags: [ownership, box, leak]
---

# Prompt
What is the lifetime of the reference returned by `Box::leak`?

# Code
```rust
fn main() {
    let s = Box::new(String::from("immortal"));
    let r: &'static mut String = Box::leak(s);
    r.push_str("!");
    println!("{r}");
}
```

# Options
- [ ] A) Tied to the lexical scope of the enclosing function in runtime memory
- [ ] B) An anonymous lifetime bounded by the thread runtime in runtime memory
- [x] C) 'static because the memory will never be freed automatically
- [ ] D) Invalid; Box::leak returns raw pointers instead of refs in code

# Hint
Box::leak deliberately gives up ownership of the heap memory.

# Explanation
`Box::leak` consumes the `Box` without running its destructor and yields a mutable reference with lifetime `'static` (`&'static mut T`), valid for the remaining duration of the program.
