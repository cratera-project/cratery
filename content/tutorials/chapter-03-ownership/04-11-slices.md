---
id: 11-slices
chapterId: ownership
chapterNumber: 3
lessonNumber: 4
title: "Slices: `&str` vs `String` and `&[T]`"
tagline: "Fat pointers, sub-slices, and Unicode safety without data copying."
readTimeMinutes: 7
difficulty: intermediate
tags: [slices, &str, fat-pointer, string]
---

# Overview
Slices let you reference a contiguous sequence of elements in a collection rather than the whole collection. A slice is a **fat pointer**: it stores a pointer to the starting element and a length.

# Sections

## String Slices (`&str`) vs `String`
- **`String`**: An owned, growable, heap-allocated UTF-8 buffer.
- **`&str`**: An immutable reference (slice) to a sequence of valid UTF-8 bytes somewhere in memory (on heap, stack, or static binary data).

Writing functions that accept `&str` allows callers to pass either `&String` or string literals `"..."` seamlessly via deref coercion!

```rust caption="Accepting &str gives maximum flexibility."
fn greet(name: &str) {
    println!("Hello, {}!", name);
}

fn main() {
    let owned = String::from("Alice");
    greet(&owned); // &String coerces to &str
    greet("Bob");  // &'static str literal
}
```

## Collection Slices (`&[T]`)
Just as string slices refer to a portion of a string, array slices refer to a portion of an array or vector:

```rust caption="Taking contiguous sub-slices of collections."
let a = [10, 20, 30, 40, 50];
let slice: &[i32] = &a[1..4]; // references [20, 30, 40]
assert_eq!(slice, &[20, 30, 40]);
```

# Common Mistakes

### Slicing a string on a non-UTF-8 char boundary
**Bad:**
```rust
let crab = "🦀"; // 4 bytes long in UTF-8
let bad = &crab[0..1]; // Panics at runtime: byte index 1 is not a char boundary!
```
**Explanation:** UTF-8 emojis and non-ASCII chars take 2 to 4 bytes. Slicing in the middle of a Unicode scalar value causes a panic.

**Good:**
```rust
let crab = "🦀";
let first_char = crab.chars().next().unwrap(); // Safe character extraction
```
**Explanation:** Use `.chars()` or `.char_indices()` when extracting characters from arbitrary strings.

# Key Takeaways
- A slice is a two-word "fat pointer" containing a pointer and a length.
- Prefer `&str` over `&String` and `&[T]` over `&Vec<T>` in function parameter signatures.
- String slicing requires byte indices to align with valid UTF-8 character boundaries.

# Quests

## Quest: tut-11-first-word
**Type:** coding
**Title:** Extract First Word Slice
**Prompt:** Implement `first_word(s: &str) -> &str` which returns a slice containing the first word of string `s` (up to the first space). If there are no spaces, return the whole string slice.
**Signature:** `pub fn first_word(s: &str) -> &str`

### Starter Code
```rust
pub fn first_word(s: &str) -> &str {
    // TODO: Find the first space and return slice s[0..idx], or entire slice
    todo!()
}
```

### Test Harness
```rust
{{SOLUTION}}

fn main() {
    assert_eq!(first_word("hello world"), "hello");
    assert_eq!(first_word("cratery"), "cratery");
    assert_eq!(first_word("rust is awesome"), "rust");
    assert_eq!(first_word(""), "");
    println!("all tests passed");
}
```

### Solution
```rust
pub fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }
    s
}
```

### Walkthrough
We convert the string slice to bytes to find the index of the first space byte `b' '`. Once found, we return the sub-slice `&s[0..i]` tied to the lifetime of `s`.

### Hints
- Iterate over `s.bytes().enumerate()` and check `if item == b' '`.
- Return `&s[0..i]`. If the loop finishes without finding a space, return `s`.

## Quest: tut-11-quiz-fat-pointer
**Type:** quiz
**Title:** Concept Check: What is stored inside a slice reference `&[i32]`?
**Prompt:** What data does the fat pointer of a slice reference `&[i32]` physically store on the stack?

### Options
- [ ] A) Only a memory address pointer to the first element.
- [x] B) A pointer to the data and the length (number of elements).
- [ ] C) A full clone of all array items.
- [ ] D) A pointer, length, and capacity.

**Hint:** Remember that slices borrow data and only need to know where it starts and how many items long it is.

**Explanation:** A slice reference `&[T]` is a fat pointer consisting of two `usize` words: a pointer to the start of the data and the slice length. (Capacity is only stored by owned vectors `Vec<T>`, not borrowed slices).
