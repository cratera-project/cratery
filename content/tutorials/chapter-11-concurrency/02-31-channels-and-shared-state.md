---
id: 31-channels-and-shared-state
chapterId: concurrency
chapterNumber: 11
lessonNumber: 2
title: "Message Channels & `Arc<Mutex<T>>`"
tagline: "\"Do not communicate by sharing memory; instead, share memory by communicating.\""
readTimeMinutes: 8
difficulty: advanced
tags: [mpsc, mutex, arc, send, sync]
---

# Overview
Rust supports both major concurrency paradigms: **Message Passing** (via multi-producer, single-consumer channels `mpsc`) and **Shared State Concurrency** (via `Arc<Mutex<T>>`). The `Send` and `Sync` traits automatically enforce thread safety at compile time.

# Sections

## Message Passing Channels (`mpsc`)
To create a channel, use `std::sync::mpsc::channel()`. It returns a `(Sender, Receiver)` tuple:

```rust caption="Passing data across threads via mpsc channels."
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let val = String::from("cratery quest");
        tx.send(val).unwrap(); // Ownership of 'val' is sent over the channel!
    });

    let received = rx.recv().unwrap();
    println!("Got: {}", received);
}
```

## Shared State Concurrency (`Arc<Mutex<T>>`)
A **Mutex** (mutual exclusion) allows only one thread to access data at any given time. Calling `.lock()` blocks until the lock is acquired and returns a `MutexGuard` RAII lock that automatically releases when dropped:

```rust caption="Coordinating 10 concurrent threads modifying a shared Mutex."
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter_clone = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = counter_clone.lock().unwrap();
            *num += 1; // MutexGuard automatically unlocks upon going out of scope!
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Result: {}", *counter.lock().unwrap()); // 10
}
```

## The `Send` and `Sync` Marker Traits
- **`Send`**: Indicates that ownership of the type can be transferred across thread boundaries.
- **`Sync`**: Indicates that it is safe for multiple threads to access the type concurrently via shared references (`&T` is `Send`).

Almost all primitive types in Rust are `Send` and `Sync`. Types with non-thread-safe interior mutability (like `Rc` and `RefCell`) are not `Send`/`Sync`, preventing race conditions at compile time!

```rust caption="Compile-time fearless concurrency markers."
// The compiler automatically implements Send and Sync for types composed of Send and Sync fields.
```

# Common Mistakes

### Trying to use `Mutex` with `Rc` instead of `Arc` across threads
**Bad:**
```rust
let lock = std::rc::Rc::new(std::sync::Mutex::new(0));
std::thread::spawn(move || { ... }); // Error: `Rc` cannot be sent between threads safely
```
**Explanation:** `Rc` is not `Send`. You must pair `Mutex` with `Arc` for multi-threaded sharing.

**Good:**
```rust
let lock = std::sync::Arc::new(std::sync::Mutex::new(0));
```
**Explanation:** Use `Arc<Mutex<T>>` for multi-threaded shared mutable state.

# Key Takeaways
- `mpsc::channel()` enables message passing without shared locks.
- `Arc<Mutex<T>>` provides thread-safe shared mutable state with RAII lock release.
- `Send` and `Sync` marker traits enforce concurrency safety at compile time.

# Quests

## Quest: tut-31-concurrent-work-queue
**Type:** coding
**Title:** Concurrent Worker Channel Dispatcher
**Prompt:** Implement `distribute_and_sum(tasks: Vec<i32>) -> i32`. Create an `mpsc::channel()`. For each task in `tasks`, clone the sender `tx` and spawn a thread that computes `task * 2` and sends the result through `tx`. Explicitly drop the original `tx` so the receiver closes, then accumulate and return the sum of all received messages from `rx`.
**Signature:** `pub fn distribute_and_sum(tasks: Vec<i32>) -> i32`

### Starter Code
```rust
use std::sync::mpsc;
use std::thread;

pub fn distribute_and_sum(tasks: Vec<i32>) -> i32 {
    // TODO: Spawn worker threads for each task and collect results via channel
    todo!()
}
```

### Test Harness
```rust
{{SOLUTION}}

fn main() {
    let result = distribute_and_sum(vec![1, 2, 3, 4, 5]);
    assert_eq!(result, 30); // (1+2+3+4+5) * 2 = 15 * 2 = 30

    assert_eq!(distribute_and_sum(vec![]), 0);
    assert_eq!(distribute_and_sum(vec![10]), 20);
    println!("all tests passed");
}
```

### Solution
```rust
use std::sync::mpsc;
use std::thread;

pub fn distribute_and_sum(tasks: Vec<i32>) -> i32 {
    let (tx, rx) = mpsc::channel();

    for task in tasks {
        let tx_clone = tx.clone();
        thread::spawn(move || {
            tx_clone.send(task * 2).unwrap();
        });
    }

    // Drop original sender so receiver knows when all threads finished
    drop(tx);

    let mut sum = 0;
    for result in rx {
        sum += result;
    }
    sum
}
```

### Walkthrough
Each spawned thread calculates `task * 2` and sends it down the channel. Dropping the initial `tx` ensures that when all worker threads drop their `tx_clone` handles, the `rx` iterator terminates cleanly.

### Hints
- Clone `let tx_clone = tx.clone();` for each thread.
- Drop `drop(tx);` before reading `for val in rx { sum += val; }`.

## Quest: tut-31-quiz-send-sync
**Type:** quiz
**Title:** Concept Check: The `Sync` Trait
**Prompt:** What does it mean for a type `T` to implement the `Sync` marker trait in Rust?

### Options
- [ ] A) Values of type `T` can only be used on the main thread.
- [x] B) It is safe for multiple threads to access `&T` (an immutable reference to T) concurrently.
- [ ] C) Type `T` automatically synchronizes with remote databases.
- [ ] D) Type `T` is serialized to JSON before sending.

**Hint:** Remember: Sync means shared references (&T) are safe across threads.

**Explanation:** `T` is `Sync` if and only if `&T` is `Send`, meaning immutable references to `T` can be safely passed to and accessed by multiple concurrent threads without data races.
