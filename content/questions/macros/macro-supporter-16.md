---
id: macro-supporter-16
categorySlug: macros
title: "Block Fragment Specifier"
difficulty: 2
tags: [macros, block, syntax]
---

# Prompt
What does `$b:block` match in macro matchers?

# Code
```rust
macro_rules! timed {
    ($b:block) => {
        let start = std::time::Instant::now();
        $b
        println!("elapsed: {:?}", start.elapsed());
    };
}
```

# Options
- [ ] A) A continuous chunk of memory allocated on the heap in runtime memory
- [ ] B) A multithreaded blocking operation on a mutex lock in runtime memory
- [x] C) A sequence of statements enclosed in curly braces `{ ... }`
- [ ] D) A block comment starting with `/*` and ending with `*/` in code

# Hint
block matches a braced block of code { ... } as a single AST node.

# Explanation
`$b:block` matches a code block delimited by braces `{ ... }`, containing zero or more statements and an optional trailing expression.
