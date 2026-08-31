---
id: 2026-01-15-lifetime-slices
title: "Lifetime Text Slices"
weekLabel: "Practice · Lifetimes"
difficulty: 2
opensAt: "2026-01-15T00:00:00.000Z"
closesAt: "2026-01-22T00:00:00.000Z"
signature: "first_word / last_word / sentences / find_all / longest_word / extract_pairs"
supportedLanguages: [rust]
---

# Description
Implement a text analysis system that efficiently processes string slices without unnecessary allocations. The system should return references to portions of the input text, demonstrating proper lifetime management.

Your implementation should:
1. Find and return string slices from input text
2. Properly annotate lifetimes
3. Return references that are valid for the lifetime of the input
4. Parse and extract data without allocating new strings when possible
5. Handle multiple references with related lifetimes

This problem tests understanding of lifetimes, borrowing, and efficient string handling in Rust.

Constraints:
- Use only the Rust standard library (no external crates)
- No `unsafe` code allowed
- Minimize string allocations (prefer returning slices)
- All lifetime annotations must be explicit where required
- Functions should work with both &str and &String inputs

You may only edit the code below. Hit Run to compile and test against the judge, then Submit to verify.

# Examples

### Example 1
**Input:**
```rust
first_word("hello world")
```
**Output:**
```
Some("hello")
```
**Explanation:** Returns a slice into the input, not a new String.

### Example 2
**Input:**
```rust
sentences("Hello world. How are you? I am fine!")
```
**Output:**
```
["Hello world", "How are you", "I am fine"] (after trim)
```
**Explanation:** Split on ., !, or ?.

# Starter Code
```rust
/// Represents a word and its position in the original text.
#[derive(Debug, PartialEq)]
pub struct WordRef<'a> {
    pub word: &'a str,
    pub position: usize,
}

/// Find the first word in the text.
/// Returns None if text is empty or contains only whitespace.
pub fn first_word(text: &str) -> Option<&str> {
    None
}

/// Find the last word in the text.
/// Returns None if text is empty or contains only whitespace.
pub fn last_word(text: &str) -> Option<&str> {
    None
}

/// Split text into sentences (split by '.', '!', or '?').
/// Returns slices that reference the original text.
pub fn sentences(text: &str) -> Vec<&str> {
    Vec::new()
}

/// Find all occurrences of a word in the text.
/// Returns references with their positions.
pub fn find_all<'a>(text: &'a str, target: &str) -> Vec<WordRef<'a>> {
    Vec::new()
}

/// Get the longest word in the text.
/// If multiple words have the same length, return the first one.
pub fn longest_word(text: &str) -> Option<&str> {
    None
}

/// Extract key-value pairs from text in format "key: value".
/// Returns a vector of (key, value) tuples as slices.
pub fn extract_pairs(text: &str) -> Vec<(&str, &str)> {
    Vec::new()
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    // test_first_word
    {
        assert_eq!(first_word("hello world"), Some("hello"));
        assert_eq!(first_word("  spaces  before"), Some("spaces"));
        assert_eq!(first_word(""), None);
        assert_eq!(first_word("   "), None);
    }

    // test_last_word
    {
        assert_eq!(last_word("hello world"), Some("world"));
        assert_eq!(last_word("trailing  "), Some("trailing"));
        assert_eq!(last_word(""), None);
        assert_eq!(last_word("   "), None);
    }

    // test_sentences
    {
        let text = "Hello world. How are you? I am fine!";
        let sents = sentences(text);

        assert_eq!(sents.len(), 3);
        assert_eq!(sents[0].trim(), "Hello world");
        assert_eq!(sents[1].trim(), "How are you");
        assert_eq!(sents[2].trim(), "I am fine");
    }

    // test_find_all
    {
        let text = "the cat and the dog and the bird";
        let results = find_all(text, "the");

        assert_eq!(results.len(), 3);
        assert_eq!(results[0].word, "the");
        assert_eq!(results[0].position, 0);
        assert_eq!(results[1].position, 12);
        assert_eq!(results[2].position, 24);
    }

    // test_longest_word
    {
        assert_eq!(longest_word("short somewhat longer"), Some("somewhat"));
        assert_eq!(longest_word("a bb ccc bb"), Some("ccc"));
        assert_eq!(longest_word(""), None);
        assert_eq!(longest_word("equal same"), Some("equal")); // First of equal length
    }

    // test_extract_pairs
    {
        let text = "name: John\nage: 30\ncity: Boston";
        let pairs = extract_pairs(text);

        assert_eq!(pairs.len(), 3);
        assert_eq!(pairs[0], ("name", "John"));
        assert_eq!(pairs[1], ("age", "30"));
        assert_eq!(pairs[2], ("city", "Boston"));
    }

    // test_lifetime_relationships
    {
        let text = String::from("hello world");
        let first = first_word(&text);

        assert_eq!(first, Some("hello"));
    }

    // test_empty_and_whitespace
    {
        assert_eq!(first_word(""), None);
        assert_eq!(last_word("   "), None);
        assert_eq!(sentences("").len(), 0);
        assert_eq!(find_all("   ", "word").len(), 0);
        assert_eq!(longest_word("  \t\n  "), None);
    }

    // test_case_sensitivity
    {
        let text = "The the THE";
        let results = find_all(text, "the");

        assert_eq!(results.len(), 1);
        assert_eq!(results[0].word, "the");
        assert_eq!(results[0].position, 4);
    }

    println!("all tests passed");
}
```
