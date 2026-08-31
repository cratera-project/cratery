---
id: conc-code-rwlock-read
categorySlug: concurrency
title: "Concurrent Read with RwLock"
difficulty: 2
tags: [concurrency, coding]
kind: coding
---

# Prompt
Implement `read_shared_map(map: &std::sync::RwLock<std::collections::HashMap<String, i32>>, key: &str) -> Option<i32>` acquiring a shared read lock.

# Code
```rust
use std::collections::HashMap;
use std::sync::RwLock;

pub fn read_shared_map(map: &RwLock<HashMap<String, i32>>, key: &str) -> Option<i32> {
    let reader = map.read().unwrap();
    reader.get(key).copied()
}
```

# Solution
```rust
use std::collections::HashMap;
use std::sync::RwLock;

pub fn read_shared_map(map: &RwLock<HashMap<String, i32>>, key: &str) -> Option<i32> {
    let reader = map.read().unwrap();
    reader.get(key).copied()
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let mut init = HashMap::new();
    init.insert(String::from("key1"), 42);
    let lock = RwLock::new(init);

    assert_eq!(read_shared_map(&lock, "key1"), Some(42));
    assert_eq!(read_shared_map(&lock, "key2"), None);
    println!("test passed");
}
```

# Explanation
Implement `read_shared_map(map: &std::sync::RwLock<std::collections::HashMap<String, i32>>, key: &str) -> Option<i32>` acquiring a shared read lock. Review the test cases to verify all assertions.
