---
id: own-code-option-take
categorySlug: ownership
title: "Extract Option Value"
difficulty: 1
tags: [ownership, option, coding]
kind: coding
---

# Prompt
Implement `extract_val` to take the value out of a mutable `Option<String>` reference using `.take()`, leaving `None` in its place.

# Code
```rust
pub fn extract_val(opt: &mut Option<String>) -> Option<String> {
    // TODO: Take inner value out
    todo!()
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let mut item = Some(String::from("data"));
    let extracted = extract_val(&mut item);
    assert_eq!(extracted, Some(String::from("data")));
    assert_eq!(item, None);
    println!("all tests passed");
}
```

# Hint
Option::take leaves None in place of the taken value.

# Explanation
`Option::take` extracts the owned `Some` value from a mutable reference and replaces the slot with `None`, avoiding ownership violation.
