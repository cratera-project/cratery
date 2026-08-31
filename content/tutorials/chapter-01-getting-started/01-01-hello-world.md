---
id: 01-hello-world
chapterId: getting-started
chapterNumber: 1
lessonNumber: 1
title: "Hello Rust: Anatomy of a Program"
tagline: "Your first steps in Rust: the main function, macros, and compile-time guarantees."
readTimeMinutes: 5
difficulty: beginner
tags: [main, println!, macros, cargo]
---

# Overview
Rust is a systems programming language focused on performance, safety, and concurrency. Every standalone Rust binary starts execution in the `main` function. Unlike many languages, Rust distinguishes between regular function calls and macro invocations, using an exclamation mark `!` for macros.

# Sections

## The Entry Point: `fn main()`
In Rust, execution begins at the `main` function. Function definitions use the `fn` keyword, followed by the function name, parentheses for arguments, and curly braces containing the function body.

By default, `main` takes no arguments and returns the unit type `()`, which represents an empty tuple (similar to `void` in C/C++ or Java).

```rust runnable caption="A standard minimal Rust entry point program."
fn main() {
    println!("Hello, Cratery!");
}
```

## Printing and Macros (`println!`)
The `println!` call looks like a function, but the exclamation point `!` indicates that it is a **declarative macro**. 

Why is `println!` a macro instead of a function?
1. **Variable arguments**: `println!` can accept any number of format arguments.
2. **Compile-time format string validation**: Rust verifies during compilation that the format string placeholders `{}` match the number and types of arguments provided. If you pass fewer arguments than placeholders, your code will fail to compile rather than crash at runtime!

```rust caption="Formatting text and debug representations using println!."
fn main() {
    let name = "Ferris";
    let age = 10;
    // Basic positional interpolation
    println!("Name: {}, Age: {}", name, age);
    
    // Named arguments
    println!("{greeting}, {name}!", greeting = "Welcome", name = name);
    
    // Debug format specifier {:?}
    println!("Debug print: {:?}", (1, "tuple", true));
}
```

# Common Mistakes

### Omitting the exclamation mark on macros
**Bad:**
```rust
fn main() {
    println("Hello world"); // Error: cannot find function `println`
}
```
**Explanation:** `println` is not a standard function. Without the `!` token, rustc searches for a function named `println` in scope and fails.

**Good:**
```rust
fn main() {
    println!("Hello world");
}
```
**Explanation:** Always append `!` when invoking macros like `println!`, `format!`, `vec!`, or `panic!`.

**Compiler Error:**
```
error[E0425]: cannot find function `println` in this scope
 --> src/main.rs:2:5
  |
2 |     println("Hello world");
  |     ^^^^^^^ help: use `println!` instead
```

### Mismatching format string placeholders
**Bad:**
```rust
fn main() {
    println!("User {} is {} years old", "Alice"); // 2 placeholders, 1 arg
}
```
**Explanation:** Rust guarantees format safety at compile time. Having 2 `{}` placeholders but only 1 argument produces a hard compile error.

**Good:**
```rust
fn main() {
    println!("User {} is {} years old", "Alice", 28);
}
```
**Explanation:** Ensure the count of `{}` format specifiers matches the supplied arguments.

# Key Takeaways
- Every Rust binary begins execution at `fn main()`.
- Macros are called with an exclamation point `!` and are expanded at compile time.
- Format strings in `println!` and `format!` are checked at compile time for safety.

# Quests

## Quest: tut-01-format-greeting
**Type:** coding
**Title:** Format a Welcome Message
**Prompt:** Write a function `format_welcome(name: &str, level: u32) -> String` that returns a formatted greeting string in the exact format: `"Welcome to Cratery, <name>! Your current level is <level>."`. Use the `format!` macro.
**Signature:** `pub fn format_welcome(name: &str, level: u32) -> String`

### Starter Code
```rust
pub fn format_welcome(name: &str, level: u32) -> String {
    // TODO: Use format! macro to build the welcome message
    todo!()
}
```

### Test Harness
```rust
{{SOLUTION}}

fn main() {
    assert_eq!(
        format_welcome("Ferris", 1),
        "Welcome to Cratery, Ferris! Your current level is 1."
    );
    assert_eq!(
        format_welcome("Alice", 42),
        "Welcome to Cratery, Alice! Your current level is 42."
    );
    assert_eq!(
        format_welcome("Rustacean", 99),
        "Welcome to Cratery, Rustacean! Your current level is 99."
    );
    println!("all tests passed");
}
```

### Solution
```rust
pub fn format_welcome(name: &str, level: u32) -> String {
    format!("Welcome to Cratery, {}! Your current level is {}.", name, level)
}
```

### Walkthrough
The `format!` macro constructs a heap-allocated `String` using the exact same formatting syntax as `println!`. We pass `name` into the first `{}` and `level` into the second `{}`.

### Hints
- Use the `format!` macro which returns an owned `String` instead of printing to stdout.
- Syntax: `format!("Welcome to Cratery, {}! Your current level is {}.", name, level)`

## Quest: tut-01-quiz-macro
**Type:** quiz
**Title:** Concept Check: Why is `println!` a macro in Rust?
**Prompt:** Why does Rust provide `println!` as a macro rather than a regular function?

### Options
- [ ] A) Because Rust functions cannot do I/O operations.
- [x] B) To allow variable numbers of arguments and compile-time format string validation.
- [ ] C) Because macros in Rust are faster at runtime than compiled functions.
- [ ] D) Because functions cannot print strings containing emojis.

**Hint:** Think about what happens if you pass 3 arguments to 2 `{}` placeholders.

**Explanation:** Macros in Rust can accept variable numbers of arguments (variadic) and enable the compiler to inspect the format string at compile time to ensure type safety and matching argument counts.
