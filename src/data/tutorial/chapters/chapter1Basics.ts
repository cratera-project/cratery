import type { TutorialChapter } from '../types'

export const chapter1Basics: TutorialChapter = {
  id: 'getting-started',
  number: 1,
  title: 'Getting Started & The Basics',
  description: 'Master the anatomy of a Rust program, cargo, immutable bindings, scalar types, and compound collections.',
  icon: '🚀',
  lessons: [
    {
      id: '01-hello-world',
      chapterId: 'getting-started',
      chapterNumber: 1,
      lessonNumber: 1,
      title: 'Hello Rust: Anatomy of a Program',
      tagline: 'Your first steps in Rust: the main function, macros, and compile-time guarantees.',
      readTimeMinutes: 5,
      difficulty: 'beginner',
      tags: ['main', 'println!', 'macros', 'cargo'],
      overview: 'Rust is a systems programming language focused on performance, safety, and concurrency. Every standalone Rust binary starts execution in the `main` function. Unlike many languages, Rust distinguishes between regular function calls and macro invocations, using an exclamation mark `!` for macros.',
      sections: [
        {
          id: 'anatomy-main',
          title: 'The Entry Point: `fn main()`',
          content: `In Rust, execution begins at the \`main\` function. Function definitions use the \`fn\` keyword, followed by the function name, parentheses for arguments, and curly braces containing the function body.

By default, \`main\` takes no arguments and returns the unit type \`()\`, which represents an empty tuple (similar to \`void\` in C/C++ or Java).`,
          codeSnippet: {
            code: `fn main() {
    println!("Hello, Cratery!");
}`,
            caption: 'A standard minimal Rust entry point program.',
            runnable: true,
          },
        },
        {
          id: 'println-macro',
          title: 'Printing and Macros (`println!`)',
          content: `The \`println!\` call looks like a function, but the exclamation point \`!\` indicates that it is a **declarative macro**. 

Why is \`println!\` a macro instead of a function?
1. **Variable arguments**: \`println!\` can accept any number of format arguments.
2. **Compile-time format string validation**: Rust verifies during compilation that the format string placeholders \`{}\` match the number and types of arguments provided. If you pass fewer arguments than placeholders, your code will fail to compile rather than crash at runtime!`,
          codeSnippet: {
            code: `fn main() {
    let name = "Ferris";
    let age = 10;
    // Basic positional interpolation
    println!("Name: {}, Age: {}", name, age);
    
    // Named arguments
    println!("{greeting}, {name}!", greeting = "Welcome", name = name);
    
    // Debug format specifier {:?}
    println!("Debug print: {:?}", (1, "tuple", true));
}`,
            caption: 'Formatting text and debug representations using println!.',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Omitting the exclamation mark on macros',
          badCode: `fn main() {
    println("Hello world"); // Error: cannot find function \`println\`
}`,
          badExplanation: '`println` is not a standard function. Without the `!` token, rustc searches for a function named `println` in scope and fails.',
          goodCode: `fn main() {
    println!("Hello world");
}`,
          goodExplanation: 'Always append `!` when invoking macros like `println!`, `format!`, `vec!`, or `panic!`.',
          compilerErrorSnippet: `error[E0425]: cannot find function \`println\` in this scope
 --> src/main.rs:2:5
  |
2 |     println("Hello world");
  |     ^^^^^^^ help: use \`println!\` instead`,
        },
        {
          title: 'Mismatching format string placeholders',
          badCode: `fn main() {
    println!("User {} is {} years old", "Alice"); // 2 placeholders, 1 arg
}`,
          badExplanation: 'Rust guarantees format safety at compile time. Having 2 `{}` placeholders but only 1 argument produces a hard compile error.',
          goodCode: `fn main() {
    println!("User {} is {} years old", "Alice", 28);
}`,
          goodExplanation: 'Ensure the count of `{}` format specifiers matches the supplied arguments.',
        },
      ],
      keyTakeaways: [
        'Every Rust binary begins execution at `fn main()`.',
        'Macros are called with an exclamation point `!` and are expanded at compile time.',
        'Format strings in `println!` and `format!` are checked at compile time for safety.',
      ],
      quests: [
        {
          id: 'tut-01-format-greeting',
          type: 'coding',
          title: 'Format a Welcome Message',
          prompt: 'Write a function `format_welcome(name: &str, level: u32) -> String` that returns a formatted greeting string in the exact format: `"Welcome to Cratery, <name>! Your current level is <level>."`. Use the `format!` macro.',
          signature: 'pub fn format_welcome(name: &str, level: u32) -> String',
          starterCode: `pub fn format_welcome(name: &str, level: u32) -> String {
    // TODO: Use format! macro to build the welcome message
    todo!()
}`,
          testHarness: `{{SOLUTION}}

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
}`,
          hints: [
            'Use the `format!` macro which returns an owned `String` instead of printing to stdout.',
            'Syntax: `format!("Welcome to Cratery, {}! Your current level is {}.", name, level)`',
          ],
          solutionCode: `pub fn format_welcome(name: &str, level: u32) -> String {
    format!("Welcome to Cratery, {}! Your current level is {}.", name, level)
}`,
          solutionWalkthrough: 'The `format!` macro constructs a heap-allocated `String` using the exact same formatting syntax as `println!`. We pass `name` into the first `{}` and `level` into the second `{}`.',
          xpReward: 15,
        },
        {
          id: 'tut-01-quiz-macro',
          type: 'quiz',
          title: 'Concept Check: Why is `println!` a macro in Rust?',
          prompt: 'Why does Rust provide `println!` as a macro rather than a regular function?',
          options: [
            { label: 'A', text: 'Because Rust functions cannot do I/O operations.' },
            { label: 'B', text: 'To allow variable numbers of arguments and compile-time format string validation.' },
            { label: 'C', text: 'Because macros in Rust are faster at runtime than compiled functions.' },
            { label: 'D', text: 'Because functions cannot print strings containing emojis.' },
          ],
          correctIndex: 1,
          explanation: 'Macros in Rust can accept variable numbers of arguments (variadic) and enable the compiler to inspect the format string at compile time to ensure type safety and matching argument counts.',
          hint: 'Think about what happens if you pass 3 arguments to 2 `{}` placeholders.',
          xpReward: 10,
        },
      ],
    },
    {
      id: '02-variables-and-mutability',
      chapterId: 'getting-started',
      chapterNumber: 1,
      lessonNumber: 2,
      title: 'Variables, Mutability & Shadowing',
      tagline: 'Why Rust variables are immutable by default and how shadowing differs from mutation.',
      readTimeMinutes: 7,
      difficulty: 'beginner',
      tags: ['let', 'mut', 'shadowing', 'const'],
      overview: 'In Rust, variables declared with `let` are **immutable by default**. This foundational design prevents accidental state mutations and data races. When mutation is explicitly needed, the `mut` keyword is added. Rust also supports **shadowing**, allowing you to redeclare a variable with the same name.',
      sections: [
        {
          id: 'immutability-default',
          title: 'Immutable by Default (`let`)',
          content: `When you bind a name with \`let x = 5;\`, \`x\` cannot be reassigned. If you attempt to reassign to an immutable variable, the compiler halts with an error.

To allow changes, prefix the variable name with \`mut\`:`,
          codeSnippet: {
            code: `fn main() {
    let x = 5;
    // x = 6; // COMPILE ERROR: cannot assign twice to immutable variable \`x\`

    let mut y = 10;
    println!("y was: {}", y);
    y += 5; // Valid because y is mutable
    println!("y is now: {}", y);
}`,
            caption: 'Contrasting immutable and mutable bindings.',
          },
        },
        {
          id: 'shadowing',
          title: 'Variable Shadowing',
          content: `**Shadowing** occurs when you declare a new variable with the same name as a previous one using the \`let\` keyword again.

Shadowing is different from marking a variable \`mut\`:
1. **Type transformation**: Shadowing allows you to change the type of the value while reusing the name.
2. **Re-established immutability**: After the shadow \`let\`, the variable is immutable again unless explicitly declared with \`let mut\`.`,
          codeSnippet: {
            code: `fn main() {
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
}`,
            caption: 'Shadowing allows changing types and local scope transformations cleanly.',
          },
        },
        {
          id: 'constants',
          title: 'Constants (`const`)',
          content: `Constants in Rust are declared using the \`const\` keyword. Unlike \`let\`:
- You **must** annotate the type explicitly.
- Constants can be declared in any scope, including the global scope outside functions.
- They are evaluated at compile time and cannot be set to the result of a runtime function call.
- They can never be made \`mut\`.`,
          codeSnippet: {
            code: `const MAX_CONNECTIONS: u32 = 10_000;
const THREE_HOURS_IN_SECONDS: u32 = 60 * 60 * 3;`,
            caption: 'Declaring compile-time constants.',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Reassigning without `mut`',
          badCode: `let score = 100;
score = 150; // Error: cannot assign twice to immutable variable`,
          badExplanation: 'Variables declared with `let` cannot be modified in place unless declared with `let mut`.',
          goodCode: `let mut score = 100;
score = 150;`,
          goodExplanation: 'Add `mut` when you intend to modify the variable in place.',
          compilerErrorSnippet: `error[E0384]: cannot assign twice to immutable variable \`score\`
 --> src/main.rs:2:5
  |
1 |     let score = 100;
  |         ----- first assignment to \`score\`
2 |     score = 150;
  |     ^^^^^^^^^^^ cannot assign twice to immutable variable`,
        },
        {
          title: 'Confusing `mut` with Shadowing when changing types',
          badCode: `let mut input = "42";
input = input.parse::<i32>().unwrap(); // Error: expected \`&str\`, found \`i32\``,
          badExplanation: '`mut` allows reassigning the value, but the type of a mutable variable cannot change.',
          goodCode: `let input = "42";
let input: i32 = input.parse().unwrap(); // OK: Shadowing with new type`,
          goodExplanation: 'Use `let` shadowing when you want to convert or transform data types.',
        },
      ],
      keyTakeaways: [
        'Variables are immutable by default in Rust for safety and predictability.',
        'Use `let mut` for variables whose value will change without changing their type.',
        'Use `let` shadowing to transform values, rebind names, or change data types within scopes.',
        'Constants with `const` must have explicit type annotations and are evaluated at compile time.',
      ],
      quests: [
        {
          id: 'tut-02-clamp-multiplier',
          type: 'coding',
          title: 'Score Multiplier with Shadowing & Mutability',
          prompt: 'Implement `calculate_score(base: i32, multiplier_str: &str, bonus: i32) -> i32`. The function should parse `multiplier_str` into an `i32` using shadowing (`let mult: i32 = ...`), multiply `base` by that multiplier into a mutable `total`, add `bonus` to `total`, and return `total`. If parsed multiplier is less than 1, clamp it to 1.',
          signature: 'pub fn calculate_score(base: i32, multiplier_str: &str, bonus: i32) -> i32',
          starterCode: `pub fn calculate_score(base: i32, multiplier_str: &str, bonus: i32) -> i32 {
    // TODO: Parse multiplier_str into i32 (default to 1 on failure if needed)
    // Clamp multiplier to at least 1
    // Calculate and return (base * mult) + bonus
    todo!()
}`,
          testHarness: `{{SOLUTION}}

fn main() {
    assert_eq!(calculate_score(10, "3", 5), 35);
    assert_eq!(calculate_score(20, "2", 0), 40);
    assert_eq!(calculate_score(15, "0", 10), 25); // clamped to 1: 15 * 1 + 10 = 25
    assert_eq!(calculate_score(5, "-4", 2), 7);   // clamped to 1: 5 * 1 + 2 = 7
    println!("all tests passed");
}`,
          hints: [
            'Parse the string using `multiplier_str.parse::<i32>().unwrap_or(1)`.',
            'Clamp using `let mult = if mult < 1 { 1 } else { mult };` or `mult.max(1)`.',
            'Initialize `let mut total = base * mult;` then add `total += bonus;`.',
          ],
          solutionCode: `pub fn calculate_score(base: i32, multiplier_str: &str, bonus: i32) -> i32 {
    let mult: i32 = multiplier_str.parse().unwrap_or(1);
    let mult = mult.max(1);
    let mut total = base * mult;
    total += bonus;
    total
}`,
          solutionWalkthrough: 'We parse the `multiplier_str` slice into an integer, shadow `mult` with its clamped maximum value of at least 1, then create a mutable `total` variable to compute and return the final score.',
          xpReward: 15,
        },
        {
          id: 'tut-02-quiz-shadowing',
          type: 'quiz',
          title: 'Concept Check: Mutability vs Shadowing',
          prompt: 'What will be the output of the following Rust code snippet?\n\n```rust\nfn main() {\n    let x = 5;\n    let x = x + 1;\n    {\n        let x = x * 2;\n        print!("{x} ");\n    }\n    print!("{x}");\n}\n```',
          options: [
            { label: 'A', text: '12 12' },
            { label: 'B', text: '12 6' },
            { label: 'C', text: '10 5' },
            { label: 'D', text: 'Compile error: cannot declare x three times' },
          ],
          correctIndex: 1,
          explanation: 'The outer scope shadows `x` to `5 + 1 = 6`. Inside the inner block, a new shadow binds `x` to `6 * 2 = 12` and prints "12 ". When the inner scope ends, the outer `x` (which is 6) is untouched and prints "6".',
          hint: 'Remember that shadowing inside an inner `{}` block does not alter the variable in the outer enclosing scope.',
          xpReward: 10,
        },
      ],
    },
    {
      id: '03-primitive-types',
      chapterId: 'getting-started',
      chapterNumber: 1,
      lessonNumber: 3,
      title: 'Scalar Data Types & Casting',
      tagline: 'Integers, floating-point numbers, booleans, and 4-byte Unicode characters.',
      readTimeMinutes: 7,
      difficulty: 'beginner',
      tags: ['types', 'integers', 'floats', 'bool', 'char', 'casting'],
      overview: 'Rust is a statically typed language, meaning the compiler must know the types of all variables at compile time. Scalar types represent a single value. Rust has four primary scalar types: integers, floating-point numbers, booleans, and characters.',
      sections: [
        {
          id: 'integer-types',
          title: 'Integer Types & Widths',
          content: `Integers are numbers without fractional components. Rust provides signed (\`i\`) and unsigned (\`u\`) integers across multiple bit widths:

| Length | Signed | Unsigned |
|---|---|---|
| 8-bit | \`i8\` (-128 to 127) | \`u8\` (0 to 255) |
| 16-bit | \`i16\` | \`u16\` |
| 32-bit (default) | \`i32\` | \`u32\` |
| 64-bit | \`i64\` | \`u64\` |
| 128-bit | \`i128\` | \`u128\` |
| Architecture-dependent | \`isize\` | \`usize\` (used for indexing & sizes) |

You can use visual number separators like \`1_000_000\` or type suffixes like \`42u8\` for clarity.`,
          codeSnippet: {
            code: `let a: i32 = -42;
let b: u64 = 1_000_000_u64;
let idx: usize = 0; // standard type for collection indices`,
            caption: 'Integer definitions with explicit types and suffixes.',
          },
        },
        {
          id: 'floats-and-bools',
          title: 'Floats & Booleans',
          content: `Rust has two primitive floating-point types: \`f32\` (single precision) and \`f64\` (double precision, default on modern CPUs).

Booleans (\`bool\`) have two values: \`true\` and \`false\` and occupy one byte in memory. Unlike C or Python, numbers in Rust do **not** implicitly convert to booleans.`,
          codeSnippet: {
            code: `let x = 2.0; // f64 by default
let y: f32 = 3.14; // f32
let is_active = true;
// if 1 { ... } // COMPILE ERROR: expected \`bool\`, found integer`,
            caption: 'Floats and strict boolean checks.',
          },
        },
        {
          id: 'char-type',
          title: 'The `char` Type (4-Byte Unicode)',
          content: `In Rust, single quotes denote a \`char\`, while double quotes denote string literals. A Rust \`char\` is **4 bytes in size** and represents a Unicode Scalar Value. It can represent ASCII letters, accented glyphs, emojis, Chinese characters, and more natively.`,
          codeSnippet: {
            code: `let letter: char = 'A';
let crab: char = '🦀';
let kanji: char = '字';
println!("char size in bytes: {}", std::mem::size_of::<char>()); // 4 bytes`,
            caption: 'Rust char values are 4-byte Unicode scalar values.',
          },
        },
        {
          id: 'type-casting',
          title: 'Explicit Casting (`as`)',
          content: `Rust never performs implicit numeric type conversion. To convert between numeric types, use the \`as\` keyword for explicit casting.`,
          codeSnippet: {
            code: `let integer: i32 = 100;
let float: f64 = integer as f64;
let byte: u8 = integer as u8;`,
            caption: 'Explicit casting with `as`.',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Mixing numeric types in arithmetic',
          badCode: `let a: i32 = 10;
let b: f64 = 2.5;
let result = a * b; // Error: cannot multiply \`i32\` by \`f64\``,
          badExplanation: 'Rust does not perform implicit widening or narrowing conversions.',
          goodCode: `let a: i32 = 10;
let b: f64 = 2.5;
let result = (a as f64) * b;`,
          goodExplanation: 'Explicitly cast one operand to match the other using `as`.',
          compilerErrorSnippet: `error[E0308]: mismatched types
 --> src/main.rs:3:22
  |
3 |     let result = a * b;
  |                      ^ expected \`i32\`, found \`f64\``,
        },
        {
          title: 'Single quotes vs Double quotes',
          badCode: `let c: char = "A"; // Error: expected \`char\`, found \`&str\``,
          badExplanation: 'Double quotes denote string slices (`&str`), while single quotes denote single `char` literals.',
          goodCode: `let c: char = 'A';`,
          goodExplanation: 'Use single quotes for `char` and double quotes for `&str`.',
        },
      ],
      keyTakeaways: [
        'Rust requires explicit type casting with `as`; implicit numeric promotion does not exist.',
        '`usize` and `isize` match the target architecture width (64-bit on x86_64 / arm64).',
        '`char` in Rust is 4 bytes representing a full Unicode Scalar Value, enclosed in single quotes.',
        'Booleans (`bool`) are strictly `true` or `false` (no truthy/falsy integer conversions).',
      ],
      quests: [
        {
          id: 'tut-03-temperature-converter',
          type: 'coding',
          title: 'Celsius to Fahrenheit Converter',
          prompt: 'Implement `celsius_to_fahrenheit(celsius: f64) -> f64` using the formula `(celsius * 9.0 / 5.0) + 32.0`. Round the result to 2 decimal places using `(result * 100.0).round() / 100.0`.',
          signature: 'pub fn celsius_to_fahrenheit(celsius: f64) -> f64',
          starterCode: `pub fn celsius_to_fahrenheit(celsius: f64) -> f64 {
    // TODO: Compute (c * 9/5) + 32 and round to 2 decimal places
    todo!()
}`,
          testHarness: `{{SOLUTION}}

fn main() {
    assert_eq!(celsius_to_fahrenheit(0.0), 32.0);
    assert_eq!(celsius_to_fahrenheit(100.0), 212.0);
    assert_eq!(celsius_to_fahrenheit(37.0), 98.6);
    assert_eq!(celsius_to_fahrenheit(-40.0), -40.0);
    println!("all tests passed");
}`,
          hints: [
            'All float literals must include decimal points (e.g. `9.0`, `5.0`, `32.0`).',
            'Use the `.round()` method on `f64`.',
          ],
          solutionCode: `pub fn celsius_to_fahrenheit(celsius: f64) -> f64 {
    let f = (celsius * 9.0 / 5.0) + 32.0;
    (f * 100.0).round() / 100.0
}`,
          solutionWalkthrough: 'We apply the conversion formula with floating-point literals, then multiply by 100, round to the nearest whole integer, and divide by 100.0 to round to two decimal places.',
          xpReward: 15,
        },
        {
          id: 'tut-03-quiz-char-size',
          type: 'quiz',
          title: 'Concept Check: Rust `char` Memory Layout',
          prompt: 'How many bytes of memory does a Rust primitive `char` type occupy?',
          options: [
            { label: 'A', text: '1 byte (like ASCII in C)' },
            { label: 'B', text: '2 bytes (UTF-16 code unit)' },
            { label: 'C', text: '4 bytes (Unicode Scalar Value)' },
            { label: 'D', text: 'Variable size (1 to 4 bytes depending on the glyph)' },
          ],
          correctIndex: 2,
          explanation: 'In Rust, a `char` is always fixed at 4 bytes (32 bits) in memory to represent any valid Unicode Scalar Value (from U+0000 to U+D7FF and U+E000 to U+10FFFF). Variable byte lengths occur in UTF-8 strings (`&str`), not `char` primitives.',
          hint: 'Remember that a `char` must be able to hold any Unicode scalar value (including emojis) in a fixed-size slot.',
          xpReward: 10,
        },
      ],
    },
    {
      id: '04-compound-types',
      chapterId: 'getting-started',
      chapterNumber: 1,
      lessonNumber: 4,
      title: 'Compound Types: Tuples & Arrays',
      tagline: 'Grouping multiple values into fixed-size tuples and fixed-size arrays.',
      readTimeMinutes: 7,
      difficulty: 'beginner',
      tags: ['tuples', 'arrays', 'destructuring', 'indexing'],
      overview: 'Compound types can group multiple values into one type. Rust has two primitive compound types: **tuples** (which can group values of different types with fixed length) and **arrays** (which group values of the exact same type with fixed length allocated on the stack).',
      sections: [
        {
          id: 'tuples',
          title: 'Tuples & Destructuring',
          content: `A tuple is a general way of grouping together values with a variety of types into one compound type. Tuples have a fixed length: once declared, they cannot grow or shrink.

You can access individual tuple elements using dot notation with indices (\`.0\`, \`.1\`, etc.) or pattern destructure them:`,
          codeSnippet: {
            code: `fn main() {
    let tup: (i32, f64, &str) = (500, 6.4, "cratery");
    
    // Direct index access
    let count = tup.0;
    let ratio = tup.1;
    
    // Destructuring pattern matching
    let (x, y, z) = tup;
    println!("Destructured: x={}, y={}, z={}", x, y, z);
    
    // Empty tuple (Unit type)
    let unit: () = ();
}`,
            caption: 'Creating, indexing, and destructuring tuples.',
          },
        },
        {
          id: 'arrays',
          title: 'Fixed-Size Arrays (`[T; N]`)',
          content: `An array is a collection of multiple values where **every element must have the same type**, and the array has a **fixed length known at compile time**. Arrays in Rust are allocated directly on the stack.

The array type signature is written as \`[Type; Length]\`:`,
          codeSnippet: {
            code: `fn main() {
    let numbers: [i32; 5] = [1, 2, 3, 4, 5];
    
    // Initialize an array with repeated elements: [value; count]
    let zeros: [u8; 100] = [0; 100]; // 100 zeros
    
    // Indexing
    let first = numbers[0];
    let second = numbers[1];
    
    // Length
    println!("Length: {}", numbers.len());
}`,
            caption: 'Declaring and initializing stack-allocated arrays.',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Out-of-bounds array access at runtime',
          badCode: `let items = [10, 20, 30];
let out = items[5]; // Panics at runtime with index out of bounds!`,
          badExplanation: 'Accessing an index >= array.len() causes Rust to panic to protect memory safety.',
          goodCode: `let items = [10, 20, 30];
if let Some(&val) = items.get(5) {
    println!("Found {}", val);
} else {
    println!("Index out of bounds!");
}`,
          goodExplanation: 'Use the `.get(index)` method which returns `Option<&T>` for safe runtime bounds-checked access.',
        },
      ],
      keyTakeaways: [
        'Tuples group heterogeneous types; accessed by destructuring or index `.0`, `.1`.',
        'Arrays `[T; N]` group homogeneous values of a fixed length `N` known at compile time on the stack.',
        'Initialize repeated array elements with `[val; count]`.',
        'Use `.get(idx)` when the index comes from user input to avoid index out of bounds panics.',
      ],
      quests: [
        {
          id: 'tut-04-tuple-stats',
          type: 'coding',
          title: 'Compute Array Min, Max & Average',
          prompt: 'Implement `array_stats(arr: [i32; 4]) -> (i32, i32, f64)` which returns a tuple containing `(min, max, average)`. The average must be computed as `f64`.',
          signature: 'pub fn array_stats(arr: [i32; 4]) -> (i32, i32, f64)',
          starterCode: `pub fn array_stats(arr: [i32; 4]) -> (i32, i32, f64) {
    // TODO: Calculate minimum, maximum, and average of the 4 elements
    todo!()
}`,
          testHarness: `{{SOLUTION}}

fn main() {
    assert_eq!(array_stats([10, 20, 30, 40]), (10, 40, 25.0));
    assert_eq!(array_stats([5, 5, 5, 5]), (5, 5, 5.0));
    assert_eq!(array_stats([-10, 0, 10, 20]), (-10, 20, 5.0));
    println!("all tests passed");
}`,
          hints: [
            'Iterate through `arr` or compare elements to find min and max.',
            'Sum the elements as `i32`, cast to `f64` using `sum as f64 / 4.0`.',
          ],
          solutionCode: `pub fn array_stats(arr: [i32; 4]) -> (i32, i32, f64) {
    let mut min = arr[0];
    let mut max = arr[0];
    let mut sum: i64 = 0;
    for &val in &arr {
        if val < min { min = val; }
        if val > max { max = val; }
        sum += val as i64;
    }
    let avg = sum as f64 / 4.0;
    (min, max, avg)
}`,
          solutionWalkthrough: 'We initialize min and max with the first element, iterate over all 4 elements to update extremes and accumulate the sum, and finally return a 3-element tuple `(min, max, avg)`.',
          xpReward: 15,
        },
        {
          id: 'tut-04-quiz-unit-type',
          type: 'quiz',
          title: 'Concept Check: The Unit Type `()`',
          prompt: 'In Rust, what is the unit type `()`?',
          options: [
            { label: 'A', text: 'A null pointer equivalent that crashes on access.' },
            { label: 'B', text: 'An empty tuple with 0 elements and 0 bytes size, returned by functions with no return value.' },
            { label: 'C', text: 'A special boolean that is neither true nor false.' },
            { label: 'D', text: 'An unsigned 1-bit integer type.' },
          ],
          correctIndex: 1,
          explanation: 'The unit type `()` is an empty tuple. It has exactly one value (also written `()`), occupies zero bytes of memory, and is implicitly returned by expressions and functions that do not return any other meaningful value.',
          hint: 'Consider what `fn main()` returns by default when no return type is specified.',
          xpReward: 10,
        },
      ],
    },
  ],
}
