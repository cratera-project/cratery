---
id: 25-closures
chapterId: iterators-closures
chapterNumber: 9
lessonNumber: 1
title: "Closures & Capture Semantics"
tagline: "Anonymous functions that capture their enclosing environment."
readTimeMinutes: 7
difficulty: intermediate
tags: [closures, Fn, FnMut, FnOnce, move]
---

# Overview
Rust’s closures are anonymous functions you can save in a variable or pass as arguments. Unlike functions, closures can **capture values from the scope in which they are defined**.

# Sections

## Closure Syntax and Type Inference
Closure syntax uses pipes `|param1, param2|` instead of parentheses:

```rust caption="Closure syntax and automatic type inference."
let add_one = |x: i32| -> i32 { x + 1 };
// Short form with full type inference:
let double = |x| x * 2;
println!("Double 5: {}", double(5));
```

## How Closures Capture Environment: The 3 Traits
A closure automatically implements one or more closure traits based on how it uses captured variables:
1. **`Fn`**: Captures by immutable reference (`&T`). The closure can be called repeatedly without mutating its environment.
2. **`FnMut`**: Captures by mutable reference (`&mut T`). Can be called repeatedly and can mutate captured variables.
3. **`FnOnce`**: Takes ownership of captured variables by moving them (`T`). Can only be called **once** because it consumes its captured state.

The `move` keyword forces a closure to take ownership of captured variables:

```rust caption="Using move closures to take full ownership."
let text = String::from("cratery");
// The 'move' keyword forces 'text' into the closure's ownership
let print_text = move || {
    println!("Text: {}", text);
};
print_text();
```

# Common Mistakes

### Calling a `FnOnce` closure more than once
**Bad:**
```rust
let s = String::from("consume");
let consume = || {
    let owned = s; // Moves 's' inside the closure body
    drop(owned);
};
consume();
consume(); // Error: use of moved value: `consume`
```
**Explanation:** Because `consume` moved `s`, it implements `FnOnce` and cannot be called a second time.

**Good:**
```rust
let s = String::from("borrow");
let inspect = || {
    println!("{}", s); // Only borrows 's' immutably (&s), implements Fn
};
inspect();
inspect(); // OK!
```
**Explanation:** Borrow rather than move data inside closures if you need to call them multiple times.

# Key Takeaways
- Closures use `|params| expression` syntax and capture environment variables.
- `Fn` borrows immutably, `FnMut` borrows mutably, and `FnOnce` consumes ownership.
- Use `move || ...` to transfer ownership of environment variables into the closure.

# Quests

## Quest: tut-25-custom-accumulator
**Type:** coding
**Title:** Custom Counter Closure
**Prompt:** Implement `make_adder(start: i32) -> impl FnMut(i32) -> i32`. The returned closure should maintain an internal accumulator starting at `start`. Each time it is called with `step`, it adds `step` to the accumulator and returns the new accumulator total.
**Signature:** `pub fn make_adder(mut start: i32) -> impl FnMut(i32) -> i32`

### Starter Code
```rust
pub fn make_adder(mut start: i32) -> impl FnMut(i32) -> i32 {
    // TODO: Return a move closure that mutates and returns start
    todo!()
}
```

### Test Harness
```rust
{{SOLUTION}}

fn main() {
    let mut counter = make_adder(10);
    assert_eq!(counter(5), 15);
    assert_eq!(counter(10), 25);
    assert_eq!(counter(-5), 20);
    println!("all tests passed");
}
```

### Solution
```rust
pub fn make_adder(mut start: i32) -> impl FnMut(i32) -> i32 {
    move |step: i32| {
        start += step;
        start
    }
}
```

### Walkthrough
The `move` keyword captures `start` by value inside the closure environment, and mutating `start` makes the closure implement `FnMut`.

### Hints
- Use `move |step| { start += step; start }`.

## Quest: tut-25-quiz-fnonce
**Type:** quiz
**Title:** Concept Check: What triggers a closure to implement `FnOnce` only?
**Prompt:** Which action causes a closure to implement `FnOnce` and prevent multiple invocations?

### Options
- [ ] A) Printing a captured integer.
- [x] B) Moving an owned value out of the captured environment inside the closure body.
- [ ] C) Passing more than two parameters to the closure.
- [ ] D) Using type annotations on closure parameters.

**Hint:** Think about what happens when ownership is consumed.

**Explanation:** If a closure moves an owned captured variable out of its environment (e.g. dropping it or returning it by value), the closure can only run once (`FnOnce`) because the variable no longer exists after the first run.
