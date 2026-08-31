---
id: iter-supporter-11
categorySlug: iterators-closures
title: "FnOnce Cannot Be Called Twice"
difficulty: 2
tags: [iterators-closures, fn-once, ownership]
---

# Prompt
Why does calling an `FnOnce` closure a second time produce a compile-time error?

# Code
```rust
fn call_twice<F: FnOnce()>(f: F) {
    f();
    // f(); // compile error: use of moved value
}
```

# Options
- [ ] A) The closure destructor runs in a separate thread asynchronously in code
- [x] B) `FnOnce::call_once(self)` consumes the closure by value on invocation
- [ ] C) The compiler zero-fills the closure memory after first execution in code
- [ ] D) Calling closures more than once is restricted to unsafe code in runtime memory

# Hint
FnOnce takes self by value, consuming ownership of captured variables.

# Explanation
`FnOnce` defines `fn call_once(self, ...) -> Self::Output`. Because it takes `self` by value, the closure (and any owned resources it captured) is consumed on the first call and cannot be called again.
