---
id: 21-generics
chapterId: generics-traits
chapterNumber: 7
lessonNumber: 1
title: "Generics & Monomorphization"
tagline: "Writing functions and structs that operate over any type without runtime overhead."
readTimeMinutes: 7
difficulty: intermediate
tags: [generics, monomorphization, zero-cost, <T>]
---

# Overview
Generics allow you to write abstract code that works with multiple concrete types. Rust implements generics via **monomorphization**: at compile time, the compiler duplicates and specializes functions for each concrete type used, resulting in zero runtime performance penalty.

# Sections

## Generic Functions
To make a function generic, place type parameter names inside angle brackets `<T>`:

```rust caption="Generic swap function specialized at compile time."
// Swap two values of any type T
fn swap<T>(a: &mut T, b: &mut T) {
    std::mem::swap(a, b);
}

fn main() {
    let mut x = 5;
    let mut y = 10;
    swap(&mut x, &mut y);
    println!("x={}, y={}", x, y); // x=10, y=5
    
    let mut s1 = "hello".to_string();
    let mut s2 = "world".to_string();
    swap(&mut s1, &mut s2); // specialized for String!
}
```

## Generic Structs
You can define structs holding generic types `T` and `U`:

```rust caption="Generic Point struct and method implementation."
struct Point<T> {
    x: T,
    y: T,
}

impl<T> Point<T> {
    fn x(&self) -> &T {
        &self.x
    }
}
```

# Common Mistakes

### Assuming different generic fields can have different types
**Bad:**
```rust
struct Point<T> {
    x: T,
    y: T,
}
let p = Point { x: 5, y: 4.0 }; // Error: expected integer, found float
```
**Explanation:** Both `x` and `y` are declared as the same type parameter `T`.

**Good:**
```rust
struct Point<T, U> {
    x: T,
    y: U,
}
let p = Point { x: 5, y: 4.0 }; // OK: T is i32, U is f64
```
**Explanation:** Use distinct generic parameters `<T, U>` when fields can hold different types.

# Key Takeaways
- Generics `<T>` allow writing flexible, reusable code.
- Monomorphization compiles generic code into dedicated concrete machine code with zero runtime cost.
- Multiple distinct generic types must use separate parameter names `<T, U>`.

# Quests

## Quest: tut-21-generic-pair
**Type:** coding
**Title:** Generic Pair Swapper
**Prompt:** Define a struct `Pair<T, U> { pub first: T, pub second: U }`. Implement method `swap(self) -> Pair<U, T>` which returns a new `Pair` with `first` and `second` swapped.
**Signature:** `pub struct Pair<T, U> ... impl<T, U> Pair<T, U> ...`

### Starter Code
```rust
pub struct Pair<T, U> {
    pub first: T,
    pub second: U,
}

impl<T, U> Pair<T, U> {
    pub fn new(first: T, second: U) -> Self {
        todo!()
    }

    pub fn swap(self) -> Pair<U, T> {
        todo!()
    }
}
```

### Test Harness
```rust
{{SOLUTION}}

fn main() {
    let p = Pair::new(10, "cratery");
    let swapped = p.swap();
    assert_eq!(swapped.first, "cratery");
    assert_eq!(swapped.second, 10);

    let p2 = Pair::new(true, 3.14);
    let swapped2 = p2.swap();
    assert_eq!(swapped2.first, 3.14);
    assert_eq!(swapped2.second, true);
    println!("all tests passed");
}
```

### Solution
```rust
pub struct Pair<T, U> {
    pub first: T,
    pub second: U,
}

impl<T, U> Pair<T, U> {
    pub fn new(first: T, second: U) -> Self {
        Self { first, second }
    }

    pub fn swap(self) -> Pair<U, T> {
        Pair {
            first: self.second,
            second: self.first,
        }
    }
}
```

### Walkthrough
`Pair<T, U>` accepts two independent generic types. Calling `.swap(self)` consumes the pair and constructs a `Pair<U, T>` with the swapped fields.

### Hints
- In `swap`, return `Pair { first: self.second, second: self.first }`.

## Quest: tut-21-quiz-monomorphization
**Type:** quiz
**Title:** Concept Check: What is Monomorphization?
**Prompt:** What does the Rust compiler do during monomorphization of generic code?

### Options
- [ ] A) It replaces all generic types with void pointers and dynamic runtime lookups.
- [x] B) It generates specialized, dedicated machine code functions for each concrete type used, eliminating runtime overhead.
- [ ] C) It boxes every generic argument on the heap.
- [ ] D) It interprets generic code with a bytecode virtual machine.

**Hint:** Think "mono" (single) + "morph" (form) at compile time.

**Explanation:** Monomorphization is compile-time code generation: rustc inspects all places where a generic function is invoked and generates exact duplicate functions specialized for `i32`, `String`, etc., allowing inlining and maximum optimization.
