---
id: 03-primitive-types
chapterId: getting-started
chapterNumber: 1
lessonNumber: 3
title: "Scalar Data Types & Casting"
tagline: "Integers, floating-point numbers, booleans, and 4-byte Unicode characters."
readTimeMinutes: 7
difficulty: beginner
tags: [types, integers, floats, bool, char, casting]
---

# Overview
Rust is a statically typed language, meaning the compiler must know the types of all variables at compile time. Scalar types represent a single value. Rust has four primary scalar types: integers, floating-point numbers, booleans, and characters.

# Sections

## Integer Types & Widths
Integers are numbers without fractional components. Rust provides signed (`i`) and unsigned (`u`) integers across multiple bit widths:

| Length | Signed | Unsigned |
|---|---|---|
| 8-bit | `i8` (-128 to 127) | `u8` (0 to 255) |
| 16-bit | `i16` | `u16` |
| 32-bit (default) | `i32` | `u32` |
| 64-bit | `i64` | `u64` |
| 128-bit | `i128` | `u128` |
| Architecture-dependent | `isize` | `usize` (used for indexing & sizes) |

You can use visual number separators like `1_000_000` or type suffixes like `42u8` for clarity.

```rust caption="Integer definitions with explicit types and suffixes."
let a: i32 = -42;
let b: u64 = 1_000_000_u64;
let idx: usize = 0; // standard type for collection indices
```

## Floats & Booleans
Rust has two primitive floating-point types: `f32` (single precision) and `f64` (double precision, default on modern CPUs).

Booleans (`bool`) have two values: `true` and `false` and occupy one byte in memory. Unlike C or Python, numbers in Rust do **not** implicitly convert to booleans.

```rust caption="Floats and strict boolean checks."
let x = 2.0; // f64 by default
let y: f32 = 3.14; // f32
let is_active = true;
// if 1 { ... } // COMPILE ERROR: expected `bool`, found integer
```

## The `char` Type (4-Byte Unicode)
In Rust, single quotes denote a `char`, while double quotes denote string literals. A Rust `char` is **4 bytes in size** and represents a Unicode Scalar Value. It can represent ASCII letters, accented glyphs, emojis, Chinese characters, and more natively.

```rust caption="Rust char values are 4-byte Unicode scalar values."
let letter: char = 'A';
let crab: char = '🦀';
let kanji: char = '字';
println!("char size in bytes: {}", std::mem::size_of::<char>()); // 4 bytes
```

## Explicit Casting (`as`)
Rust never performs implicit numeric type conversion. To convert between numeric types, use the `as` keyword for explicit casting.

```rust caption="Explicit casting with `as`."
let integer: i32 = 100;
let float: f64 = integer as f64;
let byte: u8 = integer as u8;
```

# Common Mistakes

### Mixing numeric types in arithmetic
**Bad:**
```rust
let a: i32 = 10;
let b: f64 = 2.5;
let result = a * b; // Error: cannot multiply `i32` by `f64`
```
**Explanation:** Rust does not perform implicit widening or narrowing conversions.

**Good:**
```rust
let a: i32 = 10;
let b: f64 = 2.5;
let result = (a as f64) * b;
```
**Explanation:** Explicitly cast one operand to match the other using `as`.

**Compiler Error:**
```
error[E0308]: mismatched types
 --> src/main.rs:3:22
  |
3 |     let result = a * b;
  |                      ^ expected `i32`, found `f64`
```

### Single quotes vs Double quotes
**Bad:**
```rust
let c: char = "A"; // Error: expected `char`, found `&str`
```
**Explanation:** Double quotes denote string slices (`&str`), while single quotes denote single `char` literals.

**Good:**
```rust
let c: char = 'A';
```
**Explanation:** Use single quotes for `char` and double quotes for `&str`.

# Key Takeaways
- Rust requires explicit type casting with `as`; implicit numeric promotion does not exist.
- `usize` and `isize` match the target architecture width (64-bit on x86_64 / arm64).
- `char` in Rust is 4 bytes representing a full Unicode Scalar Value, enclosed in single quotes.
- Booleans (`bool`) are strictly `true` or `false` (no truthy/falsy integer conversions).

# Quests

## Quest: tut-03-temperature-converter
**Type:** coding
**Title:** Celsius to Fahrenheit Converter
**Prompt:** Implement `celsius_to_fahrenheit(celsius: f64) -> f64` using the formula `(celsius * 9.0 / 5.0) + 32.0`. Round the result to 2 decimal places using `(result * 100.0).round() / 100.0`.
**Signature:** `pub fn celsius_to_fahrenheit(celsius: f64) -> f64`

### Starter Code
```rust
pub fn celsius_to_fahrenheit(celsius: f64) -> f64 {
    // TODO: Compute (c * 9/5) + 32 and round to 2 decimal places
    todo!()
}
```

### Test Harness
```rust
{{SOLUTION}}

fn main() {
    assert_eq!(celsius_to_fahrenheit(0.0), 32.0);
    assert_eq!(celsius_to_fahrenheit(100.0), 212.0);
    assert_eq!(celsius_to_fahrenheit(37.0), 98.6);
    assert_eq!(celsius_to_fahrenheit(-40.0), -40.0);
    println!("all tests passed");
}
```

### Solution
```rust
pub fn celsius_to_fahrenheit(celsius: f64) -> f64 {
    let f = (celsius * 9.0 / 5.0) + 32.0;
    (f * 100.0).round() / 100.0
}
```

### Walkthrough
We apply the conversion formula with floating-point literals, then multiply by 100, round to the nearest whole integer, and divide by 100.0 to round to two decimal places.

### Hints
- All float literals must include decimal points (e.g. `9.0`, `5.0`, `32.0`).
- Use the `.round()` method on `f64`.

## Quest: tut-03-quiz-char-size
**Type:** quiz
**Title:** Concept Check: Rust `char` Memory Layout
**Prompt:** How many bytes of memory does a Rust primitive `char` type occupy?

### Options
- [ ] A) 1 byte (like ASCII in C)
- [ ] B) 2 bytes (UTF-16 code unit)
- [x] C) 4 bytes (Unicode Scalar Value)
- [ ] D) Variable size (1 to 4 bytes depending on the glyph)

**Hint:** Remember that a `char` must be able to hold any Unicode scalar value (including emojis) in a fixed-size slot.

**Explanation:** In Rust, a `char` is always fixed at 4 bytes (32 bits) in memory to represent any valid Unicode Scalar Value (from U+0000 to U+D7FF and U+E000 to U+10FFFF). Variable byte lengths occur in UTF-8 strings (`&str`), not `char` primitives.
