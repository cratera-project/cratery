---
id: 34-unsafe-and-raw-pointers
chapterId: unsafe-rust
chapterNumber: 13
lessonNumber: 34
title: "Unsafe Rust & Raw Pointers"
tagline: "Working with `*const T` and `*mut T` when you need absolute control over memory."
readTimeMinutes: 7
difficulty: advanced
tags: [unsafe, raw-pointers, memory, pointers]
---

# Overview
Unsafe Rust grants five superpowers: dereferencing raw pointers, calling unsafe functions, implementing unsafe traits, mutating static variables, and accessing fields of unions. Unsafe does not disable the borrow checker, but allows you to uphold invariants manually.

# Sections

## Creating and Dereferencing Raw Pointers
Raw pointers (`*const T` and `*mut T`) can be created in safe code without restrictions. However, **dereferencing** them requires an `unsafe` block because the compiler cannot guarantee valid memory or absence of data races.

```rust caption="Creating raw pointers in safe code and dereferencing them in unsafe blocks."
fn main() {
    let mut num = 42;

    // Creating raw pointers is completely SAFE
    let r1 = &num as *const i32;
    let r2 = &mut num as *mut i32;

    // Dereferencing raw pointers requires UNSAFE
    unsafe {
        println!("r1 points to: {}", *r1);
        *r2 = 99;
        println!("r2 updated value to: {}", *r2);
    }
}
```

## Unsafe Functions & Safe Abstractions
An `unsafe fn` signals to callers that they must uphold specific contracts (e.g. non-null, valid alignment, bounds) to prevent Undefined Behavior (UB). Safe abstractions wrap unsafe internals with safe public interfaces (like `Vec` or `String`).

```rust caption="Building safe abstractions around unsafe pointer manipulation."
use std::slice;

// Safe wrapper around unsafe pointer indexing
pub fn custom_split_at_mut(values: &mut [i32], mid: usize) -> (&mut [i32], &mut [i32]) {
    let len = values.len();
    let ptr = values.as_mut_ptr();
    assert!(mid <= len);

    unsafe {
        (
            slice::from_raw_parts_mut(ptr, mid),
            slice::from_raw_parts_mut(ptr.add(mid), len - mid),
        )
    }
}
```

# Common Mistakes

### Creating Aliased Mutable References
**Bad:**
```rust
let mut val = 10;
let p = &mut val as *mut i32;
unsafe {
    let r1 = &mut *p;
    let r2 = &mut *p; // UB: Two active mutable references to the same memory!
    *r1 += 1;
    *r2 += 1;
}
```
**Explanation:** Creating two active `&mut` references to the same memory location triggers instant Undefined Behavior (UB) under the Stacked Borrows / Tree Borrows model.

**Good:**
```rust
let mut val = 10;
let p = &mut val as *mut i32;
unsafe {
    // Modify through raw pointer arithmetic directly without aliasing &mut references
    *p += 1;
    *p += 1;
}
```
**Explanation:** Manipulate memory via raw pointers directly without creating illegal overlapping mutable references.

# Key Takeaways
- Raw pointers (*const T, *mut T) ignore borrowing rules, can be null, and lack automatic cleanup.
- Dereferencing raw pointers requires an unsafe block.
- The idiomatic Rust pattern is wrapping unsafe operations inside airtight safe APIs.
