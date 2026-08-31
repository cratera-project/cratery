---
id: own-supporter-34
categorySlug: ownership
title: "Drop Guard in Panic Unwind"
difficulty: 2
tags: [ownership, panic, unwind]
---

# Prompt
Are local variable destructors guaranteed to run during normal panic unwinding?

# Code
```rust
struct CleanUp;
impl Drop for CleanUp {
    fn drop(&mut self) { println!("cleaned up"); }
}

fn risky() {
    let _guard = CleanUp;
    panic!("boom");
}
```

# Options
- [ ] A) No; panics abort execution immediately without dropping
- [x] B) Yes; stack unwinding drops locals in reverse order
- [ ] C) Only variables implementing the Copy trait are dropped
- [ ] D) Destructors run in parallel background worker threads

# Hint
Under the default panic=unwind strategy, Rust walks the stack and runs destructors.

# Explanation
When panic unwinding occurs (`panic = "unwind"`), Rust unwinds the stack frame by frame, running the destructors of all live local variables in reverse order of declaration.
