---
id: borrow-supporter-2
categorySlug: borrow-checker
title: "Non-Lexical Lifetimes (NLL) Scope Ending"
difficulty: 2
tags: [borrow-checker, nll, lifetimes]
---

# Prompt
When does a borrow end under Non-Lexical Lifetimes (NLL)?

# Code
```rust
fn main() {
    let mut data = vec![1, 2, 3];
    let r = &data[0];
    println!("{r}");
    // r is no longer used after here
    data.push(4); // OK under NLL
}
```

# Options
- [ ] A) At the exact semicolon of the enclosing curly brace `{ ... }` under current compiler safety rules
- [ ] B) When the operating system context-switches the active thread under current compiler safety rules
- [ ] C) When all variables in the function frame are dropped during standard program runtime execution
- [x] D) At the point of its last use in control flow, rather than the enclosing lexical scope end

# Hint
NLL ends borrows at their last point of actual use.

# Explanation
Under NLL, a reference's lifetime ends at the point of its last actual use in the control flow graph, allowing mutations like `data.push(4)` even before the block scope closes.
