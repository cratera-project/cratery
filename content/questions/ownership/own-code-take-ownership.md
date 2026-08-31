---
id: own-code-take-ownership
categorySlug: ownership
title: "Append Suffix in Place"
difficulty: 1
tags: [ownership, string, coding]
kind: coding
---

# Prompt
Implement `append_suffix` taking an owned `String` and a string slice `&str`, appending the suffix to the string in-place, and returning the updated `String`.

# Code
```rust
pub fn append_suffix(mut s: String, suffix: &str) -> String {
    // TODO: Append suffix and return s
    todo!()
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let s = String::from("Rust");
    let res = append_suffix(s, "acean");
    assert_eq!(res, "Rustacean");
    println!("all tests passed");
}
```

# Hint
Use s.push_str(suffix) on the mutable String.

# Explanation
Taking `mut s: String` by value allows in-place mutation without reallocating a new string if capacity allows, and returning it transfers ownership back to the caller.
