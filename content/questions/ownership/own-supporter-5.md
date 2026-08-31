---
id: own-supporter-5
categorySlug: ownership
title: "Option::take in &mut Method"
difficulty: 2
tags: [ownership, option, take]
---

# Prompt
How does `take()` allow modifying an owned value inside `&mut self`?

# Code
```rust
struct Worker {
    task: Option<String>,
}

impl Worker {
    fn run(&mut self) {
        if let Some(t) = self.task.take() {
            println!("doing {t}");
        }
    }
}
```

# Options
- [x] A) It leaves None in place while moving out inner task
- [ ] B) It creates a shallow copy of the underlying String in code
- [ ] C) It promotes the String to a static heap allocation in code
- [ ] D) It temporarily transmutes &mut self into owned self

# Hint
Option::take replaces the value with None and returns the old value.

# Explanation
`Option::take` replaces `self.task` with `None` and returns the `Some(String)` by value. This leaves `self.task` initialized while safely moving ownership out through `&mut self`.
