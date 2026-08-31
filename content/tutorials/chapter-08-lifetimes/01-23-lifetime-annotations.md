---
id: 23-lifetime-annotations
chapterId: lifetimes
chapterNumber: 8
lessonNumber: 1
title: "Lifetime Annotations in Functions (`'a`)"
tagline: "Describing the relationship between reference lifetimes to the compiler."
readTimeMinutes: 8
difficulty: advanced
tags: [lifetimes, 'a, borrow-checker, references]
---

# Overview
Every reference in Rust has a **lifetime**, which is the scope for which that reference is valid. Most of the time, lifetimes are implicit and inferred through elision rules. When multiple references could be returned, explicit generic lifetime annotations (`'a`) are required.

# Sections

## Why Lifetimes Exist
The primary aim of lifetimes is to **prevent dangling references**, which cause a program to reference data other than the data it intends to reference.

Lifetime annotations do **not** change how long any of the references live. Rather, they describe the relationship of the lifetimes of multiple references to each other so the borrow checker can verify safety.

```rust caption="Specifying lifetime parameter 'a connecting inputs to the output reference."
// We declare generic lifetime 'a between angle brackets
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

fn main() {
    let string1 = String::from("long string is long");
    {
        let string2 = String::from("xyz");
        let result = longest(string1.as_str(), string2.as_str());
        println!("The longest string is {}", result);
    }
}
```

## The 3 Lifetime Elision Rules
The compiler applies three rules automatically so you don't have to write explicit lifetimes on common functions:
1. **Rule 1**: Each parameter that is a reference gets its own lifetime parameter (`fn foo<'a, 'b>(x: &'a i32, y: &'b i32)`).
2. **Rule 2**: If there is exactly one input lifetime parameter, that lifetime is assigned to all output lifetime parameters (`fn foo<'a>(x: &'a i32) -> &'a i32`).
3. **Rule 3**: If there are multiple input lifetime parameters, but one of them is `&self` or `&mut self`, the lifetime of `self` is assigned to all output lifetime parameters.

```rust caption="Lifetime elision allows writing clean signatures without 'a when unambiguous."
// The compiler elides lifetimes here using Rule 2 automatically!
fn first_char(s: &str) -> &str {
    &s[0..1]
}
```

# Common Mistakes

### Returning a reference to a local variable created inside the function
**Bad:**
```rust
fn bad_function() -> &String {
    let s = String::from("hello");
    &s // Error: returns a reference to data owned by the current function
}
```
**Explanation:** `s` will be dropped and deallocated when `bad_function` finishes, making `&s` an illegal dangling reference.

**Good:**
```rust
fn good_function() -> String {
    let s = String::from("hello");
    s // Return the owned String by value!
}
```
**Explanation:** Return an owned value (`String`, `Vec`) rather than a reference if the data is created inside the function.

**Compiler Error:**
```
error[E0515]: cannot return reference to local variable `s`
 --> src/main.rs:3:5
  |
3 |     &s
  |     ^^ returns a reference to data owned by the current function
```

# Key Takeaways
- Lifetimes prevent dangling references at compile time with zero runtime cost.
- Lifetime annotations (`'a`) specify relationships between input and output reference durations.
- Never attempt to return a reference to a local variable created in the function; return owned values instead.

# Quests

## Quest: tut-23-find-prefix-slice
**Type:** coding
**Title:** Longest Common Prefix Slice
**Prompt:** Implement `longest_common_prefix<'a>(s1: &'a str, s2: &str) -> &'a str`. The function should return the slice from `s1` corresponding to the characters that match at the start of both `s1` and `s2`.
**Signature:** `pub fn longest_common_prefix<'a>(s1: &'a str, s2: &str) -> &'a str`

### Starter Code
```rust
pub fn longest_common_prefix<'a>(s1: &'a str, s2: &str) -> &'a str {
    // TODO: Return slice of s1 matching start of s2
    todo!()
}
```

### Test Harness
```rust
{{SOLUTION}}

fn main() {
    let s1 = String::from("cratery_arena");
    let s2 = "cratery_contest";
    let prefix = longest_common_prefix(&s1, s2);
    assert_eq!(prefix, "cratery_");

    assert_eq!(longest_common_prefix("rust", "ruby"), "ru");
    assert_eq!(longest_common_prefix("apple", "banana"), "");
    println!("all tests passed");
}
```

### Solution
```rust
pub fn longest_common_prefix<'a>(s1: &'a str, s2: &str) -> &'a str {
    let mut end_idx = 0;
    for ((i, c1), c2) in s1.char_indices().zip(s2.chars()) {
        if c1 == c2 {
            end_idx = i + c1.len_utf8();
        } else {
            break;
        }
    }
    &s1[0..end_idx]
}
```

### Walkthrough
We zip the characters of `s1` and `s2` together, track matching character boundaries, and return a sub-slice `&s1[0..end_idx]` guaranteed to live as long as `s1` (`'a`).

### Hints
- Iterate with `for ((i, c1), c2) in s1.char_indices().zip(s2.chars()) { if c1 != c2 { return &s1[0..i]; } }`

## Quest: tut-23-quiz-lifetime-purpose
**Type:** quiz
**Title:** Concept Check: What do lifetime annotations change at runtime?
**Prompt:** How do lifetime annotations like `'a` affect the runtime execution speed or memory layout of compiled Rust binaries?

### Options
- [ ] A) They add reference-counting overhead to each pointer access.
- [ ] B) They change the duration that objects stay allocated on the heap.
- [x] C) Nothing at all: lifetimes are entirely erased during compilation and incur zero runtime overhead.
- [ ] D) They trigger periodic garbage collection cycles.

**Hint:** Remember that Rust is committed to zero-cost abstractions.

**Explanation:** Lifetimes are purely a compile-time static analysis tool for the borrow checker. Once the compiler proves the references are safe and cannot dangle, lifetime annotations are completely erased.
