---
id: life-code-filter-slices
categorySlug: lifetimes
title: "Filter Borrowed Slices"
difficulty: 2
tags: [lifetimes, coding]
kind: coding
---

# Prompt
Implement `filter_containing<'a>(slices: &[&'a str], needle: &str) -> Vec<&'a str>` returning only string slices that contain `needle`.

# Code
```rust
pub fn filter_containing<'a>(slices: &[&'a str], needle: &str) -> Vec<&'a str> {
    slices.iter().copied().filter(|s| s.contains(needle)).collect()
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let list = ["apple", "banana", "pineapple", "cherry"];
    let matches = filter_containing(&list, "apple");
    assert_eq!(matches, vec!["apple", "pineapple"]);
    println!("test passed");
}
```

# Explanation
Implement `filter_containing<'a>(slices: &[&'a str], needle: &str) -> Vec<&'a str>` returning only string slices that contain `needle`. Review the test cases to verify all assertions.
