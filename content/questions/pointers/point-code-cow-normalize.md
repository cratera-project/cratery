---
id: point-code-cow-normalize
categorySlug: pointers
title: "Clone-On-Write Normalizer"
difficulty: 2
tags: [pointers, coding]
kind: coding
---

# Prompt
Implement `normalize_str<'a>(s: &'a str) -> std::borrow::Cow<'a, str>` returning borrowed slice if no spaces exist, or owned lowercase String if spaces exist.

# Code
```rust
use std::borrow::Cow;

pub fn normalize_str<'a>(s: &'a str) -> Cow<'a, str> {
    if s.contains(' ') {
        Cow::Owned(s.to_lowercase())
    } else {
        Cow::Borrowed(s)
    }
}
```

# Solution
```rust
use std::borrow::Cow;

pub fn normalize_str<'a>(s: &'a str) -> Cow<'a, str> {
    if s.contains(' ') {
        Cow::Owned(s.to_lowercase())
    } else {
        Cow::Borrowed(s)
    }
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let b = normalize_str("Rust");
    assert!(matches!(b, std::borrow::Cow::Borrowed("Rust")));

    let o = normalize_str("Hello World");
    assert!(matches!(o, std::borrow::Cow::Owned(ref s) if s == "hello world"));
    println!("test passed");
}
```

# Explanation
Implement `normalize_str<'a>(s: &'a str) -> std::borrow::Cow<'a, str>` returning borrowed slice if no spaces exist, or owned lowercase String if spaces exist. Review the test cases to verify all assertions.
