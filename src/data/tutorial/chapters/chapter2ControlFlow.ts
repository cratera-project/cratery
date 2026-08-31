import type { TutorialChapter } from '../types'

export const chapter2ControlFlow: TutorialChapter = {
  id: 'control-flow',
  number: 2,
  title: 'Functions & Control Flow',
  description: 'Understand expression-oriented programming, statement vs expression returns, conditionals, and loops.',
  icon: '⚡',
  lessons: [
    {
      id: '05-functions-and-returns',
      chapterId: 'control-flow',
      chapterNumber: 2,
      lessonNumber: 1,
      title: 'Functions: Statements vs Expressions',
      tagline: 'Why the last expression without a semicolon is the return value of a function.',
      readTimeMinutes: 6,
      difficulty: 'beginner',
      tags: ['fn', 'parameters', 'expressions', 'return'],
      overview: 'Rust is an **expression-oriented language**. In Rust, almost everything is an expression that evaluates to a value. Understanding the distinction between **statements** (which perform an action and end with `;`) and **expressions** (which evaluate to a resultant value) is crucial.',
      sections: [
        {
          id: 'function-signatures',
          title: 'Function Signatures and Types',
          content: `In function signatures, you **must declare the type of each parameter**. Rust's type inference works within function bodies, but not across function boundaries. The return type is declared after an arrow \`->\`.`,
          codeSnippet: {
            code: `fn add(a: i32, b: i32) -> i32 {
    a + b // Note: NO semicolon here! This is the return expression.
}`,
            caption: 'A clean Rust function returning an expression directly.',
          },
        },
        {
          id: 'statements-vs-expressions',
          title: 'Statements vs Expressions',
          content: `- **Statements** are instructions that perform some action and do not return a value. In Rust, statements end in a semicolon \`;\`.
- **Expressions** evaluate to a resultant value. If you add a semicolon to the end of an expression, you turn it into a statement, which evaluates to the unit type \`()\`.`,
          codeSnippet: {
            code: `fn calculate(x: i32) -> i32 {
    let y = {
        let z = x * 2;
        z + 10 // Expression returning z + 10 to y
    };
    
    y * 3 // Expression returned from calculate
}`,
            caption: 'Block expressions evaluating to values.',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Accidental trailing semicolon on return expression',
          badCode: `fn square(n: i32) -> i32 {
    n * n; // Error: expected \`i32\`, found \`()\`
}`,
          badExplanation: 'The semicolon transforms `n * n` into a statement, causing the function to implicitly return `()` instead of `i32`.',
          goodCode: `fn square(n: i32) -> i32 {
    n * n
}`,
          goodExplanation: 'Omit the semicolon on the final expression to return its value.',
          compilerErrorSnippet: `error[E0308]: mismatched types
 --> src/main.rs:1:22
  |
1 | fn square(n: i32) -> i32 {
  |    ------            ^^^ expected \`i32\`, found \`()\`
2 |     n * n;
  |          - help: remove this semicolon to return this value`,
        },
      ],
      keyTakeaways: [
        'Functions must explicitly annotate all parameter types and the return type `-> Type`.',
        'Expressions return a value; adding a semicolon `;` turns an expression into a statement returning `()`.',
        'Early returns are done via the `return` keyword, but idiomatic Rust uses the final expression without a semicolon.',
      ],
      quests: [
        {
          id: 'tut-05-grade-calc',
          type: 'coding',
          title: 'Score Clamping Function',
          prompt: 'Implement `clamp_and_double(val: i32, min_val: i32, max_val: i32) -> i32`. If `val < min_val`, clamp it to `min_val`. If `val > max_val`, clamp it to `max_val`. Then return the clamped value multiplied by 2 using an expression.',
          signature: 'pub fn clamp_and_double(val: i32, min_val: i32, max_val: i32) -> i32',
          starterCode: `pub fn clamp_and_double(val: i32, min_val: i32, max_val: i32) -> i32 {
    // TODO: Clamp val between min_val and max_val, then return clamped * 2
    todo!()
}`,
          testHarness: `{{SOLUTION}}

fn main() {
    assert_eq!(clamp_and_double(15, 10, 20), 30);
    assert_eq!(clamp_and_double(5, 10, 20), 20); // 10 * 2 = 20
    assert_eq!(clamp_and_double(25, 10, 20), 40); // 20 * 2 = 40
    assert_eq!(clamp_and_double(-5, 0, 100), 0);
    println!("all tests passed");
}`,
          hints: [
            'You can use `val.clamp(min_val, max_val)` or `if/else`.',
            'Make the final line `clamped * 2` without a semicolon.',
          ],
          solutionCode: `pub fn clamp_and_double(val: i32, min_val: i32, max_val: i32) -> i32 {
    let clamped = if val < min_val {
        min_val
    } else if val > max_val {
        max_val
    } else {
        val
    };
    clamped * 2
}`,
          solutionWalkthrough: 'We clamp `val` within the bounds `[min_val, max_val]` using an expression-based `if/else` block, and return `clamped * 2` as the trailing expression.',
          xpReward: 15,
        },
        {
          id: 'tut-05-quiz-expression',
          type: 'quiz',
          title: 'Concept Check: Semicolons in Function Bodies',
          prompt: 'What is the return type and value of the following function?\n\n```rust\nfn mystery() {\n    let a = 10;\n    a + 5;\n}\n```',
          options: [
            { label: 'A', text: 'Returns integer 15 of type i32' },
            { label: 'B', text: 'Returns the unit type () with no value' },
            { label: 'C', text: 'Returns integer 10' },
            { label: 'D', text: 'Compile error because a is unused' },
          ],
          correctIndex: 1,
          explanation: 'Because `a + 5;` ends in a semicolon, it is evaluated as a statement. The function body has no trailing expression and returns the unit type `()` implicitly.',
          hint: 'Look at the trailing semicolon on the last line inside the function body.',
          xpReward: 10,
        },
      ],
    },
    {
      id: '06-control-flow-if',
      chapterId: 'control-flow',
      chapterNumber: 2,
      lessonNumber: 2,
      title: 'Conditionals: `if` as an Expression',
      tagline: 'Using `if`, `else if`, and assigning ternary-like results cleanly.',
      readTimeMinutes: 6,
      difficulty: 'beginner',
      tags: ['if', 'else', 'ternary', 'conditions'],
      overview: 'In Rust, `if` is an expression, not a statement. This means `if/else` blocks evaluate to a value that can be assigned directly to variables without needing a separate ternary `?:` operator.',
      sections: [
        {
          id: 'if-basics',
          title: 'Conditionals and Strict Booleans',
          content: `Conditions in \`if\` statements **must be explicit booleans**. Rust will never attempt to convert non-boolean types (like \`0\` or \`null\`) into booleans.`,
          codeSnippet: {
            code: `let number = 7;
if number % 2 == 0 {
    println!("Even");
} else {
    println!("Odd");
}`,
            caption: 'Standard if-else branching with boolean conditions.',
          },
        },
        {
          id: 'if-let-binding',
          title: 'Assigning from `if` Expressions',
          content: `Because \`if\` is an expression, you can use it on the right side of a \`let\` statement. All branches **must return the exact same type**.`,
          codeSnippet: {
            code: `let condition = true;
let number = if condition { 5 } else { 6 };
println!("The value is: {}", number);`,
            caption: 'Assigning variable bindings directly from an if/else expression.',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Branches returning different types',
          badCode: `let score = 85;
let result = if score >= 50 { "Pass" } else { 0 }; // Error: expected &str, found integer`,
          badExplanation: 'Rust is statically typed; every branch of an `if` expression must evaluate to the same type so the compiler knows the variable type.',
          goodCode: `let score = 85;
let result = if score >= 50 { "Pass" } else { "Fail" };`,
          goodExplanation: 'Ensure all `if` and `else` branches return values of the identical type.',
          compilerErrorSnippet: `error[E0308]: \`if\` and \`else\` have incompatible types
 --> src/main.rs:2:47
  |
2 |     let result = if score >= 50 { "Pass" } else { 0 };
  |                                   ------          ^ expected \`&str\`, found integer
  |                                   |
  |                                   expected because of this`,
        },
      ],
      keyTakeaways: [
        '`if` conditions must evaluate strictly to a `bool`.',
        '`if` blocks are expressions that can return values to `let` bindings.',
        'All branches in an `if/else` expression must return the identical type.',
      ],
      quests: [
        {
          id: 'tut-06-ticket-pricing',
          type: 'coding',
          title: 'Movie Ticket Tier Calculator',
          prompt: 'Implement `ticket_price(age: u32, is_student: bool) -> u32`. If `age < 12`, the price is 5. If `age >= 65`, the price is 7. Otherwise, if `is_student` is true, the price is 8; else the price is 12. Use an `if/else` expression.',
          signature: 'pub fn ticket_price(age: u32, is_student: bool) -> u32',
          starterCode: `pub fn ticket_price(age: u32, is_student: bool) -> u32 {
    // TODO: Return ticket price based on age and student status
    todo!()
}`,
          testHarness: `{{SOLUTION}}

fn main() {
    assert_eq!(ticket_price(8, false), 5);
    assert_eq!(ticket_price(70, false), 7);
    assert_eq!(ticket_price(20, true), 8);
    assert_eq!(ticket_price(20, false), 12);
    assert_eq!(ticket_price(12, true), 8);
    println!("all tests passed");
}`,
          hints: [
            'Structure your `if/else if/else` block and return the result directly.',
          ],
          solutionCode: `pub fn ticket_price(age: u32, is_student: bool) -> u32 {
    if age < 12 {
        5
    } else if age >= 65 {
        7
    } else if is_student {
        8
    } else {
        12
    }
}`,
          solutionWalkthrough: 'The `if/else if/else` expression tests the age brackets in priority order and returns the respective `u32` ticket cost cleanly.',
          xpReward: 15,
        },
        {
          id: 'tut-06-quiz-truthy',
          type: 'quiz',
          title: 'Concept Check: Condition Evaluation',
          prompt: 'What happens if you write `if 1 { println!("true"); }` in Rust?',
          options: [
            { label: 'A', text: 'It prints "true" because 1 is truthy.' },
            { label: 'B', text: 'It fails at compile time with a mismatched types error (expected bool, found integer).' },
            { label: 'C', text: 'It prints 1 to stdout.' },
            { label: 'D', text: 'It executes in debug mode but crashes in release mode.' },
          ],
          correctIndex: 1,
          explanation: 'Rust requires the condition of an `if` expression to be strictly of type `bool`. It will not perform implicit truthy/falsy conversions like JavaScript, Python, or C.',
          hint: 'Remember that Rust does not have implicit boolean coercion.',
          xpReward: 10,
        },
      ],
    },
    {
      id: '07-loops-and-labels',
      chapterId: 'control-flow',
      chapterNumber: 2,
      lessonNumber: 3,
      title: 'Loops: `loop`, `while`, `for`, and Loop Labels',
      tagline: 'Infinite loops that return values, iterator loops, and labeled breaks.',
      readTimeMinutes: 7,
      difficulty: 'beginner',
      tags: ['loop', 'while', 'for', 'break', 'labels'],
      overview: 'Rust provides three kinds of loops: `loop` (an infinite loop that can return a value via `break value`), `while` (a conditional loop), and `for` (the most idiomatic loop for iterating over ranges and collections).',
      sections: [
        {
          id: 'infinite-loop-returns',
          title: 'Returning Values from `loop` with `break`',
          content: `Rust's \`loop\` keyword creates an endless loop until explicitly broken. One powerful feature of \`loop\` is that **\`break\` can return a value** out of the loop directly into a variable:`,
          codeSnippet: {
            code: `fn main() {
    let mut counter = 0;
    
    let result = loop {
        counter += 1;
        if counter == 10 {
            break counter * 2; // Returns 20 out of the loop
        }
    };
    
    println!("The result is: {}", result); // 20
}`,
            caption: 'Returning a value directly from a loop using break.',
          },
        },
        {
          id: 'for-and-ranges',
          title: '`for` Loops and Inclusive Ranges',
          content: `The \`for\` loop is the safest and fastest way to iterate in Rust because the compiler eliminates array bounds checking when iterating over elements.

Use exclusive ranges \`0..5\` (0 to 4) or inclusive ranges \`1..=5\` (1 to 5):`,
          codeSnippet: {
            code: `fn main() {
    // Exclusive range: 1, 2, 3, 4
    for number in 1..5 {
        print!("{} ", number);
    }
    
    // Inclusive range: 1, 2, 3, 4, 5
    for number in 1..=5 {
        print!("{} ", number);
    }
    
    // Iterating over an array slice
    let items = ["apple", "banana", "cherry"];
    for item in items {
        println!("Fruit: {}", item);
    }
}`,
            caption: 'Iterating through numeric ranges and collection items.',
          },
        },
        {
          id: 'loop-labels',
          title: 'Disambiguating Nested Loops with Loop Labels',
          content: `When nesting loops, a regular \`break\` or \`continue\` only applies to the innermost loop. You can prefix loops with a **label** starting with a single quote (e.g. \`'outer:\`) to break or continue outer loops directly:`,
          codeSnippet: {
            code: `fn main() {
    'outer: for x in 0..10 {
        'inner: for y in 0..10 {
            if x * y > 20 {
                println!("Breaking outer loop at x={}, y={}", x, y);
                break 'outer; // Breaks the outer loop directly
            }
        }
    }
}`,
            caption: 'Using loop labels to break out of nested loops.',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Using `while` with index instead of `for in`',
          badCode: `let arr = [10, 20, 30];
let mut idx = 0;
while idx < arr.len() {
    println!("{}", arr[idx]); // Incurs runtime bounds check on every access
    idx += 1;
}`,
          badExplanation: 'Manual indexing is error prone and slower because rustc must check array bounds on every iteration.',
          goodCode: `let arr = [10, 20, 30];
for &elem in &arr {
    println!("{}", elem); // Fast, zero bounds-check overhead
}`,
          goodExplanation: 'Use `for elem in &arr` for idiomatic, safe, zero-cost iteration.',
        },
      ],
      keyTakeaways: [
        '`loop` can evaluate to a value using `break <value>`.',
        '`for in` is the idiomatic way to iterate over ranges (`0..N`, `0..=N`) and collections.',
        'Use loop labels (e.g. `\'label: loop`) to break or continue enclosing outer loops from within inner loops.',
      ],
      quests: [
        {
          id: 'tut-07-collatz-steps',
          type: 'coding',
          title: 'Collatz Conjecture Step Counter with `loop`',
          prompt: 'Implement `collatz_steps(mut n: u64) -> u64` to return the number of steps to reach `1`. In each step: if `n` is even, `n = n / 2`; if `n` is odd, `n = 3 * n + 1`. If `n <= 1`, return 0.',
          signature: 'pub fn collatz_steps(mut n: u64) -> u64',
          starterCode: `pub fn collatz_steps(mut n: u64) -> u64 {
    // TODO: Count steps until n reaches 1
    todo!()
}`,
          testHarness: `{{SOLUTION}}

fn main() {
    assert_eq!(collatz_steps(1), 0);
    assert_eq!(collatz_steps(2), 1);
    assert_eq!(collatz_steps(6), 8);
    assert_eq!(collatz_steps(27), 111);
    println!("all tests passed");
}`,
          hints: [
            'Handle `if n <= 1 { return 0; }` first.',
            'Use `let mut steps = 0;` and a `while n > 1` loop.',
          ],
          solutionCode: `pub fn collatz_steps(mut n: u64) -> u64 {
    if n <= 1 {
        return 0;
    }
    let mut steps = 0;
    while n > 1 {
        if n % 2 == 0 {
            n /= 2;
        } else {
            n = 3 * n + 1;
        }
        steps += 1;
    }
    steps
}`,
          solutionWalkthrough: 'We check for base cases, then loop while `n > 1`, updating `n` according to the Collatz rules and incrementing our step counter.',
          xpReward: 15,
        },
        {
          id: 'tut-07-quiz-loop-break',
          type: 'quiz',
          title: 'Concept Check: Breaking with a Return Value',
          prompt: 'Which looping construct in Rust allows returning a value using `break <expression>;` to assign to a variable?',
          options: [
            { label: 'A', text: '`loop`' },
            { label: 'B', text: '`while`' },
            { label: 'C', text: '`for`' },
            { label: 'D', text: '`goto`' },
          ],
          correctIndex: 0,
          explanation: 'Only the `loop` construct allows returning a value via `break value;` because `loop` is guaranteed to only exit through an explicit `break`, whereas `while` and `for` can exit when their conditions become false.',
          hint: 'Think about which loop guarantees an exit only through an explicit break statement.',
          xpReward: 10,
        },
      ],
    },
  ],
}
