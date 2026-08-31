---
id: macro-code-vec-of-strings
categorySlug: macros
title: "String Vector Declarative Macro"
difficulty: 2
tags: [macros, coding]
kind: coding
---

# Prompt
Write a declarative macro `vec_of_strings!($($x:expr),*)` that takes comma-separated string literals and constructs a `Vec<String>`.

# Code
```rust
#[macro_export]
macro_rules! vec_of_strings {
    ($($x:expr),* $(,)?) => {
        vec![$($x.to_string()),*]
    };
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let v = vec_of_strings!["hello", "rust", "crab"];
    assert_eq!(v, vec![String::from("hello"), String::from("rust"), String::from("crab")]);
    let empty: Vec<String> = vec_of_strings![];
    assert!(empty.is_empty());
    println!("test passed");
}
```

# Explanation
Write a declarative macro `vec_of_strings!($($x:expr),*)` that takes comma-separated string literals and constructs a `Vec<String>`. Review the test cases to verify all assertions.
