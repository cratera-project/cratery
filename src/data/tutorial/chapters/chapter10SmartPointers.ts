import type { TutorialChapter } from '../types'

export const chapter10SmartPointers: TutorialChapter = {
  id: 'smart-pointers',
  number: 10,
  title: 'Smart Pointers & Memory Layout',
  description: 'Manage heap allocation with Box<T>, shared ownership with Rc/Arc, and interior mutability with RefCell.',
  icon: '📦',
  lessons: [
    {
      id: '27-box-pointer',
      chapterId: 'smart-pointers',
      chapterNumber: 10,
      lessonNumber: 1,
      title: '`Box<T>`: Heap Allocation & Recursive Types',
      tagline: 'Moving data to the heap and creating recursive data structures with known size.',
      readTimeMinutes: 7,
      difficulty: 'advanced',
      tags: ['box', 'smart-pointers', 'heap', 'recursion', 'deref'],
      overview: '`Box<T>` is the simplest smart pointer in Rust. It allows you to store data on the heap rather than the stack, leaving only a pointer on the stack. Boxes are commonly used for recursive data structures whose size cannot be known at compile time.',
      sections: [
        {
          id: 'box-basics',
          title: 'Heap Allocation with `Box::new`',
          content: `When a \`Box\` goes out of scope, both the pointer on the stack and the data on the heap are automatically deallocated:`,
          codeSnippet: {
            code: `fn main() {
    let b = Box::new(5); // 5 is stored on the heap
    println!("b = {}", b); // Deref coercion allows accessing the inner value seamlessly
}`,
            caption: 'Allocating values on the heap with Box.',
          },
        },
        {
          id: 'recursive-types',
          title: 'Recursive Data Structures (Linked Lists & Trees)',
          content: `Rust must know how much space a type takes up at compile time. Recursive types without indirection have infinite theoretical size. Wrapping the recursive field in \`Box<T>\` solves this because a \`Box\` has a fixed pointer size on the stack:`,
          codeSnippet: {
            code: `// Cons List / Linked List Node
enum List {
    Cons(i32, Box<List>),
    Nil,
}

use List::{Cons, Nil};

fn main() {
    let list = Cons(1, Box::new(Cons(2, Box::new(Cons(3, Box::new(Nil))))));
}`,
            caption: 'Using Box<List> to enable recursive data structures.',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Direct recursion without indirection',
          badCode: `enum BadList {
    Cons(i32, BadList), // Error: recursive type \`BadList\` has infinite size
    Nil,
}`,
          badExplanation: 'Rust cannot determine the stack size of `BadList` because it contains itself directly.',
          goodCode: `enum GoodList {
    Cons(i32, Box<GoodList>), // Box has fixed usize pointer size on stack!
    Nil,
}`,
          goodExplanation: 'Use `Box<T>` to introduce a pointer layer with a fixed size.',
        },
      ],
      keyTakeaways: [
        '`Box<T>` allocates data on the heap and owns it.',
        'Use `Box<T>` to break infinite-size recursive data structures like Trees and Linked Lists.',
        '`Box` implements `Deref` and `Drop`, deallocating heap memory when it drops out of scope.',
      ],
      quests: [
        {
          id: 'tut-27-tree-sum',
          type: 'coding',
          title: 'Binary Tree Node Sum with Box',
          prompt: 'Given an enum `TreeNode { Node(i32, Box<TreeNode>, Box<TreeNode>), Empty }`, implement `tree_sum(root: &TreeNode) -> i32` which recursively computes the sum of all node values in the binary tree.',
          signature: 'pub fn tree_sum(root: &TreeNode) -> i32',
          starterCode: `pub enum TreeNode {
    Node(i32, Box<TreeNode>, Box<TreeNode>),
    Empty,
}

pub fn tree_sum(root: &TreeNode) -> i32 {
    // TODO: Recursively sum node values
    todo!()
}`,
          testHarness: `{{SOLUTION}}

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
}`,
          hints: [
            'Match on `root`: for `TreeNode::Node(val, left, right)` return `val + tree_sum(left) + tree_sum(right)`, for `TreeNode::Empty` return `0`.'
          ],
          solutionCode: `pub enum TreeNode {
    Node(i32, Box<TreeNode>, Box<TreeNode>),
    Empty,
}

pub fn tree_sum(root: &TreeNode) -> i32 {
    match root {
        TreeNode::Node(val, left, right) => val + tree_sum(left) + tree_sum(right),
        TreeNode::Empty => 0,
    }
}`,
          solutionWalkthrough: 'We pattern match against `TreeNode`. When encountering `Node(val, left, right)`, we recursively evaluate `left` and `right` boxed sub-trees and accumulate the total sum.',
          xpReward: 15,
        },
        {
          id: 'tut-27-quiz-box-size',
          type: 'quiz',
          title: 'Concept Check: Why does `Box<T>` enable recursive types?',
          prompt: 'Why does wrapping a recursive field in `Box<T>` satisfy the Rust compiler\'s type size requirement?',
          options: [
            { label: 'A', text: 'Because Box makes all data zero bytes in memory.' },
            { label: 'B', text: 'Because a Box is a pointer on the stack with a fixed, known size (1 word / 8 bytes on 64-bit systems).' },
            { label: 'C', text: 'Because Box disables the borrow checker.' },
            { label: 'D', text: 'Because Box prevents memory deallocation.' },
          ],
          correctIndex: 1,
          explanation: 'The compiler needs to know the exact stack size of any type. Because `Box<T>` is a pointer to the heap, its stack size is always exactly one pointer width (8 bytes on 64-bit), regardless of how deep the recursive structure grows.',
          hint: 'Think about the fixed size of a heap pointer on the stack.',
          xpReward: 10,
        },
      ],
    },
    {
      id: '28-rc-and-arc',
      chapterId: 'smart-pointers',
      chapterNumber: 10,
      lessonNumber: 2,
      title: 'Shared Ownership with `Rc<T>` & `Arc<T>`',
      tagline: 'Reference counted pointers for single-threaded and multi-threaded shared data.',
      readTimeMinutes: 8,
      difficulty: 'advanced',
      tags: ['rc', 'arc', 'reference-counting', 'concurrency'],
      overview: 'In most cases in Rust, ownership is clear: each value has exactly one owner. However, in graph structures or shared caches, multiple parts of a program may need to own a value simultaneously. Rust provides reference counting smart pointers: `Rc<T>` (single-threaded) and `Arc<T>` (atomic, thread-safe).',
      sections: [
        {
          id: 'rc-basics',
          title: '`Rc<T>`: Reference Counting (Single-Threaded)',
          content: `\`Rc<T>\` keeps track of the number of references to a value on the heap. Cloning an \`Rc\` with \`Rc::clone(&ptr)\` does **not** duplicate the underlying data; it only increments the reference count. When the count reaches 0, the data is dropped.`,
          codeSnippet: {
            code: `use std::rc::Rc;

fn main() {
    let shared_data = Rc::new(vec![1, 2, 3]);
    println!("Count after init: {}", Rc::strong_count(&shared_data)); // 1

    let owner_a = Rc::clone(&shared_data);
    let owner_b = Rc::clone(&shared_data);
    println!("Count with owners: {}", Rc::strong_count(&shared_data)); // 3
} // All 3 drop here; data is freed once count reaches 0!`,
            caption: 'Shared read-only ownership using Rc<T>.',
          },
        },
        {
          id: 'arc-basics',
          title: '`Arc<T>`: Atomic Reference Counting (Thread-Safe)',
          content: `\`Rc<T>\` is not safe to send across threads because incrementing its counter is not an atomic CPU operation. When sharing data across threads, use \`Arc<T>\` (Atomically Reference Counted):`,
          codeSnippet: {
            code: `use std::sync::Arc;
use std::thread;

fn main() {
    let data = Arc::new(vec![10, 20, 30]);

    let data_clone = Arc::clone(&data);
    let handle = thread::spawn(move || {
        println!("Thread received data: {:?}", data_clone);
    });

    handle.join().unwrap();
}`,
            caption: 'Sharing data across threads safely using Arc<T>.',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Sending `Rc<T>` across thread boundaries',
          badCode: `use std::rc::Rc;
use std::thread;
let r = Rc::new(42);
thread::spawn(move || { println!("{}", r); }); // Error: \`Rc<i32>\` cannot be sent between threads safely`,
          badExplanation: '`Rc` does not implement `Send` because its non-atomic counter causes data races in multi-threaded contexts.',
          goodCode: `use std::sync::Arc;
use std::thread;
let r = Arc::new(42);
thread::spawn(move || { println!("{}", r); }); // OK! Arc uses atomic operations`,
          goodExplanation: 'Use `Arc<T>` whenever data or ownership crosses thread boundaries.',
        },
      ],
      keyTakeaways: [
        '`Rc<T>` enables multiple owners for read-only data in single-threaded programs.',
        '`Rc::clone(&ptr)` increments reference count in O(1) time without deep memory copies.',
        'Use `Arc<T>` for multi-threaded reference counting (`Arc` is `Send + Sync` if `T` is).',
      ],
      quests: [
        {
          id: 'tut-28-shared-graph-node',
          type: 'coding',
          title: 'Shared Graph Node with Rc',
          prompt: 'Create a struct `GraphNode { pub value: i32, pub neighbors: Vec<std::rc::Rc<GraphNode>> }`. Implement `new(value: i32) -> Self` and `add_neighbor(&mut self, neighbor: &std::rc::Rc<GraphNode>)` which clones the `Rc` pointer and appends it to `neighbors`.',
          signature: 'pub struct GraphNode ... impl GraphNode ...',
          starterCode: `use std::rc::Rc;

pub struct GraphNode {
    pub value: i32,
    pub neighbors: Vec<Rc<GraphNode>>,
}

impl GraphNode {
    pub fn new(value: i32) -> Self {
        todo!()
    }

    pub fn add_neighbor(&mut self, neighbor: &Rc<GraphNode>) {
        // TODO: Clone neighbor Rc and push to self.neighbors
        todo!()
    }
}`,
          testHarness: `{{SOLUTION}}

fn main() {
    use std::rc::Rc;
    let target = Rc::new(GraphNode::new(99));
    
    let mut node1 = GraphNode::new(1);
    let mut node2 = GraphNode::new(2);

    node1.add_neighbor(&target);
    node2.add_neighbor(&target);

    assert_eq!(Rc::strong_count(&target), 3); // target + node1 + node2
    assert_eq!(node1.neighbors[0].value, 99);
    assert_eq!(node2.neighbors[0].value, 99);
    println!("all tests passed");
}`,
          hints: ['Use `Rc::clone(neighbor)` in `add_neighbor`.'],
          solutionCode: `use std::rc::Rc;

pub struct GraphNode {
    pub value: i32,
    pub neighbors: Vec<Rc<GraphNode>>,
}

impl GraphNode {
    pub fn new(value: i32) -> Self {
        Self {
            value,
            neighbors: Vec::new(),
        }
    }

    pub fn add_neighbor(&mut self, neighbor: &Rc<GraphNode>) {
        self.neighbors.push(Rc::clone(neighbor));
    }
}`,
          solutionWalkthrough: '`Rc::clone(neighbor)` duplicates the smart pointer handle to `target` in O(1) time without copying graph node data, sharing ownership cleanly.',
          xpReward: 15,
        },
        {
          id: 'tut-28-quiz-rc-vs-arc',
          type: 'quiz',
          title: 'Concept Check: Why not use `Arc<T>` everywhere?',
          prompt: 'Why doesn\'t Rust simply use `Arc<T>` for everything instead of having both `Rc<T>` and `Arc<T>`?',
          options: [
            { label: 'A', text: '`Arc<T>` is limited to 100 maximum owners.' },
            { label: 'B', text: 'Atomic operations used by `Arc<T>` carry CPU cache synchronization performance overhead that is unnecessary in single-threaded code.' },
            { label: 'C', text: '`Arc<T>` does not support heap allocations.' },
            { label: 'D', text: '`Rc<T>` is an older deprecated legacy type.' },
          ],
          correctIndex: 1,
          explanation: 'Atomic memory operations used by `Arc` involve bus locking and CPU cache synchronization instructions, which are slower than the plain integer operations of `Rc`. Rust follows the zero-cost abstraction philosophy by providing `Rc` for single-threaded speed.',
          hint: 'Consider the CPU performance difference between atomic and non-atomic operations.',
          xpReward: 10,
        },
      ],
    },
    {
      id: '29-refcell-interior-mutability',
      chapterId: 'smart-pointers',
      chapterNumber: 10,
      lessonNumber: 3,
      title: 'Interior Mutability: `RefCell<T>` & `Cell<T>`',
      tagline: 'Mutating data through immutable references by shifting borrow checks to runtime.',
      readTimeMinutes: 8,
      difficulty: 'advanced',
      tags: ['refcell', 'interior-mutability', 'borrow_mut', 'runtime-checks'],
      overview: '**Interior mutability** is a design pattern in Rust that allows you to mutate data even when there are immutable references to that data. `RefCell<T>` represents single ownership of data and enforces the borrowing rules **at runtime instead of compile time**.',
      sections: [
        {
          id: 'refcell-basics',
          title: '`RefCell<T>`: Runtime Borrow Checking',
          content: `With \`RefCell<T>\`:
- \`.borrow()\` returns \`Ref<T>\` (shared borrow).
- \`.borrow_mut()\` returns \`RefMut<T>\` (mutable borrow).

If you violate borrowing rules at runtime (e.g., calling \`borrow_mut()\` while another \`borrow()\` is still active), \`RefCell\` **panics at runtime**:`,
          codeSnippet: {
            code: `use std::cell::RefCell;

fn main() {
    let data = RefCell::new(5);

    {
        let mut mut_ref = data.borrow_mut();
        *mut_ref += 10;
    } // mut_ref drops here

    println!("Value: {}", data.borrow()); // 15
}`,
            caption: 'Using RefCell for scoped interior mutation.',
          },
        },
        {
          id: 'rc-refcell-combo',
          title: 'Combining `Rc<RefCell<T>>` for Multiple Mutable Owners',
          content: `A common Rust idiom for graph nodes and tree structures is combining \`Rc\` with \`RefCell\`: \`Rc<RefCell<T>>\` allows **multiple owners** (\`Rc\`) that can all **mutate the inner value** (\`RefCell\`).`,
          codeSnippet: {
            code: `use std::rc::Rc;
use std::cell::RefCell;

fn main() {
    let shared_counter = Rc::new(RefCell::new(0));

    let c1 = Rc::clone(&shared_counter);
    let c2 = Rc::clone(&shared_counter);

    *c1.borrow_mut() += 1;
    *c2.borrow_mut() += 2;

    println!("Final count: {}", shared_counter.borrow()); // 3
}`,
            caption: 'Rc<RefCell<T>>: Shared mutable state in single-threaded code.',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Simultaneous `.borrow()` and `.borrow_mut()` causing runtime panic',
          badCode: `let cell = RefCell::new(10);
let r1 = cell.borrow();
let mut r2 = cell.borrow_mut(); // Runtime panic: AlreadyBorrowed!`,
          badExplanation: 'Borrowing mutably while an active immutable `Ref` exists triggers a panic at runtime.',
          goodCode: `let cell = RefCell::new(10);
{
    let r1 = cell.borrow();
    println!("{}", *r1);
} // r1 drops here
let mut r2 = cell.borrow_mut(); // OK!`,
          goodExplanation: 'Ensure `Ref` scopes are dropped before acquiring a `RefMut`.',
        },
      ],
      keyTakeaways: [
        '`RefCell<T>` moves borrow checking from compile time to runtime.',
        'Violating the single-mutable-or-multiple-immutable rule with `RefCell` causes a runtime `panic!`.',
        'Combine `Rc<RefCell<T>>` to achieve shared ownership with interior mutability.',
      ],
      quests: [
        {
          id: 'tut-29-mock-logger',
          type: 'coding',
          title: 'Mock Logger using Interior Mutability',
          prompt: 'Implement struct `MockLogger { pub messages: std::cell::RefCell<Vec<String>> }`. Implement `new() -> Self`, `log(&self, msg: &str)` (appends `msg.to_string()` into `messages` via `borrow_mut`), and `count(&self) -> usize` (returns count of messages via `borrow`). Note that `log` takes `&self` immutably!',
          signature: 'pub struct MockLogger ... impl MockLogger ...',
          starterCode: `use std::cell::RefCell;

pub struct MockLogger {
    pub messages: RefCell<Vec<String>>,
}

impl MockLogger {
    pub fn new() -> Self {
        todo!()
    }

    pub fn log(&self, msg: &str) {
        // TODO: Mutate inner messages through &self
        todo!()
    }

    pub fn count(&self) -> usize {
        // TODO: Return count of logged messages
        todo!()
    }
}`,
          testHarness: `{{SOLUTION}}

fn main() {
    let logger = MockLogger::new();
    logger.log("booting engine");
    logger.log("ready");

    assert_eq!(logger.count(), 2);
    assert_eq!(logger.messages.borrow()[0], "booting engine");
    assert_eq!(logger.messages.borrow()[1], "ready");
    println!("all tests passed");
}`,
          hints: [
            'In `log(&self, msg: &str)`, write `self.messages.borrow_mut().push(msg.to_string());`.'
          ],
          solutionCode: `use std::cell::RefCell;

pub struct MockLogger {
    pub messages: RefCell<Vec<String>>,
}

impl MockLogger {
    pub fn new() -> Self {
        Self {
            messages: RefCell::new(Vec::new()),
        }
    }

    pub fn log(&self, msg: &str) {
        self.messages.borrow_mut().push(msg.to_string());
    }

    pub fn count(&self) -> usize {
        self.messages.borrow().len()
    }
}`,
          solutionWalkthrough: '`MockLogger` exposes an immutable `&self` interface while using `RefCell` internally to dynamically acquire mutable borrows and mutate its message vector.',
          xpReward: 15,
        },
        {
          id: 'tut-29-quiz-refcell-panic',
          type: 'quiz',
          title: 'Concept Check: What happens when `RefCell` borrowing rules are broken?',
          prompt: 'What happens at runtime if your program attempts to acquire a `.borrow_mut()` on a `RefCell` while a `.borrow()` is still held?',
          options: [
            { label: 'A', text: 'The program halts with a compile-time error.' },
            { label: 'B', text: 'The calling thread panics with an `AlreadyBorrowed` runtime error.' },
            { label: 'C', text: 'The thread sleeps indefinitely.' },
            { label: 'D', text: 'The data is silently overwritten.' },
          ],
          correctIndex: 1,
          explanation: '`RefCell<T>` enforces Rust\'s borrowing rules dynamically at runtime. If the rules are broken, it immediately panics to protect against memory corruption and data races.',
          hint: 'Remember that RefCell translates compile-time checks into runtime panics.',
          xpReward: 10,
        },
      ],
    },
  ],
}
