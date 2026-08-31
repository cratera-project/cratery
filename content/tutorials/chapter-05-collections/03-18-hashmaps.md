---
id: 18-hashmaps
chapterId: collections
chapterNumber: 5
lessonNumber: 3
title: "HashMaps & The Entry API"
tagline: "Key-value mapping and idiomatic in-place updates with `.entry()`."
readTimeMinutes: 7
difficulty: intermediate
tags: [hashmap, entry-api, key-value, collections]
---

# Overview
The type `HashMap<K, V>` stores a mapping of keys of type `K` to values of type `V` using a hashing function. Rust's `Entry` API provides an elegant, zero-overhead way to inspect, insert, and update map entries in place.

# Sections

## Basic HashMap Operations
To use `HashMap`, import it from `std::collections::HashMap`:

```rust caption="Basic HashMap insertion and retrieval."
use std::collections::HashMap;

fn main() {
    let mut scores = HashMap::new();
    scores.insert("Blue", 10);
    scores.insert("Yellow", 50);

    // Reading values
    let team_name = "Blue";
    if let Some(&score) = scores.get(team_name) {
        println!("{}: {}", team_name, score);
    }
}
```

## The Powerful Entry API (`.entry().or_insert()`)
The `.entry()` method checks if a key is present and returns an `Entry` enum. Calling `.or_insert()` returns a mutable reference `&mut V` to the value, inserting the default if it didn't exist:

```rust caption="Counting frequencies cleanly with the Entry API."
use std::collections::HashMap;

fn word_count(text: &str) -> HashMap<&str, u32> {
    let mut counts = HashMap::new();
    for word in text.split_whitespace() {
        let count = counts.entry(word).or_insert(0);
        *count += 1; // Dereference and increment in place!
    }
    counts
}
```

# Common Mistakes

### Using separate `.contains_key()` followed by `.insert()`
**Bad:**
```rust
let mut map = HashMap::new();
let key = "apple";
if !map.contains_key(key) {
    map.insert(key, 0); // Performs 2 separate hash lookups!
}
```
**Explanation:** Calling `contains_key` then `insert` hashes and traverses the bucket table twice.

**Good:**
```rust
let mut map = HashMap::new();
map.entry("apple").or_insert(0); // Performs 1 single hash lookup
```
**Explanation:** The Entry API performs the lookup and potential insertion in a single efficient pass.

# Key Takeaways
- HashMaps map keys to values using `std::collections::HashMap`.
- `.get(&key)` returns `Option<&V>`.
- Use `.entry(key).or_insert(default)` for concise, single-pass lookup and mutation.

# Quests

## Quest: tut-18-char-frequencies
**Type:** coding
**Title:** Character Frequency Counter with Entry API
**Prompt:** Implement `char_frequencies(text: &str) -> std::collections::HashMap<char, usize>`. Count the frequency of each ASCII alphanumeric character in `text`, converted to lowercase. Ignore spaces and punctuation.
**Signature:** `pub fn char_frequencies(text: &str) -> std::collections::HashMap<char, usize>`

### Starter Code
```rust
use std::collections::HashMap;

pub fn char_frequencies(text: &str) -> HashMap<char, usize> {
    // TODO: Count frequency of each alphanumeric char (lowercase)
    todo!()
}
```

### Test Harness
```rust
{{SOLUTION}}

fn main() {
    let freq = char_frequencies("Hello, World!");
    assert_eq!(freq.get(&'h'), Some(&1));
    assert_eq!(freq.get(&'e'), Some(&1));
    assert_eq!(freq.get(&'l'), Some(&3));
    assert_eq!(freq.get(&'o'), Some(&2));
    assert_eq!(freq.get(&'w'), Some(&1));
    assert_eq!(freq.get(&'r'), Some(&1));
    assert_eq!(freq.get(&'d'), Some(&1));
    assert_eq!(freq.get(&' '), None); // spaces ignored
    assert_eq!(freq.get(&'!'), None); // punctuation ignored
    println!("all tests passed");
}
```

### Solution
```rust
use std::collections::HashMap;

pub fn char_frequencies(text: &str) -> HashMap<char, usize> {
    let mut map = HashMap::new();
    for c in text.chars() {
        if c.is_alphanumeric() {
            let lower = c.to_ascii_lowercase();
            *map.entry(lower).or_insert(0) += 1;
        }
    }
    map
}
```

### Walkthrough
We iterate through all characters in the string slice, filter for alphanumeric characters, convert to lowercase, and update counts with `*map.entry(lower).or_insert(0) += 1;`.

### Hints
- Filter with `c.is_alphanumeric()`, convert with `c.to_ascii_lowercase()`.
- Update map with `*map.entry(c).or_insert(0) += 1;`.

## Quest: tut-18-quiz-entry-api
**Type:** quiz
**Title:** Concept Check: What does `.entry(key).or_insert(default)` return?
**Prompt:** What type does the method call `map.entry(key).or_insert(0)` return in Rust?

### Options
- [ ] A) A boolean indicating if the key was newly inserted.
- [x] B) A mutable reference `&mut V` to the value for the key in the map.
- [ ] C) A clone of the entire HashMap.
- [ ] D) An immutable integer value.

**Hint:** Remember that you can dereference and mutate the result directly with `*`.

**Explanation:** `.or_insert()` returns a mutable reference `&mut V` to the value corresponding to `key` (either existing or newly inserted), allowing you to dereference and modify it in place with `*ref += 1`.
