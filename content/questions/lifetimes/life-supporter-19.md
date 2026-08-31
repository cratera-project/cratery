---
id: life-supporter-19
categorySlug: lifetimes
title: "Static Lifetime String Literals"
difficulty: 2
tags: [lifetimes, static, binary]
---

# Prompt
Where is the text bytes for 'hello world' stored in compiled binaries?

# Code
```rust
fn main() {
    let s: &'static str = "hello world";
    println!("{s}");
}
```

# Options
- [ ] A) In read-only data segment of the compiled binary
- [x] B) On the main thread stack frame during execution
- [ ] C) On the process heap during startup initialization
- [ ] D) Inside operating system page cache during runtime

# Hint
String literals are baked into the compiled executable read-only section.

# Explanation
String literals ('hello world') are embedded directly into the read-only data segment (.rodata) of the binary. They are valid for the entire execution of the program ('static).
