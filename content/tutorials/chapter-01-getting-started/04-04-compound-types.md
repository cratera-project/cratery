---
id: 04-compound-types
chapterId: getting-started
chapterNumber: 1
lessonNumber: 4
title: "Compound Types: Tuples & Arrays"
tagline: "Grouping multiple values into fixed-size tuples and fixed-size arrays."
readTimeMinutes: 7
difficulty: beginner
tags: [tuples, arrays, destructuring, indexing]
---

# Overview
Compound types can group multiple values into one type. Rust has two primitive compound types: **tuples** (which can group values of different types with fixed length) and **arrays** (which group values of the exact same type with fixed length allocated on the stack).

# Sections

## Tuples & Destructuring
A tuple is a general way of grouping together values with a variety of types into one compound type. Tuples have a fixed length: once declared, they cannot grow or shrink.

You can access individual tuple elements using dot notation with indices (`.0`, `.1`, etc.) or pattern destructure them:

```rust caption="Creating, indexing, and destructuring tuples."
fn main() {
    let tup: (i32, f64, &str) = (500, 6.4, "cratery");
    
    // Direct index access
    let count = tup.0;
    let ratio = tup.1;
    
    // Destructuring pattern matching
    let (x, y, z) = tup;
    println!("Destructured: x={}, y={}, z={}", x, y, z);
    
    // Empty tuple (Unit type)
    let unit: () = ();
}
```

## Fixed-Size Arrays (`[T; N]`)
An array is a collection of multiple values where **every element must have the same type**, and the array has a **fixed length known at compile time**. Arrays in Rust are allocated directly on the stack.

The array type signature is written as `[Type; Length]`:

```rust caption="Declaring and initializing stack-allocated arrays."
fn main() {
    let numbers: [i32; 5] = [1, 2, 3, 4, 5];
    
    // Initialize an array with repeated elements: [value; count]
    let zeros: [u8; 100] = [0; 100]; // 100 zeros
    
    // Indexing
    let first = numbers[0];
    let second = numbers[1];
    
    // Length
    println!("Length: {}", numbers.len());
}
```

# Common Mistakes

### Out-of-bounds array access at runtime
**Bad:**
```rust
let items = [10, 20, 30];
let out = items[5]; // Panics at runtime with index out of bounds!
```
**Explanation:** Accessing an index >= array.len() causes Rust to panic to protect memory safety.

**Good:**
```rust
let items = [10, 20, 30];
if let Some(&val) = items.get(5) {
    println!("Found {}", val);
} else {
    println!("Index out of bounds!");
}
```
**Explanation:** Use the `.get(index)` method which returns `Option<&T>` for safe runtime bounds-checked access.

# Key Takeaways
- Tuples group heterogeneous types; accessed by destructuring or index `.0`, `.1`.
- Arrays `[T; N]` group homogeneous values of a fixed length `N` known at compile time on the stack.
- Initialize repeated array elements with `[val; count]`.
- Use `.get(idx)` when the index comes from user input to avoid index out of bounds panics.

# Quests

## Quest: tut-04-tuple-stats
**Type:** coding
**Title:** Compute Array Min, Max & Average
**Prompt:** Implement `array_stats(arr: [i32; 4]) -> (i32, i32, f64)` which returns a tuple containing `(min, max, average)`. The average must be computed as `f64`.
**Signature:** `pub fn array_stats(arr: [i32; 4]) -> (i32, i32, f64)`

### Starter Code
```rust
pub fn array_stats(arr: [i32; 4]) -> (i32, i32, f64) {
    // TODO: Calculate minimum, maximum, and average of the 4 elements
    todo!()
}
```

### Test Harness
```rust
{{SOLUTION}}

fn main() {
    assert_eq!(array_stats([10, 20, 30, 40]), (10, 40, 25.0));
    assert_eq!(array_stats([5, 5, 5, 5]), (5, 5, 5.0));
    assert_eq!(array_stats([-10, 0, 10, 20]), (-10, 20, 5.0));
    println!("all tests passed");
}
```

### Solution
```rust
pub fn array_stats(arr: [i32; 4]) -> (i32, i32, f64) {
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
}
```

### Walkthrough
We initialize min and max with the first element, iterate over all 4 elements to update extremes and accumulate the sum, and finally return a 3-element tuple `(min, max, avg)`.

### Hints
- Iterate through `arr` or compare elements to find min and max.
- Sum the elements as `i32`, cast to `f64` using `sum as f64 / 4.0`.

## Quest: tut-04-quiz-unit-type
**Type:** quiz
**Title:** Concept Check: The Unit Type `()`
**Prompt:** In Rust, what is the unit type `()`?

### Options
- [ ] A) A null pointer equivalent that crashes on access.
- [x] B) An empty tuple with 0 elements and 0 bytes size, returned by functions with no return value.
- [ ] C) A special boolean that is neither true nor false.
- [ ] D) An unsigned 1-bit integer type.

**Hint:** Consider what `fn main()` returns by default when no return type is specified.

**Explanation:** The unit type `()` is an empty tuple. It has exactly one value (also written `()`), occupies zero bytes of memory, and is implicitly returned by expressions and functions that do not return any other meaningful value.
