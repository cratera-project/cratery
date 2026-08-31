---
id: 10-mutable-references
chapterId: ownership
chapterNumber: 3
lessonNumber: 3
title: "Mutable References (`&mut T`) & NLL"
tagline: "Exclusive modification, avoiding data races, and Non-Lexical Lifetimes."
readTimeMinutes: 8
difficulty: intermediate
tags: [&mut, borrow-checker, nll, data-race]
---

# Overview
Mutable references allow you to mutate borrowed data. However, Rust places a strict constraint on them: you can have only **one mutable reference to a particular piece of data in a particular scope**.

# Sections

## The Exclusivity of `&mut`
To create a mutable reference:
1. The original variable must be marked `mut`.
2. You create the reference with `&mut s`.
3. The function accepts `&mut String`.

This rule prevents **data races at compile time**. A data race occurs when two or more pointers access the same data concurrently and at least one is writing.

```rust caption="Passing exclusive mutable references."
fn modify(s: &mut String) {
    s.push_str(" rocks!");
}

fn main() {
    let mut s = String::from("Rust");
    modify(&mut s);
    println!("{}", s); // "Rust rocks!"
}
```

## Non-Lexical Lifetimes (NLL)
A reference's scope starts where it is introduced and continues through the **last time that reference is used**, not necessarily until the end of the curly brace `}`. This compiler capability is called Non-Lexical Lifetimes (NLL).

```rust caption="NLL allows mutable borrows after the last usage of immutable borrows."
let mut s = String::from("hello");

let r1 = &s; // immutable borrow
let r2 = &s; // immutable borrow
println!("{} and {}", r1, r2);
// r1 and r2 are NOT used after this line

let r3 = &mut s; // Valid! r1 and r2's scopes ended after the println!
r3.push_str(" world");
println!("{}", r3);
```

# Common Mistakes

### Simultaneous mutable and immutable borrow
**Bad:**
```rust
let mut s = String::from("hello");
let r1 = &s;
let r2 = &mut s; // Error: cannot borrow `s` as mutable because it is also borrowed as immutable
println!("{}, {}", r1, r2);
```
**Explanation:** `r1` is used in `println!`, so its lifetime overlaps with `r2`. Rust forbids reading through `r1` while `r2` has exclusive write access.

**Good:**
```rust
let mut s = String::from("hello");
let r1 = &s;
println!("{}", r1); // Last use of r1

let r2 = &mut s; // OK: r1 is no longer in use
r2.push_str(" world");
```
**Explanation:** Finish using the immutable reference before creating the mutable reference.

**Compiler Error:**
```
error[E0502]: cannot borrow `s` as mutable because it is also borrowed as immutable
 --> src/main.rs:3:14
  |
2 |     let r1 = &s;
  |              -- immutable borrow occurs here
3 |     let r2 = &mut s;
  |              ^^^^^^ mutable borrow occurs here
4 |     println!("{}, {}", r1, r2);
  |                        -- immutable borrow later used here
```

# Key Takeaways
- You can have only ONE mutable reference (`&mut T`) to a value at a time.
- You cannot have a mutable reference while any immutable references are still in active use.
- Non-Lexical Lifetimes (NLL) ends a reference's lifetime at its last line of usage.

# Quests

## Quest: tut-10-capitalize-in-place
**Type:** coding
**Title:** In-Place String Uppercaser
**Prompt:** Implement `make_uppercase(s: &mut String)` which modifies the borrowed string `s` in place so that all ASCII characters become uppercase.
**Signature:** `pub fn make_uppercase(s: &mut String)`

### Starter Code
```rust
pub fn make_uppercase(s: &mut String) {
    // TODO: Mutate s in place to make all ASCII chars uppercase
    todo!()
}
```

### Test Harness
```rust
{{SOLUTION}}

fn main() {
    let mut msg = String::from("hello cratery");
    make_uppercase(&mut msg);
    assert_eq!(msg, "HELLO CRATERY");

    let mut empty = String::new();
    make_uppercase(&mut empty);
    assert_eq!(empty, "");
    println!("all tests passed");
}
```

### Solution
```rust
pub fn make_uppercase(s: &mut String) {
    s.make_ascii_uppercase();
}
```

### Walkthrough
`make_ascii_uppercase()` takes `&mut self` and updates every ASCII byte in place without allocating a new string.

### Hints
- Use `s.make_ascii_uppercase()` which operates directly on `&mut String`.

## Quest: tut-10-quiz-data-race
**Type:** quiz
**Title:** Concept Check: What prevents data races in Rust?
**Prompt:** How does the Rust compiler guarantee at compile time that data races cannot occur in safe code?

### Options
- [ ] A) By putting global locks on every variable.
- [x] B) By enforcing that only one mutable reference OR multiple read-only references can exist at any given time.
- [ ] C) By pausing all threads during write operations.
- [ ] D) By running a background garbage collector thread.

**Hint:** Consider the borrow checker's exclusivity guarantee.

**Explanation:** Data races require simultaneous concurrent read/write or write/write access. By statically enforcing exclusive access for `&mut` at compile time, data races are made impossible in safe Rust.
