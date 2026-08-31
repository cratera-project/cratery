---
id: 29-refcell-interior-mutability
chapterId: smart-pointers
chapterNumber: 10
lessonNumber: 3
title: "Interior Mutability: `RefCell<T>` & `Cell<T>`"
tagline: "Mutating data through immutable references by shifting borrow checks to runtime."
readTimeMinutes: 8
difficulty: advanced
tags: [refcell, interior-mutability, borrow_mut, runtime-checks]
---

# Overview
**Interior mutability** is a design pattern in Rust that allows you to mutate data even when there are immutable references to that data. `RefCell<T>` represents single ownership of data and enforces the borrowing rules **at runtime instead of compile time**.

# Sections

## `RefCell<T>`: Runtime Borrow Checking
With `RefCell<T>`:
- `.borrow()` returns `Ref<T>` (shared borrow).
- `.borrow_mut()` returns `RefMut<T>` (mutable borrow).

If you violate borrowing rules at runtime (e.g., calling `borrow_mut()` while another `borrow()` is still active), `RefCell` **panics at runtime**:

```rust caption="Using RefCell for scoped interior mutation."
use std::cell::RefCell;

fn main() {
    let data = RefCell::new(5);

    {
        let mut mut_ref = data.borrow_mut();
        *mut_ref += 10;
    } // mut_ref drops here

    println!("Value: {}", data.borrow()); // 15
}
```

## Combining `Rc<RefCell<T>>` for Multiple Mutable Owners
A common Rust idiom for graph nodes and tree structures is combining `Rc` with `RefCell`: `Rc<RefCell<T>>` allows **multiple owners** (`Rc`) that can all **mutate the inner value** (`RefCell`).

```rust caption="Rc<RefCell<T>>: Shared mutable state in single-threaded code."
use std::rc::Rc;
use std::cell::RefCell;

fn main() {
    let shared_counter = Rc::new(RefCell::new(0));

    let c1 = Rc::clone(&shared_counter);
    let c2 = Rc::clone(&shared_counter);

    *c1.borrow_mut() += 1;
    *c2.borrow_mut() += 2;

    println!("Final count: {}", shared_counter.borrow()); // 3
}
```

# Common Mistakes

### Simultaneous `.borrow()` and `.borrow_mut()` causing runtime panic
**Bad:**
```rust
let cell = RefCell::new(10);
let r1 = cell.borrow();
let mut r2 = cell.borrow_mut(); // Runtime panic: AlreadyBorrowed!
```
**Explanation:** Borrowing mutably while an active immutable `Ref` exists triggers a panic at runtime.

**Good:**
```rust
let cell = RefCell::new(10);
{
    let r1 = cell.borrow();
    println!("{}", *r1);
} // r1 drops here
let mut r2 = cell.borrow_mut(); // OK!
```
**Explanation:** Ensure `Ref` scopes are dropped before acquiring a `RefMut`.

# Key Takeaways
- `RefCell<T>` moves borrow checking from compile time to runtime.
- Violating the single-mutable-or-multiple-immutable rule with `RefCell` causes a runtime `panic!`.
- Combine `Rc<RefCell<T>>` to achieve shared ownership with interior mutability.

# Quests

## Quest: tut-29-mock-logger
**Type:** coding
**Title:** Mock Logger using Interior Mutability
**Prompt:** Implement struct `MockLogger { pub messages: std::cell::RefCell<Vec<String>> }`. Implement `new() -> Self`, `log(&self, msg: &str)` (appends `msg.to_string()` into `messages` via `borrow_mut`), and `count(&self) -> usize` (returns count of messages via `borrow`). Note that `log` takes `&self` immutably!
**Signature:** `pub struct MockLogger ... impl MockLogger ...`

### Starter Code
```rust
use std::cell::RefCell;

pub struct MockLogger {
    pub messages: RefCell<Vec<String>>,
}

impl MockLogger {
    pub fn new() -> Self {
        todo!()
    }

    pub fn log(&self, msg: &str) {
        // TODO: Mutate inner messages through &self
        todo!()
    }

    pub fn count(&self) -> usize {
        // TODO: Return count of logged messages
        todo!()
    }
}
```

### Test Harness
```rust
{{SOLUTION}}

fn main() {
    let logger = MockLogger::new();
    logger.log("booting engine");
    logger.log("ready");

    assert_eq!(logger.count(), 2);
    assert_eq!(logger.messages.borrow()[0], "booting engine");
    assert_eq!(logger.messages.borrow()[1], "ready");
    println!("all tests passed");
}
```

### Solution
```rust
use std::cell::RefCell;

pub struct MockLogger {
    pub messages: RefCell<Vec<String>>,
}

impl MockLogger {
    pub fn new() -> Self {
        Self {
            messages: RefCell::new(Vec::new()),
        }
    }

    pub fn log(&self, msg: &str) {
        self.messages.borrow_mut().push(msg.to_string());
    }

    pub fn count(&self) -> usize {
        self.messages.borrow().len()
    }
}
```

### Walkthrough
`MockLogger` exposes an immutable `&self` interface while using `RefCell` internally to dynamically acquire mutable borrows and mutate its message vector.

### Hints
- In `log(&self, msg: &str)`, write `self.messages.borrow_mut().push(msg.to_string());`.

## Quest: tut-29-quiz-refcell-panic
**Type:** quiz
**Title:** Concept Check: What happens when `RefCell` borrowing rules are broken?
**Prompt:** What happens at runtime if your program attempts to acquire a `.borrow_mut()` on a `RefCell` while a `.borrow()` is still held?

### Options
- [ ] A) The program halts with a compile-time error.
- [x] B) The calling thread panics with an `AlreadyBorrowed` runtime error.
- [ ] C) The thread sleeps indefinitely.
- [ ] D) The data is silently overwritten.

**Hint:** Remember that RefCell translates compile-time checks into runtime panics.

**Explanation:** `RefCell<T>` enforces Rust's borrowing rules dynamically at runtime. If the rules are broken, it immediately panics to protect against memory corruption and data races.
