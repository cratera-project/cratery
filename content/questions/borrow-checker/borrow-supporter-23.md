---
id: borrow-supporter-23
categorySlug: borrow-checker
title: "Temporary Lifetime in Function Arguments"
difficulty: 2
tags: [borrow-checker, temporaries, function-calls]
---

# Prompt
When is a temporary created as a function argument dropped?

# Code
```rust
struct PrintOnDrop(&'static str);
impl Drop for PrintOnDrop {
    fn drop(&mut self) { print!("{}", self.0); }
}

fn inspect(_p: &PrintOnDrop) {}

fn main() {
    inspect(&PrintOnDrop("A"));
    print!("B");
}
```

# Options
- [x] A) At the end of the statement, printing "AB"
- [ ] B) At the end of the `main` block, printing "BA"
- [ ] C) Before `inspect` is called, printing "AB" in code
- [ ] D) During compiler dead-code elimination passes

# Hint
Temporaries passed by reference to functions are dropped at the end of the statement.

# Explanation
The temporary `PrintOnDrop("A")` is created for the statement `inspect(&PrintOnDrop("A"));` and dropped at the terminating semicolon, printing `"A"` before `"B"`.
