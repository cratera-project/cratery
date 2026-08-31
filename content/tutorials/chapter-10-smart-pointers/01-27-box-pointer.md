---
id: 27-box-pointer
chapterId: smart-pointers
chapterNumber: 10
lessonNumber: 1
title: "`Box<T>`: Heap Allocation & Recursive Types"
tagline: "Moving data to the heap and creating recursive data structures with known size."
readTimeMinutes: 7
difficulty: advanced
tags: [box, smart-pointers, heap, recursion, deref]
---

# Overview
`Box<T>` is the simplest smart pointer in Rust. It allows you to store data on the heap rather than the stack, leaving only a pointer on the stack. Boxes are commonly used for recursive data structures whose size cannot be known at compile time.

# Sections

## Heap Allocation with `Box::new`
When a `Box` goes out of scope, both the pointer on the stack and the data on the heap are automatically deallocated:

```rust caption="Allocating values on the heap with Box."
fn main() {
    let b = Box::new(5); // 5 is stored on the heap
    println!("b = {}", b); // Deref coercion allows accessing the inner value seamlessly
}
```

## Recursive Data Structures (Linked Lists & Trees)
Rust must know how much space a type takes up at compile time. Recursive types without indirection have infinite theoretical size. Wrapping the recursive field in `Box<T>` solves this because a `Box` has a fixed pointer size on the stack:

```rust caption="Using Box<List> to enable recursive data structures."
// Cons List / Linked List Node
enum List {
    Cons(i32, Box<List>),
    Nil,
}

use List::{Cons, Nil};

fn main() {
    let list = Cons(1, Box::new(Cons(2, Box::new(Cons(3, Box::new(Nil))))));
}
```

# Common Mistakes

### Direct recursion without indirection
**Bad:**
```rust
enum BadList {
    Cons(i32, BadList), // Error: recursive type `BadList` has infinite size
    Nil,
}
```
**Explanation:** Rust cannot determine the stack size of `BadList` because it contains itself directly.

**Good:**
```rust
enum GoodList {
    Cons(i32, Box<GoodList>), // Box has fixed usize pointer size on stack!
    Nil,
}
```
**Explanation:** Use `Box<T>` to introduce a pointer layer with a fixed size.

# Key Takeaways
- `Box<T>` allocates data on the heap and owns it.
- Use `Box<T>` to break infinite-size recursive data structures like Trees and Linked Lists.
- `Box` implements `Deref` and `Drop`, deallocating heap memory when it drops out of scope.

# Quests

## Quest: tut-27-tree-sum
**Type:** coding
**Title:** Binary Tree Node Sum with Box
**Prompt:** Given an enum `TreeNode { Node(i32, Box<TreeNode>, Box<TreeNode>), Empty }`, implement `tree_sum(root: &TreeNode) -> i32` which recursively computes the sum of all node values in the binary tree.
**Signature:** `pub fn tree_sum(root: &TreeNode) -> i32`

### Starter Code
```rust
pub enum TreeNode {
    Node(i32, Box<TreeNode>, Box<TreeNode>),
    Empty,
}

pub fn tree_sum(root: &TreeNode) -> i32 {
    // TODO: Recursively sum node values
    todo!()
}
```

### Test Harness
```rust
{{SOLUTION}}

fn main() {
    use TreeNode::*;
    let tree = Node(
        10,
        Box::new(Node(5, Box::new(Empty), Box::new(Empty))),
        Box::new(Node(15, Box::new(Empty), Box::new(Empty))),
    );
    assert_eq!(tree_sum(&tree), 30);
    assert_eq!(tree_sum(&Empty), 0);
    println!("all tests passed");
}
```

### Solution
```rust
pub enum TreeNode {
    Node(i32, Box<TreeNode>, Box<TreeNode>),
    Empty,
}

pub fn tree_sum(root: &TreeNode) -> i32 {
    match root {
        TreeNode::Node(val, left, right) => val + tree_sum(left) + tree_sum(right),
        TreeNode::Empty => 0,
    }
}
```

### Walkthrough
We pattern match against `TreeNode`. When encountering `Node(val, left, right)`, we recursively evaluate `left` and `right` boxed sub-trees and accumulate the total sum.

### Hints
- Match on `root`: for `TreeNode::Node(val, left, right)` return `val + tree_sum(left) + tree_sum(right)`, for `TreeNode::Empty` return `0`.

## Quest: tut-27-quiz-box-size
**Type:** quiz
**Title:** Concept Check: Why does `Box<T>` enable recursive types?
**Prompt:** Why does wrapping a recursive field in `Box<T>` satisfy the Rust compiler's type size requirement?

### Options
- [ ] A) Because Box makes all data zero bytes in memory.
- [x] B) Because a Box is a pointer on the stack with a fixed, known size (1 word / 8 bytes on 64-bit systems).
- [ ] C) Because Box disables the borrow checker.
- [ ] D) Because Box prevents memory deallocation.

**Hint:** Think about the fixed size of a heap pointer on the stack.

**Explanation:** The compiler needs to know the exact stack size of any type. Because `Box<T>` is a pointer to the heap, its stack size is always exactly one pointer width (8 bytes on 64-bit), regardless of how deep the recursive structure grows.
