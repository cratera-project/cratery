---
id: life-supporter-6
categorySlug: lifetimes
title: "Lifetime Elision in Struct Impl"
difficulty: 2
tags: [lifetimes, elision, impl]
---

# Prompt
In impl<'a> Reader<'a>, what lifetime is assigned to fn get(&self) -> &str?

# Code
```rust
struct Reader<'a> {
    data: &'a str,
}

impl<'a> Reader<'a> {
    fn get(&self) -> &str {
        self.data
    }
}
```

# Options
- [x] A) The return type gets the lifetime of &self by default
- [ ] B) The return type gets lifetime 'static automatically in code
- [ ] C) The return type gets lifetime 'a from the struct in code
- [ ] D) Compilation fails without explicit lifetime annotations

# Hint
In methods with &self or &mut self, elided output lifetimes are tied to &self.

# Explanation
By Rust's lifetime elision rules, if there is a &self or &mut self parameter, the lifetime of self is assigned to all elided output lifetimes. So get(&self) -> &str is desugared to fn get<'s>(&'s self) -> &'s str.
