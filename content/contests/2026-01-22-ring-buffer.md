---
id: 2026-01-22-ring-buffer
title: "Ring Buffer with IntoIterator"
weekLabel: "Practice · Collections"
difficulty: 2
opensAt: "2026-01-22T00:00:00.000Z"
closesAt: "2026-01-29T00:00:00.000Z"
signature: "RingBuffer<T> - push / get / IntoIterator"
supportedLanguages: [rust]
---

# Description
Implement a custom ring buffer (circular buffer) collection that can store a fixed number of elements and supports iteration. When the buffer is full, adding new elements overwrites the oldest elements. The buffer should implement the `IntoIterator` trait to allow iteration over its elements.

Your ring buffer should:
1. Have a fixed capacity set at creation
2. Support pushing elements (overwrites oldest when full)
3. Support reading elements without consuming them
4. Implement IntoIterator to allow for-in loops
5. Provide an iterator that yields elements in insertion order
6. Track the current size and capacity

This problem tests understanding of custom collections, iterators, and the Iterator trait in Rust.

Constraints:
- Use only the Rust standard library (no external crates)
- No `unsafe` code allowed
- Capacity must be at least 1
- Elements are generic type `T`
- Must implement `IntoIterator` for the collection
- Iterator should yield elements in order from oldest to newest

You may only edit the code below. Hit Run to compile and test against the judge, then Submit to verify.

# Examples

### Example 1
**Input:**
```rust
new(3); push 1,2,3; get(0), get(1), get(2)
```
**Output:**
```
Some(&1), Some(&2), Some(&3)
```
**Explanation:** Logical index 0 is the oldest element.

### Example 2
**Input:**
```rust
new(3); push 1,2,3,4; into_iter collect
```
**Output:**
```
[2,3,4]
```
**Explanation:** When full, push overwrites the oldest element.

# Starter Code
```rust
pub struct RingBuffer<T> {
    buffer: Vec<Option<T>>,
    capacity: usize,
    head: usize,  // Next write position
    size: usize,  // Current number of elements
}

impl<T> RingBuffer<T> {
    /// Create a new ring buffer with the given capacity.
    pub fn new(capacity: usize) -> Self {
        Self {
            buffer: Vec::new(),
            capacity,
            head: 0,
            size: 0,
        }
    }

    /// Push an item into the buffer.
    /// Overwrites the oldest item if the buffer is full.
    pub fn push(&mut self, item: T) {
        let _ = item;
    }

    /// Get a reference to the element at the given logical index.
    /// Index 0 is the oldest element, len()-1 is the newest.
    pub fn get(&self, index: usize) -> Option<&T> {
        None
    }

    /// Returns the current number of elements.
    pub fn len(&self) -> usize {
        0
    }

    /// Returns the maximum capacity.
    pub fn capacity(&self) -> usize {
        self.capacity
    }

    /// Returns true if the buffer is at capacity.
    pub fn is_full(&self) -> bool {
        false
    }

    /// Returns true if the buffer is empty.
    pub fn is_empty(&self) -> bool {
        self.len() == 0
    }
}

/// Iterator for RingBuffer
pub struct RingBufferIter<T> {
    buffer: RingBuffer<T>,
    current: usize,
}

impl<T> Iterator for RingBufferIter<T> {
    type Item = T;

    fn next(&mut self) -> Option<Self::Item> {
        None
    }
}

impl<T> IntoIterator for RingBuffer<T> {
    type Item = T;
    type IntoIter = RingBufferIter<T>;

    fn into_iter(self) -> Self::IntoIter {
        RingBufferIter { buffer: self, current: 0 }
    }
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    // test_basic_push_and_get
    {
        let mut buffer = RingBuffer::new(3);

        buffer.push(1);
        buffer.push(2);
        buffer.push(3);

        assert_eq!(buffer.len(), 3);
        assert_eq!(buffer.get(0), Some(&1));
        assert_eq!(buffer.get(1), Some(&2));
        assert_eq!(buffer.get(2), Some(&3));
    }

    // test_overwrite_when_full
    {
        let mut buffer = RingBuffer::new(3);

        buffer.push(1);
        buffer.push(2);
        buffer.push(3);
        buffer.push(4); // Overwrites 1

        assert_eq!(buffer.len(), 3);
        assert_eq!(buffer.get(0), Some(&2));
        assert_eq!(buffer.get(1), Some(&3));
        assert_eq!(buffer.get(2), Some(&4));
    }

    // test_is_full
    {
        let mut buffer = RingBuffer::new(2);

        assert!(!buffer.is_full());

        buffer.push(1);
        assert!(!buffer.is_full());

        buffer.push(2);
        assert!(buffer.is_full());
    }

    // test_into_iterator
    {
        let mut buffer = RingBuffer::new(3);
        buffer.push(1);
        buffer.push(2);
        buffer.push(3);

        let collected: Vec<_> = buffer.into_iter().collect();
        assert_eq!(collected, vec![1, 2, 3]);
    }

    // test_iterator_with_overwrites
    {
        let mut buffer = RingBuffer::new(3);

        buffer.push(1);
        buffer.push(2);
        buffer.push(3);
        buffer.push(4);
        buffer.push(5);

        let collected: Vec<_> = buffer.into_iter().collect();
        assert_eq!(collected, vec![3, 4, 5]);
    }

    // test_capacity_one
    {
        let mut buffer = RingBuffer::new(1);

        buffer.push(1);
        assert_eq!(buffer.get(0), Some(&1));

        buffer.push(2);
        assert_eq!(buffer.get(0), Some(&2));
        assert_eq!(buffer.len(), 1);
    }

    // test_get_out_of_bounds
    {
        let mut buffer = RingBuffer::new(3);
        buffer.push(1);
        buffer.push(2);

        assert_eq!(buffer.get(2), None);
        assert_eq!(buffer.get(5), None);
    }

    // test_empty_buffer
    {
        let buffer: RingBuffer<i32> = RingBuffer::new(5);

        assert!(buffer.is_empty());
        assert!(!buffer.is_full());
        assert_eq!(buffer.len(), 0);
        assert_eq!(buffer.get(0), None);

        let collected: Vec<_> = buffer.into_iter().collect();
        assert_eq!(collected, Vec::<i32>::new());
    }

    println!("all tests passed");
}
```
