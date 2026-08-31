---
id: 19-panic-vs-result
chapterId: error-handling
chapterNumber: 6
lessonNumber: 1
title: "Unrecoverable (`panic!`) vs Recoverable (`Result<T, E>`)"
tagline: "When to halt execution vs when to return explicit error types."
readTimeMinutes: 7
difficulty: intermediate
tags: [errors, panic!, result, exceptions]
---

# Overview
Rust does not have runtime exceptions. Instead, it categorizes errors into two distinct types: **unrecoverable errors** (which invoke the `panic!` macro and unwind the stack) and **recoverable errors** (which return a `Result<T, E>`).

# Sections

## Unrecoverable Errors with `panic!`
When a `panic!` occurs:
1. The program prints a failure message.
2. The runtime begins **unwinding** the stack, cleaning up variables and calling `drop` on each one.
3. The process exits with a non-zero exit code.

Use `panic!` only for bug conditions that should never happen in correct code (like internal invariant violations).

```rust caption="Triggering an unrecoverable panic on invariant violation."
fn check_invariant(num: i32) {
    if num < 0 {
        panic!("Invariant violated: num must be non-negative, got {}", num);
    }
}
```

## Recoverable Errors with `Result<T, E>`
The `Result<T, E>` enum is defined as:
```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```
Any operation that can reasonably fail (like file I/O, parsing user input, or network calls) returns `Result<T, E>`, forcing callers to explicitly acknowledge possible failure modes.

```rust caption="Returning Result<T, E> for fallible validation."
fn parse_percentage(input: &str) -> Result<u32, String> {
    match input.parse::<u32>() {
        Ok(val) if val <= 100 => Ok(val),
        Ok(val) => Err(format!("Percentage {} exceeds 100", val)),
        Err(_) => Err("Invalid integer input".to_string()),
    }
}
```

# Common Mistakes

### Using `panic!` for routine errors like invalid user input
**Bad:**
```rust
fn parse_age(s: &str) -> u32 {
    s.parse().expect("Failed to parse age") // Crashes the entire server on bad input!
}
```
**Explanation:** Crashing on expected bad input makes software fragile and vulnerable to denial-of-service.

**Good:**
```rust
fn parse_age(s: &str) -> Result<u32, std::num::ParseIntError> {
    s.parse()
}
```
**Explanation:** Return `Result` so callers can cleanly report the error back to the user or retry.

# Key Takeaways
- Rust handles errors without runtime exceptions: unrecoverable bugs panic; recoverable errors return `Result<T, E>`.
- `Ok(T)` contains the successful value; `Err(E)` contains the error description or object.
- Rust compiler forces you to handle `Result` types before accessing the inner success payload.

# Quests

## Quest: tut-19-safe-division-result
**Type:** coding
**Title:** Safe Integer Division with Result
**Prompt:** Implement `divide_exact(a: i32, b: i32) -> Result<i32, String>`. If `b == 0`, return `Err("division by zero".to_string())`. If `a % b != 0`, return `Err("not evenly divisible".to_string())`. Otherwise return `Ok(a / b)`.
**Signature:** `pub fn divide_exact(a: i32, b: i32) -> Result<i32, String>`

### Starter Code
```rust
pub fn divide_exact(a: i32, b: i32) -> Result<i32, String> {
    // TODO: Return Err for 0 or non-divisible, otherwise Ok(a / b)
    todo!()
}
```

### Test Harness
```rust
{{SOLUTION}}

fn main() {
    assert_eq!(divide_exact(10, 2), Ok(5));
    assert_eq!(divide_exact(10, 0), Err("division by zero".to_string()));
    assert_eq!(divide_exact(10, 3), Err("not evenly divisible".to_string()));
    assert_eq!(divide_exact(-12, 4), Ok(-3));
    println!("all tests passed");
}
```

### Solution
```rust
pub fn divide_exact(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        Err("division by zero".to_string())
    } else if a % b != 0 {
        Err("not evenly divisible".to_string())
    } else {
        Ok(a / b)
    }
}
```

### Walkthrough
We validate the division constraints sequentially, returning descriptive `Err(String)` variants for invalid states and wrapping the quotient in `Ok(a / b)`.

### Hints
- Check `if b == 0` first, then `if a % b != 0`, then `Ok(a / b)`.

## Quest: tut-19-quiz-result-nature
**Type:** quiz
**Title:** Concept Check: Error Handling Philosophy
**Prompt:** Why does Rust use `Result<T, E>` return values instead of try/catch exceptions?

### Options
- [ ] A) Because exceptions in Rust can only be thrown by operating system kernel calls.
- [x] B) To make error possibilities explicit in function signatures and eliminate hidden control flow branches.
- [ ] C) Because Result types are slower than exceptions.
- [ ] D) Because try/catch blocks are not supported by LLVM.

**Hint:** Consider how explicit type signatures make function behavior transparent.

**Explanation:** With `Result<T, E>`, every potential failure is declared explicitly in the function type signature. The caller cannot ignore it, and there is no hidden non-local jump in control flow as with exceptions.
