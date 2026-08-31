import type { TutorialChapter } from '../types'

export const chapter9IteratorsClosures: TutorialChapter = {
  id: 'iterators-closures',
  number: 9,
  title: 'Iterators & Closures: Functional Rust',
  description: 'Master anonymous functions, closure capture traits (Fn, FnMut, FnOnce), and zero-cost iterator adapters.',
  icon: '🔁',
  lessons: [
    {
      id: '25-closures',
      chapterId: 'iterators-closures',
      chapterNumber: 9,
      lessonNumber: 1,
      title: 'Closures & Capture Semantics',
      tagline: 'Anonymous functions that capture their enclosing environment.',
      readTimeMinutes: 7,
      difficulty: 'intermediate',
      tags: ['closures', 'Fn', 'FnMut', 'FnOnce', 'move'],
      overview: 'Rust’s closures are anonymous functions you can save in a variable or pass as arguments. Unlike functions, closures can **capture values from the scope in which they are defined**.',
      sections: [
        {
          id: 'closure-syntax',
          title: 'Closure Syntax and Type Inference',
          content: `Closure syntax uses pipes \`|param1, param2|\` instead of parentheses:`,
          codeSnippet: {
            code: `let add_one = |x: i32| -> i32 { x + 1 };
// Short form with full type inference:
let double = |x| x * 2;
println!("Double 5: {}", double(5));`,
            caption: 'Closure syntax and automatic type inference.',
          },
        },
        {
          id: 'capture-modes',
          title: 'How Closures Capture Environment: The 3 Traits',
          content: `A closure automatically implements one or more closure traits based on how it uses captured variables:
1. **\`Fn\`**: Captures by immutable reference (\`&T\`). The closure can be called repeatedly without mutating its environment.
2. **\`FnMut\`**: Captures by mutable reference (\`&mut T\`). Can be called repeatedly and can mutate captured variables.
3. **\`FnOnce\`**: Takes ownership of captured variables by moving them (\`T\`). Can only be called **once** because it consumes its captured state.

The \`move\` keyword forces a closure to take ownership of captured variables:`,
          codeSnippet: {
            code: `let text = String::from("cratery");
// The 'move' keyword forces 'text' into the closure's ownership
let print_text = move || {
    println!("Text: {}", text);
};
print_text();`,
            caption: 'Using move closures to take full ownership.',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Calling a `FnOnce` closure more than once',
          badCode: `let s = String::from("consume");
let consume = || {
    let owned = s; // Moves 's' inside the closure body
    drop(owned);
};
consume();
consume(); // Error: use of moved value: \`consume\``,
          badExplanation: 'Because `consume` moved `s`, it implements `FnOnce` and cannot be called a second time.',
          goodCode: `let s = String::from("borrow");
let inspect = || {
    println!("{}", s); // Only borrows 's' immutably (&s), implements Fn
};
inspect();
inspect(); // OK!`,
          goodExplanation: 'Borrow rather than move data inside closures if you need to call them multiple times.',
        },
      ],
      keyTakeaways: [
        'Closures use `|params| expression` syntax and capture environment variables.',
        '`Fn` borrows immutably, `FnMut` borrows mutably, and `FnOnce` consumes ownership.',
        'Use `move || ...` to transfer ownership of environment variables into the closure.',
      ],
      quests: [
        {
          id: 'tut-25-custom-accumulator',
          type: 'coding',
          title: 'Custom Counter Closure',
          prompt: 'Implement `make_adder(start: i32) -> impl FnMut(i32) -> i32`. The returned closure should maintain an internal accumulator starting at `start`. Each time it is called with `step`, it adds `step` to the accumulator and returns the new accumulator total.',
          signature: 'pub fn make_adder(mut start: i32) -> impl FnMut(i32) -> i32',
          starterCode: `pub fn make_adder(mut start: i32) -> impl FnMut(i32) -> i32 {
    // TODO: Return a move closure that mutates and returns start
    todo!()
}`,
          testHarness: `{{SOLUTION}}

fn main() {
    let mut counter = make_adder(10);
    assert_eq!(counter(5), 15);
    assert_eq!(counter(10), 25);
    assert_eq!(counter(-5), 20);
    println!("all tests passed");
}`,
          hints: [
            'Use `move |step| { start += step; start }`.'
          ],
          solutionCode: `pub fn make_adder(mut start: i32) -> impl FnMut(i32) -> i32 {
    move |step: i32| {
        start += step;
        start
    }
}`,
          solutionWalkthrough: 'The `move` keyword captures `start` by value inside the closure environment, and mutating `start` makes the closure implement `FnMut`.',
          xpReward: 15,
        },
        {
          id: 'tut-25-quiz-fnonce',
          type: 'quiz',
          title: 'Concept Check: What triggers a closure to implement `FnOnce` only?',
          prompt: 'Which action causes a closure to implement `FnOnce` and prevent multiple invocations?',
          options: [
            { label: 'A', text: 'Printing a captured integer.' },
            { label: 'B', text: 'Moving an owned value out of the captured environment inside the closure body.' },
            { label: 'C', text: 'Passing more than two parameters to the closure.' },
            { label: 'D', text: 'Using type annotations on closure parameters.' },
          ],
          correctIndex: 1,
          explanation: 'If a closure moves an owned captured variable out of its environment (e.g. dropping it or returning it by value), the closure can only run once (`FnOnce`) because the variable no longer exists after the first run.',
          hint: 'Think about what happens when ownership is consumed.',
          xpReward: 10,
        },
      ],
    },
    {
      id: '26-iterators-and-adapters',
      chapterId: 'iterators-closures',
      chapterNumber: 9,
      lessonNumber: 2,
      title: 'Iterators & Functional Adapters',
      tagline: 'Lazy evaluation, zero-cost transformations, and consumer pipelines.',
      readTimeMinutes: 8,
      difficulty: 'intermediate',
      tags: ['iterators', 'map', 'filter', 'fold', 'collect', 'lazy'],
      overview: 'In Rust, iterators are **lazy**: they have no effect until you call methods that consume the iterator to use it up. Iterator adapters like `map`, `filter`, and `fold` are optimized by rustc into tight loops equivalent to hand-written assembly.',
      sections: [
        {
          id: 'iterator-methods',
          title: 'The `Iterator` Trait & Lazy Adapters',
          content: `All iterators implement the standard \`Iterator\` trait, which requires defining a \`next()\` method:
\`\`\`rust
pub trait Iterator {
    type Item;
    fn next(&mut self) -> Option<Self::Item>;
}
\`\`\`
- **Adapters** (\`map\`, \`filter\`, \`zip\`, \`take\`): Transform iterators lazily.
- **Consumers** (\`collect\`, \`sum\`, \`fold\`, \`count\`): Drive the iterator to completion.`,
          codeSnippet: {
            code: `let v = vec![1, 2, 3, 4, 5, 6];

// Functional processing pipeline
let sum_of_even_squares: i32 = v.iter()
    .filter(|&&x| x % 2 == 0)
    .map(|&x| x * x)
    .sum();

println!("Sum: {}", sum_of_even_squares); // 2^2 + 4^2 + 6^2 = 4 + 16 + 36 = 56`,
            caption: 'Chaining iterator adapters into zero-cost functional pipelines.',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Forgetting that iterators are lazy (unused adapters)',
          badCode: `let mut v = vec![1, 2, 3];
v.iter().map(|x| println!("{}", x)); // Warning: unused \`Map\` that must be used (does nothing!)`,
          badExplanation: 'Because `map` is lazy, nothing is executed until a consumer (like `for_each` or `collect`) drives it.',
          goodCode: `let mut v = vec![1, 2, 3];
v.iter().for_each(|x| println!("{}", x)); // Executes immediately`,
          goodExplanation: 'Use `.for_each()` or a `for in` loop when performing side-effects.',
        },
      ],
      keyTakeaways: [
        'Iterators in Rust are lazy: no computation happens until consumed.',
        '`.iter()` borrows (`&T`), `.iter_mut()` borrows mutably (`&mut T`), and `.into_iter()` consumes (`T`).',
        'Rust compiles iterator chains into assembly loops as fast as raw C `for` loops.',
      ],
      quests: [
        {
          id: 'tut-26-pipeline-transform',
          type: 'coding',
          title: 'Functional Data Pipeline',
          prompt: 'Implement `process_scores(scores: &[i32]) -> i32`. Using iterator methods: filter out negative scores, multiply all remaining scores by 2, keep only those greater than 10, and return their sum. (Do not use explicit `for` loops).',
          signature: 'pub fn process_scores(scores: &[i32]) -> i32',
          starterCode: `pub fn process_scores(scores: &[i32]) -> i32 {
    // TODO: Use scores.iter().filter(...).map(...).sum()
    todo!()
}`,
          testHarness: `{{SOLUTION}}

fn main() {
    assert_eq!(process_scores(&[3, 6, -2, 10, 4]), 32); // (6*2=12) + (10*2=20) = 32
    assert_eq!(process_scores(&[-5, -10]), 0);
    assert_eq!(process_scores(&[1, 2, 3]), 0); // 2, 4, 6 (none > 10)
    println!("all tests passed");
}`,
          hints: [
            '`scores.iter().copied().filter(|&x| x >= 0).map(|x| x * 2).filter(|&x| x > 10).sum()`'
          ],
          solutionCode: `pub fn process_scores(scores: &[i32]) -> i32 {
    scores
        .iter()
        .copied()
        .filter(|&x| x >= 0)
        .map(|x| x * 2)
        .filter(|&x| x > 10)
        .sum()
}`,
          solutionWalkthrough: 'The iterator pipeline filters non-negatives, doubles values, filters values strictly greater than 10, and sums the results with zero intermediate allocations.',
          xpReward: 15,
        },
        {
          id: 'tut-26-quiz-lazy-iter',
          type: 'quiz',
          title: 'Concept Check: Iterator Laziness',
          prompt: 'What happens when you call `let it = (0..10).map(|x| x * 2);` without consuming `it`?',
          options: [
            { label: 'A', text: 'All 10 numbers are doubled immediately and stored in an array.' },
            { label: 'B', text: 'Nothing is calculated yet because iterators are lazy and only execute when values are requested by next() or a consumer.' },
            { label: 'C', text: 'A background thread is launched to compute the values.' },
            { label: 'D', text: 'The program panics with a lazy iterator exception.' },
          ],
          correctIndex: 1,
          explanation: 'In Rust, iterator adapters produce an iterator struct that calculates items on-demand when `.next()` is called. Without a consumer like `.collect()`, `.sum()`, or a `for` loop, no work is performed.',
          hint: 'Remember that Rust iterators do not evaluate until pulled.',
          xpReward: 10,
        },
      ],
    },
  ],
}
