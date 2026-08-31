---
id: 24-struct-lifetimes
chapterId: lifetimes
chapterNumber: 8
lessonNumber: 2
title: "Lifetimes in Structs & The `'static` Lifetime"
tagline: "Storing borrowed references in data structures and binary-duration data."
readTimeMinutes: 7
difficulty: advanced
tags: [struct-lifetimes, 'static, references, borrowing]
---

# Overview
So far, our structs have owned all their data. Structs can also hold references, but in that case, we must add a lifetime annotation on every reference in the struct definition.

# Sections

## Structs Holding References
To store a reference inside a struct, we annotate the struct with a lifetime parameter `struct Excerpt<'a> { part: &'a str }`.

This annotation means an instance of `Excerpt` **cannot outlive the reference it holds in its `part` field**.

```rust caption="ImportantExcerpt holds a slice borrowed from novel."
struct ImportantExcerpt<'a> {
    part: &'a str,
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let first_sentence = novel.split('.').next().expect("Could not find a '.'");
    
    let i = ImportantExcerpt {
        part: first_sentence,
    };
    println!("Excerpt: {}", i.part);
}
```

## The `'static` Lifetime
The `'static` lifetime denotes that the data can live for the entire duration of the program. All string literals `"hello"` have the `'static` lifetime because their text is hardcoded directly into the read-only data segment of the binary.

```rust caption="String literals have a static lifetime."
let s: &'static str = "I have a static lifetime.";
```

# Common Mistakes

### Letting the owned data drop before the struct that borrows it
**Bad:**
```rust
struct Holder<'a> { r: &'a str }
let holder;
{
    let s = String::from("temp");
    holder = Holder { r: &s }; // Error: `s` does not live long enough
}
println!("{}", holder.r);
```
**Explanation:** `s` drops at the end of the inner block, but `holder` tries to access it in the outer block.

**Good:**
```rust
let s = String::from("temp");
let holder = Holder { r: &s };
println!("{}", holder.r);
```
**Explanation:** Ensure the owned resource has an enclosing scope that outlives the borrowing struct.

# Key Takeaways
- Structs that store references must declare lifetime parameters: `struct Container<'a> { data: &'a str }`.
- A struct holding a reference cannot outlive the data it references.
- `'static` indicates data stored in the binary that lasts for the entire execution.

# Quests

## Quest: tut-24-token-stream
**Type:** coding
**Title:** Zero-Copy Token Stream Struct
**Prompt:** Create a struct `TokenStream<'a>` with fields `pub text: &'a str` and `pub pos: usize`. Implement `new(text: &'a str) -> Self` and `next_token(&mut self) -> Option<&'a str>` which returns whitespace-separated word slices from `text` one by one, updating `pos`.
**Signature:** `pub struct TokenStream<'a> ... impl<'a> TokenStream<'a> ...`

### Starter Code
```rust
pub struct TokenStream<'a> {
    pub text: &'a str,
    pub pos: usize,
}

impl<'a> TokenStream<'a> {
    pub fn new(text: &'a str) -> Self {
        todo!()
    }

    pub fn next_token(&mut self) -> Option<&'a str> {
        // TODO: Advance and return the next whitespace-separated word slice
        todo!()
    }
}
```

### Test Harness
```rust
{{SOLUTION}}

fn main() {
    let source = String::from("alpha beta gamma");
    let mut stream = TokenStream::new(&source);
    assert_eq!(stream.next_token(), Some("alpha"));
    assert_eq!(stream.next_token(), Some("beta"));
    assert_eq!(stream.next_token(), Some("gamma"));
    assert_eq!(stream.next_token(), None);
    println!("all tests passed");
}
```

### Solution
```rust
pub struct TokenStream<'a> {
    pub text: &'a str,
    pub pos: usize,
}

impl<'a> TokenStream<'a> {
    pub fn new(text: &'a str) -> Self {
        Self { text, pos: 0 }
    }

    pub fn next_token(&mut self) -> Option<&'a str> {
        let remaining = &self.text[self.pos..];
        let trimmed_start = remaining.trim_start();
        if trimmed_start.is_empty() {
            self.pos = self.text.len();
            return None;
        }

        let leading_spaces = remaining.len() - trimmed_start.len();
        let word_len = trimmed_start.find(char::is_whitespace).unwrap_or(trimmed_start.len());
        
        let start = self.pos + leading_spaces;
        let end = start + word_len;
        self.pos = end;
        Some(&self.text[start..end])
    }
}
```

### Walkthrough
`TokenStream<'a>` references borrowed slice `text` without allocating new memory, returning `&'a str` slices directly referencing original bytes.

### Hints
- Skip leading whitespace from `&self.text[self.pos..]`, find word end, update `self.pos`, and return slice.

## Quest: tut-24-quiz-static-str
**Type:** quiz
**Title:** Concept Check: The Lifetime of Hardcoded String Literals
**Prompt:** What lifetime does a string literal like `"hello cratery"` possess in Rust?

### Options
- [ ] A) It has the lifetime of the stack frame where it is defined.
- [x] B) `&'static str` because it is stored directly in the compiled binary's read-only data section.
- [ ] C) It has no lifetime and is dynamically allocated each time.
- [ ] D) It has a mutable lifetime.

**Hint:** Consider where string constants live in compiled binaries.

**Explanation:** String literals are stored in the read-only data segment of the compiled binary, meaning their memory address is valid for the entire runtime of the program (`'static`).
