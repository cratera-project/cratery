---
id: iter-take-while-1
categorySlug: iterators-closures
title: "take_while vs take"
difficulty: 2
tags: [iterators, combinators]
---

# Prompt
How do `.take` and `.take_while` differ?

# Code
```rust
nums.iter().take(3);
nums.iter().take_while(|&&x| x < 10);
```

# Options
- [ ] A) `take` consumes; `take_while` only borrows items
- [x] B) `take` uses a count; `take_while` uses a predicate
- [ ] C) `take_while` is only for infinite iterators
- [ ] D) They match; `take_while` is just an older name

# Hint
One stops after N items; the other stops on a failed test.

# Explanation
`take(n)` yields at most `n` items. `take_while` yields while the predicate holds and stops at the first failure (even if later items would pass). Both are lazy adapters.
