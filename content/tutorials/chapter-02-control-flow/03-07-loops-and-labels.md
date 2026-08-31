---
id: 07-loops-and-labels
chapterId: control-flow
chapterNumber: 2
lessonNumber: 3
title: "Loops: `loop`, `while`, `for`, and Loop Labels"
tagline: "Infinite loops that return values, iterator loops, and labeled breaks."
readTimeMinutes: 7
difficulty: beginner
tags: [loop, while, for, break, labels]
---

# Overview
Rust provides three kinds of loops: `loop` (an infinite loop that can return a value via `break value`), `while` (a conditional loop), and `for` (the most idiomatic loop for iterating over ranges and collections).

# Sections

## Returning Values from `loop` with `break`
Rust's `loop` keyword creates an endless loop until explicitly broken. One powerful feature of `loop` is that **`break` can return a value** out of the loop directly into a variable:

```rust caption="Returning a value directly from a loop using break."
fn main() {
    let mut counter = 0;
    
    let result = loop {
        counter += 1;
        if counter == 10 {
            break counter * 2; // Returns 20 out of the loop
        }
    };
    
    println!("The result is: {}", result); // 20
}
```

## `for` Loops and Inclusive Ranges
The `for` loop is the safest and fastest way to iterate in Rust because the compiler eliminates array bounds checking when iterating over elements.

Use exclusive ranges `0..5` (0 to 4) or inclusive ranges `1..=5` (1 to 5):

```rust caption="Iterating through numeric ranges and collection items."
fn main() {
    // Exclusive range: 1, 2, 3, 4
    for number in 1..5 {
        print!("{} ", number);
    }
    
    // Inclusive range: 1, 2, 3, 4, 5
    for number in 1..=5 {
        print!("{} ", number);
    }
    
    // Iterating over an array slice
    let items = ["apple", "banana", "cherry"];
    for item in items {
        println!("Fruit: {}", item);
    }
}
```

## Disambiguating Nested Loops with Loop Labels
When nesting loops, a regular `break` or `continue` only applies to the innermost loop. You can prefix loops with a **label** starting with a single quote (e.g. `'outer:`) to break or continue outer loops directly:

```rust caption="Using loop labels to break out of nested loops."
fn main() {
    'outer: for x in 0..10 {
        'inner: for y in 0..10 {
            if x * y > 20 {
                println!("Breaking outer loop at x={}, y={}", x, y);
                break 'outer; // Breaks the outer loop directly
            }
        }
    }
}
```

# Common Mistakes

### Using `while` with index instead of `for in`
**Bad:**
```rust
let arr = [10, 20, 30];
let mut idx = 0;
while idx < arr.len() {
    println!("{}", arr[idx]); // Incurs runtime bounds check on every access
    idx += 1;
}
```
**Explanation:** Manual indexing is error prone and slower because rustc must check array bounds on every iteration.

**Good:**
```rust
let arr = [10, 20, 30];
for &elem in &arr {
    println!("{}", elem); // Fast, zero bounds-check overhead
}
```
**Explanation:** Use `for elem in &arr` for idiomatic, safe, zero-cost iteration.

# Key Takeaways
- `loop` can evaluate to a value using `break <value>`.
- `for in` is the idiomatic way to iterate over ranges (`0..N`, `0..=N`) and collections.
- Use loop labels (e.g. `'label: loop`) to break or continue enclosing outer loops from within inner loops.

# Quests

## Quest: tut-07-collatz-steps
**Type:** coding
**Title:** Collatz Conjecture Step Counter with `loop`
**Prompt:** Implement `collatz_steps(mut n: u64) -> u64` to return the number of steps to reach `1`. In each step: if `n` is even, `n = n / 2`; if `n` is odd, `n = 3 * n + 1`. If `n <= 1`, return 0.
**Signature:** `pub fn collatz_steps(mut n: u64) -> u64`

### Starter Code
```rust
pub fn collatz_steps(mut n: u64) -> u64 {
    // TODO: Count steps until n reaches 1
    todo!()
}
```

### Test Harness
```rust
{{SOLUTION}}

fn main() {
    assert_eq!(collatz_steps(1), 0);
    assert_eq!(collatz_steps(2), 1);
    assert_eq!(collatz_steps(6), 8);
    assert_eq!(collatz_steps(27), 111);
    println!("all tests passed");
}
```

### Solution
```rust
pub fn collatz_steps(mut n: u64) -> u64 {
    if n <= 1 {
        return 0;
    }
    let mut steps = 0;
    while n > 1 {
        if n % 2 == 0 {
            n /= 2;
        } else {
            n = 3 * n + 1;
        }
        steps += 1;
    }
    steps
}
```

### Walkthrough
We check for base cases, then loop while `n > 1`, updating `n` according to the Collatz rules and incrementing our step counter.

### Hints
- Handle `if n <= 1 { return 0; }` first.
- Use `let mut steps = 0;` and a `while n > 1` loop.

## Quest: tut-07-quiz-loop-break
**Type:** quiz
**Title:** Concept Check: Breaking with a Return Value
**Prompt:** Which looping construct in Rust allows returning a value using `break <expression>;` to assign to a variable?

### Options
- [x] A) `loop`
- [ ] B) `while`
- [ ] C) `for`
- [ ] D) `goto`

**Hint:** Think about which loop guarantees an exit only through an explicit break statement.

**Explanation:** Only the `loop` construct allows returning a value via `break value;` because `loop` is guaranteed to only exit through an explicit `break`, whereas `while` and `for` can exit when their conditions become false.
