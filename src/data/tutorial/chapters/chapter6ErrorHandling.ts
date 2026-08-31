import type { TutorialChapter } from '../types'

export const chapter6ErrorHandling: TutorialChapter = {
  id: 'error-handling',
  number: 6,
  title: 'Error Handling: Robustness by Design',
  description: 'Unrecoverable panic! vs recoverable Result<T, E>, the ? operator, and error combinators.',
  icon: '⚠️',
  lessons: [
    {
      id: '19-panic-vs-result',
      chapterId: 'error-handling',
      chapterNumber: 6,
      lessonNumber: 1,
      title: 'Unrecoverable (`panic!`) vs Recoverable (`Result<T, E>`)',
      tagline: 'When to halt execution vs when to return explicit error types.',
      readTimeMinutes: 7,
      difficulty: 'intermediate',
      tags: ['errors', 'panic!', 'result', 'exceptions'],
      overview: 'Rust does not have runtime exceptions. Instead, it categorizes errors into two distinct types: **unrecoverable errors** (which invoke the `panic!` macro and unwind the stack) and **recoverable errors** (which return a `Result<T, E>`).',
      sections: [
        {
          id: 'panic-unrecoverable',
          title: 'Unrecoverable Errors with `panic!`',
          content: `When a \`panic!\` occurs:
1. The program prints a failure message.
2. The runtime begins **unwinding** the stack, cleaning up variables and calling \`drop\` on each one.
3. The process exits with a non-zero exit code.

Use \`panic!\` only for bug conditions that should never happen in correct code (like internal invariant violations).`,
          codeSnippet: {
            code: `fn check_invariant(num: i32) {
    if num < 0 {
        panic!("Invariant violated: num must be non-negative, got {}", num);
    }
}`,
            caption: 'Triggering an unrecoverable panic on invariant violation.',
          },
        },
        {
          id: 'result-recoverable',
          title: 'Recoverable Errors with `Result<T, E>`',
          content: `The \`Result<T, E>\` enum is defined as:
\`\`\`rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
\`\`\`
Any operation that can reasonably fail (like file I/O, parsing user input, or network calls) returns \`Result<T, E>\`, forcing callers to explicitly acknowledge possible failure modes.`,
          codeSnippet: {
            code: `fn parse_percentage(input: &str) -> Result<u32, String> {
    match input.parse::<u32>() {
        Ok(val) if val <= 100 => Ok(val),
        Ok(val) => Err(format!("Percentage {} exceeds 100", val)),
        Err(_) => Err("Invalid integer input".to_string()),
    }
}`,
            caption: 'Returning Result<T, E> for fallible validation.',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Using `panic!` for routine errors like invalid user input',
          badCode: `fn parse_age(s: &str) -> u32 {
    s.parse().expect("Failed to parse age") // Crashes the entire server on bad input!
}`,
          badExplanation: 'Crashing on expected bad input makes software fragile and vulnerable to denial-of-service.',
          goodCode: `fn parse_age(s: &str) -> Result<u32, std::num::ParseIntError> {
    s.parse()
}`,
          goodExplanation: 'Return `Result` so callers can cleanly report the error back to the user or retry.',
        },
      ],
      keyTakeaways: [
        'Rust handles errors without runtime exceptions: unrecoverable bugs panic; recoverable errors return `Result<T, E>`.',
        '`Ok(T)` contains the successful value; `Err(E)` contains the error description or object.',
        'Rust compiler forces you to handle `Result` types before accessing the inner success payload.',
      ],
      quests: [
        {
          id: 'tut-19-safe-division-result',
          type: 'coding',
          title: 'Safe Integer Division with Result',
          prompt: 'Implement `divide_exact(a: i32, b: i32) -> Result<i32, String>`. If `b == 0`, return `Err("division by zero".to_string())`. If `a % b != 0`, return `Err("not evenly divisible".to_string())`. Otherwise return `Ok(a / b)`.',
          signature: 'pub fn divide_exact(a: i32, b: i32) -> Result<i32, String>',
          starterCode: `pub fn divide_exact(a: i32, b: i32) -> Result<i32, String> {
    // TODO: Return Err for 0 or non-divisible, otherwise Ok(a / b)
    todo!()
}`,
          testHarness: `{{SOLUTION}}

fn main() {
    assert_eq!(divide_exact(10, 2), Ok(5));
    assert_eq!(divide_exact(10, 0), Err("division by zero".to_string()));
    assert_eq!(divide_exact(10, 3), Err("not evenly divisible".to_string()));
    assert_eq!(divide_exact(-12, 4), Ok(-3));
    println!("all tests passed");
}`,
          hints: [
            'Check `if b == 0` first, then `if a % b != 0`, then `Ok(a / b)`.',
          ],
          solutionCode: `pub fn divide_exact(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        Err("division by zero".to_string())
    } else if a % b != 0 {
        Err("not evenly divisible".to_string())
    } else {
        Ok(a / b)
    }
}`,
          solutionWalkthrough: 'We validate the division constraints sequentially, returning descriptive `Err(String)` variants for invalid states and wrapping the quotient in `Ok(a / b)`.',
          xpReward: 15,
        },
        {
          id: 'tut-19-quiz-result-nature',
          type: 'quiz',
          title: 'Concept Check: Error Handling Philosophy',
          prompt: 'Why does Rust use `Result<T, E>` return values instead of try/catch exceptions?',
          options: [
            { label: 'A', text: 'Because exceptions in Rust can only be thrown by operating system kernel calls.' },
            { label: 'B', text: 'To make error possibilities explicit in function signatures and eliminate hidden control flow branches.' },
            { label: 'C', text: 'Because Result types are slower than exceptions.' },
            { label: 'D', text: 'Because try/catch blocks are not supported by LLVM.' },
          ],
          correctIndex: 1,
          explanation: 'With `Result<T, E>`, every potential failure is declared explicitly in the function type signature. The caller cannot ignore it, and there is no hidden non-local jump in control flow as with exceptions.',
          hint: 'Consider how explicit type signatures make function behavior transparent.',
          xpReward: 10,
        },
      ],
    },
    {
      id: '20-question-mark-operator',
      chapterId: 'error-handling',
      chapterNumber: 6,
      lessonNumber: 2,
      title: 'Propagating Errors with the `?` Operator',
      tagline: 'Ergonomic error propagation and automatic type conversion.',
      readTimeMinutes: 7,
      difficulty: 'intermediate',
      tags: ['?', 'try', 'error-propagation', 'From'],
      overview: 'When writing functions that call other fallible functions, handling every `Result` with an explicit `match` statement quickly creates deeply nested "pyramids of doom". Rust provides the `?` operator for clean, early-return error propagation.',
      sections: [
        {
          id: 'question-mark',
          title: 'The `?` Operator in Action',
          content: `When placed after a \`Result\` or \`Option\`, the \`?\` operator does the following:
- If the value is \`Ok(v)\`, it **unwraps** \`v\` and execution continues.
- If the value is \`Err(e)\`, it **returns early** from the enclosing function with \`Err(From::from(e))\`.`,
          codeSnippet: {
            code: `fn parse_sum(a_str: &str, b_str: &str) -> Result<i32, std::num::ParseIntError> {
    let a: i32 = a_str.parse()?; // Unwraps or returns early on error
    let b: i32 = b_str.parse()?; // Unwraps or returns early on error
    Ok(a + b)
}`,
            caption: 'Clean sequential error propagation using ?.',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Using `?` in functions that do not return `Result` or `Option`',
          badCode: `fn main() {
    let num: i32 = "42".parse()?; // Error: the \`?\` operator can only be used in a function that returns \`Result\` or \`Option\`
}`,
          badExplanation: '`?` expands to an early `return Err(...)`. If the enclosing function does not return a compatible `Result`, rustc fails to compile.',
          goodCode: `fn main() -> Result<(), Box<dyn std::error::Error>> {
    let num: i32 = "42".parse()?;
    println!("Num: {}", num);
    Ok(())
}`,
          goodExplanation: 'Ensure the enclosing function returns a `Result` or `Option`, or unwrap explicitly in main.',
        },
      ],
      keyTakeaways: [
        'The `?` operator unwraps `Ok` values or immediately returns `Err` from the function.',
        '`?` automatically converts error types using the `From` trait (`From::from(err)`).',
        '`main` can return `Result<(), E>` to allow using `?` at top-level.',
      ],
      quests: [
        {
          id: 'tut-20-parse-and-multiply',
          type: 'coding',
          title: 'Parse String Coordinates and Multiply',
          prompt: 'Implement `multiply_str_coords(x_str: &str, y_str: &str) -> Result<i64, std::num::ParseIntError>`. Use the `?` operator to parse both strings as `i64` and return `Ok(x * y)`.',
          signature: 'pub fn multiply_str_coords(x_str: &str, y_str: &str) -> Result<i64, std::num::ParseIntError>',
          starterCode: `pub fn multiply_str_coords(x_str: &str, y_str: &str) -> Result<i64, std::num::ParseIntError> {
    // TODO: Parse both using ? operator and return Ok(x * y)
    todo!()
}`,
          testHarness: `{{SOLUTION}}

fn main() {
    assert_eq!(multiply_str_coords("10", "20"), Ok(200));
    assert!(multiply_str_coords("invalid", "20").is_err());
    assert!(multiply_str_coords("10", "bad").is_err());
    println!("all tests passed");
}`,
          hints: ['`let x: i64 = x_str.parse()?;` then `let y: i64 = y_str.parse()?;` then `Ok(x * y)`. '],
          solutionCode: `pub fn multiply_str_coords(x_str: &str, y_str: &str) -> Result<i64, std::num::ParseIntError> {
    let x: i64 = x_str.parse()?;
    let y: i64 = y_str.parse()?;
    Ok(x * y)
}`,
          solutionWalkthrough: 'The `?` operator on `parse()?` unwraps the parsed integer or returns the `ParseIntError` directly out of the function on failure.',
          xpReward: 15,
        },
        {
          id: 'tut-20-quiz-question-mark',
          type: 'quiz',
          title: 'Concept Check: What does the `?` operator perform on `Err(e)`?',
          prompt: 'What code does the expression `let val = fallible_call()?;` expand to when an `Err(e)` occurs?',
          options: [
            { label: 'A', text: 'It panics and crashes the current thread.' },
            { label: 'B', text: 'It returns early from the calling function with `Err(From::from(e))`.' },
            { label: 'C', text: 'It sets `val` to a default zero value and continues.' },
            { label: 'D', text: 'It restarts the function from the beginning.' },
          ],
          correctIndex: 1,
          explanation: 'The `?` operator performs an early return with `return Err(From::from(e));`, passing the error up to the caller while automatically applying error type conversions defined by the `From` trait.',
          hint: 'Remember that ? propagates the error up the call stack.',
          xpReward: 10,
        },
      ],
    },
  ],
}
