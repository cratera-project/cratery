---
id: 09-borrowing-and-references
chapterId: ownership
chapterNumber: 3
lessonNumber: 2
title: "References & Borrowing (`&T`)"
tagline: "Accessing data without taking ownership: shared references and borrowing."
readTimeMinutes: 7
difficulty: intermediate
tags: [borrowing, references, &, aliasing]
---

# Overview
Instead of passing ownership back and forth, Rust allows you to **borrow** access to data using **references** (`&T`). References let you refer to some value without taking ownership of it.

# Sections

## Shared References (`&T`)
An ampersand `&` represents a reference. When a function takes a reference `&String`, it borrows read-only access to the string. Because it does not own the string, the value is not dropped when the function returns.

```rust caption="Borrowing via immutable reference &."
fn calculate_length(s: &String) -> usize {
    s.len() // s is a reference to a String
} // Here, s goes out of scope, but because it does not have ownership, nothing happens.

fn main() {
    let s1 = String::from("cratery");
    let len = calculate_length(&s1); // pass reference
    println!("The length of '{}' is {}.", s1, len); // s1 is still valid!
}
```

# Common Mistakes

### Attempting to mutate behind a shared reference
**Bad:**
```rust
fn append_world(s: &String) {
    s.push_str(", world"); // Error: cannot borrow `*s` as mutable
}
```
**Explanation:** Shared references `&T` are immutable by default. You cannot mutate the data they point to.

**Good:**
```rust
fn append_world(s: &mut String) {
    s.push_str(", world");
}
```
**Explanation:** Use a mutable reference `&mut String` if you need to modify the data.

# Key Takeaways
- A reference `&T` lets you borrow access without taking ownership.
- You can have any number of shared (`&T`) references active simultaneously.
- Data cannot be mutated through a shared immutable reference.

# Quests

## Quest: tut-09-sum-borrowed-slice
**Type:** coding
**Title:** Sum of Vector without Consuming
**Prompt:** Implement `sum_elements(nums: &[i32]) -> i32` which computes and returns the sum of all elements in the borrowed slice `nums`.
**Signature:** `pub fn sum_elements(nums: &[i32]) -> i32`

### Starter Code
```rust
pub fn sum_elements(nums: &[i32]) -> i32 {
    // TODO: Sum elements in borrowed slice without taking ownership
    todo!()
}
```

### Test Harness
```rust
{{SOLUTION}}

fn main() {
    let numbers = vec![1, 2, 3, 4, 5];
    assert_eq!(sum_elements(&numbers), 15);
    assert_eq!(numbers.len(), 5); // vector is still owned and valid

    let empty: [i32; 0] = [];
    assert_eq!(sum_elements(&empty), 0);
    println!("all tests passed");
}
```

### Solution
```rust
pub fn sum_elements(nums: &[i32]) -> i32 {
    nums.iter().sum()
}
```

### Walkthrough
By accepting a borrowed slice `&[i32]`, the function reads the elements without taking ownership, allowing the caller to continue using the original vector.

### Hints
- Use `nums.iter().sum()` or a `for &n in nums` loop.

## Quest: tut-09-quiz-borrow-rule
**Type:** quiz
**Title:** Concept Check: The Aliasing XOR Mutation Rule
**Prompt:** Which of the following describes Rust's core reference rule?

### Options
- [ ] A) You can have any number of mutable references at the same time.
- [x] B) You may have either multiple shared references (&T) OR exactly one mutable reference (&mut T) at any given time.
- [ ] C) References can outlive the owner value.
- [ ] D) Immutable references can modify heap data but not stack data.

**Hint:** Think: "Many readers OR one writer".

**Explanation:** Rust enforces the Aliasing XOR Mutation rule: at any given time, you can have either one or more immutable references (&T) to a resource, OR exactly one mutable reference (&mut T), but never both simultaneously.
