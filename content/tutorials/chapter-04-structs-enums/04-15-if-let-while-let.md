---
id: 15-if-let-while-let
chapterId: structs-enums
chapterNumber: 4
lessonNumber: 4
title: "Concise Control Flow: `if let`, `while let` & `let else`"
tagline: "Handling single pattern matches without boilerplate match arms."
readTimeMinutes: 6
difficulty: intermediate
tags: [if-let, while-let, let-else, patterns]
---

# Overview
When you only care about matching one specific variant and ignoring all other possibilities, a full `match` expression can be verbose. Rust provides `if let`, `while let`, and `let else` for clean, ergonomic pattern handling.

# Sections

## `if let` Syntax
The `if let` syntax allows you to combine `if` and `let` into a less verbose way to handle values that match one pattern while ignoring the rest:

```rust caption="Using if let for single-pattern matching."
let config_max = Some(3u8);

// Instead of verbose match config_max { Some(max) => ..., _ => () }
if let Some(max) = config_max {
    println!("The maximum is configured to be {}", max);
}
```

## Guard Clauses with `let else` (Rust 1.65+)
`let else` enables early return / guard patterns. If the pattern matches, variables are bound in the outer scope. If the pattern fails, the `else` block **must** diverge (e.g., `return`, `break`, `continue`, or `panic!`).

```rust caption="Eliminating indentation pyramids with let else guard clauses."
fn process_user_id(id_opt: Option<u64>) -> String {
    let Some(id) = id_opt else {
        return "Missing user ID".to_string();
    };
    
    // 'id' is now directly available as an unnested u64 here!
    format!("User ID: {}", id)
}
```

# Common Mistakes

### Not diverging inside a `let else` block
**Bad:**
```rust
fn test(val: Option<i32>) {
    let Some(x) = val else {
        println!("None"); // Error: `else` clause of `let...else` does not diverge
    };
}
```
**Explanation:** The `else` block of `let else` must never fall through; it must return, break, continue, or panic.

**Good:**
```rust
fn test(val: Option<i32>) {
    let Some(x) = val else {
        println!("None");
        return;
    };
}
```
**Explanation:** Ensure the `else` branch explicitly exits the scope with `return` or `break`.

# Key Takeaways
- Use `if let` when you want to handle one variant and ignore all others.
- Use `while let` to continuously loop as long as a pattern continues to match (e.g. popping a queue).
- Use `let else` for early returns to unwrap values without nesting your logic inside blocks.

# Quests

## Quest: tut-15-drain-stack
**Type:** coding
**Title:** Sum and Drain Stack with `while let`
**Prompt:** Implement `drain_and_sum(mut stack: Vec<i32>) -> i32`. Use `while let Some(val) = stack.pop()` to remove elements from the back of the vector and accumulate their sum until the stack is empty.
**Signature:** `pub fn drain_and_sum(mut stack: Vec<i32>) -> i32`

### Starter Code
```rust
pub fn drain_and_sum(mut stack: Vec<i32>) -> i32 {
    // TODO: Use while let Some(...) = stack.pop() to sum elements
    todo!()
}
```

### Test Harness
```rust
{{SOLUTION}}

fn main() {
    assert_eq!(drain_and_sum(vec![10, 20, 30]), 60);
    assert_eq!(drain_and_sum(vec![]), 0);
    assert_eq!(drain_and_sum(vec![5, -5, 10]), 10);
    println!("all tests passed");
}
```

### Solution
```rust
pub fn drain_and_sum(mut stack: Vec<i32>) -> i32 {
    let mut sum = 0;
    while let Some(val) = stack.pop() {
        sum += val;
    }
    sum
}
```

### Walkthrough
`stack.pop()` returns `Some(val)` while items remain and `None` when empty. `while let` naturally loops until `None` is encountered and terminates cleanly.

### Hints
- Initialize `let mut sum = 0;` and loop with `while let Some(val) = stack.pop()`. 

## Quest: tut-15-quiz-let-else
**Type:** quiz
**Title:** Concept Check: Requirement of `let else` blocks
**Prompt:** What is a mandatory requirement for the `else` block of a `let else` statement in Rust?

### Options
- [ ] A) It must allocate memory on the heap.
- [x] B) It must diverge (i.e. return, break, continue, or panic) and never fall through.
- [ ] C) It must contain at least two match arms.
- [ ] D) It must return a boolean value.

**Hint:** What must happen if the pattern did not match?

**Explanation:** Because `let else` binds the unwrapped variables in the enclosing scope, the `else` block must diverge (type `!`), meaning execution cannot proceed past the block if the pattern match fails.
