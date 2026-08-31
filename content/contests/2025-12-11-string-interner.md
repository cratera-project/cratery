---
id: 2025-12-11-string-interner
title: "String Interner"
weekLabel: "Practice · Strings"
difficulty: 2
opensAt: "2025-12-11T00:00:00.000Z"
closesAt: "2025-12-18T00:00:00.000Z"
signature: "StringInterner - intern / resolve / len / iter"
supportedLanguages: [rust]
---

# Description
Implement a string interner that deduplicates strings and returns unique identifiers for each interned string. A string interner is a data structure that stores a single copy of each distinct string value, returning a unique "symbol" ID for each unique string. This is commonly used in compilers, interpreters, and other systems where many duplicate strings are processed.

Your interner should:
1. Accept strings and return a unique `Symbol` ID for each unique string
2. Allow retrieving the original string given a `Symbol`
3. Return the same `Symbol` for the same string value
4. Support iteration over all interned strings
5. Track the total count of interned strings

This pattern is used in real-world Rust projects like `rustc` (the Rust compiler) and `string-interner` crate.

Constraints:
- Use only the Rust standard library (no external crates)
- No `unsafe` code allowed
- Symbol IDs should be lightweight (just wrap a `usize`)
- Lookups by Symbol should be O(1)
- Interning should avoid unnecessary string cloning when possible
- The interner should own all strings

You may only edit the code below. Hit Run to compile and test against the judge, then Submit to verify.

# Examples

### Example 1
**Input:**
```rust
let mut interner = StringInterner::new();
let s1 = interner.intern("rust");
let s2 = interner.intern("rust");
let s3 = interner.intern("go");
```
**Output:**
```
s1 == s2 && s1 != s3
```
**Explanation:** Duplicate string allocations share the exact same Symbol ID.

### Example 2
**Input:**
```rust
let mut interner = StringInterner::new();
let sym = interner.intern("rust");
interner.resolve(sym)
```
**Output:**
```
Some("rust")
```
**Explanation:** Symbols resolve in O(1) back to the owned string slice.

# Starter Code
```rust
use std::collections::HashMap;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct Symbol(usize);

impl Symbol {
    pub fn as_usize(&self) -> usize {
        self.0
    }
}

pub struct StringInterner {
    strings: Vec<String>,
    lookup: HashMap<String, Symbol>,
}

impl StringInterner {
    /// Create a new empty string interner
    pub fn new() -> Self {
        Self { strings: Vec::new(), lookup: HashMap::new() }
    }

    /// Intern a string, returning its unique symbol.
    /// If the string was already interned, returns the existing symbol.
    pub fn intern(&mut self, s: &str) -> Symbol {
        let _ = s;
        Symbol(0)
    }

    /// Resolve a symbol back to its string.
    /// Returns None if the symbol is not valid.
    pub fn resolve(&self, symbol: Symbol) -> Option<&str> {
        None
    }

    /// Returns the number of unique strings interned.
    pub fn len(&self) -> usize {
        0
    }

    /// Returns true if no strings have been interned.
    pub fn is_empty(&self) -> bool {
        false
    }

    /// Iterate over all interned strings with their symbols.
    pub fn iter(&self) -> impl Iterator<Item = (Symbol, &str)> {
        std::iter::empty()
    }
}

impl Default for StringInterner {
    fn default() -> Self {
        Self::new()
    }
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    // test_basic_intern
    {
        let mut interner = StringInterner::new();

        let sym1 = interner.intern("hello");
        let sym2 = interner.intern("world");
        let sym3 = interner.intern("hello"); // Same as sym1

        assert_eq!(sym1, sym3, "Same string should return same symbol");
        assert_ne!(sym1, sym2, "Different strings should have different symbols");
        assert_eq!(interner.len(), 2);
    }

    // test_resolve
    {
        let mut interner = StringInterner::new();

        let sym = interner.intern("rust");

        assert_eq!(interner.resolve(sym), Some("rust"));
        assert_eq!(interner.resolve(Symbol(999)), None);
    }

    // test_empty_string
    {
        let mut interner = StringInterner::new();

        let empty1 = interner.intern("");
        let empty2 = interner.intern("");

        assert_eq!(empty1, empty2);
        assert_eq!(interner.resolve(empty1), Some(""));
        assert_eq!(interner.len(), 1);
    }

    // test_many_strings
    {
        let mut interner = StringInterner::new();
        let mut symbols = Vec::new();

        for i in 0..1000 {
            let s = format!("string_{}", i);
            symbols.push((interner.intern(&s), s));
        }

        assert_eq!(interner.len(), 1000);

        for (sym, expected) in &symbols {
            assert_eq!(interner.resolve(*sym), Some(expected.as_str()));
        }
    }

    // test_iteration
    {
        let mut interner = StringInterner::new();

        interner.intern("alpha");
        interner.intern("beta");
        interner.intern("gamma");
        interner.intern("alpha"); // Duplicate

        let entries: Vec<_> = interner.iter().collect();
        assert_eq!(entries.len(), 3);

        // Verify all strings are present
        let strings: Vec<&str> = entries.iter().map(|(_, s)| *s).collect();
        assert!(strings.contains(&"alpha"));
        assert!(strings.contains(&"beta"));
        assert!(strings.contains(&"gamma"));
    }

    // test_symbol_ordering
    {
        let mut interner = StringInterner::new();

        let sym1 = interner.intern("first");
        let sym2 = interner.intern("second");
        let sym3 = interner.intern("third");

        assert_eq!(sym1.as_usize(), 0);
        assert_eq!(sym2.as_usize(), 1);
        assert_eq!(sym3.as_usize(), 2);
    }

    // test_is_empty
    {
        let mut interner = StringInterner::new();

        assert!(interner.is_empty());
        assert_eq!(interner.len(), 0);

        interner.intern("test");

        assert!(!interner.is_empty());
        assert_eq!(interner.len(), 1);
    }

    // test_unicode_strings
    {
        let mut interner = StringInterner::new();

        let sym1 = interner.intern("こんにちは");
        let sym2 = interner.intern("🦀 Ferris");
        let sym3 = interner.intern("こんにちは");

        assert_eq!(sym1, sym3);
        assert_ne!(sym1, sym2);

        assert_eq!(interner.resolve(sym1), Some("こんにちは"));
        assert_eq!(interner.resolve(sym2), Some("🦀 Ferris"));
    }

    println!("all tests passed");
}
```
