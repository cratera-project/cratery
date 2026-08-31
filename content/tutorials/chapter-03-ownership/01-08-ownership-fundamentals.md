---
id: 08-ownership-fundamentals
chapterId: ownership
chapterNumber: 3
lessonNumber: 1
title: "Ownership Fundamentals: Move vs Copy & RAII"
tagline: "The three rules of ownership, stack vs heap, and automatic cleanup."
readTimeMinutes: 8
difficulty: beginner
tags: [ownership, move, copy, raii, drop]
---

# Overview
Ownership is Rust's most unique feature. It enables Rust to guarantee memory safety at compile time without requiring a garbage collector. Memory is automatically managed through a system of rules that the compiler checks at compile time.

# Sections

## The 3 Rules of Ownership
Memorize these three rules—they govern everything in Rust:
1. **Each value in Rust has an owner.**
2. **There can only be one owner at a time.**
3. **When the owner goes out of scope, the value is dropped (freed from memory).**

```rust caption="Automatic RAII memory deallocation at scope end."
{
    let s = String::from("hello"); // s comes into scope, heap allocated
    // use s
} // s goes out of scope here; Rust automatically calls `drop` and frees heap memory!
```

## Move Semantics vs `Copy` Types
Types stored entirely on the stack that implement the `Copy` trait (such as integers, floats, booleans, chars, and fixed arrays of Copy types) are copied bitwise.

Heap-allocated types (like `String` or `Vec`) do **not** implement `Copy`. When you assign `s1` to `s2`, Rust performs a **Move**: it copies the pointer, length, and capacity on the stack, and **invalidates `s1`** so that the heap buffer is not double-freed!

```rust caption="Move semantics prevents double-free memory bugs."
fn main() {
    // Copy type (integers on stack)
    let x = 5;
    let y = x; // x is still valid!
    println!("x={}, y={}", x, y);

    // Non-Copy type (String on heap)
    let s1 = String::from("cratery");
    let s2 = s1; // Ownership MOVES to s2. s1 is now invalid!
    
    // println!("{}", s1); // COMPILE ERROR: borrow of moved value: `s1`
    println!("s2 owns: {}", s2);
}
```

# Common Mistakes

### Using a variable after moving it
**Bad:**
```rust
let s1 = String::from("data");
let s2 = s1;
println!("{}", s1); // Error: value borrowed here after move
```
**Explanation:** When `s1` was assigned to `s2`, ownership moved to `s2`. `s1` is no longer valid.

**Good:**
```rust
let s1 = String::from("data");
let s2 = s1.clone(); // Explicit deep copy of heap buffer
println!("s1: {}, s2: {}", s1, s2);
```
**Explanation:** Use `.clone()` if you explicitly want a deep copy of the heap data, or pass references.

**Compiler Error:**
```
error[E0382]: borrow of moved value: `s1`
 --> src/main.rs:3:20
  |
1 |     let s1 = String::from("data");
  |         -- move occurs because `s1` has type `String`
2 |     let s2 = s1;
  |              -- value moved here
3 |     println!("{}", s1);
  |                    ^^ value borrowed here after move
```

# Key Takeaways
- Each value has exactly one owner; when the owner drops out of scope, its memory is freed.
- Assigning a heap type transfers (moves) ownership, invalidating the previous binding.
- Stack-only primitives implement `Copy` and duplicate automatically on assignment.

# Quests

## Quest: tut-08-ownership-transfer
**Type:** coding
**Title:** Safe String Transfer & Prefixing
**Prompt:** Implement `prefix_and_consume(mut name: String, prefix: &str) -> String` which takes ownership of `name`, inserts `prefix` at the beginning, and returns the modified `String`.
**Signature:** `pub fn prefix_and_consume(mut name: String, prefix: &str) -> String`

### Starter Code
```rust
pub fn prefix_and_consume(mut name: String, prefix: &str) -> String {
    // TODO: Insert prefix at index 0 and return owned name
    todo!()
}
```

### Test Harness
```rust
{{SOLUTION}}

fn main() {
    let s = String::from("Rust");
    let result = prefix_and_consume(s, "Hello, ");
    assert_eq!(result, "Hello, Rust");

    let empty = String::new();
    assert_eq!(prefix_and_consume(empty, "Cratery"), "Cratery");
    println!("all tests passed");
}
```

### Solution
```rust
pub fn prefix_and_consume(mut name: String, prefix: &str) -> String {
    name.insert_str(0, prefix);
    name
}
```

### Walkthrough
The function takes ownership of `name` by value, modifies its heap buffer with `.insert_str(0, prefix)`, and returns ownership back to the caller.

### Hints
- Use `name.insert_str(0, prefix)` or `format!("{}{}", prefix, name)`.

## Quest: tut-08-quiz-copy-trait
**Type:** quiz
**Title:** Concept Check: Types Implementing `Copy`
**Prompt:** Which of the following types implements the `Copy` trait in Rust?

### Options
- [ ] A) `String`
- [ ] B) `Vec<i32>`
- [x] C) `(i32, bool, char)`
- [ ] D) `Box<i32>`

**Hint:** Look for the type composed entirely of stack-allocated scalar primitives.

**Explanation:** A tuple implements `Copy` if and only if all of its constituent elements implement `Copy`. Because `i32`, `bool`, and `char` are stack-only `Copy` types, `(i32, bool, char)` implements `Copy`. Heap-owning types (`String`, `Vec`, `Box`) do not implement `Copy`.
