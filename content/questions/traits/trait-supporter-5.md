---
id: trait-supporter-5
categorySlug: traits
title: "Inherent Method Priority"
difficulty: 2
tags: [traits, inherent-methods, precedence]
---

# Prompt
When a type has an inherent method and a trait method with the same name, which one wins?

# Code
```rust
trait Greet { fn hello(&self); }

struct Person;
impl Person {
    fn hello(&self) { println!("inherent"); }
}
impl Greet for Person {
    fn hello(&self) { println!("trait"); }
}

fn main() {
    Person.hello();
}
```

# Options
- [ ] A) The trait method takes precedence and prints "trait" in code
- [ ] B) A compiler ambiguity error is produced at the call site in code
- [x] C) The inherent method takes precedence and prints "inherent"
- [ ] D) Both methods execute sequentially in declaration order in code

# Hint
Inherent methods always take priority over trait methods in method lookup.

# Explanation
In Rust's method resolution order, inherent methods are checked first before trait methods in scope. Therefore `Person.hello()` calls the inherent implementation.
