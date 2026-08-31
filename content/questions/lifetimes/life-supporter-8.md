---
id: life-supporter-8
categorySlug: lifetimes
title: "Anonymous Lifetime in Struct Pattern"
difficulty: 2
tags: [lifetimes, anonymous, syntax]
---

# Prompt
What does Reader<'_> signify in function signatures?

# Code
```rust
struct Reader<'a>(&'a [u8]);

fn process(_r: Reader<'_>) {
    // ...
}
```

# Options
- [ ] A) The struct contains only static reference variables in code
- [ ] B) The struct is allocated dynamically on the heap in code
- [x] C) The lifetime is inferred anonymously by the compiler
- [ ] D) The struct must not outlive the main function call in code

# Hint
The underscore _ acts as an anonymous elided lifetime parameter.

# Explanation
Reader<'_> asks the compiler to infer an anonymous lifetime for the parameter, following standard lifetime elision rules rather than requiring an explicit generic declaration <'a>.
