import type { TutorialChapter } from '../types'

export const chapter8Lifetimes: TutorialChapter = {
  id: 'lifetimes',
  number: 8,
  title: 'Lifetimes & Borrow Checker Mastery',
  description: 'Understand reference validity: lifetime parameters, elision rules, and structs holding borrowed references.',
  icon: '⏳',
  lessons: [
    {
      id: '23-lifetime-annotations',
      chapterId: 'lifetimes',
      chapterNumber: 8,
      lessonNumber: 1,
      title: 'Lifetime Annotations in Functions (`\'a`)',
      tagline: 'Describing the relationship between reference lifetimes to the compiler.',
      readTimeMinutes: 8,
      difficulty: 'advanced',
      tags: ['lifetimes', '\'a', 'borrow-checker', 'references'],
      overview: 'Every reference in Rust has a **lifetime**, which is the scope for which that reference is valid. Most of the time, lifetimes are implicit and inferred through elision rules. When multiple references could be returned, explicit generic lifetime annotations (`\'a`) are required.',
      sections: [
        {
          id: 'why-lifetimes',
          title: 'Why Lifetimes Exist',
          content: `The primary aim of lifetimes is to **prevent dangling references**, which cause a program to reference data other than the data it intends to reference.

Lifetime annotations do **not** change how long any of the references live. Rather, they describe the relationship of the lifetimes of multiple references to each other so the borrow checker can verify safety.`,
          codeSnippet: {
            code: `// We declare generic lifetime 'a between angle brackets
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

fn main() {
    let string1 = String::from("long string is long");
    {
        let string2 = String::from("xyz");
        let result = longest(string1.as_str(), string2.as_str());
        println!("The longest string is {}", result);
    }
}`,
            caption: 'Specifying lifetime parameter \'a connecting inputs to the output reference.',
          },
        },
        {
          id: 'lifetime-elision',
          title: 'The 3 Lifetime Elision Rules',
          content: `The compiler applies three rules automatically so you don't have to write explicit lifetimes on common functions:
1. **Rule 1**: Each parameter that is a reference gets its own lifetime parameter (\`fn foo<'a, 'b>(x: &'a i32, y: &'b i32)\`).
2. **Rule 2**: If there is exactly one input lifetime parameter, that lifetime is assigned to all output lifetime parameters (\`fn foo<'a>(x: &'a i32) -> &'a i32\`).
3. **Rule 3**: If there are multiple input lifetime parameters, but one of them is \`&self\` or \`&mut self\`, the lifetime of \`self\` is assigned to all output lifetime parameters.`,
          codeSnippet: {
            code: `// The compiler elides lifetimes here using Rule 2 automatically!
fn first_char(s: &str) -> &str {
    &s[0..1]
}`,
            caption: 'Lifetime elision allows writing clean signatures without \'a when unambiguous.',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Returning a reference to a local variable created inside the function',
          badCode: `fn bad_function() -> &String {
    let s = String::from("hello");
    &s // Error: returns a reference to data owned by the current function
}`,
          badExplanation: '`s` will be dropped and deallocated when `bad_function` finishes, making `&s` an illegal dangling reference.',
          goodCode: `fn good_function() -> String {
    let s = String::from("hello");
    s // Return the owned String by value!
}`,
          goodExplanation: 'Return an owned value (`String`, `Vec`) rather than a reference if the data is created inside the function.',
          compilerErrorSnippet: `error[E0515]: cannot return reference to local variable \`s\`
 --> src/main.rs:3:5
  |
3 |     &s
  |     ^^ returns a reference to data owned by the current function`,
        },
      ],
      keyTakeaways: [
        'Lifetimes prevent dangling references at compile time with zero runtime cost.',
        'Lifetime annotations (`\'a`) specify relationships between input and output reference durations.',
        'Never attempt to return a reference to a local variable created in the function; return owned values instead.',
      ],
      quests: [
        {
          id: 'tut-23-find-prefix-slice',
          type: 'coding',
          title: 'Longest Common Prefix Slice',
          prompt: 'Implement `longest_common_prefix<\'a>(s1: &\'a str, s2: &str) -> &\'a str`. The function should return the slice from `s1` corresponding to the characters that match at the start of both `s1` and `s2`.',
          signature: 'pub fn longest_common_prefix<\'a>(s1: &\'a str, s2: &str) -> &\'a str',
          starterCode: `pub fn longest_common_prefix<'a>(s1: &'a str, s2: &str) -> &'a str {
    // TODO: Return slice of s1 matching start of s2
    todo!()
}`,
          testHarness: `{{SOLUTION}}

fn main() {
    let s1 = String::from("cratery_arena");
    let s2 = "cratery_contest";
    let prefix = longest_common_prefix(&s1, s2);
    assert_eq!(prefix, "cratery_");

    assert_eq!(longest_common_prefix("rust", "ruby"), "ru");
    assert_eq!(longest_common_prefix("apple", "banana"), "");
    println!("all tests passed");
}`,
          hints: [
            'Iterate with `for ((i, c1), c2) in s1.char_indices().zip(s2.chars()) { if c1 != c2 { return &s1[0..i]; } }`'
          ],
          solutionCode: `pub fn longest_common_prefix<'a>(s1: &'a str, s2: &str) -> &'a str {
    let mut end_idx = 0;
    for ((i, c1), c2) in s1.char_indices().zip(s2.chars()) {
        if c1 == c2 {
            end_idx = i + c1.len_utf8();
        } else {
            break;
        }
    }
    &s1[0..end_idx]
}`,
          solutionWalkthrough: 'We zip the characters of `s1` and `s2` together, track matching character boundaries, and return a sub-slice `&s1[0..end_idx]` guaranteed to live as long as `s1` (`\'a`).',
          xpReward: 15,
        },
        {
          id: 'tut-23-quiz-lifetime-purpose',
          type: 'quiz',
          title: 'Concept Check: What do lifetime annotations change at runtime?',
          prompt: 'How do lifetime annotations like `\'a` affect the runtime execution speed or memory layout of compiled Rust binaries?',
          options: [
            { label: 'A', text: 'They add reference-counting overhead to each pointer access.' },
            { label: 'B', text: 'They change the duration that objects stay allocated on the heap.' },
            { label: 'C', text: 'Nothing at all: lifetimes are entirely erased during compilation and incur zero runtime overhead.' },
            { label: 'D', text: 'They trigger periodic garbage collection cycles.' },
          ],
          correctIndex: 2,
          explanation: 'Lifetimes are purely a compile-time static analysis tool for the borrow checker. Once the compiler proves the references are safe and cannot dangle, lifetime annotations are completely erased.',
          hint: 'Remember that Rust is committed to zero-cost abstractions.',
          xpReward: 10,
        },
      ],
    },
    {
      id: '24-struct-lifetimes',
      chapterId: 'lifetimes',
      chapterNumber: 8,
      lessonNumber: 2,
      title: 'Lifetimes in Structs & The `\'static` Lifetime',
      tagline: 'Storing borrowed references in data structures and binary-duration data.',
      readTimeMinutes: 7,
      difficulty: 'advanced',
      tags: ['struct-lifetimes', '\'static', 'references', 'borrowing'],
      overview: 'So far, our structs have owned all their data. Structs can also hold references, but in that case, we must add a lifetime annotation on every reference in the struct definition.',
      sections: [
        {
          id: 'struct-ref-lifetime',
          title: 'Structs Holding References',
          content: `To store a reference inside a struct, we annotate the struct with a lifetime parameter \`struct Excerpt<'a> { part: &'a str }\`.

This annotation means an instance of \`Excerpt\` **cannot outlive the reference it holds in its \`part\` field**.`,
          codeSnippet: {
            code: `struct ImportantExcerpt<'a> {
    part: &'a str,
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let first_sentence = novel.split('.').next().expect("Could not find a '.'");
    
    let i = ImportantExcerpt {
        part: first_sentence,
    };
    println!("Excerpt: {}", i.part);
}`,
            caption: 'ImportantExcerpt holds a slice borrowed from novel.',
          },
        },
        {
          id: 'static-lifetime',
          title: 'The `\'static` Lifetime',
          content: `The \`'static\` lifetime denotes that the data can live for the entire duration of the program. All string literals \`"hello"\` have the \`'static\` lifetime because their text is hardcoded directly into the read-only data segment of the binary.`,
          codeSnippet: {
            code: `let s: &'static str = "I have a static lifetime.";`,
            caption: 'String literals have a static lifetime.',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Letting the owned data drop before the struct that borrows it',
          badCode: `struct Holder<'a> { r: &'a str }
let holder;
{
    let s = String::from("temp");
    holder = Holder { r: &s }; // Error: \`s\` does not live long enough
}
println!("{}", holder.r);`,
          badExplanation: '`s` drops at the end of the inner block, but `holder` tries to access it in the outer block.',
          goodCode: `let s = String::from("temp");
let holder = Holder { r: &s };
println!("{}", holder.r);`,
          goodExplanation: 'Ensure the owned resource has an enclosing scope that outlives the borrowing struct.',
        },
      ],
      keyTakeaways: [
        'Structs that store references must declare lifetime parameters: `struct Container<\'a> { data: &\'a str }`.',
        'A struct holding a reference cannot outlive the data it references.',
        '`\'static` indicates data stored in the binary that lasts for the entire execution.',
      ],
      quests: [
        {
          id: 'tut-24-token-stream',
          type: 'coding',
          title: 'Zero-Copy Token Stream Struct',
          prompt: 'Create a struct `TokenStream<\'a>` with fields `pub text: &\'a str` and `pub pos: usize`. Implement `new(text: &\'a str) -> Self` and `next_token(&mut self) -> Option<&\'a str>` which returns whitespace-separated word slices from `text` one by one, updating `pos`.',
          signature: 'pub struct TokenStream<\'a> ... impl<\'a> TokenStream<\'a> ...',
          starterCode: `pub struct TokenStream<'a> {
    pub text: &'a str,
    pub pos: usize,
}

impl<'a> TokenStream<'a> {
    pub fn new(text: &'a str) -> Self {
        todo!()
    }

    pub fn next_token(&mut self) -> Option<&'a str> {
        // TODO: Advance and return the next whitespace-separated word slice
        todo!()
    }
}`,
          testHarness: `{{SOLUTION}}

fn main() {
    let source = String::from("alpha beta gamma");
    let mut stream = TokenStream::new(&source);
    assert_eq!(stream.next_token(), Some("alpha"));
    assert_eq!(stream.next_token(), Some("beta"));
    assert_eq!(stream.next_token(), Some("gamma"));
    assert_eq!(stream.next_token(), None);
    println!("all tests passed");
}`,
          hints: [
            'Skip leading whitespace from `&self.text[self.pos..]`, find word end, update `self.pos`, and return slice.'
          ],
          solutionCode: `pub struct TokenStream<'a> {
    pub text: &'a str,
    pub pos: usize,
}

impl<'a> TokenStream<'a> {
    pub fn new(text: &'a str) -> Self {
        Self { text, pos: 0 }
    }

    pub fn next_token(&mut self) -> Option<&'a str> {
        let remaining = &self.text[self.pos..];
        let trimmed_start = remaining.trim_start();
        if trimmed_start.is_empty() {
            self.pos = self.text.len();
            return None;
        }

        let leading_spaces = remaining.len() - trimmed_start.len();
        let word_len = trimmed_start.find(char::is_whitespace).unwrap_or(trimmed_start.len());
        
        let start = self.pos + leading_spaces;
        let end = start + word_len;
        self.pos = end;
        Some(&self.text[start..end])
    }
}`,
          solutionWalkthrough: '`TokenStream<\'a>` references borrowed slice `text` without allocating new memory, returning `&\'a str` slices directly referencing original bytes.',
          xpReward: 15,
        },
        {
          id: 'tut-24-quiz-static-str',
          type: 'quiz',
          title: 'Concept Check: The Lifetime of Hardcoded String Literals',
          prompt: 'What lifetime does a string literal like `"hello cratery"` possess in Rust?',
          options: [
            { label: 'A', text: 'It has the lifetime of the stack frame where it is defined.' },
            { label: 'B', text: '`&\'static str` because it is stored directly in the compiled binary\'s read-only data section.' },
            { label: 'C', text: 'It has no lifetime and is dynamically allocated each time.' },
            { label: 'D', text: 'It has a mutable lifetime.' },
          ],
          correctIndex: 1,
          explanation: 'String literals are stored in the read-only data segment of the compiled binary, meaning their memory address is valid for the entire runtime of the program (`\'static`).',
          hint: 'Consider where string constants live in compiled binaries.',
          xpReward: 10,
        },
      ],
    },
  ],
}
