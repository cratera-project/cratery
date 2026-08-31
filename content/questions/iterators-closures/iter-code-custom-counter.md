---
id: iter-code-custom-counter
categorySlug: iterators-closures
title: "Custom Range Counter Iterator"
difficulty: 2
tags: [iterators-closures, coding]
kind: coding
---

# Prompt
Implement `Iterator` for `pub struct Counter { pub current: u32, pub end: u32 }` where `next(&mut self)` yields numbers from `current` up to (exclusive) `end`.

# Code
```rust
pub struct Counter {
    pub current: u32,
    pub end: u32,
}

impl Iterator for Counter {
    type Item = u32;

    fn next(&mut self) -> Option<Self::Item> {
        if self.current < self.end {
            let val = self.current;
            self.current += 1;
            Some(val)
        } else {
            None
        }
    }
}
```

# Solution
```rust
pub struct Counter {
    pub current: u32,
    pub end: u32,
}

impl Iterator for Counter {
    type Item = u32;

    fn next(&mut self) -> Option<Self::Item> {
        if self.current < self.end {
            let val = self.current;
            self.current += 1;
            Some(val)
        } else {
            None
        }
    }
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let mut c = Counter { current: 1, end: 4 };
    assert_eq!(c.next(), Some(1));
    assert_eq!(c.next(), Some(2));
    assert_eq!(c.next(), Some(3));
    assert_eq!(c.next(), None);
    println!("test passed");
}
```

# Explanation
Implement `Iterator` for `pub struct Counter { pub current: u32, pub end: u32 }` where `next(&mut self)` yields numbers from `current` up to (exclusive) `end`. Review the test cases to verify all assertions.
