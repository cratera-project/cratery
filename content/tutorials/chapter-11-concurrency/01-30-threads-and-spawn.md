---
id: 30-threads-and-spawn
chapterId: concurrency
chapterNumber: 11
lessonNumber: 1
title: "Spawning Threads & `move` Closures"
tagline: "Creating operating system threads and joining their results safely."
readTimeMinutes: 7
difficulty: advanced
tags: [threads, spawn, join, concurrency]
---

# Overview
Rust offers 1:1 operating system threads via `std::thread`. The type system and borrow checker guarantee that data races and concurrency errors are caught at compile time.

# Sections

## Spawning Threads with `thread::spawn`
Call `thread::spawn` to start a new thread. Use `handle.join().unwrap()` to wait for the spawned thread to finish and retrieve its returned value:

```rust caption="Spawning and joining threads in Rust."
use std::thread;
use std::time::Duration;

fn main() {
    let handle = thread::spawn(|| {
        for i in 1..5 {
            println!("Thread counter: {}", i);
            thread::sleep(Duration::from_millis(1));
        }
        42 // thread return value
    });

    let result = handle.join().unwrap();
    println!("Spawned thread finished with result: {}", result);
}
```

## Using `move` Closures with Threads
Because the spawned thread could outlive the function that created it, the compiler forces closures passed to `thread::spawn` to take ownership of captured variables with `move`:

```rust caption="Transferring ownership to spawned threads with move."
use std::thread;

fn main() {
    let v = vec![1, 2, 3];

    // 'move' transfers ownership of 'v' into the thread
    let handle = thread::spawn(move || {
        println!("Here's a vector: {:?}", v);
    });

    handle.join().unwrap();
}
```

# Common Mistakes

### Attempting to borrow a stack variable into a spawned thread without `move`
**Bad:**
```rust
let v = vec![1, 2, 3];
thread::spawn(|| {
    println!("{:?}", v); // Error: closure may outlive the current function, but it borrows `v`
});
```
**Explanation:** The main thread might return and deallocate `v` while the spawned thread is still running.

**Good:**
```rust
let v = vec![1, 2, 3];
thread::spawn(move || {
    println!("{:?}", v);
});
```
**Explanation:** Use `move` to transfer ownership of `v` safely into the spawned thread.

# Key Takeaways
- `thread::spawn` creates a native OS thread.
- Calling `join()` waits for a thread to complete and catches any thread panics.
- Threads require `move` closures to ensure captured data lives for the thread's full lifetime.

# Quests

## Quest: tut-30-parallel-sum
**Type:** coding
**Title:** Parallel Chunk Sum with Threads
**Prompt:** Implement `parallel_chunk_sum(first_half: Vec<i64>, second_half: Vec<i64>) -> i64`. Spawn a new thread with `std::thread::spawn` to sum `first_half`. Compute the sum of `second_half` on the current thread. Then `join()` the spawned thread and return the total sum of both halves.
**Signature:** `pub fn parallel_chunk_sum(first_half: Vec<i64>, second_half: Vec<i64>) -> i64`

### Starter Code
```rust
use std::thread;

pub fn parallel_chunk_sum(first_half: Vec<i64>, second_half: Vec<i64>) -> i64 {
    // TODO: Spawn a thread for first_half, compute second_half, join, and return total
    todo!()
}
```

### Test Harness
```rust
{{SOLUTION}}

fn main() {
    let sum = parallel_chunk_sum(vec![1, 2, 3], vec![4, 5, 6]);
    assert_eq!(sum, 21);

    let empty_sum = parallel_chunk_sum(vec![], vec![100]);
    assert_eq!(empty_sum, 100);
    println!("all tests passed");
}
```

### Solution
```rust
use std::thread;

pub fn parallel_chunk_sum(first_half: Vec<i64>, second_half: Vec<i64>) -> i64 {
    let handle = thread::spawn(move || {
        first_half.into_iter().sum::<i64>()
    });

    let sum2: i64 = second_half.into_iter().sum();
    let sum1 = handle.join().unwrap();
    sum1 + sum2
}
```

### Walkthrough
`thread::spawn(move || ...)` transfers ownership of `first_half` to the background thread. We compute `sum2` on the main thread and add `handle.join().unwrap()` to get the total.

### Hints
- `let handle = thread::spawn(move || first_half.into_iter().sum::<i64>());`

## Quest: tut-30-quiz-thread-move
**Type:** quiz
**Title:** Concept Check: Why is `move` needed on `thread::spawn` closures?
**Prompt:** Why does the Rust compiler require `move` closures when capturing local variables in `thread::spawn`?

### Options
- [ ] A) Because closures cannot read data without moving.
- [x] B) Because the spawned thread might outlive the creating function's stack frame, which would leave borrowed references pointing to deallocated memory.
- [ ] C) Because spawned threads run in a different process.
- [ ] D) Because move makes variables immutable.

**Hint:** Think about what happens if the main function returns before the thread finishes.

**Explanation:** Since threads run concurrently and independently, the main thread could finish and destroy its stack frame before the spawned thread finishes. Moving ownership guarantees the data remains valid as long as the thread is alive.
