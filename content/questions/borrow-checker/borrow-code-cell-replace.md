---
id: borrow-code-cell-replace
categorySlug: borrow-checker
title: "Interior Mutability with Cell"
difficulty: 2
tags: [borrow-checker, coding]
kind: coding
---

# Prompt
Implement `add_to_cell` taking a shared reference `&std::cell::Cell<i32>` and an integer `val`, adding `val` to the cell's current value and returning the new value.

# Code
```rust
use std::cell::Cell;

pub fn add_to_cell(cell: &Cell<i32>, val: i32) -> i32 {
    let new_val = cell.get() + val;
    cell.set(new_val);
    new_val
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let cell = Cell::new(10);
    assert_eq!(add_to_cell(&cell, 5), 15);
    assert_eq!(cell.get(), 15);
    println!("test passed");
}
```

# Explanation
Implement `add_to_cell` taking a shared reference `&std::cell::Cell<i32>` and an integer `val`, adding `val` to the cell's current value and returning the new value. Review the test cases to verify all assertions.
