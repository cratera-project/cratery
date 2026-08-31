---
id: 32-declarative-macros
chapterId: macros
chapterNumber: 12
lessonNumber: 32
title: "Declarative Macros with `macro_rules!`"
tagline: "Pattern matching on Rust syntax tokens to generate repetitive boilerplate safely."
readTimeMinutes: 6
difficulty: intermediate
tags: [macros, macro_rules, metaprogramming, syntax]
---

# Overview
Declarative macros (`macro_rules!`) let you define custom syntactic extensions using pattern matching on Rust token streams. They expand at compile-time before type-checking.

# Sections

## Macro Definition & Matchers
Declarative macros match syntax patterns rather than runtime values. Designators specify what kind of syntax fragment to capture:
- `$x:expr`: An expression (e.g. `1 + 2`, `foo()`)
- `$i:ident`: An identifier (variable or function name)
- `$t:ty`: A type (e.g. `i32`, `Vec<String>`)
- `$p:pat`: A pattern (for `match` or `let`)
- `$b:block`: A brace-delimited block of code

```rust caption="Overloading macro branches based on token patterns."
macro_rules! say_hello {
    // Match with no arguments
    () => {
        println!("Hello, Rustacean!");
    };
    // Match an expression
    ($name:expr) => {
        println!("Hello, {}!", $name);
    };
}

fn main() {
    say_hello!();
    say_hello!("Ferris");
}
```

## Repetitions: Building `vec!`-style Macros
Macros support repetition matching with `$(...)*` (zero or more), `$(...)+` (one or more), and optional delimiters like `$(...),*` for comma-separated items.

```rust caption="Repetition expansion in declarative macros."
macro_rules! my_vec {
    ( $( $x:expr ),* ) => {
        {
            let mut temp_vec = Vec::new();
            $(
                temp_vec.push($x);
            )*
            temp_vec
        }
    };
}

fn main() {
    let numbers = my_vec![10, 20, 30];
    assert_eq!(numbers.len(), 3);
}
```

# Common Mistakes

### Trailing Comma Rejection
**Bad:**
```rust
macro_rules! list {
    ( $( $x:expr ),* ) => { ... };
}
// list![1, 2, 3,]; fails to match because trailing comma is not allowed
```
**Explanation:** The matcher strictly expects comma-separated items without an optional trailing comma.

**Good:**
```rust
macro_rules! list {
    ( $( $x:expr ),* $(,)? ) => { ... };
}
```
**Explanation:** Adding `$(,)?` at the end allows optional trailing commas, idiomatic in modern Rust.

# Key Takeaways
- Declarative macros operate at the syntactic token level before type checking.
- Token designators like $expr, $ident, and $ty determine what tokens are captured.
- Repetitions allow creating variable-arity macros like vec![] or println!.
