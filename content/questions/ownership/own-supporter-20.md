---
id: own-supporter-20
categorySlug: ownership
title: "Underscore Variable Drop Timing"
difficulty: 3
tags: [ownership, underscore, drop]
---

# Prompt
What is the difference between `let _ = guard;` and `let _guard = guard;`?

# Code
```rust
struct Guard;
impl Drop for Guard {
    fn drop(&mut self) { println!("dropped"); }
}

fn main() {
    let _ = Guard; // line A
    println!("middle");
    let _guard = Guard; // line B
    println!("end");
}
```

# Options
- [ ] A) Both drop immediately on their respective declaration lines in code
- [ ] B) Both are deferred and drop at the end of main function in code
- [ ] C) `_` drops at scope end; `_guard` drops immediately on line B
- [x] D) `_` drops immediately on line A; `_guard` drops at scope end

# Hint
A wildcard let _ = expr does not bind a variable and drops the value immediately.

# Explanation
`let _ = Guard` does not create a variable binding; the expression is evaluated and dropped immediately. In contrast, `let _guard = Guard` creates a named binding that lives until the end of the enclosing block.
