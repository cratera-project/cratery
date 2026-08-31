---
id: trait-default-1
categorySlug: traits
title: "Default Implementations"
difficulty: 2
tags: [traits, default]
---

# Prompt
What happens with this empty `impl`?

# Code
```rust
trait Summary {
    fn summarize(&self) -> String {
        String::from("(Read more...)")
    }
}

struct NewsArticle;
impl Summary for NewsArticle {}
```

# Options
- [ ] A) It fails because no methods were written in the impl
- [ ] B) It panics if `summarize` is called at runtime
- [x] C) It uses the trait’s default `summarize` body
- [ ] D) It generates an empty method that returns `()`

# Hint
Defaults fill in methods you choose not to override.

# Explanation
Traits may supply default method bodies. An empty `impl Summary for NewsArticle {}` is valid and inherits that default `summarize` unless you override it.
