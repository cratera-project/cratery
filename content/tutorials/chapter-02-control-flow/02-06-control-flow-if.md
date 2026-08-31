---
id: 06-control-flow-if
chapterId: control-flow
chapterNumber: 2
lessonNumber: 2
title: "Conditionals: `if` as an Expression"
tagline: "Using `if`, `else if`, and assigning ternary-like results cleanly."
readTimeMinutes: 6
difficulty: beginner
tags: [if, else, ternary, conditions]
---

# Overview
In Rust, `if` is an expression, not a statement. This means `if/else` blocks evaluate to a value that can be assigned directly to variables without needing a separate ternary `?:` operator.

# Sections

## Conditionals and Strict Booleans
Conditions in `if` statements **must be explicit booleans**. Rust will never attempt to convert non-boolean types (like `0` or `null`) into booleans.

```rust caption="Standard if-else branching with boolean conditions."
let number = 7;
if number % 2 == 0 {
    println!("Even");
} else {
    println!("Odd");
}
```

## Assigning from `if` Expressions
Because `if` is an expression, you can use it on the right side of a `let` statement. All branches **must return the exact same type**.

```rust caption="Assigning variable bindings directly from an if/else expression."
let condition = true;
let number = if condition { 5 } else { 6 };
println!("The value is: {}", number);
```

# Common Mistakes

### Branches returning different types
**Bad:**
```rust
let score = 85;
let result = if score >= 50 { "Pass" } else { 0 }; // Error: expected &str, found integer
```
**Explanation:** Rust is statically typed; every branch of an `if` expression must evaluate to the same type so the compiler knows the variable type.

**Good:**
```rust
let score = 85;
let result = if score >= 50 { "Pass" } else { "Fail" };
```
**Explanation:** Ensure all `if` and `else` branches return values of the identical type.

**Compiler Error:**
```
error[E0308]: `if` and `else` have incompatible types
 --> src/main.rs:2:47
  |
2 |     let result = if score >= 50 { "Pass" } else { 0 };
  |                                   ------          ^ expected `&str`, found integer
  |                                   |
  |                                   expected because of this
```

# Key Takeaways
- `if` conditions must evaluate strictly to a `bool`.
- `if` blocks are expressions that can return values to `let` bindings.
- All branches in an `if/else` expression must return the identical type.

# Quests

## Quest: tut-06-ticket-pricing
**Type:** coding
**Title:** Movie Ticket Tier Calculator
**Prompt:** Implement `ticket_price(age: u32, is_student: bool) -> u32`. If `age < 12`, the price is 5. If `age >= 65`, the price is 7. Otherwise, if `is_student` is true, the price is 8; else the price is 12. Use an `if/else` expression.
**Signature:** `pub fn ticket_price(age: u32, is_student: bool) -> u32`

### Starter Code
```rust
pub fn ticket_price(age: u32, is_student: bool) -> u32 {
    // TODO: Return ticket price based on age and student status
    todo!()
}
```

### Test Harness
```rust
{{SOLUTION}}

fn main() {
    assert_eq!(ticket_price(8, false), 5);
    assert_eq!(ticket_price(70, false), 7);
    assert_eq!(ticket_price(20, true), 8);
    assert_eq!(ticket_price(20, false), 12);
    assert_eq!(ticket_price(12, true), 8);
    println!("all tests passed");
}
```

### Solution
```rust
pub fn ticket_price(age: u32, is_student: bool) -> u32 {
    if age < 12 {
        5
    } else if age >= 65 {
        7
    } else if is_student {
        8
    } else {
        12
    }
}
```

### Walkthrough
The `if/else if/else` expression tests the age brackets in priority order and returns the respective `u32` ticket cost cleanly.

### Hints
- Structure your `if/else if/else` block and return the result directly.

## Quest: tut-06-quiz-truthy
**Type:** quiz
**Title:** Concept Check: Condition Evaluation
**Prompt:** What happens if you write `if 1 { println!("true"); }` in Rust?

### Options
- [ ] A) It prints "true" because 1 is truthy.
- [x] B) It fails at compile time with a mismatched types error (expected bool, found integer).
- [ ] C) It prints 1 to stdout.
- [ ] D) It executes in debug mode but crashes in release mode.

**Hint:** Remember that Rust does not have implicit boolean coercion.

**Explanation:** Rust requires the condition of an `if` expression to be strictly of type `bool`. It will not perform implicit truthy/falsy conversions like JavaScript, Python, or C.
