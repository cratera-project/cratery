---
id: own-supporter-4
categorySlug: ownership
title: "Temporary Drop in Let Statement"
difficulty: 3
tags: [ownership, temporaries, drop]
---

# Prompt
When is the temporary `String::from("temp")` dropped?

# Code
```rust
fn main() {
    let _ref = &String::from("temp").len();
    println!("after let");
}
```

# Options
- [ ] A) At the end of the entire enclosing `main` block
- [ ] B) Immediately before the call to `.len()` starts
- [ ] C) During program termination inside static runtime
- [x] D) At the end of the `let` statement on that line

# Hint
Temporary lifetime extension only extends the value being directly borrowed.

# Explanation
Because `_ref` borrows the returned `usize` from `.len()`, the temporary `String` is not extended and is dropped at the end of the statement before `"after let"` prints.
