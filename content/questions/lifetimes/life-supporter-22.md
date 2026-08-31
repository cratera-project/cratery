---
id: life-supporter-22
categorySlug: lifetimes
title: "Closure Returning Reference"
difficulty: 2
tags: [lifetimes, closures, elision]
---

# Prompt
What lifetime does the closure |s: &str| s.trim() assign to its output?

# Code
```rust
fn trim_str<'a>(s: &'a str) -> &'a str {
    s.trim()
}

fn main() {
    let text = String::from("  hi  ");
    println!("{}", trim_str(&text));
}
```

# Options
- [x] A) Tied to the lifetime of the input parameter s
- [ ] B) Tied to the lifetime of the closure binding itself
- [ ] C) Always promoted to the static lifetime 'static
- [ ] D) An unbounded unsafe lifetime in anonymous scope

# Hint
Single input reference closures elide the output lifetime to match the input.

# Explanation
In closures taking a single reference parameter, lifetime elision applies: the returned reference is tied to the lifetime of the input reference argument s.
