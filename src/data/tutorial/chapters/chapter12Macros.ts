import type { TutorialChapter } from '../types'

export const chapter12Macros: TutorialChapter = {
  id: 'macros',
  number: 12,
  title: 'Macros & Metaprogramming',
  description: 'Code that writes code: master declarative `macro_rules!` and procedural macros for zero-cost metaprogramming.',
  icon: '✨',
  lessons: [
    {
      id: '32-declarative-macros',
      chapterId: 'macros',
      chapterNumber: 12,
      lessonNumber: 32,
      title: 'Declarative Macros with `macro_rules!`',
      tagline: 'Pattern matching on Rust syntax tokens to generate repetitive boilerplate safely.',
      readTimeMinutes: 6,
      difficulty: 'intermediate',
      tags: ['macros', 'macro_rules', 'metaprogramming', 'syntax'],
      overview:
        'Declarative macros (`macro_rules!`) let you define custom syntactic extensions using pattern matching on Rust token streams. They expand at compile-time before type-checking.',
      sections: [
        {
          id: 'macro-rules-basics',
          title: 'Macro Definition & Matchers',
          content: `Declarative macros match syntax patterns rather than runtime values. Designators specify what kind of syntax fragment to capture:
- \`$x:expr\`: An expression (e.g. \`1 + 2\`, \`foo()\`)
- \`$i:ident\`: An identifier (variable or function name)
- \`$t:ty\`: A type (e.g. \`i32\`, \`Vec<String>\`)
- \`$p:pat\`: A pattern (for \`match\` or \`let\`)
- \`$b:block\`: A brace-delimited block of code`,
          codeSnippet: {
            code: `macro_rules! say_hello {
    // Match with no arguments
    () => {
        println!("Hello, Rustacean!");
    };
    // Match an expression
    ($name:expr) => {
        println!("Hello, {}!", $name);
    };
}

fn main() {
    say_hello!();
    say_hello!("Ferris");
}`,
            caption: 'Overloading macro branches based on token patterns.',
          },
        },
        {
          id: 'macro-repetitions',
          title: 'Repetitions: Building `vec!`-style Macros',
          content: `Macros support repetition matching with \`$(...)*\` (zero or more), \`$(...)+\` (one or more), and optional delimiters like \`$(...),*\` for comma-separated items.`,
          codeSnippet: {
            code: `macro_rules! my_vec {
    ( $( $x:expr ),* ) => {
        {
            let mut temp_vec = Vec::new();
            $(
                temp_vec.push($x);
            )*
            temp_vec
        }
    };
}

fn main() {
    let numbers = my_vec![10, 20, 30];
    assert_eq!(numbers.len(), 3);
}`,
            caption: 'Repetition expansion in declarative macros.',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Trailing Comma Rejection',
          badCode: `macro_rules! list {
    ( $( $x:expr ),* ) => { ... };
}
// list![1, 2, 3,]; fails to match because trailing comma is not allowed`,
          badExplanation: 'The matcher strictly expects comma-separated items without an optional trailing comma.',
          goodCode: `macro_rules! list {
    ( $( $x:expr ),* $(,)? ) => { ... };
}`,
          goodExplanation: 'Adding `$(,)?` at the end allows optional trailing commas, idiomatic in modern Rust.',
        },
      ],
      keyTakeaways: [
        'Declarative macros operate at the syntactic token level before type checking.',
        'Token designators like $expr, $ident, and $ty determine what tokens are captured.',
        'Repetitions allow creating variable-arity macros like vec![] or println!.',
      ],
      quests: [],
    },
    {
      id: '33-procedural-macros',
      chapterId: 'macros',
      chapterNumber: 12,
      lessonNumber: 33,
      title: 'Procedural Macros & Custom Derives',
      tagline: 'Writing compiler plugins with `proc_macro`, `syn`, and `quote` for arbitrary code generation.',
      readTimeMinutes: 7,
      difficulty: 'advanced',
      tags: ['macros', 'proc-macro', 'derive', 'compiler-plugins'],
      overview:
        'Procedural macros accept a stream of Rust code tokens as input, execute arbitrary Rust code at compile-time, and output a new stream of tokens. They power `#[derive(...)]`, custom attributes, and function-like macros.',
      sections: [
        {
          id: 'three-kinds-proc-macros',
          title: 'The Three Kinds of Procedural Macros',
          content: `Procedural macros must live in a separate crate with \`proc-macro = true\` in \`Cargo.toml\`. There are three types:
1. **Custom Derive**: \`#[derive(MyTrait)]\` creates trait implementations automatically.
2. **Attribute-like**: \`#[route(GET, "/")]\` attaches custom logic to structs, functions, or modules.
3. **Function-like**: \`sql!("SELECT * FROM users")\` accepts arbitrary syntax inside macro calls.

> 💡 **Compiler Architecture Note**: Because procedural macros run arbitrary Rust code on the host machine during compilation, they must be compiled as separate shared libraries. For safety and isolation, single-file online runners and sandboxed judges (like Cratera) execute safe sandboxed code and disallow arbitrary host proc-macro definitions.`,
          codeSnippet: {
            code: `// In my_macro_crate/src/lib.rs (compiled with proc-macro = true):
use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, DeriveInput};

#[proc_macro_derive(Describe)]
pub fn describe_derive(input: TokenStream) -> TokenStream {
    let ast = parse_macro_input!(input as DeriveInput);
    let name = &ast.ident;

    let expanded = quote! {
        impl #name {
            pub fn type_name() -> &'static str {
                stringify!(#name)
            }
        }
    };

    TokenStream::from(expanded)
}`,
            caption: 'A custom derive procedural macro using syn and quote.',
            runnable: false,
          },
        },
        {
          id: 'syn-quote-pipeline',
          title: 'The `syn` & `quote` Pipeline',
          content: `In the Rust ecosystem:
- **\`syn\`**: Parses raw \`TokenStream\` into a strongly-typed Abstract Syntax Tree (AST).
- **\`quote\`**: Quasi-quoting library that converts Rust expressions back into a \`TokenStream\`.
- **\`proc_macro2\`**: Makes proc-macro types unit-testable outside compiler harness.`,
          codeSnippet: {
            code: `// Consuming the derive macro in consumer code:
// #[derive(Describe)]
// struct User;
// assert_eq!(User::type_name(), "User");`,
            caption: 'Zero boilerplate type introspection at compile-time.',
            runnable: false,
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Defining Proc Macro in the Same Crate',
          badCode: `// In main.rs or lib.rs of a regular crate (without proc-macro = true):
#[proc_macro_derive(Foo)]
pub fn foo(input: TokenStream) -> TokenStream { ... }`,
          badExplanation: 'Procedural macros cannot be defined in the same crate where they are used.',
          goodCode: `// In my_macro_crate/Cargo.toml:
// [lib]
// proc-macro = true
//
// In consumer Cargo.toml:
// [dependencies]
// my_macro_crate = { path = "../my_macro_crate" }`,
          goodExplanation: 'Proc-macro crates are compiled as host shared libraries that the compiler loads during compilation.',
        },
      ],
      keyTakeaways: [
        'Procedural macros run arbitrary Rust code at compile time, receiving and emitting TokenStreams.',
        'Custom derives (#[derive(...)]) generate implementations for user-defined structs and enums.',
        'syn and quote are the standard libraries for parsing and generating Rust ASTs.',
      ],
      quests: [],
    },
  ],
}
