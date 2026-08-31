---
id: own-supporter-11
categorySlug: ownership
title: "Drop Order in If-Let Statement"
difficulty: 3
tags: [ownership, if-let, drop]
---

# Prompt
When is the temporary value dropped in `if let Some(_) = make_temp() { ... }`?

# Code
```rust
struct Logger(&'static str);
impl Drop for Logger {
    fn drop(&mut self) { println!("drop {}", self.0); }
}

fn make_temp() -> Option<Logger> { Some(Logger("guard")) }

fn main() {
    if let Some(_) = make_temp() {
        println!("inside body");
    }
    println!("after if-let");
}
```

# Options
- [ ] A) Drop guard prints, then inside body, then after if-let during execution
- [ ] B) Inside body prints, then after if-let, then drop guard
- [x] C) Inside body prints, then drop guard, then after if-let
- [ ] D) Drop guard is deferred until main function completes in code

# Hint
The scrutinee temporary lives until the end of the entire if-let block expression.

# Explanation
In `if let Some(_) = make_temp()`, the temporary `Option<Logger>` created as the scrutinee lives for the duration of the if-let expression. It is dropped after the block body finishes, before `"after if-let"`.
