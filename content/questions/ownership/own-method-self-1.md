---
id: own-method-self-1
categorySlug: ownership
title: "Method Receiver Types"
difficulty: 2
tags: [ownership, methods]
---

# Prompt
What happens to `p` after calling `consume`?

# Code
```rust
struct Point { x: i32, y: i32 }

impl Point {
    fn consume(self) {
        println!("({}, {})", self.x, self.y);
    }
}

fn main() {
    let p = Point { x: 0, y: 0 };
    p.consume();
    // use p here?
}
```

# Options
- [ ] A) `Point` is `Copy`, so `p` stays usable
- [ ] B) Methods always return `self` after they finish
- [ ] C) `self` only mutably borrows, leaving `p` valid
- [x] D) `self` takes ownership, so `p` is moved

# Hint
`self` vs `&self` vs `&mut self` differ.

# Explanation
A `self` receiver consumes the value. `Point` does not implement `Copy` here (no `#[derive(Copy)]`), so `p` is moved into `consume` and cannot be used afterward. Use `&self`/`&mut self` to borrow instead.
