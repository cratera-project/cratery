---
id: 17-strings-in-depth
chapterId: collections
chapterNumber: 5
lessonNumber: 2
title: "Strings in Depth: UTF-8 & Graphemes"
tagline: "Why Rust does not allow string indexing by number and how UTF-8 works."
readTimeMinutes: 7
difficulty: intermediate
tags: [strings, utf-8, chars, bytes]
---

# Overview
Rust strings are always guaranteed to be valid UTF-8 encoded sequences. Because UTF-8 characters can take between 1 and 4 bytes, direct integer indexing (such as `s[0]`) is not supported.

# Sections

## Bytes vs Chars vs Graphemes
In Rust:
1. **Bytes** (`s.bytes()`): The raw 8-bit bytes in memory.
2. **Chars** (`s.chars()`): Unicode Scalar Values (4 bytes each).
3. **Grapheme Clusters**: Visual human characters (e.g. `é` composed of `e` + accent modifier).

```rust caption="Iterating over Unicode scalar values."
let s = "🦀 hi";
println!("Byte length: {}", s.len()); // 7 bytes ('🦀' is 4 bytes + ' ' is 1 + 'h' is 1 + 'i' is 1)
println!("Char count: {}", s.chars().count()); // 4 chars

for c in s.chars() {
    print!("[{}] ", c);
}
// Outputs: [🦀] [ ] [h] [i]
```

# Common Mistakes

### Direct integer string indexing
**Bad:**
```rust
let s = "hello";
let c = s[0]; // Error: the type `str` cannot be indexed by `{integer}`
```
**Explanation:** Because UTF-8 characters have variable byte lengths, finding the N-th character in O(1) time without scanning is impossible.

**Good:**
```rust
let s = "hello";
let first_char = s.chars().next(); // Some('h')
```
**Explanation:** Use `.chars().nth(index)` or string slice iteration.

# Key Takeaways
- Rust `String` and `&str` are strictly guaranteed to be valid UTF-8.
- `s.len()` returns the byte count, NOT the character count.
- Rust prevents direct indexing `s[i]` to protect against O(n) performance traps and invalid UTF-8 slicing.

# Quests

## Quest: tut-17-reverse-words
**Type:** coding
**Title:** Reverse Words in a Sentence
**Prompt:** Implement `reverse_words(sentence: &str) -> String`. The function should split the sentence by whitespace, reverse the order of the words, and join them back with single spaces.
**Signature:** `pub fn reverse_words(sentence: &str) -> String`

### Starter Code
```rust
pub fn reverse_words(sentence: &str) -> String {
    // TODO: Split words, reverse their order, and join with space
    todo!()
}
```

### Test Harness
```rust
{{SOLUTION}}

fn main() {
    assert_eq!(reverse_words("hello world"), "world hello");
    assert_eq!(reverse_words("the quick brown fox"), "fox brown quick the");
    assert_eq!(reverse_words("cratery"), "cratery");
    assert_eq!(reverse_words(""), "");
    println!("all tests passed");
}
```

### Solution
```rust
pub fn reverse_words(sentence: &str) -> String {
    sentence.split_whitespace().rev().collect::<Vec<_>>().join(" ")
}
```

### Walkthrough
`split_whitespace()` splits on arbitrary spaces, `.rev()` reverses the iterator order, and `.join(" ")` joins the word slices into a new owned `String`.

### Hints
- Use `sentence.split_whitespace().rev().collect::<Vec<_>>().join(" ")`.

## Quest: tut-17-quiz-string-indexing
**Type:** quiz
**Title:** Concept Check: Why Rust Disallows `s[0]`
**Prompt:** Why does the Rust compiler reject string indexing with integers like `s[0]`?

### Options
- [ ] A) Because strings in Rust do not have a fixed start address in memory.
- [x] B) Because UTF-8 characters have variable byte lengths, so indexing cannot be guaranteed in O(1) time and could land inside a multi-byte character.
- [ ] C) Because strings are compiled to linked lists in binary code.
- [ ] D) Because indexing is only allowed on mutable variables.

**Hint:** Consider what happens to Unicode characters like emojis that take 4 bytes.

**Explanation:** In UTF-8, characters can be 1, 2, 3, or 4 bytes long. Indexing into byte 0 might only get a fragment of a multi-byte character, and calculating the Nth character requires scanning from the beginning, which cannot be O(1).
