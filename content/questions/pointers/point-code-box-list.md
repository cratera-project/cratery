---
id: point-code-box-list
categorySlug: pointers
title: "Boxed Singly-Linked Node"
difficulty: 2
tags: [pointers, coding]
kind: coding
---

# Prompt
Define `pub struct Node { pub val: i32, pub next: Option<Box<Node>> }`. Implement `fn new(val: i32) -> Self` and `fn push(&mut self, val: i32)` which appends a node to the tail.

# Code
```rust
pub struct Node {
    pub val: i32,
    pub next: Option<Box<Node>>,
}

impl Node {
    pub fn new(val: i32) -> Self {
        Self { val, next: None }
    }

    pub fn push(&mut self, val: i32) {
        let mut curr = self;
        while let Some(ref mut next) = curr.next {
            curr = next;
        }
        curr.next = Some(Box::new(Node::new(val)));
    }
}
```

# Solution
```rust
pub struct Node {
    pub val: i32,
    pub next: Option<Box<Node>>,
}

impl Node {
    pub fn new(val: i32) -> Self {
        Self { val, next: None }
    }

    pub fn push(&mut self, val: i32) {
        let mut curr = self;
        while let Some(ref mut next) = curr.next {
            curr = next;
        }
        curr.next = Some(Box::new(Node::new(val)));
    }
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let mut head = Node::new(1);
    head.push(2);
    head.push(3);
    assert_eq!(head.val, 1);
    assert_eq!(head.next.as_ref().unwrap().val, 2);
    assert_eq!(head.next.as_ref().unwrap().next.as_ref().unwrap().val, 3);
    println!("test passed");
}
```

# Explanation
Define `pub struct Node { pub val: i32, pub next: Option<Box<Node>> }`. Implement `fn new(val: i32) -> Self` and `fn push(&mut self, val: i32)` which appends a node to the tail. Review the test cases to verify all assertions.
