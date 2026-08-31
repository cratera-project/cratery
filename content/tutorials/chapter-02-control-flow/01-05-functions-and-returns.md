---
id: 05-functions-and-returns
chapterId: control-flow
chapterNumber: 2
lessonNumber: 1
title: "Functions: Statements vs Expressions"
tagline: "Why the last expression without a semicolon is the return value of a function."
readTimeMinutes: 6
difficulty: beginner
tags: [fn, parameters, expressions, return]
---

# Overview
Rust is an **expression-oriented language**. In Rust, almost everything is an expression that evaluates to a value. Understanding the distinction between **statements** (which perform an action and end with `;`) and **expressions** (which evaluate to a resultant value) is crucial.

# Sections

## Function Signatures and Types
In function signatures, you **must declare the type of each parameter**. Rust's type inference works within function bodies, but not across function boundaries. The return type is declared after an arrow `->`.

```rust caption="A clean Rust function returning an expression directly."
fn add(a: i32, b: i32) -> i32 {
    a + b // Note: NO semicolon here! This is the return expression.
}
```

## Statements vs Expressions
- **Statements** are instructions that perform some action and do not return a value. In Rust, statements end in a semicolon `;`.
- **Expressions** evaluate to a resultant value. If you add a semicolon to the end of an expression, you turn it into a statement, which evaluates to the unit type `()`.

```rust caption="Block expressions evaluating to values."
fn calculate(x: i32) -> i32 {
    let y = {
        let z = x * 2;
        z + 10 // Expression returning z + 10 to y
    };
    
    y * 3 // Expression returned from calculate
}
```

# Common Mistakes

### Accidental trailing semicolon on return expression
**Bad:**
```rust
fn square(n: i32) -> i32 {
    n * n; // Error: expected `i32`, found `()`
}
```
**Explanation:** The semicolon transforms `n * n` into a statement, causing the function to implicitly return `()` instead of `i32`.

**Good:**
```rust
fn square(n: i32) -> i32 {
    n * n
}
```
**Explanation:** Omit the semicolon on the final expression to return its value.

**Compiler Error:**
```
error[E0308]: mismatched types
 --> src/main.rs:1:22
  |
1 | fn square(n: i32) -> i32 {
  |    ------            ^^^ expected `i32`, found `()`
2 |     n * n;
  |          - help: remove this semicolon to return this value
```

# Key Takeaways
- Functions must explicitly annotate all parameter types and the return type `-> Type`.
- Expressions return a value; adding a semicolon `;` turns an expression into a statement returning `()`.
- Early returns are done via the `return` keyword, but idiomatic Rust uses the final expression without a semicolon.

# Quests

## Quest: tut-05-grade-calc
**Type:** coding
**Title:** Score Clamping Function
**Prompt:** Implement `clamp_and_double(val: i32, min_val: i32, max_val: i32) -> i32`. If `val < min_val`, clamp it to `min_val`. If `val > max_val`, clamp it to `max_val`. Then return the clamped value multiplied by 2 using an expression.
**Signature:** `pub fn clamp_and_double(val: i32, min_val: i32, max_val: i32) -> i32`

### Starter Code
```rust
pub fn clamp_and_double(val: i32, min_val: i32, max_val: i32) -> i32 {
    // TODO: Clamp val between min_val and max_val, then return clamped * 2
    todo!()
}
```

### Test Harness
```rust
{{SOLUTION}}

fn main() {
    assert_eq!(clamp_and_double(15, 10, 20), 30);
    assert_eq!(clamp_and_double(5, 10, 20), 20); // 10 * 2 = 20
    assert_eq!(clamp_and_double(25, 10, 20), 40); // 20 * 2 = 40
    assert_eq!(clamp_and_double(-5, 0, 100), 0);
    println!("all tests passed");
}
```

### Solution
```rust
pub fn clamp_and_double(val: i32, min_val: i32, max_val: i32) -> i32 {
    let clamped = if val < min_val {
        min_val
    } else if val > max_val {
        max_val
    } else {
        val
    };
    clamped * 2
}
```

### Walkthrough
We clamp `val` within the bounds `[min_val, max_val]` using an expression-based `if/else` block, and return `clamped * 2` as the trailing expression.

### Hints
- You can use `val.clamp(min_val, max_val)` or `if/else`.
- Make the final line `clamped * 2` without a semicolon.

## Quest: tut-05-quiz-expression
**Type:** quiz
**Title:** Concept Check: Semicolons in Function Bodies
**Prompt:** What is the return type and value of the following function?

```rust
fn mystery() {
    let a = 10;
    a + 5;
}
```

### Options
- [ ] A) Returns integer 15 of type i32
- [x] B) Returns the unit type () with no value
- [ ] C) Returns integer 10
- [ ] D) Compile error because a is unused

**Hint:** Look at the trailing semicolon on the last line inside the function body.

**Explanation:** Because `a + 5;` ends in a semicolon, it is evaluated as a statement. The function body has no trailing expression and returns the unit type `()` implicitly.
