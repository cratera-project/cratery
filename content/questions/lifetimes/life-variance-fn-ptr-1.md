---
id: life-variance-fn-ptr-1
categorySlug: lifetimes
title: "Function Pointer Variance"
difficulty: 3
tags: [lifetimes, variance, subtyping]
---

# Prompt
Why is passing `identity` to `apply` allowed here?

# Code
```rust
fn apply<'a>(f: fn(&'static str) -> &'a str, s: &'static str) -> &'a str {
    f(s)
}

fn identity<'b>(s: &'b str) -> &'b str {
    s
}

fn main() {
    let msg: &'static str = "hello";
    println!("{}", apply(identity, msg));
}
```

# Options
- [ ] A) Function pointers automatically coerce input lifetimes to static
- [ ] B) The compiler creates an owned duplicate of the parameter string
- [ ] C) Lifetime annotations on fn pointer arguments are totally ignored
- [x] D) Function pointer arguments are contravariant over input lifetime

# Hint
Consider whether a function accepting more lifetimes can satisfy one expecting fewer.

# Explanation
In Rust's subtyping rules, function pointers `fn(Arg) -> Ret` are contravariant with respect to `Arg` and covariant with respect to `Ret`. Because `'static` outlives `'b`, a function that can accept any shorter lifetime `'b` (`identity`) can safely be used where a function accepting `'static` is required (`apply`).
