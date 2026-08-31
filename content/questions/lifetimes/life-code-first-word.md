---
id: life-code-first-word
categorySlug: lifetimes
title: "First Word Slicer"
difficulty: 1
tags: [lifetimes, coding]
kind: coding
---

# Prompt
Implement `first_word(s: &str) -> &str` returning the first whitespace-delimited word in `s`, or the whole trimmed slice.

# Code
```rust
pub fn first_word(s: &str) -> &str {
    let trimmed = s.trim_start();
    trimmed.split_whitespace().next().unwrap_or("")
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    assert_eq!(first_word("hello world"), "hello");
    assert_eq!(first_word("   rustacean   "), "rustacean");
    assert_eq!(first_word(""), "");
    println!("test passed");
}
```

# Explanation
Implement `first_word(s: &str) -> &str` returning the first whitespace-delimited word in `s`, or the whole trimmed slice. Review the test cases to verify all assertions.
