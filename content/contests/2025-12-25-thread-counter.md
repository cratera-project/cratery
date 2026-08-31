---
id: 2025-12-25-thread-counter
title: "Thread-Safe Counter"
weekLabel: "Practice · Concurrency"
difficulty: 2
opensAt: "2025-12-25T00:00:00.000Z"
closesAt: "2026-01-01T00:00:00.000Z"
signature: "Counter - increment / decrement / add / get / reset"
supportedLanguages: [rust]
---

# Description
Implement a thread-safe counter that can be safely incremented and read from multiple threads simultaneously. This is a fundamental concurrent programming problem that requires understanding of Rust's concurrency primitives.

Your counter should:
1. Be safely shareable across multiple threads
2. Support atomic increment operations
3. Support atomic decrement operations
4. Support reading the current value
5. Support resetting the counter to zero
6. All operations must be thread-safe without data races

This problem demonstrates understanding of Arc, Mutex, and thread synchronization in Rust.

Constraints:
- Use only the Rust standard library (no external crates)
- No `unsafe` code allowed
- Must be safe to use across multiple threads
- All operations must be atomic (no race conditions)
- The counter value is stored as `i64`
- Must properly handle potential overflow/underflow

You may only edit the code below. Hit Run to compile and test against the judge, then Submit to verify.

# Examples

### Example 1
**Input:**
```rust
let counter = Counter::new();
counter.increment();
counter.increment();
counter.decrement();
counter.get()
```
**Output:**
```
1
```
**Explanation:** Basic atomic counter operations.

### Example 2
**Input:**
```rust
let counter = Counter::new();
counter.add(10);
counter.add(-5);
counter.get()
```
**Output:**
```
5
```
**Explanation:** add accepts both positive and negative offsets.

# Starter Code
```rust
use std::sync::{Arc, Mutex};

#[derive(Clone)]
pub struct Counter {
    value: Arc<Mutex<i64>>,
}

impl Counter {
    /// Create a new counter initialized to 0.
    pub fn new() -> Self {
        Self { value: Arc::new(Mutex::new(0)) }
    }

    /// Increment the counter by 1.
    pub fn increment(&self) {

    }

    /// Decrement the counter by 1.
    pub fn decrement(&self) {

    }

    /// Add a value to the counter (can be negative).
    pub fn add(&self, value: i64) {
        let _ = value;
    }

    /// Get the current counter value.
    pub fn get(&self) -> i64 {
        0
    }

    /// Reset the counter to 0.
    pub fn reset(&self) {

    }
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    // test_basic_operations
    {
        let counter = Counter::new();

        assert_eq!(counter.get(), 0);

        counter.increment();
        assert_eq!(counter.get(), 1);

        counter.increment();
        assert_eq!(counter.get(), 2);

        counter.decrement();
        assert_eq!(counter.get(), 1);
    }

    // test_add_operation
    {
        let counter = Counter::new();

        counter.add(10);
        assert_eq!(counter.get(), 10);

        counter.add(-5);
        assert_eq!(counter.get(), 5);

        counter.add(0);
        assert_eq!(counter.get(), 5);
    }

    // test_reset
    {
        let counter = Counter::new();

        counter.add(100);
        assert_eq!(counter.get(), 100);

        counter.reset();
        assert_eq!(counter.get(), 0);
    }

    // test_clone_shares_state
    {
        let counter1 = Counter::new();
        let counter2 = counter1.clone();

        counter1.increment();
        assert_eq!(counter2.get(), 1);

        counter2.add(5);
        assert_eq!(counter1.get(), 6);
    }

    // test_multithreaded_increment
    {
        use std::thread;

        let counter = Counter::new();
        let mut handles = vec![];

        // Spawn 10 threads, each incrementing 100 times
        for _ in 0..10 {
            let counter_clone = counter.clone();
            let handle = thread::spawn(move || {
                for _ in 0..100 {
                    counter_clone.increment();
                }
            });
            handles.push(handle);
        }

        // Wait for all threads
        for handle in handles {
            handle.join().unwrap();
        }

        // Should be exactly 1000
        assert_eq!(counter.get(), 1000);
    }

    // test_multithreaded_mixed_operations
    {
        use std::thread;

        let counter = Counter::new();
        let mut handles = vec![];

        // 5 threads incrementing
        for _ in 0..5 {
            let counter_clone = counter.clone();
            let handle = thread::spawn(move || {
                for _ in 0..50 {
                    counter_clone.increment();
                }
            });
            handles.push(handle);
        }

        // 3 threads decrementing
        for _ in 0..3 {
            let counter_clone = counter.clone();
            let handle = thread::spawn(move || {
                for _ in 0..50 {
                    counter_clone.decrement();
                }
            });
            handles.push(handle);
        }

        for handle in handles {
            handle.join().unwrap();
        }

        // Should be 5*50 - 3*50 = 100
        assert_eq!(counter.get(), 100);
    }

    // test_multithreaded_add
    {
        use std::thread;

        let counter = Counter::new();
        let mut handles = vec![];

        for i in 1..=10 {
            let counter_clone = counter.clone();
            let handle = thread::spawn(move || {
                counter_clone.add(i);
            });
            handles.push(handle);
        }

        for handle in handles {
            handle.join().unwrap();
        }

        // Sum of 1 to 10 = 55
        assert_eq!(counter.get(), 55);
    }

    // test_negative_values
    {
        let counter = Counter::new();

        counter.decrement();
        assert_eq!(counter.get(), -1);

        counter.add(-10);
        assert_eq!(counter.get(), -11);

        counter.increment();
        assert_eq!(counter.get(), -10);
    }

    println!("all tests passed");
}
```
