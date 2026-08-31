---
id: 02-variables-and-mutability
chapterId: getting-started
chapterNumber: 1
lessonNumber: 2
title: "Variables, Mutability & Shadowing"
tagline: "Why Rust variables are immutable by default and how shadowing differs from mutation."
readTimeMinutes: 7
difficulty: beginner
tags: [let, mut, shadowing, const]
---

# Overview
In Rust, variables declared with `let` are **immutable by default**. This foundational design prevents accidental state mutations and data races. When mutation is explicitly needed, the `mut` keyword is added. Rust also supports **shadowing**, allowing you to redeclare a variable with the same name.

# Sections

## Immutable by Default (`let`)
When you bind a name with `let x = 5;`, `x` cannot be reassigned. If you attempt to reassign to an immutable variable, the compiler halts with an error.

To allow changes, prefix the variable name with `mut`:

```rust caption="Contrasting immutable and mutable bindings."
fn main() {
    let x = 5;
    // x = 6; // COMPILE ERROR: cannot assign twice to immutable variable `x`

    let mut y = 10;
    println!("y was: {}", y);
    y += 5; // Valid because y is mutable
    println!("y is now: {}", y);
}
```

## Variable Shadowing
**Shadowing** occurs when you declare a new variable with the same name as a previous one using the `let` keyword again.

Shadowing is different from marking a variable `mut`:
1. **Type transformation**: Shadowing allows you to change the type of the value while reusing the name.
2. **Re-established immutability**: After the shadow `let`, the variable is immutable again unless explicitly declared with `let mut`.

```rust caption="Shadowing allows changing types and local scope transformations cleanly."
fn main() {
    let spaces = "   ";          // type: &str
    let spaces = spaces.len();    // type: usize (shadowed with new type!)
    println!("Number of spaces: {}", spaces);
    
    let x = 5;
    let x = x + 1; // Shadows previous x with value 6
    {
        let x = x * 2; // Shadows x inside this inner block (x = 12)
        println!("Inner x: {}", x);
    }
    println!("Outer x: {}", x); // x is still 6 here
}
```

## Constants (`const`)
Constants in Rust are declared using the `const` keyword. Unlike `let`:
- You **must** annotate the type explicitly.
- Constants can be declared in any scope, including the global scope outside functions.
- They are evaluated at compile time and cannot be set to the result of a runtime function call.
- They can never be made `mut`.

```rust caption="Declaring compile-time constants."
const MAX_CONNECTIONS: u32 = 10_000;
const THREE_HOURS_IN_SECONDS: u32 = 60 * 60 * 3;
```

# Common Mistakes

### Reassigning without `mut`
**Bad:**
```rust
let score = 100;
score = 150; // Error: cannot assign twice to immutable variable
```
**Explanation:** Variables declared with `let` cannot be modified in place unless declared with `let mut`.

**Good:**
```rust
let mut score = 100;
score = 150;
```
**Explanation:** Add `mut` when you intend to modify the variable in place.

**Compiler Error:**
```
error[E0384]: cannot assign twice to immutable variable `score`
 --> src/main.rs:2:5
  |
1 |     let score = 100;
  |         ----- first assignment to `score`
2 |     score = 150;
  |     ^^^^^^^^^^^ cannot assign twice to immutable variable
```

### Confusing `mut` with Shadowing when changing types
**Bad:**
```rust
let mut input = "42";
input = input.parse::<i32>().unwrap(); // Error: expected `&str`, found `i32`
```
**Explanation:** `mut` allows reassigning the value, but the type of a mutable variable cannot change.

**Good:**
```rust
let input = "42";
let input: i32 = input.parse().unwrap(); // OK: Shadowing with new type
```
**Explanation:** Use `let` shadowing when you want to convert or transform data types.

# Key Takeaways
- Variables are immutable by default in Rust for safety and predictability.
- Use `let mut` for variables whose value will change without changing their type.
- Use `let` shadowing to transform values, rebind names, or change data types within scopes.
- Constants with `const` must have explicit type annotations and are evaluated at compile time.

# Quests

## Quest: tut-02-clamp-multiplier
**Type:** coding
**Title:** Score Multiplier with Shadowing & Mutability
**Prompt:** Implement `calculate_score(base: i32, multiplier_str: &str, bonus: i32) -> i32`. The function should parse `multiplier_str` into an `i32` using shadowing (`let mult: i32 = ...`), multiply `base` by that multiplier into a mutable `total`, add `bonus` to `total`, and return `total`. If parsed multiplier is less than 1, clamp it to 1.
**Signature:** `pub fn calculate_score(base: i32, multiplier_str: &str, bonus: i32) -> i32`

### Starter Code
```rust
pub fn calculate_score(base: i32, multiplier_str: &str, bonus: i32) -> i32 {
    // TODO: Parse multiplier_str into i32 (default to 1 on failure if needed)
    // Clamp multiplier to at least 1
    // Calculate and return (base * mult) + bonus
    todo!()
}
```

### Test Harness
```rust
{{SOLUTION}}

fn main() {
    assert_eq!(calculate_score(10, "3", 5), 35);
    assert_eq!(calculate_score(20, "2", 0), 40);
    assert_eq!(calculate_score(15, "0", 10), 25); // clamped to 1: 15 * 1 + 10 = 25
    assert_eq!(calculate_score(5, "-4", 2), 7);   // clamped to 1: 5 * 1 + 2 = 7
    println!("all tests passed");
}
```

### Solution
```rust
pub fn calculate_score(base: i32, multiplier_str: &str, bonus: i32) -> i32 {
    let mult: i32 = multiplier_str.parse().unwrap_or(1);
    let mult = mult.max(1);
    let mut total = base * mult;
    total += bonus;
    total
}
```

### Walkthrough
We parse the `multiplier_str` slice into an integer, shadow `mult` with its clamped maximum value of at least 1, then create a mutable `total` variable to compute and return the final score.

### Hints
- Parse the string using `multiplier_str.parse::<i32>().unwrap_or(1)`.
- Clamp using `let mult = if mult < 1 { 1 } else { mult };` or `mult.max(1)`.
- Initialize `let mut total = base * mult;` then add `total += bonus;`.

## Quest: tut-02-quiz-shadowing
**Type:** quiz
**Title:** Concept Check: Mutability vs Shadowing
**Prompt:** What will be the output of the following Rust code snippet?

```rust
fn main() {
    let x = 5;
    let x = x + 1;
    {
        let x = x * 2;
        print!("{x} ");
    }
    print!("{x}");
}
```

### Options
- [ ] A) 12 12
- [x] B) 12 6
- [ ] C) 10 5
- [ ] D) Compile error: cannot declare x three times

**Hint:** Remember that shadowing inside an inner `{}` block does not alter the variable in the outer enclosing scope.

**Explanation:** The outer scope shadows `x` to `5 + 1 = 6`. Inside the inner block, a new shadow binds `x` to `6 * 2 = 12` and prints "12 ". When the inner scope ends, the outer `x` (which is 6) is untouched and prints "6".
