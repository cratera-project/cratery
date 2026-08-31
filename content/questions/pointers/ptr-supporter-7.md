---
id: ptr-supporter-7
categorySlug: pointers
title: "MaybeUninit::assume_init Invariants"
difficulty: 3
tags: [pointers, maybe-uninit, safety]
---

# Prompt
What safety invariant must be satisfied before calling `assume_init()` on `MaybeUninit<T>`?

# Code
```rust
use std::mem::MaybeUninit;

fn main() {
    let mut val = MaybeUninit::<i32>::uninit();
    val.write(100);
    let init_val = unsafe { val.assume_init() };
    println!("{init_val}");
}
```

# Options
- [ ] A) The value must be allocated on the heap through `Box::new` within local thread memory
- [ ] B) The type `T` must implement the `Copy` and `Send` marker traits within local thread memory
- [x] C) The memory for `T` must be fully and validly initialized with a valid bit pattern
- [ ] D) All other references to the enclosing struct must be dropped within local thread memory

# Hint
Calling assume_init on uninitialized memory is immediate undefined behavior.

# Explanation
`MaybeUninit::assume_init()` asserts to the compiler that the contained `T` is fully initialized with a valid bit representation. Calling it on uninitialized memory is instant Undefined Behavior (UB).
