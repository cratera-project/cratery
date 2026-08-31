---
id: iter-supporter-8
categorySlug: iterators-closures
title: "FnMut Closure Mutation"
difficulty: 2
tags: [iterators-closures, fn-mut, closures]
---

# Prompt
Why does calling an `FnMut` closure require the closure variable to be declared `mut`?

# Code
```rust
fn main() {
    let mut count = 0;
    let mut inc = || { count += 1; count };
    assert_eq!(inc(), 1);
    assert_eq!(inc(), 2);
}
```

# Options
- [ ] A) Closures are allocated on the heap and require mutable write locks in runtime memory
- [ ] B) The compiler must allocate a new stack frame on each invocation in runtime memory
- [x] C) Invoking `FnMut::call_mut(&mut self)` requires an exclusive mutable reference
- [ ] D) Variables captured inside closures lose their type information in runtime memory

# Hint
FnMut is defined as fn call_mut(&mut self, ...) which needs a mutable binding.

# Explanation
`FnMut` defines `extern "rust-call" fn call_mut(&mut self, ...)`. Because the call takes `&mut self` to modify its captured environment, the binding `inc` must be declared with `let mut`.
