---
id: 14-pattern-matching
chapterId: structs-enums
chapterNumber: 4
lessonNumber: 3
title: "Exhaustive Pattern Matching & `match`"
tagline: "The power of `match`, match guards, destructuring, and compiler exhaustiveness."
readTimeMinutes: 7
difficulty: intermediate
tags: [match, patterns, destructuring, guards]
---

# Overview
`match` is Rust’s most powerful control flow construct. It compares a value against a series of patterns and executes code based on which pattern matches. Matches in Rust are **exhaustive**: every single possible value must be covered.

# Sections

## Exhaustive Matching
When matching on enums or types, the compiler verifies that all cases are handled. You can use the catch-all pattern `_` to handle remaining cases:

```rust caption="Matching on literals, multi-patterns, and ranges."
let number = 13;
match number {
    1 => println!("One!"),
    2 | 3 | 5 | 7 | 11 | 13 => println!("Small prime number"),
    14..=20 => println!("Teen between 14 and 20"),
    _ => println!("Other number"),
}
```

## Match Guards (Conditional Matching)
A **match guard** is an additional `if` condition specified after the pattern that must also match for the arm to be chosen:

```rust caption="Using if match guards for conditional pattern matching."
let num = Some(4);
match num {
    Some(x) if x % 2 == 0 => println!("Even number: {}", x),
    Some(x) => println!("Odd number: {}", x),
    None => println!("No number"),
}
```

# Common Mistakes

### Non-exhaustive match compiler error
**Bad:**
```rust
let opt = Some(5);
match opt {
    Some(x) => println!("{}", x), // Error: non-exhaustive patterns: `None` not covered
}
```
**Explanation:** The compiler refuses to build code where a case could slip through unhandled.

**Good:**
```rust
match opt {
    Some(x) => println!("{}", x),
    None => (),
}
```
**Explanation:** Explicitly handle `None` or use a wildcard `_`.

**Compiler Error:**
```
error[E0004]: non-exhaustive patterns: `None` not covered
 --> src/main.rs:2:11
  |
2 |     match opt {
  |           ^^^ pattern `None` not covered
```

# Key Takeaways
- `match` expressions are exhaustive: all possible variants or values must be covered.
- Combine multiple values with `|` and numerical ranges with `start..=end`.
- Use match guards (`if condition`) to add runtime conditional constraints to pattern arms.

# Quests

## Quest: tut-14-evaluate-command
**Type:** coding
**Title:** Command Evaluator with Pattern Matching
**Prompt:** Given an enum `Command { Move { dx: i32, dy: i32 }, Teleport(i32, i32), Reset }`, implement `apply_command(cmd: Command, current: (i32, i32)) -> (i32, i32)`. `Move` adds `dx` and `dy` to `current`. `Teleport(x, y)` sets coordinates to `(x, y)`. `Reset` sets coordinates to `(0, 0)`.
**Signature:** `pub fn apply_command(cmd: Command, current: (i32, i32)) -> (i32, i32)`

### Starter Code
```rust
pub enum Command {
    Move { dx: i32, dy: i32 },
    Teleport(i32, i32),
    Reset,
}

pub fn apply_command(cmd: Command, current: (i32, i32)) -> (i32, i32) {
    // TODO: Match on cmd and compute new position
    todo!()
}
```

### Test Harness
```rust
{{SOLUTION}}

fn main() {
    let pos = (10, 20);
    assert_eq!(apply_command(Command::Move { dx: 5, dy: -3 }, pos), (15, 17));
    assert_eq!(apply_command(Command::Teleport(100, 200), pos), (100, 200));
    assert_eq!(apply_command(Command::Reset, pos), (0, 0));
    println!("all tests passed");
}
```

### Solution
```rust
pub enum Command {
    Move { dx: i32, dy: i32 },
    Teleport(i32, i32),
    Reset,
}

pub fn apply_command(cmd: Command, current: (i32, i32)) -> (i32, i32) {
    match cmd {
        Command::Move { dx, dy } => (current.0 + dx, current.1 + dy),
        Command::Teleport(x, y) => (x, y),
        Command::Reset => (0, 0),
    }
}
```

### Walkthrough
The `match` pattern destructures named fields `Move { dx, dy }`, positional tuple variants `Teleport(x, y)`, and unit variants `Reset` directly in the match arms.

### Hints
- Use a `match cmd` block with arms for each variant.

## Quest: tut-14-quiz-guard
**Type:** quiz
**Title:** Concept Check: Match Guards
**Prompt:** What happens if the pattern matches in a match arm, but its match guard `if condition` evaluates to `false`?

### Options
- [ ] A) The program panics with a match guard exception.
- [x] B) Pattern matching moves on to test subsequent match arms.
- [ ] C) The arm executes anyway with default values.
- [ ] D) The match immediately returns the unit value ().

**Hint:** Guards act as additional filters on an arm.

**Explanation:** If a pattern matches but the guard expression evaluates to `false`, Rust continues checking subsequent match arms until it finds a matching arm.
