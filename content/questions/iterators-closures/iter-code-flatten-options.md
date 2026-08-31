---
id: iter-code-flatten-options
categorySlug: iterators-closures
title: "Flatten Optional Values"
difficulty: 1
tags: [iterators-closures, coding]
kind: coding
---

# Prompt
Implement `flatten_options(opts: Vec<Option<i32>>) -> Vec<i32>` using iterator `.into_iter().flatten().collect()`.

# Code
```rust
pub fn flatten_options(opts: Vec<Option<i32>>) -> Vec<i32> {
    opts.into_iter().flatten().collect()
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let data = vec![Some(1), None, Some(3), None, Some(5)];
    assert_eq!(flatten_options(data), vec![1, 3, 5]);
    println!("test passed");
}
```

# Explanation
Implement `flatten_options(opts: Vec<Option<i32>>) -> Vec<i32>` using iterator `.into_iter().flatten().collect()`. Review the test cases to verify all assertions.
