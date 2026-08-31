---
id: trait-disambiguation-inherent-1
categorySlug: traits
title: "Inherent Method Precedence"
difficulty: 2
tags: [traits, methods, inherent]
---

# Prompt
What is the output of running this program?

# Code
```rust
trait Greet {
    fn say(&self) -> &'static str { "trait greet" }
}

struct User;

impl User {
    fn say(&self) -> &'static str { "inherent greet" }
}

impl Greet for User {}

fn main() {
    let u = User;
    println!("{}", u.say());
}
```

# Options
- [ ] A) trait greet because trait methods have higher priority
- [x] B) inherent greet because inherent methods take precedence
- [ ] C) Fails to compile due to ambiguous duplicate method names
- [ ] D) Fails to compile because Greet::say is not implemented

# Hint
Dot syntax looks for inherent methods before searching traits.

# Explanation
When resolving method calls via dot syntax (`u.say()`), Rust checks inherent methods on the concrete type before looking up trait methods in scope. Therefore, `User::say` takes precedence and prints `"inherent greet"`. To call the trait implementation, use fully qualified syntax: `Greet::say(&u)` or `<User as Greet>::say(&u)`.
