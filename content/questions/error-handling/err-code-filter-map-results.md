---
id: err-code-filter-map-results
categorySlug: error-handling
title: "Filter Ok Values from Results"
difficulty: 1
tags: [error-handling, coding]
kind: coding
---

# Prompt
Implement `collect_successes<T, E>(results: Vec<Result<T, E>>) -> Vec<T>` collecting only the successful `Ok` values.

# Code
```rust
pub fn collect_successes<T, E>(results: Vec<Result<T, E>>) -> Vec<T> {
    results.into_iter().filter_map(|r| r.ok()).collect()
}
```

# Solution
```rust
pub fn collect_successes<T, E>(results: Vec<Result<T, E>>) -> Vec<T> {
    results.into_iter().filter_map(|r| r.ok()).collect()
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let items: Vec<Result<i32, &str>> = vec![Ok(1), Err("bad"), Ok(3), Err("fail"), Ok(5)];
    assert_eq!(collect_successes(items), vec![1, 3, 5]);
    println!("test passed");
}
```

# Explanation
Implement `collect_successes<T, E>(results: Vec<Result<T, E>>) -> Vec<T>` collecting only the successful `Ok` values. Review the test cases to verify all assertions.
