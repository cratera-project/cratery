---
id: macro-code-calc-min
categorySlug: macros
title: "Minimum Expression Macro"
difficulty: 2
tags: [macros, coding]
kind: coding
---

# Prompt
Write a declarative macro `calc_min!(a, b)` and `calc_min!(a, b, c)` returning the smallest value among the passed arguments.

# Code
```rust
#[macro_export]
macro_rules! calc_min {
    ($a:expr, $b:expr) => {
        if $a < $b { $a } else { $b }
    };
    ($a:expr, $b:expr, $c:expr) => {
        calc_min!(calc_min!($a, $b), $c)
    };
}
```

# Solution
```rust
#[macro_export]
macro_rules! calc_min {
    ($a:expr, $b:expr) => {
        if $a < $b { $a } else { $b }
    };
    ($a:expr, $b:expr, $c:expr) => {
        calc_min!(calc_min!($a, $b), $c)
    };
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    assert_eq!(calc_min!(10, 5), 5);
    assert_eq!(calc_min!(20, 15, 30), 15);
    println!("test passed");
}
```

# Explanation
Write a declarative macro `calc_min!(a, b)` and `calc_min!(a, b, c)` returning the smallest value among the passed arguments. Review the test cases to verify all assertions.
