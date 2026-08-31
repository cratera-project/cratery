---
id: point-code-box-leak
categorySlug: pointers
title: "Leak Box to Static Lifetime"
difficulty: 3
tags: [pointers, coding]
kind: coding
---

# Prompt
Implement `make_static_str(s: String) -> &'static str` using `Box::leak(s.into_boxed_str())`.

# Code
```rust
pub fn make_static_str(s: String) -> &'static str {
    Box::leak(s.into_boxed_str())
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let s = String::from("dynamic_config");
    let static_ref: &'static str = make_static_str(s);
    assert_eq!(static_ref, "dynamic_config");
    println!("test passed");
}
```

# Explanation
Implement `make_static_str(s: String) -> &'static str` using `Box::leak(s.into_boxed_str())`. Review the test cases to verify all assertions.
