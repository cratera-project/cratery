---
id: trait-supporter-34
categorySlug: traits
title: "Pointer Coercion in dyn Trait"
difficulty: 2
tags: [traits, deref-coercion, dyn]
---

# Prompt
Why does passing `&Box<dyn Trait>` to a function expecting `&dyn Trait` work?

# Code
```rust
trait Worker { fn work(&self); }
struct MyWorker;
impl Worker for MyWorker { fn work(&self) {} }

fn execute(w: &dyn Worker) { w.work(); }

fn main() {
    let b: Box<dyn Worker> = Box::new(MyWorker);
    execute(&*b);
}
```

# Options
- [ ] A) The Box pointer is unpacked and cloned onto the call stack during execution
- [ ] B) Trait objects bypass standard reference borrowing rules in code
- [ ] C) The compiler translates the call into a C ABI function call
- [x] D) Deref coercion coerces `&Box<dyn Worker>` to `&dyn Worker`

# Hint
Deref coercion dereferences Box<T> to &T, which is &dyn Worker here.

# Explanation
Because `Box<T>` implements `Deref<Target = T>`, `&Box<dyn Worker>` deref-coerces to `&dyn Worker`, allowing seamless function passing.
