---
id: 13-enums-and-option
chapterId: structs-enums
chapterNumber: 4
lessonNumber: 2
title: "Enums with Data & `Option<T>`"
tagline: "Algebraic data types and the total elimination of null pointer exceptions."
readTimeMinutes: 8
difficulty: intermediate
tags: [enum, option, null-safety, adt]
---

# Overview
Rust enums are **Algebraic Data Types (Tagged Unions)**. Unlike C or Java enums, each variant can hold different types and amounts of associated data. Rust does not have a `null` value—instead, it uses the standard `Option<T>` enum.

# Sections

## Enums with Associated Data
Each enum variant can store arbitrary data, including primitive types, tuples, or structs:

```rust caption="Enum variants holding different payloads."
enum WebEvent {
    PageLoad,
    KeyPress(char),
    Click { x: i64, y: i64 },
    Paste(String),
}

fn inspect(event: WebEvent) {
    match event {
        WebEvent::PageLoad => println!("Page loaded"),
        WebEvent::KeyPress(c) => println!("Key pressed: {}", c),
        WebEvent::Click { x, y } => println!("Clicked at ({}, {})", x, y),
        WebEvent::Paste(text) => println!("Pasted: {}", text),
    }
}
```

## `Option<T>`: The Null Alternative
The `Option<T>` enum is defined in the standard library as:
```rust
enum Option<T> {
    Some(T),
    None,
}
```
Because `Option<T>` and `T` are different types, the compiler forces you to explicitly handle the `None` case before you can access the inner `T`. This completely eliminates the billion-dollar mistake of NullPointerExceptions!

```rust caption="Using Option<T> for fallible operations without null."
fn divide(numerator: f64, denominator: f64) -> Option<f64> {
    if denominator == 0.0 {
        None
    } else {
        Some(numerator / denominator)
    }
}

fn main() {
    let result = divide(10.0, 2.0);
    match result {
        Some(val) => println!("Result: {}", val),
        None => println!("Cannot divide by zero!"),
    }
}
```

# Common Mistakes

### Calling `.unwrap()` on `None`
**Bad:**
```rust
let opt: Option<i32> = None;
let val = opt.unwrap(); // Panics at runtime with "called `Option::unwrap()` on a `None` value"
```
**Explanation:** `.unwrap()` assumes the value is `Some(T)`. If it is `None`, your program panics immediately.

**Good:**
```rust
let opt: Option<i32> = None;
let val = opt.unwrap_or(0); // Fallback default
```
**Explanation:** Use `match`, `if let`, `.unwrap_or(default)`, or `.unwrap_or_else()` for safe handling.

# Key Takeaways
- Rust enums can hold data directly inside their variants.
- Rust has no `null`; absence of a value is explicitly modeled via `Option<T>` (`Some(T)` or `None`).
- The compiler prevents accessing the inner value of an `Option` without explicitly handling `None`.

# Quests

## Quest: tut-13-safe-division
**Type:** coding
**Title:** Safe Integer Average
**Prompt:** Implement `safe_average(numbers: &[i32]) -> Option<f64>`. If `numbers` is empty, return `None`. Otherwise, calculate the sum and return `Some(sum / length as f64)`.
**Signature:** `pub fn safe_average(numbers: &[i32]) -> Option<f64>`

### Starter Code
```rust
pub fn safe_average(numbers: &[i32]) -> Option<f64> {
    // TODO: Return None if empty, otherwise Some(average)
    todo!()
}
```

### Test Harness
```rust
{{SOLUTION}}

fn main() {
    assert_eq!(safe_average(&[10, 20, 30]), Some(20.0));
    assert_eq!(safe_average(&[]), None);
    assert_eq!(safe_average(&[5, 10]), Some(7.5));
    println!("all tests passed");
}
```

### Solution
```rust
pub fn safe_average(numbers: &[i32]) -> Option<f64> {
    if numbers.is_empty() {
        return None;
    }
    let sum: i64 = numbers.iter().map(|&n| n as i64).sum();
    Some(sum as f64 / numbers.len() as f64)
}
```

### Walkthrough
We guard against division by zero by checking `numbers.is_empty()`. If non-empty, we compute the sum as `i64` to prevent overflow, divide by length, and wrap the result in `Some(...)`.

### Hints
- Check `if numbers.is_empty() { return None; }`.
- Sum the numbers, cast to `f64`, and wrap in `Some(...)`.

## Quest: tut-13-quiz-option-safety
**Type:** quiz
**Title:** Concept Check: Null Safety in Rust
**Prompt:** Why is `Option<T>` safer than a nullable pointer in C/Java?

### Options
- [ ] A) `Option<T>` automatically allocates all data in secure heap zones.
- [x] B) `Option<T>` and `T` are distinct types, so the compiler forces you to handle `None` before you can access `T`.
- [ ] C) `Option<T>` converts `None` to zero automatically.
- [ ] D) `Option<T>` ignores null pointer errors at runtime without crashing.

**Hint:** Focus on how the compiler prevents accidental null dereferencing.

**Explanation:** In Rust, `T` is guaranteed to always hold a valid instance of `T`. If a value might be absent, it must be typed as `Option<T>`, preventing accidental access without explicit unwrapping or matching.
