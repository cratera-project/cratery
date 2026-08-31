---
id: borrow-supporter-13
categorySlug: borrow-checker
title: "Self Borrow in Trait Methods"
difficulty: 1
tags: [borrow-checker, methods, lifetimes]
---

# Prompt
What is the borrow duration of `&self` in `fn len(&self) -> usize`?

# Code
```rust
struct List(Vec<i32>);
impl List {
    fn len(&self) -> usize { self.0.len() }
}

fn main() {
    let mut l = List(vec![1, 2]);
    let len = l.len();
    l.0.push(3); // OK because len(&self) borrow ended at function return
    println!("{len}");
}
```

# Options
- [ ] A) The borrow persists for the entire enclosing main scope in code
- [ ] B) The borrow is extended until `len` variable is dropped in code
- [x] C) The borrow ends as soon as the `len()` method call returns
- [ ] D) The borrow is permanent until the `List` is destroyed in code

# Hint
Since the return type usize contains no references, the borrow of self ends at function exit.

# Explanation
Because `len(&self) -> usize` returns a primitive `usize` that contains no references connected to `&self`, the shared borrow of `l` ends immediately when `len()` finishes executing.
