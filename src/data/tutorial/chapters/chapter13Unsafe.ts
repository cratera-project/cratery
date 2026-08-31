import type { TutorialChapter } from '../types'

export const chapter13Unsafe: TutorialChapter = {
  id: 'unsafe-rust',
  number: 13,
  title: 'Unsafe Rust & Systems Programming',
  description: 'Unlocking Rust’s superpowers: raw pointers, calling foreign C APIs via FFI, and maintaining unsafe invariants.',
  icon: '🛡️',
  lessons: [
    {
      id: '34-unsafe-and-raw-pointers',
      chapterId: 'unsafe-rust',
      chapterNumber: 13,
      lessonNumber: 34,
      title: 'Unsafe Rust & Raw Pointers',
      tagline: 'Working with `*const T` and `*mut T` when you need absolute control over memory.',
      readTimeMinutes: 7,
      difficulty: 'advanced',
      tags: ['unsafe', 'raw-pointers', 'memory', 'pointers'],
      overview:
        'Unsafe Rust grants five superpowers: dereferencing raw pointers, calling unsafe functions, implementing unsafe traits, mutating static variables, and accessing fields of unions. Unsafe does not disable the borrow checker, but allows you to uphold invariants manually.',
      sections: [
        {
          id: 'raw-pointers-basics',
          title: 'Creating and Dereferencing Raw Pointers',
          content: `Raw pointers (\`*const T\` and \`*mut T\`) can be created in safe code without restrictions. However, **dereferencing** them requires an \`unsafe\` block because the compiler cannot guarantee valid memory or absence of data races.`,
          codeSnippet: {
            code: `fn main() {
    let mut num = 42;

    // Creating raw pointers is completely SAFE
    let r1 = &num as *const i32;
    let r2 = &mut num as *mut i32;

    // Dereferencing raw pointers requires UNSAFE
    unsafe {
        println!("r1 points to: {}", *r1);
        *r2 = 99;
        println!("r2 updated value to: {}", *r2);
    }
}`,
            caption: 'Creating raw pointers in safe code and dereferencing them in unsafe blocks.',
          },
        },
        {
          id: 'unsafe-functions-invariants',
          title: 'Unsafe Functions & Safe Abstractions',
          content: `An \`unsafe fn\` signals to callers that they must uphold specific contracts (e.g. non-null, valid alignment, bounds) to prevent Undefined Behavior (UB). Safe abstractions wrap unsafe internals with safe public interfaces (like \`Vec\` or \`String\`).`,
          codeSnippet: {
            code: `use std::slice;

// Safe wrapper around unsafe pointer indexing
pub fn custom_split_at_mut(values: &mut [i32], mid: usize) -> (&mut [i32], &mut [i32]) {
    let len = values.len();
    let ptr = values.as_mut_ptr();
    assert!(mid <= len);

    unsafe {
        (
            slice::from_raw_parts_mut(ptr, mid),
            slice::from_raw_parts_mut(ptr.add(mid), len - mid),
        )
    }
}`,
            caption: 'Building safe abstractions around unsafe pointer manipulation.',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Creating Aliased Mutable References',
          badCode: `let mut val = 10;
let p = &mut val as *mut i32;
unsafe {
    let r1 = &mut *p;
    let r2 = &mut *p; // UB: Two active mutable references to the same memory!
    *r1 += 1;
    *r2 += 1;
}`,
          badExplanation: 'Creating two active `&mut` references to the same memory location triggers instant Undefined Behavior (UB) under the Stacked Borrows / Tree Borrows model.',
          goodCode: `let mut val = 10;
let p = &mut val as *mut i32;
unsafe {
    // Modify through raw pointer arithmetic directly without aliasing &mut references
    *p += 1;
    *p += 1;
}`,
          goodExplanation: 'Manipulate memory via raw pointers directly without creating illegal overlapping mutable references.',
        },
      ],
      keyTakeaways: [
        'Raw pointers (*const T, *mut T) ignore borrowing rules, can be null, and lack automatic cleanup.',
        'Dereferencing raw pointers requires an unsafe block.',
        'The idiomatic Rust pattern is wrapping unsafe operations inside airtight safe APIs.',
      ],
      quests: [],
    },
    {
      id: '35-ffi-and-c-interop',
      chapterId: 'unsafe-rust',
      chapterNumber: 13,
      lessonNumber: 35,
      title: 'FFI & C Interoperability',
      tagline: 'Calling C libraries from Rust and exposing Rust functions to C with zero overhead.',
      readTimeMinutes: 6,
      difficulty: 'advanced',
      tags: ['ffi', 'extern', 'c-interop', 'abi', 'systems'],
      overview:
        'Foreign Function Interface (FFI) allows Rust to call functions written in C (or other languages) and vice versa. Using `extern "C"` and `#[repr(C)]`, Rust matches the C Application Binary Interface (ABI) precisely.',
      sections: [
        {
          id: 'calling-c-functions',
          title: 'Calling External C Functions',
          content: `To call C functions, declare them in an \`unsafe extern "C"\` block. In Rust 2024 Edition, the \`unsafe\` keyword is required on \`extern\` blocks because the compiler cannot verify the signatures or safety invariants of foreign C libraries.

> 🛡️ **Sandbox Security Note**: To prevent unverified host library execution and potential memory escapes, online microVM judge engines (such as Cratera) restrict raw \`extern "C"\` blocks in competitive coding submissions.`,
          codeSnippet: {
            code: `use std::ffi::c_int;

// In Rust 2024, foreign extern blocks are declared with 'unsafe'
unsafe extern "C" {
    fn abs(input: c_int) -> c_int;
}

fn main() {
    unsafe {
        let result = abs(-42);
        println!("Absolute value from C standard library: {}", result);
    }
}`,
            caption: 'Declaring and calling an external C standard library function in Rust 2024.',
          },
        },
        {
          id: 'exposing-rust-to-c',
          title: 'Exposing Rust Functions with `#[unsafe(no_mangle)]`',
          content: `To allow C code to call Rust, disable Rust symbol name mangling with \`#[unsafe(no_mangle)]\` and specify the \`extern "C"\` calling convention. In Rust 2024 Edition, \`no_mangle\` is categorized as an unsafe attribute:`,
          codeSnippet: {
            code: `#[unsafe(no_mangle)]
pub extern "C" fn rust_add(a: i32, b: i32) -> i32 {
    a + b
}`,
            caption: 'Exporting a C-compatible function with stable symbol name in Rust 2024.',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Using Default Rust Struct Layout with C FFI',
          badCode: `struct Point {
    x: i32,
    y: i32,
}`,
          badExplanation: 'Rust does not guarantee field order or alignment for standard structs, making them incompatible with C layouts.',
          goodCode: `#[repr(C)]
pub struct Point {
    pub x: i32,
    pub y: i32,
}`,
          goodExplanation: 'Adding #[repr(C)] forces the compiler to arrange struct memory matching C ABI specifications.',
        },
      ],
      keyTakeaways: [
        'FFI allows seamless, zero-cost integration between Rust and C/C++ libraries.',
        'Foreign function calls are always unsafe because Rust cannot verify foreign invariants.',
        'Use #[repr(C)] on structs and #[unsafe(no_mangle)] extern "C" on exported functions in Rust 2024.',
      ],
      quests: [],
    },
  ],
}
