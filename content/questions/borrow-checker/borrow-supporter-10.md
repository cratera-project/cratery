---
id: borrow-supporter-10
categorySlug: borrow-checker
title: "Temporary Lifetime in Match Scrutinee"
difficulty: 3
tags: [borrow-checker, temporaries, match]
---

# Prompt
How long does a temporary value created in a `match` expression scrutinee live?

# Code
```rust
struct Resource(&'static str);
impl Drop for Resource {
    fn drop(&mut self) { println!("drop"); }
}

fn main() {
    match Resource("data").0 {
        "data" => println!("matched"),
        _ => {},
    }
}
```

# Options
- [ ] A) Dropped immediately before entering any match arm body
- [ ] B) Extended to the end of the enclosing main function
- [ ] C) Promoted to static binary storage by the compiler
- [x] D) Until the end of the entire `match` expression

# Hint
Temporaries in the scrutinee of a match expression live for the entire match block.

# Explanation
The temporary `Resource("data")` created in the scrutinee of the `match` expression lives until the end of the entire `match` block. The drop runs after `"matched"` is printed.
