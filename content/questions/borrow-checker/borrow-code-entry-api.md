---
id: borrow-code-entry-api
categorySlug: borrow-checker
title: "Word Frequency with Entry API"
difficulty: 2
tags: [borrow-checker, coding]
kind: coding
---

# Prompt
Implement `record_word` using `std::collections::HashMap`'s entry API to increment the count for `word` by 1 (inserting 1 if not present).

# Code
```rust
use std::collections::HashMap;

pub fn record_word(map: &mut HashMap<String, usize>, word: &str) {
    *map.entry(word.to_string()).or_insert(0) += 1;
}
```

# Solution
```rust
use std::collections::HashMap;

pub fn record_word(map: &mut HashMap<String, usize>, word: &str) {
    *map.entry(word.to_string()).or_insert(0) += 1;
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let mut counts = HashMap::new();
    record_word(&mut counts, "rust");
    record_word(&mut counts, "rust");
    record_word(&mut counts, "crab");
    assert_eq!(counts.get("rust"), Some(&2));
    assert_eq!(counts.get("crab"), Some(&1));
    println!("test passed");
}
```

# Explanation
Implement `record_word` using `std::collections::HashMap`'s entry API to increment the count for `word` by 1 (inserting 1 if not present). Review the test cases to verify all assertions.
