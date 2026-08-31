import type { TutorialChapter } from '../types'

export const chapter4StructsEnums: TutorialChapter = {
  id: 'structs-enums',
  number: 4,
  title: 'Structs, Enums & Pattern Matching',
  description: 'Design custom domain models with structs, methods, algebraic enums, and exhaustive pattern matching.',
  icon: '💎',
  lessons: [
    {
      id: '12-structs-and-methods',
      chapterId: 'structs-enums',
      chapterNumber: 4,
      lessonNumber: 1,
      title: 'Structs & Method Implementation (`impl`)',
      tagline: 'Encapsulating state and behavior with structs and associated methods.',
      readTimeMinutes: 8,
      difficulty: 'beginner',
      tags: ['struct', 'impl', 'methods', 'self'],
      overview: 'Structs allow you to create custom data types by grouping named fields. Methods are defined within `impl` blocks and take `self`, `&self`, or `&mut self` as their first parameter.',
      sections: [
        {
          id: 'struct-definition',
          title: 'Defining & Instantiating Structs',
          content: `To define a struct, use the \`struct\` keyword and name the fields. Rust also provides field init shorthand and struct update syntax:`,
          codeSnippet: {
            code: `struct User {
    username: String,
    email: String,
    active: bool,
    sign_in_count: u64,
}

fn build_user(email: String, username: String) -> User {
    User {
        email,    // field init shorthand
        username,
        active: true,
        sign_in_count: 1,
    }
}`,
            caption: 'Defining and instantiating custom structs.',
          },
        },
        {
          id: 'methods-impl',
          title: 'Methods and Associated Functions',
          content: `Methods are functions associated with a struct, defined inside an \`impl\` block:
- **\`&self\`**: Borrows the instance immutably for reading.
- **\`&mut self\`**: Borrows the instance mutably to alter its state.
- **\`self\`**: Consumes and takes ownership of the instance.
- **Associated functions** (like \`Rectangle::new\`) do not take \`self\` and act as constructors.`,
          codeSnippet: {
            code: `struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    // Constructor (associated function)
    fn new(width: u32, height: u32) -> Self {
        Self { width, height }
    }

    // Method taking immutable borrow
    fn area(&self) -> u32 {
        self.width * self.height
    }

    // Method taking mutable borrow
    fn scale(&mut self, factor: u32) {
        self.width *= factor;
        self.height *= factor;
    }
}`,
            caption: 'Implementing constructors and methods on Rectangle.',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Forgetting `&` on `self` in methods',
          badCode: `impl Rectangle {
    fn area(self) -> u32 { // Consumes ownership of self!
        self.width * self.height
    }
}
let rect = Rectangle::new(10, 20);
rect.area();
rect.area(); // Error: use of moved value \`rect\``,
          badExplanation: 'Using `self` by value moves ownership into the method, destroying the instance after the first call.',
          goodCode: `impl Rectangle {
    fn area(&self) -> u32 { // Borrows immutably
        self.width * self.height
    }
}`,
          goodExplanation: 'Always use `&self` unless you explicitly want to consume the object.',
        },
      ],
      keyTakeaways: [
        'Use `struct` to model custom composite domain types.',
        '`&self` borrows the struct, `&mut self` mutates it, and `self` consumes ownership.',
        'Associated functions without a `self` parameter are called with `Type::function()`.',
      ],
      quests: [
        {
          id: 'tut-12-bank-account',
          type: 'coding',
          title: 'Bank Account Balance Tracker',
          prompt: 'Create a struct `BankAccount` with private field `balance: i64`. Implement methods: `new(initial: i64) -> BankAccount`, `deposit(&mut self, amount: i64)`, `withdraw(&mut self, amount: i64) -> bool` (returns `true` if successful, or `false` without modifying balance if `amount > balance`), and `balance(&self) -> i64`.',
          signature: 'pub struct BankAccount ... impl BankAccount ...',
          starterCode: `pub struct BankAccount {
    balance: i64,
}

impl BankAccount {
    pub fn new(initial: i64) -> Self {
        todo!()
    }

    pub fn deposit(&mut self, amount: i64) {
        todo!()
    }

    pub fn withdraw(&mut self, amount: i64) -> bool {
        todo!()
    }

    pub fn balance(&self) -> i64 {
        todo!()
    }
}`,
          testHarness: `{{SOLUTION}}

fn main() {
    let mut acc = BankAccount::new(100);
    assert_eq!(acc.balance(), 100);

    acc.deposit(50);
    assert_eq!(acc.balance(), 150);

    assert!(acc.withdraw(80));
    assert_eq!(acc.balance(), 70);

    assert!(!acc.withdraw(100)); // Insufficient funds
    assert_eq!(acc.balance(), 70);
    println!("all tests passed");
}`,
          hints: [
            'In `withdraw`, check `if amount > self.balance { false } else { self.balance -= amount; true }`.',
          ],
          solutionCode: `pub struct BankAccount {
    balance: i64,
}

impl BankAccount {
    pub fn new(initial: i64) -> Self {
        Self { balance: initial }
    }

    pub fn deposit(&mut self, amount: i64) {
        self.balance += amount;
    }

    pub fn withdraw(&mut self, amount: i64) -> bool {
        if amount > self.balance {
            false
        } else {
            self.balance -= amount;
            true
        }
    }

    pub fn balance(&self) -> i64 {
        self.balance
    }
}`,
          solutionWalkthrough: 'We construct `BankAccount` with `Self { balance: initial }`, mutate state via `&mut self` in `deposit` and `withdraw`, and inspect state via `&self` in `balance()`.',
          xpReward: 15,
        },
        {
          id: 'tut-12-quiz-method-self',
          type: 'quiz',
          title: 'Concept Check: Method `self` Signatures',
          prompt: 'Which method signature should you use if a method needs to read struct fields without modifying or consuming the instance?',
          options: [
            { label: 'A', text: '`fn get_id(self) -> u32`' },
            { label: 'B', text: '`fn get_id(&self) -> u32`' },
            { label: 'C', text: '`fn get_id(&mut self) -> u32`' },
            { label: 'D', text: '`fn get_id(mut self) -> u32`' },
          ],
          correctIndex: 1,
          explanation: '`&self` borrows the instance immutably. This allows any number of readers to call the method without consuming or modifying the struct.',
          hint: 'Look for the immutable reference to self.',
          xpReward: 10,
        },
      ],
    },
    {
      id: '13-enums-and-option',
      chapterId: 'structs-enums',
      chapterNumber: 4,
      lessonNumber: 2,
      title: 'Enums with Data & `Option<T>`',
      tagline: 'Algebraic data types and the total elimination of null pointer exceptions.',
      readTimeMinutes: 8,
      difficulty: 'intermediate',
      tags: ['enum', 'option', 'null-safety', 'adt'],
      overview: 'Rust enums are **Algebraic Data Types (Tagged Unions)**. Unlike C or Java enums, each variant can hold different types and amounts of associated data. Rust does not have a `null` value—instead, it uses the standard `Option<T>` enum.',
      sections: [
        {
          id: 'enums-data',
          title: 'Enums with Associated Data',
          content: `Each enum variant can store arbitrary data, including primitive types, tuples, or structs:`,
          codeSnippet: {
            code: `enum WebEvent {
    PageLoad,
    KeyPress(char),
    Click { x: i64, y: i64 },
    Paste(String),
}

fn inspect(event: WebEvent) {
    match event {
        WebEvent::PageLoad => println!("Page loaded"),
        WebEvent::KeyPress(c) => println!("Key pressed: {}", c),
        WebEvent::Click { x, y } => println!("Clicked at ({}, {})", x, y),
        WebEvent::Paste(text) => println!("Pasted: {}", text),
    }
}`,
            caption: 'Enum variants holding different payloads.',
          },
        },
        {
          id: 'option-type',
          title: '`Option<T>`: The Null Alternative',
          content: `The \`Option<T>\` enum is defined in the standard library as:
\`\`\`rust
enum Option<T> {
    Some(T),
    None,
}
\`\`\`
Because \`Option<T>\` and \`T\` are different types, the compiler forces you to explicitly handle the \`None\` case before you can access the inner \`T\`. This completely eliminates the billion-dollar mistake of NullPointerExceptions!`,
          codeSnippet: {
            code: `fn divide(numerator: f64, denominator: f64) -> Option<f64> {
    if denominator == 0.0 {
        None
    } else {
        Some(numerator / denominator)
    }
}

fn main() {
    let result = divide(10.0, 2.0);
    match result {
        Some(val) => println!("Result: {}", val),
        None => println!("Cannot divide by zero!"),
    }
}`,
            caption: 'Using Option<T> for fallible operations without null.',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Calling `.unwrap()` on `None`',
          badCode: `let opt: Option<i32> = None;
let val = opt.unwrap(); // Panics at runtime with "called \`Option::unwrap()\` on a \`None\` value"`,
          badExplanation: '`.unwrap()` assumes the value is `Some(T)`. If it is `None`, your program panics immediately.',
          goodCode: `let opt: Option<i32> = None;
let val = opt.unwrap_or(0); // Fallback default`,
          goodExplanation: 'Use `match`, `if let`, `.unwrap_or(default)`, or `.unwrap_or_else()` for safe handling.',
        },
      ],
      keyTakeaways: [
        'Rust enums can hold data directly inside their variants.',
        'Rust has no `null`; absence of a value is explicitly modeled via `Option<T>` (`Some(T)` or `None`).',
        'The compiler prevents accessing the inner value of an `Option` without explicitly handling `None`.',
      ],
      quests: [
        {
          id: 'tut-13-safe-division',
          type: 'coding',
          title: 'Safe Integer Average',
          prompt: 'Implement `safe_average(numbers: &[i32]) -> Option<f64>`. If `numbers` is empty, return `None`. Otherwise, calculate the sum and return `Some(sum / length as f64)`.',
          signature: 'pub fn safe_average(numbers: &[i32]) -> Option<f64>',
          starterCode: `pub fn safe_average(numbers: &[i32]) -> Option<f64> {
    // TODO: Return None if empty, otherwise Some(average)
    todo!()
}`,
          testHarness: `{{SOLUTION}}

fn main() {
    assert_eq!(safe_average(&[10, 20, 30]), Some(20.0));
    assert_eq!(safe_average(&[]), None);
    assert_eq!(safe_average(&[5, 10]), Some(7.5));
    println!("all tests passed");
}`,
          hints: [
            'Check `if numbers.is_empty() { return None; }`.',
            'Sum the numbers, cast to `f64`, and wrap in `Some(...)`.',
          ],
          solutionCode: `pub fn safe_average(numbers: &[i32]) -> Option<f64> {
    if numbers.is_empty() {
        return None;
    }
    let sum: i64 = numbers.iter().map(|&n| n as i64).sum();
    Some(sum as f64 / numbers.len() as f64)
}`,
          solutionWalkthrough: 'We guard against division by zero by checking `numbers.is_empty()`. If non-empty, we compute the sum as `i64` to prevent overflow, divide by length, and wrap the result in `Some(...)`.',
          xpReward: 15,
        },
        {
          id: 'tut-13-quiz-option-safety',
          type: 'quiz',
          title: 'Concept Check: Null Safety in Rust',
          prompt: 'Why is `Option<T>` safer than a nullable pointer in C/Java?',
          options: [
            { label: 'A', text: '`Option<T>` automatically allocates all data in secure heap zones.' },
            { label: 'B', text: '`Option<T>` and `T` are distinct types, so the compiler forces you to handle `None` before you can access `T`.' },
            { label: 'C', text: '`Option<T>` converts `None` to zero automatically.' },
            { label: 'D', text: '`Option<T>` ignores null pointer errors at runtime without crashing.' },
          ],
          correctIndex: 1,
          explanation: 'In Rust, `T` is guaranteed to always hold a valid instance of `T`. If a value might be absent, it must be typed as `Option<T>`, preventing accidental access without explicit unwrapping or matching.',
          hint: 'Focus on how the compiler prevents accidental null dereferencing.',
          xpReward: 10,
        },
      ],
    },
    {
      id: '14-pattern-matching',
      chapterId: 'structs-enums',
      chapterNumber: 4,
      lessonNumber: 3,
      title: 'Exhaustive Pattern Matching & `match`',
      tagline: 'The power of `match`, match guards, destructuring, and compiler exhaustiveness.',
      readTimeMinutes: 7,
      difficulty: 'intermediate',
      tags: ['match', 'patterns', 'destructuring', 'guards'],
      overview: '`match` is Rust’s most powerful control flow construct. It compares a value against a series of patterns and executes code based on which pattern matches. Matches in Rust are **exhaustive**: every single possible value must be covered.',
      sections: [
        {
          id: 'match-exhaustiveness',
          title: 'Exhaustive Matching',
          content: `When matching on enums or types, the compiler verifies that all cases are handled. You can use the catch-all pattern \`_\` to handle remaining cases:`,
          codeSnippet: {
            code: `let number = 13;
match number {
    1 => println!("One!"),
    2 | 3 | 5 | 7 | 11 | 13 => println!("Small prime number"),
    14..=20 => println!("Teen between 14 and 20"),
    _ => println!("Other number"),
}`,
            caption: 'Matching on literals, multi-patterns, and ranges.',
          },
        },
        {
          id: 'match-guards',
          title: 'Match Guards (Conditional Matching)',
          content: `A **match guard** is an additional \`if\` condition specified after the pattern that must also match for the arm to be chosen:`,
          codeSnippet: {
            code: `let num = Some(4);
match num {
    Some(x) if x % 2 == 0 => println!("Even number: {}", x),
    Some(x) => println!("Odd number: {}", x),
    None => println!("No number"),
}`,
            caption: 'Using if match guards for conditional pattern matching.',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Non-exhaustive match compiler error',
          badCode: `let opt = Some(5);
match opt {
    Some(x) => println!("{}", x), // Error: non-exhaustive patterns: \`None\` not covered
}`,
          badExplanation: 'The compiler refuses to build code where a case could slip through unhandled.',
          goodCode: `match opt {
    Some(x) => println!("{}", x),
    None => (),
}`,
          goodExplanation: 'Explicitly handle `None` or use a wildcard `_`.',
          compilerErrorSnippet: `error[E0004]: non-exhaustive patterns: \`None\` not covered
 --> src/main.rs:2:11
  |
2 |     match opt {
  |           ^^^ pattern \`None\` not covered`,
        },
      ],
      keyTakeaways: [
        '`match` expressions are exhaustive: all possible variants or values must be covered.',
        'Combine multiple values with `|` and numerical ranges with `start..=end`.',
        'Use match guards (`if condition`) to add runtime conditional constraints to pattern arms.',
      ],
      quests: [
        {
          id: 'tut-14-evaluate-command',
          type: 'coding',
          title: 'Command Evaluator with Pattern Matching',
          prompt: 'Given an enum `Command { Move { dx: i32, dy: i32 }, Teleport(i32, i32), Reset }`, implement `apply_command(cmd: Command, current: (i32, i32)) -> (i32, i32)`. `Move` adds `dx` and `dy` to `current`. `Teleport(x, y)` sets coordinates to `(x, y)`. `Reset` sets coordinates to `(0, 0)`.',
          signature: 'pub fn apply_command(cmd: Command, current: (i32, i32)) -> (i32, i32)',
          starterCode: `pub enum Command {
    Move { dx: i32, dy: i32 },
    Teleport(i32, i32),
    Reset,
}

pub fn apply_command(cmd: Command, current: (i32, i32)) -> (i32, i32) {
    // TODO: Match on cmd and compute new position
    todo!()
}`,
          testHarness: `{{SOLUTION}}

fn main() {
    let pos = (10, 20);
    assert_eq!(apply_command(Command::Move { dx: 5, dy: -3 }, pos), (15, 17));
    assert_eq!(apply_command(Command::Teleport(100, 200), pos), (100, 200));
    assert_eq!(apply_command(Command::Reset, pos), (0, 0));
    println!("all tests passed");
}`,
          hints: [
            'Use a `match cmd` block with arms for each variant.',
          ],
          solutionCode: `pub enum Command {
    Move { dx: i32, dy: i32 },
    Teleport(i32, i32),
    Reset,
}

pub fn apply_command(cmd: Command, current: (i32, i32)) -> (i32, i32) {
    match cmd {
        Command::Move { dx, dy } => (current.0 + dx, current.1 + dy),
        Command::Teleport(x, y) => (x, y),
        Command::Reset => (0, 0),
    }
}`,
          solutionWalkthrough: 'The `match` pattern destructures named fields `Move { dx, dy }`, positional tuple variants `Teleport(x, y)`, and unit variants `Reset` directly in the match arms.',
          xpReward: 15,
        },
        {
          id: 'tut-14-quiz-guard',
          type: 'quiz',
          title: 'Concept Check: Match Guards',
          prompt: 'What happens if the pattern matches in a match arm, but its match guard `if condition` evaluates to `false`?',
          options: [
            { label: 'A', text: 'The program panics with a match guard exception.' },
            { label: 'B', text: 'Pattern matching moves on to test subsequent match arms.' },
            { label: 'C', text: 'The arm executes anyway with default values.' },
            { label: 'D', text: 'The match immediately returns the unit value ().' },
          ],
          correctIndex: 1,
          explanation: 'If a pattern matches but the guard expression evaluates to `false`, Rust continues checking subsequent match arms until it finds a matching arm.',
          hint: 'Guards act as additional filters on an arm.',
          xpReward: 10,
        },
      ],
    },
    {
      id: '15-if-let-while-let',
      chapterId: 'structs-enums',
      chapterNumber: 4,
      lessonNumber: 4,
      title: 'Concise Control Flow: `if let`, `while let` & `let else`',
      tagline: 'Handling single pattern matches without boilerplate match arms.',
      readTimeMinutes: 6,
      difficulty: 'intermediate',
      tags: ['if-let', 'while-let', 'let-else', 'patterns'],
      overview: 'When you only care about matching one specific variant and ignoring all other possibilities, a full `match` expression can be verbose. Rust provides `if let`, `while let`, and `let else` for clean, ergonomic pattern handling.',
      sections: [
        {
          id: 'if-let',
          title: '`if let` Syntax',
          content: `The \`if let\` syntax allows you to combine \`if\` and \`let\` into a less verbose way to handle values that match one pattern while ignoring the rest:`,
          codeSnippet: {
            code: `let config_max = Some(3u8);

// Instead of verbose match config_max { Some(max) => ..., _ => () }
if let Some(max) = config_max {
    println!("The maximum is configured to be {}", max);
}`,
            caption: 'Using if let for single-pattern matching.',
          },
        },
        {
          id: 'let-else',
          title: 'Guard Clauses with `let else` (Rust 1.65+)',
          content: `\`let else\` enables early return / guard patterns. If the pattern matches, variables are bound in the outer scope. If the pattern fails, the \`else\` block **must** diverge (e.g., \`return\`, \`break\`, \`continue\`, or \`panic!\`).`,
          codeSnippet: {
            code: `fn process_user_id(id_opt: Option<u64>) -> String {
    let Some(id) = id_opt else {
        return "Missing user ID".to_string();
    };
    
    // 'id' is now directly available as an unnested u64 here!
    format!("User ID: {}", id)
}`,
            caption: 'Eliminating indentation pyramids with let else guard clauses.',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Not diverging inside a `let else` block',
          badCode: `fn test(val: Option<i32>) {
    let Some(x) = val else {
        println!("None"); // Error: \`else\` clause of \`let...else\` does not diverge
    };
}`,
          badExplanation: 'The `else` block of `let else` must never fall through; it must return, break, continue, or panic.',
          goodCode: `fn test(val: Option<i32>) {
    let Some(x) = val else {
        println!("None");
        return;
    };
}`,
          goodExplanation: 'Ensure the `else` branch explicitly exits the scope with `return` or `break`.',
        },
      ],
      keyTakeaways: [
        'Use `if let` when you want to handle one variant and ignore all others.',
        'Use `while let` to continuously loop as long as a pattern continues to match (e.g. popping a queue).',
        'Use `let else` for early returns to unwrap values without nesting your logic inside blocks.',
      ],
      quests: [
        {
          id: 'tut-15-drain-stack',
          type: 'coding',
          title: 'Sum and Drain Stack with `while let`',
          prompt: 'Implement `drain_and_sum(mut stack: Vec<i32>) -> i32`. Use `while let Some(val) = stack.pop()` to remove elements from the back of the vector and accumulate their sum until the stack is empty.',
          signature: 'pub fn drain_and_sum(mut stack: Vec<i32>) -> i32',
          starterCode: `pub fn drain_and_sum(mut stack: Vec<i32>) -> i32 {
    // TODO: Use while let Some(...) = stack.pop() to sum elements
    todo!()
}`,
          testHarness: `{{SOLUTION}}

fn main() {
    assert_eq!(drain_and_sum(vec![10, 20, 30]), 60);
    assert_eq!(drain_and_sum(vec![]), 0);
    assert_eq!(drain_and_sum(vec![5, -5, 10]), 10);
    println!("all tests passed");
}`,
          hints: ['Initialize `let mut sum = 0;` and loop with `while let Some(val) = stack.pop()`. '],
          solutionCode: `pub fn drain_and_sum(mut stack: Vec<i32>) -> i32 {
    let mut sum = 0;
    while let Some(val) = stack.pop() {
        sum += val;
    }
    sum
}`,
          solutionWalkthrough: '`stack.pop()` returns `Some(val)` while items remain and `None` when empty. `while let` naturally loops until `None` is encountered and terminates cleanly.',
          xpReward: 15,
        },
        {
          id: 'tut-15-quiz-let-else',
          type: 'quiz',
          title: 'Concept Check: Requirement of `let else` blocks',
          prompt: 'What is a mandatory requirement for the `else` block of a `let else` statement in Rust?',
          options: [
            { label: 'A', text: 'It must allocate memory on the heap.' },
            { label: 'B', text: 'It must diverge (i.e. return, break, continue, or panic) and never fall through.' },
            { label: 'C', text: 'It must contain at least two match arms.' },
            { label: 'D', text: 'It must return a boolean value.' },
          ],
          correctIndex: 1,
          explanation: 'Because `let else` binds the unwrapped variables in the enclosing scope, the `else` block must diverge (type `!`), meaning execution cannot proceed past the block if the pattern match fails.',
          hint: 'What must happen if the pattern did not match?',
          xpReward: 10,
        },
      ],
    },
  ],
}
