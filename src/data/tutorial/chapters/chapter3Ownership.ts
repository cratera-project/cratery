import type { TutorialChapter } from '../types'

export const chapter3Ownership: TutorialChapter = {
  id: 'ownership',
  number: 3,
  title: 'Ownership & The Borrow Checker',
  description: 'Understand the core of Rust: Move semantics, RAII memory cleanup, shared borrows, and mutable references.',
  icon: '🔒',
  lessons: [
    {
      id: '08-ownership-fundamentals',
      chapterId: 'ownership',
      chapterNumber: 3,
      lessonNumber: 1,
      title: 'Ownership Fundamentals: Move vs Copy & RAII',
      tagline: 'The three rules of ownership, stack vs heap, and automatic cleanup.',
      readTimeMinutes: 8,
      difficulty: 'beginner',
      tags: ['ownership', 'move', 'copy', 'raii', 'drop'],
      overview: 'Ownership is Rust\'s most unique feature. It enables Rust to guarantee memory safety at compile time without requiring a garbage collector. Memory is automatically managed through a system of rules that the compiler checks at compile time.',
      sections: [
        {
          id: 'three-rules',
          title: 'The 3 Rules of Ownership',
          content: `Memorize these three rules—they govern everything in Rust:
1. **Each value in Rust has an owner.**
2. **There can only be one owner at a time.**
3. **When the owner goes out of scope, the value is dropped (freed from memory).**`,
          codeSnippet: {
            code: `{
    let s = String::from("hello"); // s comes into scope, heap allocated
    // use s
} // s goes out of scope here; Rust automatically calls \`drop\` and frees heap memory!`,
            caption: 'Automatic RAII memory deallocation at scope end.',
          },
        },
        {
          id: 'move-semantics',
          title: 'Move Semantics vs `Copy` Types',
          content: `Types stored entirely on the stack that implement the \`Copy\` trait (such as integers, floats, booleans, chars, and fixed arrays of Copy types) are copied bitwise.

Heap-allocated types (like \`String\` or \`Vec\`) do **not** implement \`Copy\`. When you assign \`s1\` to \`s2\`, Rust performs a **Move**: it copies the pointer, length, and capacity on the stack, and **invalidates \`s1\`** so that the heap buffer is not double-freed!`,
          codeSnippet: {
            code: `fn main() {
    // Copy type (integers on stack)
    let x = 5;
    let y = x; // x is still valid!
    println!("x={}, y={}", x, y);

    // Non-Copy type (String on heap)
    let s1 = String::from("cratery");
    let s2 = s1; // Ownership MOVES to s2. s1 is now invalid!
    
    // println!("{}", s1); // COMPILE ERROR: borrow of moved value: \`s1\`
    println!("s2 owns: {}", s2);
}`,
            caption: 'Move semantics prevents double-free memory bugs.',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Using a variable after moving it',
          badCode: `let s1 = String::from("data");
let s2 = s1;
println!("{}", s1); // Error: value borrowed here after move`,
          badExplanation: 'When `s1` was assigned to `s2`, ownership moved to `s2`. `s1` is no longer valid.',
          goodCode: `let s1 = String::from("data");
let s2 = s1.clone(); // Explicit deep copy of heap buffer
println!("s1: {}, s2: {}", s1, s2);`,
          goodExplanation: 'Use `.clone()` if you explicitly want a deep copy of the heap data, or pass references.',
          compilerErrorSnippet: `error[E0382]: borrow of moved value: \`s1\`
 --> src/main.rs:3:20
  |
1 |     let s1 = String::from("data");
  |         -- move occurs because \`s1\` has type \`String\`
2 |     let s2 = s1;
  |              -- value moved here
3 |     println!("{}", s1);
  |                    ^^ value borrowed here after move`,
        },
      ],
      keyTakeaways: [
        'Each value has exactly one owner; when the owner drops out of scope, its memory is freed.',
        'Assigning a heap type transfers (moves) ownership, invalidating the previous binding.',
        'Stack-only primitives implement `Copy` and duplicate automatically on assignment.',
      ],
      quests: [
        {
          id: 'tut-08-ownership-transfer',
          type: 'coding',
          title: 'Safe String Transfer & Prefixing',
          prompt: 'Implement `prefix_and_consume(mut name: String, prefix: &str) -> String` which takes ownership of `name`, inserts `prefix` at the beginning, and returns the modified `String`.',
          signature: 'pub fn prefix_and_consume(mut name: String, prefix: &str) -> String',
          starterCode: `pub fn prefix_and_consume(mut name: String, prefix: &str) -> String {
    // TODO: Insert prefix at index 0 and return owned name
    todo!()
}`,
          testHarness: `{{SOLUTION}}

fn main() {
    let s = String::from("Rust");
    let result = prefix_and_consume(s, "Hello, ");
    assert_eq!(result, "Hello, Rust");

    let empty = String::new();
    assert_eq!(prefix_and_consume(empty, "Cratery"), "Cratery");
    println!("all tests passed");
}`,
          hints: [
            'Use `name.insert_str(0, prefix)` or `format!("{}{}", prefix, name)`.',
          ],
          solutionCode: `pub fn prefix_and_consume(mut name: String, prefix: &str) -> String {
    name.insert_str(0, prefix);
    name
}`,
          solutionWalkthrough: 'The function takes ownership of `name` by value, modifies its heap buffer with `.insert_str(0, prefix)`, and returns ownership back to the caller.',
          xpReward: 15,
        },
        {
          id: 'tut-08-quiz-copy-trait',
          type: 'quiz',
          title: 'Concept Check: Types Implementing `Copy`',
          prompt: 'Which of the following types implements the `Copy` trait in Rust?',
          options: [
            { label: 'A', text: '`String`' },
            { label: 'B', text: '`Vec<i32>`' },
            { label: 'C', text: '`(i32, bool, char)`' },
            { label: 'D', text: '`Box<i32>`' },
          ],
          correctIndex: 2,
          explanation: 'A tuple implements `Copy` if and only if all of its constituent elements implement `Copy`. Because `i32`, `bool`, and `char` are stack-only `Copy` types, `(i32, bool, char)` implements `Copy`. Heap-owning types (`String`, `Vec`, `Box`) do not implement `Copy`.',
          hint: 'Look for the type composed entirely of stack-allocated scalar primitives.',
          xpReward: 10,
        },
      ],
    },
    {
      id: '09-borrowing-and-references',
      chapterId: 'ownership',
      chapterNumber: 3,
      lessonNumber: 2,
      title: 'References & Borrowing (`&T`)',
      tagline: 'Accessing data without taking ownership: shared references and borrowing.',
      readTimeMinutes: 7,
      difficulty: 'intermediate',
      tags: ['borrowing', 'references', '&', 'aliasing'],
      overview: 'Instead of passing ownership back and forth, Rust allows you to **borrow** access to data using **references** (`&T`). References let you refer to some value without taking ownership of it.',
      sections: [
        {
          id: 'immutable-references',
          title: 'Shared References (`&T`)',
          content: `An ampersand \`&\` represents a reference. When a function takes a reference \`&String\`, it borrows read-only access to the string. Because it does not own the string, the value is not dropped when the function returns.`,
          codeSnippet: {
            code: `fn calculate_length(s: &String) -> usize {
    s.len() // s is a reference to a String
} // Here, s goes out of scope, but because it does not have ownership, nothing happens.

fn main() {
    let s1 = String::from("cratery");
    let len = calculate_length(&s1); // pass reference
    println!("The length of '{}' is {}.", s1, len); // s1 is still valid!
}`,
            caption: 'Borrowing via immutable reference &.',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Attempting to mutate behind a shared reference',
          badCode: `fn append_world(s: &String) {
    s.push_str(", world"); // Error: cannot borrow \`*s\` as mutable
}`,
          badExplanation: 'Shared references `&T` are immutable by default. You cannot mutate the data they point to.',
          goodCode: `fn append_world(s: &mut String) {
    s.push_str(", world");
}`,
          goodExplanation: 'Use a mutable reference `&mut String` if you need to modify the data.',
        },
      ],
      keyTakeaways: [
        'A reference `&T` lets you borrow access without taking ownership.',
        'You can have any number of shared (`&T`) references active simultaneously.',
        'Data cannot be mutated through a shared immutable reference.',
      ],
      quests: [
        {
          id: 'tut-09-sum-borrowed-slice',
          type: 'coding',
          title: 'Sum of Vector without Consuming',
          prompt: 'Implement `sum_elements(nums: &[i32]) -> i32` which computes and returns the sum of all elements in the borrowed slice `nums`.',
          signature: 'pub fn sum_elements(nums: &[i32]) -> i32',
          starterCode: `pub fn sum_elements(nums: &[i32]) -> i32 {
    // TODO: Sum elements in borrowed slice without taking ownership
    todo!()
}`,
          testHarness: `{{SOLUTION}}

fn main() {
    let numbers = vec![1, 2, 3, 4, 5];
    assert_eq!(sum_elements(&numbers), 15);
    assert_eq!(numbers.len(), 5); // vector is still owned and valid

    let empty: [i32; 0] = [];
    assert_eq!(sum_elements(&empty), 0);
    println!("all tests passed");
}`,
          hints: ['Use `nums.iter().sum()` or a `for &n in nums` loop.'],
          solutionCode: `pub fn sum_elements(nums: &[i32]) -> i32 {
    nums.iter().sum()
}`,
          solutionWalkthrough: 'By accepting a borrowed slice `&[i32]`, the function reads the elements without taking ownership, allowing the caller to continue using the original vector.',
          xpReward: 15,
        },
        {
          id: 'tut-09-quiz-borrow-rule',
          type: 'quiz',
          title: 'Concept Check: The Aliasing XOR Mutation Rule',
          prompt: 'Which of the following describes Rust\'s core reference rule?',
          options: [
            { label: 'A', text: 'You can have any number of mutable references at the same time.' },
            { label: 'B', text: 'You may have either multiple shared references (&T) OR exactly one mutable reference (&mut T) at any given time.' },
            { label: 'C', text: 'References can outlive the owner value.' },
            { label: 'D', text: 'Immutable references can modify heap data but not stack data.' },
          ],
          correctIndex: 1,
          explanation: 'Rust enforces the Aliasing XOR Mutation rule: at any given time, you can have either one or more immutable references (&T) to a resource, OR exactly one mutable reference (&mut T), but never both simultaneously.',
          hint: 'Think: "Many readers OR one writer".',
          xpReward: 10,
        },
      ],
    },
    {
      id: '10-mutable-references',
      chapterId: 'ownership',
      chapterNumber: 3,
      lessonNumber: 3,
      title: 'Mutable References (`&mut T`) & NLL',
      tagline: 'Exclusive modification, avoiding data races, and Non-Lexical Lifetimes.',
      readTimeMinutes: 8,
      difficulty: 'intermediate',
      tags: ['&mut', 'borrow-checker', 'nll', 'data-race'],
      overview: 'Mutable references allow you to mutate borrowed data. However, Rust places a strict constraint on them: you can have only **one mutable reference to a particular piece of data in a particular scope**.',
      sections: [
        {
          id: 'exclusive-borrow',
          title: 'The Exclusivity of `&mut`',
          content: `To create a mutable reference:
1. The original variable must be marked \`mut\`.
2. You create the reference with \`&mut s\`.
3. The function accepts \`&mut String\`.

This rule prevents **data races at compile time**. A data race occurs when two or more pointers access the same data concurrently and at least one is writing.`,
          codeSnippet: {
            code: `fn modify(s: &mut String) {
    s.push_str(" rocks!");
}

fn main() {
    let mut s = String::from("Rust");
    modify(&mut s);
    println!("{}", s); // "Rust rocks!"
}`,
            caption: 'Passing exclusive mutable references.',
          },
        },
        {
          id: 'nll',
          title: 'Non-Lexical Lifetimes (NLL)',
          content: `A reference's scope starts where it is introduced and continues through the **last time that reference is used**, not necessarily until the end of the curly brace \`}\`. This compiler capability is called Non-Lexical Lifetimes (NLL).`,
          codeSnippet: {
            code: `let mut s = String::from("hello");

let r1 = &s; // immutable borrow
let r2 = &s; // immutable borrow
println!("{} and {}", r1, r2);
// r1 and r2 are NOT used after this line

let r3 = &mut s; // Valid! r1 and r2's scopes ended after the println!
r3.push_str(" world");
println!("{}", r3);`,
            caption: 'NLL allows mutable borrows after the last usage of immutable borrows.',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Simultaneous mutable and immutable borrow',
          badCode: `let mut s = String::from("hello");
let r1 = &s;
let r2 = &mut s; // Error: cannot borrow \`s\` as mutable because it is also borrowed as immutable
println!("{}, {}", r1, r2);`,
          badExplanation: '`r1` is used in `println!`, so its lifetime overlaps with `r2`. Rust forbids reading through `r1` while `r2` has exclusive write access.',
          goodCode: `let mut s = String::from("hello");
let r1 = &s;
println!("{}", r1); // Last use of r1

let r2 = &mut s; // OK: r1 is no longer in use
r2.push_str(" world");`,
          goodExplanation: 'Finish using the immutable reference before creating the mutable reference.',
          compilerErrorSnippet: `error[E0502]: cannot borrow \`s\` as mutable because it is also borrowed as immutable
 --> src/main.rs:3:14
  |
2 |     let r1 = &s;
  |              -- immutable borrow occurs here
3 |     let r2 = &mut s;
  |              ^^^^^^ mutable borrow occurs here
4 |     println!("{}, {}", r1, r2);
  |                        -- immutable borrow later used here`,
        },
      ],
      keyTakeaways: [
        'You can have only ONE mutable reference (`&mut T`) to a value at a time.',
        'You cannot have a mutable reference while any immutable references are still in active use.',
        'Non-Lexical Lifetimes (NLL) ends a reference\'s lifetime at its last line of usage.',
      ],
      quests: [
        {
          id: 'tut-10-capitalize-in-place',
          type: 'coding',
          title: 'In-Place String Uppercaser',
          prompt: 'Implement `make_uppercase(s: &mut String)` which modifies the borrowed string `s` in place so that all ASCII characters become uppercase.',
          signature: 'pub fn make_uppercase(s: &mut String)',
          starterCode: `pub fn make_uppercase(s: &mut String) {
    // TODO: Mutate s in place to make all ASCII chars uppercase
    todo!()
}`,
          testHarness: `{{SOLUTION}}

fn main() {
    let mut msg = String::from("hello cratery");
    make_uppercase(&mut msg);
    assert_eq!(msg, "HELLO CRATERY");

    let mut empty = String::new();
    make_uppercase(&mut empty);
    assert_eq!(empty, "");
    println!("all tests passed");
}`,
          hints: [
            'Use `s.make_ascii_uppercase()` which operates directly on `&mut String`.',
          ],
          solutionCode: `pub fn make_uppercase(s: &mut String) {
    s.make_ascii_uppercase();
}`,
          solutionWalkthrough: '`make_ascii_uppercase()` takes `&mut self` and updates every ASCII byte in place without allocating a new string.',
          xpReward: 15,
        },
        {
          id: 'tut-10-quiz-data-race',
          type: 'quiz',
          title: 'Concept Check: What prevents data races in Rust?',
          prompt: 'How does the Rust compiler guarantee at compile time that data races cannot occur in safe code?',
          options: [
            { label: 'A', text: 'By putting global locks on every variable.' },
            { label: 'B', text: 'By enforcing that only one mutable reference OR multiple read-only references can exist at any given time.' },
            { label: 'C', text: 'By pausing all threads during write operations.' },
            { label: 'D', text: 'By running a background garbage collector thread.' },
          ],
          correctIndex: 1,
          explanation: 'Data races require simultaneous concurrent read/write or write/write access. By statically enforcing exclusive access for `&mut` at compile time, data races are made impossible in safe Rust.',
          hint: 'Consider the borrow checker\'s exclusivity guarantee.',
          xpReward: 10,
        },
      ],
    },
    {
      id: '11-slices',
      chapterId: 'ownership',
      chapterNumber: 3,
      lessonNumber: 4,
      title: 'Slices: `&str` vs `String` and `&[T]`',
      tagline: 'Fat pointers, sub-slices, and Unicode safety without data copying.',
      readTimeMinutes: 7,
      difficulty: 'intermediate',
      tags: ['slices', '&str', 'fat-pointer', 'string'],
      overview: 'Slices let you reference a contiguous sequence of elements in a collection rather than the whole collection. A slice is a **fat pointer**: it stores a pointer to the starting element and a length.',
      sections: [
        {
          id: 'string-slices',
          title: 'String Slices (`&str`) vs `String`',
          content: `- **\`String\`**: An owned, growable, heap-allocated UTF-8 buffer.
- **\`&str\`**: An immutable reference (slice) to a sequence of valid UTF-8 bytes somewhere in memory (on heap, stack, or static binary data).

Writing functions that accept \`&str\` allows callers to pass either \`&String\` or string literals \`"..."\` seamlessly via deref coercion!`,
          codeSnippet: {
            code: `fn greet(name: &str) {
    println!("Hello, {}!", name);
}

fn main() {
    let owned = String::from("Alice");
    greet(&owned); // &String coerces to &str
    greet("Bob");  // &'static str literal
}`,
            caption: 'Accepting &str gives maximum flexibility.',
          },
        },
        {
          id: 'array-slices',
          title: 'Collection Slices (`&[T]`)',
          content: `Just as string slices refer to a portion of a string, array slices refer to a portion of an array or vector:`,
          codeSnippet: {
            code: `let a = [10, 20, 30, 40, 50];
let slice: &[i32] = &a[1..4]; // references [20, 30, 40]
assert_eq!(slice, &[20, 30, 40]);`,
            caption: 'Taking contiguous sub-slices of collections.',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Slicing a string on a non-UTF-8 char boundary',
          badCode: `let crab = "🦀"; // 4 bytes long in UTF-8
let bad = &crab[0..1]; // Panics at runtime: byte index 1 is not a char boundary!`,
          badExplanation: 'UTF-8 emojis and non-ASCII chars take 2 to 4 bytes. Slicing in the middle of a Unicode scalar value causes a panic.',
          goodCode: `let crab = "🦀";
let first_char = crab.chars().next().unwrap(); // Safe character extraction`,
          goodExplanation: 'Use `.chars()` or `.char_indices()` when extracting characters from arbitrary strings.',
        },
      ],
      keyTakeaways: [
        'A slice is a two-word "fat pointer" containing a pointer and a length.',
        'Prefer `&str` over `&String` and `&[T]` over `&Vec<T>` in function parameter signatures.',
        'String slicing requires byte indices to align with valid UTF-8 character boundaries.',
      ],
      quests: [
        {
          id: 'tut-11-first-word',
          type: 'coding',
          title: 'Extract First Word Slice',
          prompt: 'Implement `first_word(s: &str) -> &str` which returns a slice containing the first word of string `s` (up to the first space). If there are no spaces, return the whole string slice.',
          signature: 'pub fn first_word(s: &str) -> &str',
          starterCode: `pub fn first_word(s: &str) -> &str {
    // TODO: Find the first space and return slice s[0..idx], or entire slice
    todo!()
}`,
          testHarness: `{{SOLUTION}}

fn main() {
    assert_eq!(first_word("hello world"), "hello");
    assert_eq!(first_word("cratery"), "cratery");
    assert_eq!(first_word("rust is awesome"), "rust");
    assert_eq!(first_word(""), "");
    println!("all tests passed");
}`,
          hints: [
            'Iterate over `s.bytes().enumerate()` and check `if item == b\' \'`.',
            'Return `&s[0..i]`. If the loop finishes without finding a space, return `s`.',
          ],
          solutionCode: `pub fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }
    s
}`,
          solutionWalkthrough: 'We convert the string slice to bytes to find the index of the first space byte `b\' \'`. Once found, we return the sub-slice `&s[0..i]` tied to the lifetime of `s`.',
          xpReward: 15,
        },
        {
          id: 'tut-11-quiz-fat-pointer',
          type: 'quiz',
          title: 'Concept Check: What is stored inside a slice reference `&[i32]`?',
          prompt: 'What data does the fat pointer of a slice reference `&[i32]` physically store on the stack?',
          options: [
            { label: 'A', text: 'Only a memory address pointer to the first element.' },
            { label: 'B', text: 'A pointer to the data and the length (number of elements).' },
            { label: 'C', text: 'A full clone of all array items.' },
            { label: 'D', text: 'A pointer, length, and capacity.' },
          ],
          correctIndex: 1,
          explanation: 'A slice reference `&[T]` is a fat pointer consisting of two `usize` words: a pointer to the start of the data and the slice length. (Capacity is only stored by owned vectors `Vec<T>`, not borrowed slices).',
          hint: 'Remember that slices borrow data and only need to know where it starts and how many items long it is.',
          xpReward: 10,
        },
      ],
    },
  ],
}
