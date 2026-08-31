import type { TutorialChapter } from '../types'

export const chapter7GenericsTraits: TutorialChapter = {
  id: 'generics-traits',
  number: 7,
  title: 'Generics & Traits: Zero-Cost Abstractions',
  description: 'Write flexible code with generics, define shared behavior with traits, and master compiler monomorphization.',
  icon: '⚡',
  lessons: [
    {
      id: '21-generics',
      chapterId: 'generics-traits',
      chapterNumber: 7,
      lessonNumber: 1,
      title: 'Generics & Monomorphization',
      tagline: 'Writing functions and structs that operate over any type without runtime overhead.',
      readTimeMinutes: 7,
      difficulty: 'intermediate',
      tags: ['generics', 'monomorphization', 'zero-cost', '<T>'],
      overview: 'Generics allow you to write abstract code that works with multiple concrete types. Rust implements generics via **monomorphization**: at compile time, the compiler duplicates and specializes functions for each concrete type used, resulting in zero runtime performance penalty.',
      sections: [
        {
          id: 'generic-functions',
          title: 'Generic Functions',
          content: `To make a function generic, place type parameter names inside angle brackets \`<T>\`:`,
          codeSnippet: {
            code: `// Swap two values of any type T
fn swap<T>(a: &mut T, b: &mut T) {
    std::mem::swap(a, b);
}

fn main() {
    let mut x = 5;
    let mut y = 10;
    swap(&mut x, &mut y);
    println!("x={}, y={}", x, y); // x=10, y=5
    
    let mut s1 = "hello".to_string();
    let mut s2 = "world".to_string();
    swap(&mut s1, &mut s2); // specialized for String!
}`,
            caption: 'Generic swap function specialized at compile time.',
          },
        },
        {
          id: 'generic-structs',
          title: 'Generic Structs',
          content: `You can define structs holding generic types \`T\` and \`U\`:`,
          codeSnippet: {
            code: `struct Point<T> {
    x: T,
    y: T,
}

impl<T> Point<T> {
    fn x(&self) -> &T {
        &self.x
    }
}`,
            caption: 'Generic Point struct and method implementation.',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Assuming different generic fields can have different types',
          badCode: `struct Point<T> {
    x: T,
    y: T,
}
let p = Point { x: 5, y: 4.0 }; // Error: expected integer, found float`,
          badExplanation: 'Both `x` and `y` are declared as the same type parameter `T`.',
          goodCode: `struct Point<T, U> {
    x: T,
    y: U,
}
let p = Point { x: 5, y: 4.0 }; // OK: T is i32, U is f64`,
          goodExplanation: 'Use distinct generic parameters `<T, U>` when fields can hold different types.',
        },
      ],
      keyTakeaways: [
        'Generics `<T>` allow writing flexible, reusable code.',
        'Monomorphization compiles generic code into dedicated concrete machine code with zero runtime cost.',
        'Multiple distinct generic types must use separate parameter names `<T, U>`.',
      ],
      quests: [
        {
          id: 'tut-21-generic-pair',
          type: 'coding',
          title: 'Generic Pair Swapper',
          prompt: 'Define a struct `Pair<T, U> { pub first: T, pub second: U }`. Implement method `swap(self) -> Pair<U, T>` which returns a new `Pair` with `first` and `second` swapped.',
          signature: 'pub struct Pair<T, U> ... impl<T, U> Pair<T, U> ...',
          starterCode: `pub struct Pair<T, U> {
    pub first: T,
    pub second: U,
}

impl<T, U> Pair<T, U> {
    pub fn new(first: T, second: U) -> Self {
        todo!()
    }

    pub fn swap(self) -> Pair<U, T> {
        todo!()
    }
}`,
          testHarness: `{{SOLUTION}}

fn main() {
    let p = Pair::new(10, "cratery");
    let swapped = p.swap();
    assert_eq!(swapped.first, "cratery");
    assert_eq!(swapped.second, 10);

    let p2 = Pair::new(true, 3.14);
    let swapped2 = p2.swap();
    assert_eq!(swapped2.first, 3.14);
    assert_eq!(swapped2.second, true);
    println!("all tests passed");
}`,
          hints: ['In `swap`, return `Pair { first: self.second, second: self.first }`.'],
          solutionCode: `pub struct Pair<T, U> {
    pub first: T,
    pub second: U,
}

impl<T, U> Pair<T, U> {
    pub fn new(first: T, second: U) -> Self {
        Self { first, second }
    }

    pub fn swap(self) -> Pair<U, T> {
        Pair {
            first: self.second,
            second: self.first,
        }
    }
}`,
          solutionWalkthrough: '`Pair<T, U>` accepts two independent generic types. Calling `.swap(self)` consumes the pair and constructs a `Pair<U, T>` with the swapped fields.',
          xpReward: 15,
        },
        {
          id: 'tut-21-quiz-monomorphization',
          type: 'quiz',
          title: 'Concept Check: What is Monomorphization?',
          prompt: 'What does the Rust compiler do during monomorphization of generic code?',
          options: [
            { label: 'A', text: 'It replaces all generic types with void pointers and dynamic runtime lookups.' },
            { label: 'B', text: 'It generates specialized, dedicated machine code functions for each concrete type used, eliminating runtime overhead.' },
            { label: 'C', text: 'It boxes every generic argument on the heap.' },
            { label: 'D', text: 'It interprets generic code with a bytecode virtual machine.' },
          ],
          correctIndex: 1,
          explanation: 'Monomorphization is compile-time code generation: rustc inspects all places where a generic function is invoked and generates exact duplicate functions specialized for `i32`, `String`, etc., allowing inlining and maximum optimization.',
          hint: 'Think "mono" (single) + "morph" (form) at compile time.',
          xpReward: 10,
        },
      ],
    },
    {
      id: '22-traits-and-bounds',
      chapterId: 'generics-traits',
      chapterNumber: 7,
      lessonNumber: 2,
      title: 'Traits & Trait Bounds',
      tagline: 'Defining interfaces, requiring capabilities, and the orphan rule.',
      readTimeMinutes: 8,
      difficulty: 'intermediate',
      tags: ['traits', 'bounds', 'impl-trait', 'where'],
      overview: 'A **trait** defines shared behavior that a type can implement (similar to interfaces in other languages). **Trait bounds** constrain generic parameters to types that guarantee specific capabilities.',
      sections: [
        {
          id: 'defining-traits',
          title: 'Defining & Implementing a Trait',
          content: `To define a trait, use the \`trait\` keyword:`,
          codeSnippet: {
            code: `pub trait Summary {
    fn summarize(&self) -> String;
    
    // Default implementation
    fn preview(&self) -> String {
        format!("(Read more: {})", self.summarize())
    }
}

pub struct Article {
    pub title: String,
    pub author: String,
}

impl Summary for Article {
    fn summarize(&self) -> String {
        format!("{} by {}", self.title, self.author)
    }
}`,
            caption: 'Defining and implementing custom traits.',
          },
        },
        {
          id: 'trait-bounds',
          title: 'Trait Bounds and `where` Clauses',
          content: `You can constrain generic functions so they only accept types implementing specific traits:`,
          codeSnippet: {
            code: `use std::fmt::Display;

pub trait Summary {
    fn summarize(&self) -> String;
}

// Using \`impl Trait\` syntax
fn notify(item: &impl Summary) {
    println!("Breaking: {}", item.summarize());
}

// Using explicit trait bound with where clause
fn print_largest<T>(list: &[T]) 
where 
    T: PartialOrd + Display 
{
    let mut largest = &list[0];
    for item in list {
        if item > largest {
            largest = item;
        }
    }
    println!("Largest is {}", largest);
}`,
            caption: 'Constraining generics with trait bounds and where clauses.',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Violating the Orphan Rule (Coherence)',
          badCode: `// Attempting to implement a foreign trait on a foreign type
impl std::fmt::Display for Vec<i32> { // Error: cannot define inherent \`impl\` for a type outside of the current crate
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result { ... }
}`,
          badExplanation: 'You can only implement a trait if either the trait OR the type is local to your crate (the Orphan Rule).',
          goodCode: `// Use the Newtype pattern
struct MyVec(Vec<i32>);
impl std::fmt::Display for MyVec { ... }`,
          goodExplanation: 'Wrap foreign types in a local tuple struct (Newtype pattern) to implement foreign traits safely.',
        },
      ],
      keyTakeaways: [
        'Traits define shared behavior and can provide default method implementations.',
        'Trait bounds (`T: Trait1 + Trait2`) restrict generics to types providing required behavior.',
        'The Orphan Rule guarantees that trait implementations can never collide or break coherence across crates.',
      ],
      quests: [
        {
          id: 'tut-22-area-trait',
          type: 'coding',
          title: 'Shape Area Trait Implementation',
          prompt: 'Define a trait `Area { fn area(&self) -> f64; }`. Create struct `Circle { pub radius: f64 }` and struct `Square { pub side: f64 }`. Implement `Area` for both (`Circle::area = std::f64::consts::PI * r * r`, `Square::area = side * side`). Also implement `total_area<T: Area>(shapes: &[T]) -> f64`.',
          signature: 'pub trait Area ... pub struct Circle ... pub struct Square ... pub fn total_area<T: Area>(shapes: &[T]) -> f64',
          starterCode: `pub trait Area {
    fn area(&self) -> f64;
}

pub struct Circle {
    pub radius: f64,
}

pub struct Square {
    pub side: f64,
}

// TODO: Implement Area for Circle and Square
// TODO: Implement total_area<T: Area>(shapes: &[T]) -> f64

pub fn total_area<T: Area>(shapes: &[T]) -> f64 {
    todo!()
}`,
          testHarness: `{{SOLUTION}}

fn main() {
    let squares = [Square { side: 2.0 }, Square { side: 3.0 }];
    assert_eq!(total_area(&squares), 13.0); // 4 + 9 = 13

    let c = Circle { radius: 1.0 };
    assert!((c.area() - std::f64::consts::PI).abs() < 1e-6);
    println!("all tests passed");
}`,
          hints: [
            'Circle area: `std::f64::consts::PI * self.radius * self.radius`',
            'In `total_area`, sum with `shapes.iter().map(|s| s.area()).sum()`',
          ],
          solutionCode: `pub trait Area {
    fn area(&self) -> f64;
}

pub struct Circle {
    pub radius: f64,
}

impl Area for Circle {
    fn area(&self) -> f64 {
        std::f64::consts::PI * self.radius * self.radius
    }
}

pub struct Square {
    pub side: f64,
}

impl Area for Square {
    fn area(&self) -> f64 {
        self.side * self.side
    }
}

pub fn total_area<T: Area>(shapes: &[T]) -> f64 {
    shapes.iter().map(|s| s.area()).sum()
}`,
          solutionWalkthrough: 'We define the `Area` trait, implement it on `Circle` and `Square`, and write a generic function `total_area` bounded by `T: Area`.',
          xpReward: 15,
        },
        {
          id: 'tut-22-quiz-orphan-rule',
          type: 'quiz',
          title: 'Concept Check: What is the Orphan Rule?',
          prompt: 'What does Rust\'s "Orphan Rule" for trait implementation enforce?',
          options: [
            { label: 'A', text: 'You can only implement a trait for a type if either the trait or the type is defined inside your own crate.' },
            { label: 'B', text: 'Traits can only be implemented for structs, not enums.' },
            { label: 'C', text: 'Parent traits must be deleted before child traits can compile.' },
            { label: 'D', text: 'Structs without constructors cannot implement traits.' },
          ],
          correctIndex: 0,
          explanation: 'The Orphan Rule ensures coherence: if two crates could implement a foreign trait on a foreign type, rustc would not know which implementation to use when both crates are imported.',
          hint: 'Think about who must own at least one of the trait or the type.',
          xpReward: 10,
        },
      ],
    },
  ],
}
