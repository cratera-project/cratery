---
id: macro-metavariable-1
categorySlug: macros
title: "Metavariable Expressions"
difficulty: 3
tags: [macros, pitfalls]
---

# Prompt
Why can `$e` be used twice safely in this expansion?

# Code
```rust
macro_rules! mul2 {
    ($e:expr) => {
        $e + $e
    };
}

fn main() {
    let mut n = 1;
    // careful: mul2!({ n += 1; n }) evaluates the block twice
    let _ = mul2!(n);
}
```

# Options
- [ ] A) Each `$e` use is automatically cached as a temporary
- [ ] B) `:expr` fragments are always pure and side-effect free
- [x] C) The matcher copies the tokens; each use re-evaluates
- [ ] D) The second `$e` is replaced by a moved value of the first

# Hint
Macros paste tokens; they do not CSE your expressions.

# Explanation
Substituting `$e` twice duplicates the expression tokens. Pure locals like `n` are fine; expressions with side effects run twice. Capture once in a `let` inside the macro if you need single evaluation.
