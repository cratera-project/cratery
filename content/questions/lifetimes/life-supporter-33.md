---
id: life-supporter-33
categorySlug: lifetimes
title: "Lifetime Elision in async fn"
difficulty: 3
tags: [lifetimes, async, elision]
---

# Prompt
How are lifetimes in arguments captured by an async fn foo(&self)?

# Code
```rust
struct Service;
impl Service {
    async fn fetch(&self) -> String {
        String::from("data")
    }
}
```

# Options
- [ ] A) Cloned into the future so the future is 'static during runtime execution
- [ ] B) Erased into unsafe raw pointers at compiler level during runtime execution
- [ ] C) Deferred until the async executor thread is spawned in code
- [x] D) Captured by the returned Future which is bound to &self

# Hint
An async fn desugars to a function returning impl Future + '_ bound to arguments.

# Explanation
async fn fetch(&self) -> String desugars to fn fetch<'a>(&'a self) -> impl Future<Output = String> + 'a. The returned Future captures &'a self and cannot outlive self.
