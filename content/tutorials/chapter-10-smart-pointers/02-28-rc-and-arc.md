---
id: 28-rc-and-arc
chapterId: smart-pointers
chapterNumber: 10
lessonNumber: 2
title: "Shared Ownership with `Rc<T>` & `Arc<T>`"
tagline: "Reference counted pointers for single-threaded and multi-threaded shared data."
readTimeMinutes: 8
difficulty: advanced
tags: [rc, arc, reference-counting, concurrency]
---

# Overview
In most cases in Rust, ownership is clear: each value has exactly one owner. However, in graph structures or shared caches, multiple parts of a program may need to own a value simultaneously. Rust provides reference counting smart pointers: `Rc<T>` (single-threaded) and `Arc<T>` (atomic, thread-safe).

# Sections

## `Rc<T>`: Reference Counting (Single-Threaded)
`Rc<T>` keeps track of the number of references to a value on the heap. Cloning an `Rc` with `Rc::clone(&ptr)` does **not** duplicate the underlying data; it only increments the reference count. When the count reaches 0, the data is dropped.

```rust caption="Shared read-only ownership using Rc<T>."
use std::rc::Rc;

fn main() {
    let shared_data = Rc::new(vec![1, 2, 3]);
    println!("Count after init: {}", Rc::strong_count(&shared_data)); // 1

    let owner_a = Rc::clone(&shared_data);
    let owner_b = Rc::clone(&shared_data);
    println!("Count with owners: {}", Rc::strong_count(&shared_data)); // 3
} // All 3 drop here; data is freed once count reaches 0!
```

## `Arc<T>`: Atomic Reference Counting (Thread-Safe)
`Rc<T>` is not safe to send across threads because incrementing its counter is not an atomic CPU operation. When sharing data across threads, use `Arc<T>` (Atomically Reference Counted):

```rust caption="Sharing data across threads safely using Arc<T>."
use std::sync::Arc;
use std::thread;

fn main() {
    let data = Arc::new(vec![10, 20, 30]);

    let data_clone = Arc::clone(&data);
    let handle = thread::spawn(move || {
        println!("Thread received data: {:?}", data_clone);
    });

    handle.join().unwrap();
}
```

# Common Mistakes

### Sending `Rc<T>` across thread boundaries
**Bad:**
```rust
use std::rc::Rc;
use std::thread;
let r = Rc::new(42);
thread::spawn(move || { println!("{}", r); }); // Error: `Rc<i32>` cannot be sent between threads safely
```
**Explanation:** `Rc` does not implement `Send` because its non-atomic counter causes data races in multi-threaded contexts.

**Good:**
```rust
use std::sync::Arc;
use std::thread;
let r = Arc::new(42);
thread::spawn(move || { println!("{}", r); }); // OK! Arc uses atomic operations
```
**Explanation:** Use `Arc<T>` whenever data or ownership crosses thread boundaries.

# Key Takeaways
- `Rc<T>` enables multiple owners for read-only data in single-threaded programs.
- `Rc::clone(&ptr)` increments reference count in O(1) time without deep memory copies.
- Use `Arc<T>` for multi-threaded reference counting (`Arc` is `Send + Sync` if `T` is).

# Quests

## Quest: tut-28-shared-graph-node
**Type:** coding
**Title:** Shared Graph Node with Rc
**Prompt:** Create a struct `GraphNode { pub value: i32, pub neighbors: Vec<std::rc::Rc<GraphNode>> }`. Implement `new(value: i32) -> Self` and `add_neighbor(&mut self, neighbor: &std::rc::Rc<GraphNode>)` which clones the `Rc` pointer and appends it to `neighbors`.
**Signature:** `pub struct GraphNode ... impl GraphNode ...`

### Starter Code
```rust
use std::rc::Rc;

pub struct GraphNode {
    pub value: i32,
    pub neighbors: Vec<Rc<GraphNode>>,
}

impl GraphNode {
    pub fn new(value: i32) -> Self {
        todo!()
    }

    pub fn add_neighbor(&mut self, neighbor: &Rc<GraphNode>) {
        // TODO: Clone neighbor Rc and push to self.neighbors
        todo!()
    }
}
```

### Test Harness
```rust
{{SOLUTION}}

fn main() {
    use std::rc::Rc;
    let target = Rc::new(GraphNode::new(99));
    
    let mut node1 = GraphNode::new(1);
    let mut node2 = GraphNode::new(2);

    node1.add_neighbor(&target);
    node2.add_neighbor(&target);

    assert_eq!(Rc::strong_count(&target), 3); // target + node1 + node2
    assert_eq!(node1.neighbors[0].value, 99);
    assert_eq!(node2.neighbors[0].value, 99);
    println!("all tests passed");
}
```

### Solution
```rust
use std::rc::Rc;

pub struct GraphNode {
    pub value: i32,
    pub neighbors: Vec<Rc<GraphNode>>,
}

impl GraphNode {
    pub fn new(value: i32) -> Self {
        Self {
            value,
            neighbors: Vec::new(),
        }
    }

    pub fn add_neighbor(&mut self, neighbor: &Rc<GraphNode>) {
        self.neighbors.push(Rc::clone(neighbor));
    }
}
```

### Walkthrough
`Rc::clone(neighbor)` duplicates the smart pointer handle to `target` in O(1) time without copying graph node data, sharing ownership cleanly.

### Hints
- Use `Rc::clone(neighbor)` in `add_neighbor`.

## Quest: tut-28-quiz-rc-vs-arc
**Type:** quiz
**Title:** Concept Check: Why not use `Arc<T>` everywhere?
**Prompt:** Why doesn't Rust simply use `Arc<T>` for everything instead of having both `Rc<T>` and `Arc<T>`?

### Options
- [ ] A) `Arc<T>` is limited to 100 maximum owners.
- [x] B) Atomic operations used by `Arc<T>` carry CPU cache synchronization performance overhead that is unnecessary in single-threaded code.
- [ ] C) `Arc<T>` does not support heap allocations.
- [ ] D) `Rc<T>` is an older deprecated legacy type.

**Hint:** Consider the CPU performance difference between atomic and non-atomic operations.

**Explanation:** Atomic memory operations used by `Arc` involve bus locking and CPU cache synchronization instructions, which are slower than the plain integer operations of `Rc`. Rust follows the zero-cost abstraction philosophy by providing `Rc` for single-threaded speed.
