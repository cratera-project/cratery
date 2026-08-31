---
id: life-code-find-prefix
categorySlug: lifetimes
title: "Extract Prefix Before Delimiter"
difficulty: 1
tags: [lifetimes, coding]
kind: coding
---

# Prompt
Implement `extract_prefix<'a>(s: &'a str, delimiter: char) -> &'a str` that returns the slice before the delimiter, or the whole slice if the delimiter is not found.

# Code
```rust
pub fn extract_prefix<'a>(s: &'a str, delimiter: char) -> &'a str {
    match s.find(delimiter) {
        Some(pos) => &s[..pos],
        None => s,
    }
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    assert_eq!(extract_prefix("key=value", '='), "key");
    assert_eq!(extract_prefix("no_delimiter", '='), "no_delimiter");
    println!("test passed");
}
```

# Explanation
Implement `extract_prefix<'a>(s: &'a str, delimiter: char) -> &'a str` that returns the slice before the delimiter, or the whole slice if the delimiter is not found. Review the test cases to verify all assertions.
