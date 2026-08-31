---
id: closure-fnonce-1
categorySlug: iterators-closures
title: "FnOnce Consumption"
difficulty: 2
tags: [closures, fnonce]
---

# Prompt
Why can this closure implement only `FnOnce`?

# Code
```rust
fn consume<F: FnOnce()>(f: F) {
    f();
}

fn main() {
    let s = String::from("hi");
    consume(|| drop(s));
}
```

# Options
- [ ] A) All closures that print text are limited to `FnOnce`
- [x] B) `drop(s)` moves `s`, so the closure can run only once
- [ ] C) `FnOnce` means the closure captures nothing at all
- [ ] D) `String` captures always require `FnMut`, never `FnOnce`

# Hint
Moved captures cannot be used on a second call.

# Explanation
Calling the closure moves `s` into `drop`. A second call would have nothing left to move, so the closure is `FnOnce` only, not `FnMut`/`Fn`. Closures that only borrow can be called repeatedly.
