---
id: 20-question-mark-operator
chapterId: error-handling
chapterNumber: 6
lessonNumber: 2
title: "Propagating Errors with the `?` Operator"
tagline: "Ergonomic error propagation and automatic type conversion."
readTimeMinutes: 7
difficulty: intermediate
tags: [?, try, error-propagation, From]
---

# Overview
When writing functions that call other fallible functions, handling every `Result` with an explicit `match` statement quickly creates deeply nested "pyramids of doom". Rust provides the `?` operator for clean, early-return error propagation.

# Sections

## The `?` Operator in Action
When placed after a `Result` or `Option`, the `?` operator does the following:
- If the value is `Ok(v)`, it **unwraps** `v` and execution continues.
- If the value is `Err(e)`, it **returns early** from the enclosing function with `Err(From::from(e))`.

```rust caption="Clean sequential error propagation using ?."
fn parse_sum(a_str: &str, b_str: &str) -> Result<i32, std::num::ParseIntError> {
    let a: i32 = a_str.parse()?; // Unwraps or returns early on error
    let b: i32 = b_str.parse()?; // Unwraps or returns early on error
    Ok(a + b)
}
```

# Common Mistakes

### Using `?` in functions that do not return `Result` or `Option`
**Bad:**
```rust
fn main() {
    let num: i32 = "42".parse()?; // Error: the `?` operator can only be used in a function that returns `Result` or `Option`
}
```
**Explanation:** `?` expands to an early `return Err(...)`. If the enclosing function does not return a compatible `Result`, rustc fails to compile.

**Good:**
```rust
fn main() -> Result<(), Box<dyn std::error::Error>> {
    let num: i32 = "42".parse()?;
    println!("Num: {}", num);
    Ok(())
}
```
**Explanation:** Ensure the enclosing function returns a `Result` or `Option`, or unwrap explicitly in main.

# Key Takeaways
- The `?` operator unwraps `Ok` values or immediately returns `Err` from the function.
- `?` automatically converts error types using the `From` trait (`From::from(err)`).
- `main` can return `Result<(), E>` to allow using `?` at top-level.

# Quests

## Quest: tut-20-parse-and-multiply
**Type:** coding
**Title:** Parse String Coordinates and Multiply
**Prompt:** Implement `multiply_str_coords(x_str: &str, y_str: &str) -> Result<i64, std::num::ParseIntError>`. Use the `?` operator to parse both strings as `i64` and return `Ok(x * y)`.
**Signature:** `pub fn multiply_str_coords(x_str: &str, y_str: &str) -> Result<i64, std::num::ParseIntError>`

### Starter Code
```rust
pub fn multiply_str_coords(x_str: &str, y_str: &str) -> Result<i64, std::num::ParseIntError> {
    // TODO: Parse both using ? operator and return Ok(x * y)
    todo!()
}
```

### Test Harness
```rust
{{SOLUTION}}

fn main() {
    assert_eq!(multiply_str_coords("10", "20"), Ok(200));
    assert!(multiply_str_coords("invalid", "20").is_err());
    assert!(multiply_str_coords("10", "bad").is_err());
    println!("all tests passed");
}
```

### Solution
```rust
pub fn multiply_str_coords(x_str: &str, y_str: &str) -> Result<i64, std::num::ParseIntError> {
    let x: i64 = x_str.parse()?;
    let y: i64 = y_str.parse()?;
    Ok(x * y)
}
```

### Walkthrough
The `?` operator on `parse()?` unwraps the parsed integer or returns the `ParseIntError` directly out of the function on failure.

### Hints
- `let x: i64 = x_str.parse()?;` then `let y: i64 = y_str.parse()?;` then `Ok(x * y)`. 

## Quest: tut-20-quiz-question-mark
**Type:** quiz
**Title:** Concept Check: What does the `?` operator perform on `Err(e)`?
**Prompt:** What code does the expression `let val = fallible_call()?;` expand to when an `Err(e)` occurs?

### Options
- [ ] A) It panics and crashes the current thread.
- [x] B) It returns early from the calling function with `Err(From::from(e))`.
- [ ] C) It sets `val` to a default zero value and continues.
- [ ] D) It restarts the function from the beginning.

**Hint:** Remember that ? propagates the error up the call stack.

**Explanation:** The `?` operator performs an early return with `return Err(From::from(e));`, passing the error up to the caller while automatically applying error type conversions defined by the `From` trait.
