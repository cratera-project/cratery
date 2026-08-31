---
id: 16-vectors
chapterId: collections
chapterNumber: 5
lessonNumber: 1
title: "Vectors: Growable Heap Arrays (`Vec<T>`)"
tagline: "Dynamic arrays on the heap, capacity vs length, and borrow safety."
readTimeMinutes: 7
difficulty: intermediate
tags: [vec, collections, heap, capacity]
---

# Overview
Vectors (`Vec<T>`) allow you to store more than one value in a single contiguous data structure on the heap. Vectors can grow and shrink dynamically at runtime.

# Sections

## Creating and Modifying Vectors
You can create a new vector with `Vec::new()` or with the convenient `vec![]` macro:

```rust caption="Creating, pushing, and inspecting vectors."
fn main() {
    let mut v: Vec<i32> = Vec::new();
    v.push(1);
    v.push(2);
    v.push(3);
    
    // Macro initialization
    let mut names = vec!["Alice", "Bob", "Charlie"];
    names.pop(); // removes "Charlie"
    
    println!("Length: {}, Capacity: {}", v.len(), v.capacity());
}
```

## Borrow Checker & Vector Reallocations
When a vector runs out of capacity, pushing a new element allocates a larger heap buffer and copies all existing elements to the new memory location.

Because of this, **Rust forbids holding a reference to a vector element while pushing to the vector**:

```rust caption="The borrow checker prevents dangling pointers when vectors reallocate."
let mut v = vec![1, 2, 3];
let first = &v[0]; // Immutable borrow

// v.push(4); // COMPILE ERROR: cannot borrow `v` as mutable because it is also borrowed as immutable
println!("First is: {}", first);
v.push(4); // Valid here after 'first' is no longer used!
```

# Common Mistakes

### Modifying a vector while iterating over it
**Bad:**
```rust
let mut v = vec![1, 2, 3];
for item in &v {
    if *item == 2 {
        v.push(99); // Error: cannot borrow `v` as mutable because it is also borrowed as immutable
    }
}
```
**Explanation:** Iterating borrows `v` immutably. Pushing requires a mutable borrow `&mut v`. Holding both causes a compile-time borrow error.

**Good:**
```rust
let mut v = vec![1, 2, 3];
let mut additions = Vec::new();
for &item in &v {
    if item == 2 { additions.push(99); }
}
v.extend(additions);
```
**Explanation:** Collect new additions separately or use `.retain()` for filtering.

# Key Takeaways
- `Vec<T>` allocates its elements on the heap with dynamic length and capacity.
- Pushing when `len == capacity` triggers heap reallocation to larger memory.
- Rust guarantees references to vector items cannot become dangling pointers.

# Quests

## Quest: tut-16-dedup-vec
**Type:** coding
**Title:** Filter and Deduplicate Vector
**Prompt:** Implement `filter_evens_unique(nums: Vec<i32>) -> Vec<i32>`. The function should take an owned vector `nums`, retain only the even numbers, remove consecutive duplicates, and return the resulting vector.
**Signature:** `pub fn filter_evens_unique(nums: Vec<i32>) -> Vec<i32>`

### Starter Code
```rust
pub fn filter_evens_unique(nums: Vec<i32>) -> Vec<i32> {
    // TODO: Filter only even numbers and remove consecutive duplicates
    todo!()
}
```

### Test Harness
```rust
{{SOLUTION}}

fn main() {
    assert_eq!(filter_evens_unique(vec![1, 2, 2, 3, 4, 4, 4, 5, 6]), vec![2, 4, 6]);
    assert_eq!(filter_evens_unique(vec![1, 3, 5]), vec![]);
    assert_eq!(filter_evens_unique(vec![0, 0, 2, 2, 0]), vec![0, 2, 0]);
    println!("all tests passed");
}
```

### Solution
```rust
pub fn filter_evens_unique(nums: Vec<i32>) -> Vec<i32> {
    let mut result: Vec<i32> = nums.into_iter().filter(|n| n % 2 == 0).collect();
    result.dedup();
    result
}
```

### Walkthrough
We filter out odd numbers with `.filter(|n| n % 2 == 0)`, collect into a mutable `Vec<i32>`, and call `.dedup()` to collapse consecutive duplicate even integers.

### Hints
- Filter with `let mut evens: Vec<i32> = nums.into_iter().filter(|n| n % 2 == 0).collect();`
- Then call `evens.dedup();` to remove consecutive duplicates.

## Quest: tut-16-quiz-vec-capacity
**Type:** quiz
**Title:** Concept Check: Vector Reallocation Safety
**Prompt:** Why does Rust forbid pushing to a `Vec<T>` while holding a reference `&v[0]` to an element inside it?

### Options
- [ ] A) Because pushing to a vector changes the type of the vector elements.
- [x] B) Because if the vector runs out of capacity, it reallocates on the heap, which would make the reference a dangling pointer.
- [ ] C) Because vectors can only hold 256 elements.
- [ ] D) Because references to heap objects are illegal in safe Rust.

**Hint:** Think about what happens to the underlying memory address when a vector grows beyond its capacity.

**Explanation:** When capacity is exceeded, pushing reallocates new memory and deallocates the old buffer. If Rust permitted holding `&v[0]`, that reference would point to freed memory (a use-after-free bug).
