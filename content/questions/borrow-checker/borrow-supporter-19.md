---
id: borrow-supporter-19
categorySlug: borrow-checker
title: "Borrowing Across Await Points in Async Blocks"
difficulty: 3
tags: [borrow-checker, async, await-send]
---

# Prompt
Why does holding a `&mut` reference across an `.await` point affect the `Send` status of a Future?

# Code
```rust
async fn work(val: &mut i32) {
    *val += 1;
    // tokio::task::yield_now().await;
}
```

# Options
- [x] A) The reference is saved in the Future state machine; if not `Send`, the Future becomes `!Send`
- [ ] B) The async executor automatically drops all live references at yield under current compiler safety rules
- [ ] C) The compiler converts mutable references into thread-local mutexes under current compiler safety rules
- [ ] D) Holding references across await points is forbidden in safe Rust under current compiler safety rules

# Hint
Variables live across await points are stored as fields in the generated Future struct.

# Explanation
Any variable held across an `.await` point becomes a field in the compiler-generated `Future` generator struct. If that variable is not `Send` (like a `MutexGuard` or raw pointer), the entire `Future` becomes `!Send`.
