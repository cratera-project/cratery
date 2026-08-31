---
id: 22-traits-and-bounds
chapterId: generics-traits
chapterNumber: 7
lessonNumber: 2
title: "Traits & Trait Bounds"
tagline: "Defining interfaces, requiring capabilities, and the orphan rule."
readTimeMinutes: 8
difficulty: intermediate
tags: [traits, bounds, impl-trait, where]
---

# Overview
A **trait** defines shared behavior that a type can implement (similar to interfaces in other languages). **Trait bounds** constrain generic parameters to types that guarantee specific capabilities.

# Sections

## Defining & Implementing a Trait
To define a trait, use the `trait` keyword:

```rust caption="Defining and implementing custom traits."
pub trait Summary {
    fn summarize(&self) -> String;
    
    // Default implementation
    fn preview(&self) -> String {
        format!("(Read more: {})", self.summarize())
    }
}

pub struct Article {
    pub title: String,
    pub author: String,
}

impl Summary for Article {
    fn summarize(&self) -> String {
        format!("{} by {}", self.title, self.author)
    }
}
```

## Trait Bounds and `where` Clauses
You can constrain generic functions so they only accept types implementing specific traits:

```rust caption="Constraining generics with trait bounds and where clauses."
use std::fmt::Display;

pub trait Summary {
    fn summarize(&self) -> String;
}

// Using `impl Trait` syntax
fn notify(item: &impl Summary) {
    println!("Breaking: {}", item.summarize());
}

// Using explicit trait bound with where clause
fn print_largest<T>(list: &[T]) 
where 
    T: PartialOrd + Display 
{
    let mut largest = &list[0];
    for item in list {
        if item > largest {
            largest = item;
        }
    }
    println!("Largest is {}", largest);
}
```

# Common Mistakes

### Violating the Orphan Rule (Coherence)
**Bad:**
```rust
// Attempting to implement a foreign trait on a foreign type
impl std::fmt::Display for Vec<i32> { // Error: cannot define inherent `impl` for a type outside of the current crate
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result { ... }
}
```
**Explanation:** You can only implement a trait if either the trait OR the type is local to your crate (the Orphan Rule).

**Good:**
```rust
// Use the Newtype pattern
struct MyVec(Vec<i32>);
impl std::fmt::Display for MyVec { ... }
```
**Explanation:** Wrap foreign types in a local tuple struct (Newtype pattern) to implement foreign traits safely.

# Key Takeaways
- Traits define shared behavior and can provide default method implementations.
- Trait bounds (`T: Trait1 + Trait2`) restrict generics to types providing required behavior.
- The Orphan Rule guarantees that trait implementations can never collide or break coherence across crates.

# Quests

## Quest: tut-22-area-trait
**Type:** coding
**Title:** Shape Area Trait Implementation
**Prompt:** Define a trait `Area { fn area(&self) -> f64; }`. Create struct `Circle { pub radius: f64 }` and struct `Square { pub side: f64 }`. Implement `Area` for both (`Circle::area = std::f64::consts::PI * r * r`, `Square::area = side * side`). Also implement `total_area<T: Area>(shapes: &[T]) -> f64`.
**Signature:** `pub trait Area ... pub struct Circle ... pub struct Square ... pub fn total_area<T: Area>(shapes: &[T]) -> f64`

### Starter Code
```rust
pub trait Area {
    fn area(&self) -> f64;
}

pub struct Circle {
    pub radius: f64,
}

pub struct Square {
    pub side: f64,
}

// TODO: Implement Area for Circle and Square
// TODO: Implement total_area<T: Area>(shapes: &[T]) -> f64

pub fn total_area<T: Area>(shapes: &[T]) -> f64 {
    todo!()
}
```

### Test Harness
```rust
{{SOLUTION}}

fn main() {
    let squares = [Square { side: 2.0 }, Square { side: 3.0 }];
    assert_eq!(total_area(&squares), 13.0); // 4 + 9 = 13

    let c = Circle { radius: 1.0 };
    assert!((c.area() - std::f64::consts::PI).abs() < 1e-6);
    println!("all tests passed");
}
```

### Solution
```rust
pub trait Area {
    fn area(&self) -> f64;
}

pub struct Circle {
    pub radius: f64,
}

impl Area for Circle {
    fn area(&self) -> f64 {
        std::f64::consts::PI * self.radius * self.radius
    }
}

pub struct Square {
    pub side: f64,
}

impl Area for Square {
    fn area(&self) -> f64 {
        self.side * self.side
    }
}

pub fn total_area<T: Area>(shapes: &[T]) -> f64 {
    shapes.iter().map(|s| s.area()).sum()
}
```

### Walkthrough
We define the `Area` trait, implement it on `Circle` and `Square`, and write a generic function `total_area` bounded by `T: Area`.

### Hints
- Circle area: `std::f64::consts::PI * self.radius * self.radius`
- In `total_area`, sum with `shapes.iter().map(|s| s.area()).sum()`

## Quest: tut-22-quiz-orphan-rule
**Type:** quiz
**Title:** Concept Check: What is the Orphan Rule?
**Prompt:** What does Rust's "Orphan Rule" for trait implementation enforce?

### Options
- [x] A) You can only implement a trait for a type if either the trait or the type is defined inside your own crate.
- [ ] B) Traits can only be implemented for structs, not enums.
- [ ] C) Parent traits must be deleted before child traits can compile.
- [ ] D) Structs without constructors cannot implement traits.

**Hint:** Think about who must own at least one of the trait or the type.

**Explanation:** The Orphan Rule ensures coherence: if two crates could implement a foreign trait on a foreign type, rustc would not know which implementation to use when both crates are imported.
