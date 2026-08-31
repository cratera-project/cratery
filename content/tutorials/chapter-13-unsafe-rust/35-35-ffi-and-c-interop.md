---
id: 35-ffi-and-c-interop
chapterId: unsafe-rust
chapterNumber: 13
lessonNumber: 35
title: "FFI & C Interoperability"
tagline: "Calling C libraries from Rust and exposing Rust functions to C with zero overhead."
readTimeMinutes: 6
difficulty: advanced
tags: [ffi, extern, c-interop, abi, systems]
---

# Overview
Foreign Function Interface (FFI) allows Rust to call functions written in C (or other languages) and vice versa. Using `extern "C"` and `#[repr(C)]`, Rust matches the C Application Binary Interface (ABI) precisely.

# Sections

## Calling External C Functions
To call C functions, declare them in an `unsafe extern "C"` block. In Rust 2024 Edition, the `unsafe` keyword is required on `extern` blocks because the compiler cannot verify the signatures or safety invariants of foreign C libraries.

> 🛡️ **Sandbox Security Note**: To prevent unverified host library execution and potential memory escapes, online microVM judge engines (such as Cratera) restrict raw `extern "C"` blocks in competitive coding submissions.

```rust caption="Declaring and calling an external C standard library function in Rust 2024."
use std::ffi::c_int;

// In Rust 2024, foreign extern blocks are declared with 'unsafe'
unsafe extern "C" {
    fn abs(input: c_int) -> c_int;
}

fn main() {
    unsafe {
        let result = abs(-42);
        println!("Absolute value from C standard library: {}", result);
    }
}
```

## Exposing Rust Functions with `#[unsafe(no_mangle)]`
To allow C code to call Rust, disable Rust symbol name mangling with `#[unsafe(no_mangle)]` and specify the `extern "C"` calling convention. In Rust 2024 Edition, `no_mangle` is categorized as an unsafe attribute:

```rust caption="Exporting a C-compatible function with stable symbol name in Rust 2024."
#[unsafe(no_mangle)]
pub extern "C" fn rust_add(a: i32, b: i32) -> i32 {
    a + b
}
```

# Common Mistakes

### Using Default Rust Struct Layout with C FFI
**Bad:**
```rust
struct Point {
    x: i32,
    y: i32,
}
```
**Explanation:** Rust does not guarantee field order or alignment for standard structs, making them incompatible with C layouts.

**Good:**
```rust
#[repr(C)]
pub struct Point {
    pub x: i32,
    pub y: i32,
}
```
**Explanation:** Adding #[repr(C)] forces the compiler to arrange struct memory matching C ABI specifications.

# Key Takeaways
- FFI allows seamless, zero-cost integration between Rust and C/C++ libraries.
- Foreign function calls are always unsafe because Rust cannot verify foreign invariants.
- Use #[repr(C)] on structs and #[unsafe(no_mangle)] extern "C" on exported functions in Rust 2024.
