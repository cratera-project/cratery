---
id: own-partial-reborrow-1
categorySlug: ownership
title: "Use After Partial Move"
difficulty: 2
tags: [ownership, partial-move]
---

# Prompt
Why is `p.age` usable while `p` as a whole is not?

# Code
```rust
struct Person {
    name: String,
    age: u32,
}

fn main() {
    let p = Person { name: "Ada".into(), age: 36 };
    let n = p.name;
    println!("{n}");
    println!("{}", p.age);
    // println!("{:?}", p); // error: partial move
}
```

# Options
- [ ] A) Partial moves are illegal; this example never compiles
- [ ] B) `age` is borrowed immutably for the rest of `main`
- [x] C) `name` moved out; unmoved fields like `age` stay usable
- [ ] D) `Person` implements `Copy`, so moves never invalidate it

# Hint
Which fields still own their data?

# Explanation
Moving `p.name` partially moves out of `p`. Fields that were not moved stay usable (`p.age` here; `u32` is also `Copy`). Using the whole `p` needs every field, including the moved `name`, so that is rejected. Other non-`Copy` fields could still be moved out separately.
