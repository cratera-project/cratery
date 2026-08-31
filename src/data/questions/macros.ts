import type { Question } from '../../lib/quiz'

export const macrosQuestions: Question[] = [
  {
    id: 'macro-rules-1',
    categorySlug: 'macros',
    title: 'Declarative Macros',
    prompt: 'How do `macro_rules!` macros differ from functions?',
    tags: ['macros', 'declarative'],
    difficulty: 2,
    language: 'rust',
    code: `macro_rules! say_hello {
    () => {
        println!("hello");
    };
}

fn main() {
    say_hello!();
}`,
    options: [
      { label: 'A', text: "They are always safer than ordinary functions in runtime memory" },
      { label: 'B', text: "They may only expand into string literal values in code" },
      { label: 'C', text: "They transform tokens into code before type checking" },
      { label: 'D', text: "They are ordinary functions invoked at runtime in code" },
    ],
    correctIndex: 2,
    hint: 'Macros run in the compiler, not as value-level calls.',
    explanation:
      '`macro_rules!` expands during compilation, producing tokens that are then parsed and type-checked. Functions take runtime values. Macros are powerful but not inherently “safer.”',
  },
  {
    id: 'macro-match-1',
    categorySlug: 'macros',
    title: 'Macro Matchers',
    prompt: 'What can `$x:expr` match in a `macro_rules!` pattern?',
    tags: ['macros', 'syntax'],
    difficulty: 2,
    language: 'rust',
    code: `macro_rules! twice {
    ($x:expr) => {
        $x + $x
    };
}`,
    options: [
      { label: 'A', text: 'Any expression, such as `2 + 2` or `f()`' },
      { label: 'B', text: 'Only string and byte string literal tokens' },
      { label: 'C', text: 'Only identifiers that name local variables' },
      { label: 'D', text: 'Only type paths used in generic arguments' },
    ],
    correctIndex: 0,
    hint: 'Fragment specifiers name syntactic categories.',
    explanation:
      '`:expr` matches a Rust expression. Other common designators include `:ident`, `:ty`, `:path`, `:tt`, and `:stmt`. Literals-only or types-only need different matchers.',
  },
  {
    id: 'macro-repeat-1',
    categorySlug: 'macros',
    title: 'Macro Repetition',
    prompt: 'What does `*` mean in `$( $x:expr ),*`?',
    tags: ['macros', 'repetition'],
    difficulty: 3,
    language: 'rust',
    code: `macro_rules! my_vec {
    ( $( $x:expr ),* ) => {
        {
            let mut v = Vec::new();
            $( v.push($x); )*
            v
        }
    };
}`,
    options: [
      { label: 'A', text: 'Repeat the grouped pattern zero or more times' },
      { label: 'B', text: 'Require exactly one trailing comma always' },
      { label: 'C', text: 'Match the grouped pattern exactly one time' },
      { label: 'D', text: 'Mark the whole pattern as a syntax error' },
    ],
    correctIndex: 0,
    hint: 'Compare `*`, `+`, and `?` repetition operators.',
    explanation:
      'In `macro_rules!`, `$( ... ),*` means zero or more repetitions of the inner pattern, separated by commas. `+` is one or more; `?` is optional (zero or one). Trailing commas need an explicit pattern if you want them.',
  },
  {
    id: 'macro-proc-1',
    categorySlug: 'macros',
    title: 'Procedural vs Declarative',
    prompt: 'What mainly distinguishes procedural macros from `macro_rules!`?',
    tags: ['macros', 'procedural'],
    difficulty: 3,
    language: 'rust',
    code: `#[derive(Debug)]
struct User {
    id: u32,
}`,
    options: [
      { label: 'A', text: 'They cannot generate `impl` blocks at all' },
      { label: 'B', text: 'They are Rust functions over `TokenStream` values' },
      { label: 'C', text: 'They are deprecated in favor of only `macro_rules!`' },
      { label: 'D', text: 'They are always simpler to write than `macro_rules!`' },
    ],
    correctIndex: 1,
    hint: 'Think `derive`, attribute, and function-like proc macros.',
    explanation:
      'Procedural macros are compiled plugins: functions from `TokenStream` to `TokenStream` (often via `syn`/`quote`). Declarative macros use pattern → template rules. Proc macros power `derive` and many attributes; they are not deprecated.',
  },
  {
    id: 'macro-hygiene-1',
    categorySlug: 'macros',
    title: 'Macro Hygiene',
    prompt: 'Why doesn\'t the macro\'s `x` clash with the caller\'s `x`?',
    tags: ['macros', 'hygiene'],
    difficulty: 2,
    language: 'rust',
    code: `macro_rules! set_x {
    () => {
        let x = 3;
    };
}

fn main() {
    let x = 1;
    set_x!();
    println!("{x}"); // prints 1
}`,
    options: [
      { label: 'A', text: 'Macros expand on another thread with private names' },
      { label: 'B', text: 'Every macro-introduced binding is implicitly static' },
      { label: 'C', text: 'It does clash; this example fails to compile' },
      { label: 'D', text: 'Hygiene keeps macro-introduced names distinct by span' },
    ],
    correctIndex: 3,
    hint: 'Declarative macros are hygienic for local identifiers.',
    explanation:
      '`macro_rules!` hygiene (via spans) keeps identifiers introduced by the macro from capturing or colliding with the caller\'s identically named locals. The caller\'s `x` stays `1`. This is stronger than “just a new block,” though expansion still respects ordinary scopes too.',
  },
  {
    id: 'macro-tt-muncher-1',
    categorySlug: 'macros',
    title: 'Token Tree Fragments',
    prompt: 'What does the `$($t:tt)*` pattern commonly allow?',
    tags: ['macros', 'tokens'],
    difficulty: 3,
    language: 'rust',
    code: `macro_rules! as_is {
    ( $($t:tt)* ) => { $($t)* };
}`,
    options: [
      { label: 'A', text: 'Only comma-separated lists of type names' },
      { label: 'B', text: 'Almost any token sequence, forwarded unchanged' },
      { label: 'C', text: 'Only items that type-check before expansion' },
      { label: 'D', text: 'Only expressions already wrapped in braces' },
    ],
    correctIndex: 1,
    hint: '`:tt` is the most general fragment specifier.',
    explanation:
      'A `tt` (token tree) is a single token or a delimited group. `$($t:tt)*` matches an arbitrary token sequence, which is why it is used for pass-through and recursive “tt muncher” macros. It does not require the tokens to type-check first.',
  },
  {
    id: 'macro-export-1',
    categorySlug: 'macros',
    title: 'Macro Visibility',
    prompt: 'How do you make a `macro_rules!` macro usable from other crates?',
    tags: ['macros', 'visibility'],
    difficulty: 2,
    language: 'rust',
    code: `#[macro_export]
macro_rules! my_assert {
    ($cond:expr) => {
        if !$cond {
            panic!("assertion failed");
        }
    };
}`,
    options: [
      { label: 'A', text: 'Mark it `pub` like a function; export is automatic' },
      { label: 'B', text: 'Apply `#[macro_export]` so it is crate-root exported' },
      { label: 'C', text: 'Put it in `main.rs` only; macros never cross crates' },
      { label: 'D', text: 'Wrap it in `pub mod macros` without other attributes' },
    ],
    correctIndex: 1,
    hint: 'Macro visibility is not the same as item `pub` alone.',
    explanation:
      '`#[macro_export]` places the macro at the crate root and makes it available to dependents (`use your_crate::my_assert;`). Ordinary `pub` on modules is not enough for classic `macro_rules!` export across crates.',
  },
  {
    id: 'macro-paste-1',
    categorySlug: 'macros',
    title: 'Macro Expansion Order',
    prompt: 'When are `macro_rules!` invocations expanded relative to types?',
    tags: ['macros', 'compilation'],
    difficulty: 2,
    language: 'rust',
    code: `macro_rules! make_add {
    ($a:expr, $b:expr) => {
        $a + $b
    };
}

fn main() {
    let n = make_add!(1, 2);
}`,
    options: [
      { label: 'A', text: 'After monomorphization, like a generic function body' },
      { label: 'B', text: 'At runtime, immediately before the `+` operator runs' },
      { label: 'C', text: 'During compilation, before type-checking expanded code' },
      { label: 'D', text: 'Only in debug builds; release inlines them away early' },
    ],
    correctIndex: 2,
    hint: 'Expansion feeds the parser/resolver; it is not a runtime step.',
    explanation:
      'Macro expansion happens at compile time as part of turning the crate into an AST that can be resolved and type-checked. By the time types are checked, `make_add!(1, 2)` is already `1 + 2`.',
  },
  {
    id: 'macro-metavariable-1',
    categorySlug: 'macros',
    title: 'Metavariable Expressions',
    prompt: 'Why can `$e` be used twice safely in this expansion?',
    tags: ['macros', 'pitfalls'],
    difficulty: 3,
    language: 'rust',
    code: `macro_rules! mul2 {
    ($e:expr) => {
        $e + $e
    };
}

fn main() {
    let mut n = 1;
    // careful: mul2!({ n += 1; n }) evaluates the block twice
    let _ = mul2!(n);
}`,
    options: [
      { label: 'A', text: 'Each `$e` use is automatically cached as a temporary' },
      { label: 'B', text: '`:expr` fragments are always pure and side-effect free' },
      { label: 'C', text: 'The matcher copies the tokens; each use re-evaluates' },
      { label: 'D', text: 'The second `$e` is replaced by a moved value of the first' },
    ],
    correctIndex: 2,
    hint: 'Macros paste tokens; they do not CSE your expressions.',
    explanation:
      'Substituting `$e` twice duplicates the expression tokens. Pure locals like `n` are fine; expressions with side effects run twice. Capture once in a `let` inside the macro if you need single evaluation.',
  },
  {
    id: 'macro-crate-1',
    categorySlug: 'macros',
    title: 'The $crate Metavariable',
    prompt: 'What is `$crate` for inside an exported `macro_rules!`?',
    tags: ['macros', 'hygiene', 'export'],
    difficulty: 3,
    language: 'rust',
    code: `// in crate helpers
#[macro_export]
macro_rules! check {
    ($e:expr) => {
        $crate::internal::validate($e)
    };
}`,
    options: [
      { label: 'A', text: 'It expands to the caller crate root module path' },
      { label: 'B', text: 'It renames the macro so callers skip importing it' },
      { label: 'C', text: 'It forces the expansion to evaluate in const context' },
      { label: 'D', text: 'It expands to the crate that defined the macro' },
    ],
    correctIndex: 3,
    hint: 'Exported macros may be called from other crates that lack your module paths.',
    explanation:
      '`$crate` resolves to the crate where the macro is defined, so exported macros can refer to that crate\'s items reliably even when invoked from dependents. It is not the caller\'s crate path.',
  },
  {
    id: 'macro-ident-1',
    categorySlug: 'macros',
    title: 'Ident Fragment Specifier',
    prompt: 'What can `$name:ident` match in a `macro_rules!` pattern?',
    tags: ['macros', 'syntax'],
    difficulty: 2,
    language: 'rust',
    code: `macro_rules! make_const {
    ($name:ident) => {
        const $name: i32 = 1;
    };
}

make_const!(ANSWER);`,
    options: [
      { label: 'A', text: 'An identifier token, such as `ANSWER`' },
      { label: 'B', text: 'Any expression, including calls like `f()`' },
      { label: 'C', text: 'Only string literals used as constant names' },
      { label: 'D', text: 'A full type path such as `std::io::Error`' },
    ],
    correctIndex: 0,
    hint: 'Fragment specifiers name syntactic categories.',
    explanation:
      '`:ident` matches a single identifier. Expressions need `:expr`, types `:ty`, paths `:path`. Using the wrong specifier is a common macro debugging dead-end for juniors.',
  },
  {
    id: 'macro-trailing-comma-1',
    categorySlug: 'macros',
    title: 'Trailing Comma Patterns',
    prompt: 'Why might this macro reject `my_vec![1, 2,]`?',
    tags: ['macros', 'repetition'],
    difficulty: 2,
    language: 'rust',
    code: `macro_rules! my_vec {
    ( $( $x:expr ),* ) => { /* ... */ };
}

// my_vec![1, 2,]; // often fails to match`,
    options: [
      { label: 'A', text: 'Trailing commas are forbidden in all Rust syntax' },
      { label: 'B', text: '`),*` does not accept an optional trailing comma' },
      { label: 'C', text: '`:expr` cannot appear inside repetition groups' },
      { label: 'D', text: 'Macros expand after commas are stripped by rustc' },
    ],
    correctIndex: 1,
    hint: 'Compare patterns that end with `$(,)?` or `,*.`',
    explanation:
      '`),*` matches comma-separated items without a final trailing comma. Idiomatic macros add an optional trailing comma arm (e.g. `$( $x:expr ),* $(,)?`) so call sites can use Rust’s usual trailing-comma style.',
  },
  {
    id: 'macro-eager-1',
    categorySlug: 'macros',
    title: 'Macro Call Site Expansion',
    prompt: 'Where do `macro_rules!` names resolve from by default?',
    tags: ['macros', 'scoping'],
    difficulty: 2,
    language: 'rust',
    code: `mod inner {
    macro_rules! m { () => { 1 }; }
    pub fn f() -> i32 { m!() }
}

// m!(); // not visible here without export/use tricks`,
    options: [
      { label: 'A', text: 'They behave exactly like `pub fn` items for visibility' },
      { label: 'B', text: 'They are always global once defined anywhere in a crate' },
      { label: 'C', text: 'They are scoped to the module that defines them' },
      { label: 'D', text: 'They only expand inside `unsafe` blocks by default' },
    ],
    correctIndex: 2,
    hint: '`#[macro_export]` and `use` change the story.',
    explanation:
      'Without `#[macro_export]`, a `macro_rules!` macro is visible in the defining module (and children, depending on definition order/legacy rules). It is not automatically crate-wide like a casual mental model of “macros are global.”',
  },
  {
    id: 'macro-stmt-1',
    categorySlug: 'macros',
    title: 'Stmt Fragment Specifier',
    prompt: 'What does `$s:stmt` match?',
    tags: ['macros', 'syntax'],
    difficulty: 2,
    language: 'rust',
    code: `macro_rules! with_stmt {
    ($s:stmt) => {
        { $s }
    };
}`,
    options: [
      { label: 'A', text: 'Only type names used in generic argument lists' },
      { label: 'B', text: 'Only literal tokens such as `1` or `"hi"`' },
      { label: 'C', text: 'Only patterns on the left of a `match` arm' },
      { label: 'D', text: 'A single statement, such as `let x = 1;`' },
    ],
    correctIndex: 3,
    hint: 'Statements vs expressions are different fragments.',
    explanation:
      '`:stmt` matches one statement. Juniors often confuse it with `:expr`. A `let` binding is a statement; many expressions need `:expr` (and semicolon rules differ in expansion).',
  },
  {
    id: 'macro-dbg-1',
    categorySlug: 'macros',
    title: 'dbg! Macro Behavior',
    prompt: 'What does `dbg!(x)` return?',
    tags: ['macros', 'stdlib'],
    difficulty: 2,
    language: 'rust',
    code: `fn main() {
    let x = 2;
    let y = dbg!(x) + 1;
    println!("{y}");
}`,
    options: [
      { label: 'A', text: 'The unit value `()` after printing to stderr' },
      { label: 'B', text: 'Ownership of `x` moved into a debug-only wrapper' },
      { label: 'C', text: 'The same value as `x`, after printing debug info' },
      { label: 'D', text: 'A string containing the debug formatting of `x`' },
    ],
    correctIndex: 2,
    hint: '`dbg!` is designed to wrap expressions in place.',
    explanation:
      '`dbg!(expr)` prints file/line and `Debug` output to stderr, then yields `expr`’s value (by move/copy as appropriate). That is why `dbg!(x) + 1` works. It does not return `()` or a `String`.',
  },
  {
    id: 'macro-vec-macro-1',
    categorySlug: 'macros',
    title: 'Why vec! Is a Macro',
    prompt: 'Why is `vec![a, b, c]` a macro rather than a function?',
    tags: ['macros', 'stdlib'],
    difficulty: 2,
    language: 'rust',
    code: `let v = vec![1, 2, 3];`,
    options: [
      { label: 'A', text: 'Functions cannot construct `Vec` values on stable' },
      { label: 'B', text: 'Macros can accept a variable number of arguments' },
      { label: 'C', text: '`vec!` must run at runtime before `main` starts' },
      { label: 'D', text: 'Only macros can allocate memory on the heap' },
    ],
    correctIndex: 1,
    hint: 'Think arity: functions have fixed parameters.',
    explanation:
      '`vec!` supports zero or more elements (and `[elem; n]`). Rust functions cannot be variadic like that in the same syntactic way, so a macro expands into the right `Vec` construction code.',
  },
  {
    id: 'macro-attr-1',
    categorySlug: 'macros',
    title: 'Attribute Proc Macros',
    prompt: 'What kind of procedural macro is `#[tokio::main]`?',
    tags: ['macros', 'procedural', 'attributes'],
    difficulty: 2,
    language: 'rust',
    code: `#[tokio::main]
async fn main() {
    println!("hi");
}`,
    options: [
      { label: 'A', text: 'A derive macro that only implements traits' },
      { label: 'B', text: 'A `macro_rules!` matcher using `:item` fragments' },
      { label: 'C', text: 'An attribute proc macro rewriting the `fn` item' },
      { label: 'D', text: 'A built-in keyword handled only by the linker' },
    ],
    correctIndex: 2,
    hint: 'Three proc-macro kinds: derive, attribute, function-like.',
    explanation:
      'Attribute procedural macros take an item (and optional attribute tokens) and emit a new `TokenStream`. `#[tokio::main]` rewrites `async fn main` into a synchronous entry that builds a runtime. It is not a derive.',
  },
  {
    id: 'macro-recurse-1',
    categorySlug: 'macros',
    title: 'Recursive macro_rules',
    prompt: 'How can a `macro_rules!` process a list recursively?',
    tags: ['macros', 'tt-muncher'],
    difficulty: 2,
    language: 'rust',
    code: `macro_rules! count {
    () => { 0 };
    ($head:expr $(, $tail:expr)*) => {
        1 + count!($($tail),*)
    };
}`,
    options: [
      { label: 'A', text: 'By expanding into a call with fewer tokens left' },
      { label: 'B', text: 'By spawning a thread that re-invokes the macro' },
      { label: 'C', text: 'By using `goto` labels inside the macro matcher' },
      { label: 'D', text: 'Recursive macros are illegal on stable Rust today' },
    ],
    correctIndex: 0,
    hint: 'Peel one fragment, recurse on the rest.',
    explanation:
      'Declarative macros may invoke themselves (or other macros) in their expansion. Classic “tt muncher” / list-peeling patterns reduce tokens each step until a base case matches. This is compile-time recursion, not runtime.',
  },
  {
    id: 'macro-optional-rep-1',
    categorySlug: 'macros',
    title: 'Optional Macro Repetition',
    prompt: 'What does `$(, $bang:literal)?` match?',
    tags: ['macros', 'repetition'],
    difficulty: 2,
    language: 'rust',
    code: `macro_rules! greet {
    ($name:expr $(, $bang:literal)?) => {
        concat!($name $(, $bang)?)
    };
}

fn main() {
    assert_eq!(greet!("hi"), "hi");
    assert_eq!(greet!("hi", "!"), "hi!");
}`,
    options: [
      { label: 'A', text: 'One or more extra literals, comma-separated' },
      { label: 'B', text: 'A required second argument of any token type' },
      { label: 'C', text: 'Zero or more bangs, including extra commas' },
      { label: 'D', text: 'Zero or one extra literal after a comma' },
    ],
    correctIndex: 3,
    hint: '`?` is the “at most once” Kleene operator.',
    explanation:
      'In `macro_rules!`, `$( … )?` matches zero or one time (Reference, Macros by example). Unlike `*`/`+`, `?` cannot take a separator token. `$(,)?` after a list is the usual trailing-comma matcher; here the comma is inside the optional group so the second argument itself is optional.',
  },
  {
    id: 'macro-stringify-1',
    categorySlug: 'macros',
    title: 'stringify vs concat',
    prompt: 'What is `stringify!(1 + 2)`?',
    tags: ['macros', 'stringify'],
    difficulty: 2,
    language: 'rust',
    code: `fn main() {
    assert_eq!(stringify!(1 + 2), "1 + 2");
    assert_eq!(concat!("a", "b"), "ab");
}`,
    options: [
      { label: 'A', text: 'The string `"3"` after constant evaluation' },
      { label: 'B', text: 'The token text `"1 + 2"`, not the computed sum' },
      { label: 'C', text: 'A runtime `format!` of the expression’s value' },
      { label: 'D', text: 'Invalid; `stringify!` only accepts identifiers' },
    ],
    correctIndex: 1,
    hint: 'One macro pastes tokens; the other pastes string literals.',
    explanation:
      '`stringify!` turns its tokens into a string literal without evaluating them, so `1 + 2` stays `"1 + 2"`. `concat!` concatenates string (and some other) literals at compile time (`"ab"`). Neither runs at runtime like `format!`.',
  },
  {
    id: 'macro-matcher-arm-precedence-1',
    categorySlug: 'macros',
    title: 'Macro Arm Matching Order',
    prompt: 'What is printed by this macro invocation?',
    tags: ['macros', 'pattern-matching', 'syntax'],
    difficulty: 2,
    language: 'rust',
    code: `macro_rules! parse_token {
    ($x:expr) => {
        "expr"
    };
    ($x:literal) => {
        "literal"
    };
}

fn main() {
    println!("{}", parse_token!(42));
}`,
    options: [
      { label: 'A', text: 'literal because literal is more specific than expr arm' },
      { label: 'B', text: 'Compile error due to ambiguous macro pattern match arms' },
      { label: 'C', text: 'Compile error because integer literals are not exprs' },
      { label: 'D', text: 'expr because macro arms are matched in top-down order' },
    ],
    correctIndex: 3,
    hint: 'In what order does macro_rules! evaluate its pattern arms?',
    explanation:
      'In declarative macros (`macro_rules!`), matcher arms are checked sequentially from top to bottom. The first arm that successfully parses the input tokens is expanded. Because `42` is a valid expression, `$x:expr` matches immediately and produces `"expr"`. To match more specific tokens like `$literal` or `$ident`, place those arms before broader fragment matchers like `$expr`.',
  },
  {
    id: 'macro-matcher-pat-param-1',
    categorySlug: 'macros',
    title: 'pat_param vs pat Fragment',
    prompt: 'Why is `$p:pat_param` used instead of `$p:pat` in the first arm?',
    tags: ['macros', 'patterns', 'follow-set'],
    difficulty: 3,
    language: 'rust',
    code: `macro_rules! match_pat {
    ($p:pat_param | $tail:pat) => { "or_pattern" };
    ($p:pat) => { "single_pattern" };
}

fn main() {
    println!("{}", match_pat!(1 | 2));
}`,
    options: [
      { label: 'A', text: '$p:pat can only match struct patterns with named fields' },
      { label: 'B', text: '$p:pat is completely deprecated and removed in Rust 2024' },
      { label: 'C', text: '$p:pat includes top-level | and cannot be followed by |' },
      { label: 'D', text: '$p:pat_param converts patterns into runtime expressions' },
    ],
    correctIndex: 2,
    hint: 'Consider how or-patterns (A | B) affect macro follow-set rules.',
    explanation:
      'In Rust 2021 and 2024 editions, the `$pat` fragment specifier matches top-level or-patterns (e.g. `A | B`). Because of this, `$pat` cannot be followed by a vertical bar `|` due to ambiguity in the macro parser follow-set rules. The `$pat_param` fragment specifier matches patterns excluding top-level or-patterns, allowing `|` to legally follow it in macro matchers.',
  },
  
  {
    id: "macro-supporter-1",
    categorySlug: "macros",
    title: "Macro Fragment Specifiers (expr vs tt)",
    prompt: "How does the `$e:expr` matcher differ from `$t:tt` in declarative macros?",
    tags: ["macros","macro-rules","matchers"],
    difficulty: 2,
    language: 'rust',
    code: "macro_rules! parse_token {\n    ($t:tt) => { println!(\"single token tree\"); };\n}",
    options: [
      { label: 'A', text: "`tt` only matches primitive numbers while `expr` matches strings" },
      { label: 'B', text: "`expr` is evaluated at runtime while `tt` evaluates at compile time" },
      { label: 'C', text: "`tt` expands only into procedural macro attribute definitions" },
      { label: 'D', text: "`expr` parses a full Rust expression; `tt` matches a single token tree" },
    ],
    correctIndex: 3,
    hint: "expr matches a complete expression AST node; tt matches a single token or bracketed tree.",
    explanation: "`$e:expr` requires the compiler to parse a complete Rust expression (like `1 + 2`). `$t:tt` matches a single token tree (an identifier, literal, punctuation mark, or balanced `(...)`, `[...]`, `{...}`).",
  },
  {
    id: "macro-supporter-2",
    categorySlug: "macros",
    title: "Macro Hygiene for Local Bindings",
    prompt: "Why can a macro define a local variable `let x = 10;` without conflicting with outer variables named `x`?",
    tags: ["macros","hygiene","syntax-context"],
    difficulty: 3,
    language: 'rust',
    code: "macro_rules! define_local {\n    () => {\n        let x = 10;\n        println!(\"{x}\");\n    };\n}\n\nfn main() {\n    let x = 99;\n    define_local!();\n    assert_eq!(x, 99);\n}",
    options: [
      { label: 'A', text: "Declarative macros use syntax context hygiene to isolate generated identifier names" },
      { label: 'B', text: "Macros execute in a separate temporary OS thread with its own stack frame in runtime memory" },
      { label: 'C', text: "The compiler moves outer variables into static program heap memory within local thread memory" },
      { label: 'D', text: "Variables defined inside macros are automatically promoted to constants in runtime memory" },
    ],
    correctIndex: 0,
    hint: "Macro hygiene assigns unique syntax context colors to macro-generated identifiers.",
    explanation: "Rust declarative macros (`macro_rules!`) are hygienic for local variables: identifiers created inside the macro expansion carry a distinct syntax context and cannot accidentally capture or shadow variables in the caller's scope.",
  },
  {
    id: "macro-supporter-3",
    categorySlug: "macros",
    title: "Macro Repetition Separators",
    prompt: "What does `$($x:expr),*` specify in a macro matcher pattern?",
    tags: ["macros","repetition","syntax"],
    difficulty: 2,
    language: 'rust',
    code: "macro_rules! my_vec {\n    ($($x:expr),*) => {\n        vec![$($x),*]\n    };\n}",
    options: [
      { label: 'A', text: "At least one expression without any delimiters" },
      { label: 'B', text: "Zero or more expressions separated by commas" },
      { label: 'C', text: "Exactly two comma-separated expressions in code" },
      { label: 'D', text: "An array slice of constant integer expressions" },
    ],
    correctIndex: 1,
    hint: "* means zero or more repetitions with the preceding comma as separator.",
    explanation: "`$($x:expr),*` matches zero or more occurrences of `$x:expr` separated by commas. Using `+` instead of `*` would require at least one expression.",
  },
  {
    id: "macro-supporter-4",
    categorySlug: "macros",
    title: "Follow-Set Ambiguity Rules",
    prompt: "Why cannot a `$p:pat` fragment specifier be immediately followed by arbitrary tokens in a macro matcher?",
    tags: ["macros","follow-set","parser"],
    difficulty: 3,
    language: 'rust',
    code: "macro_rules! test_pat {\n    ($p:pat => $e:expr) => { ... };\n}",
    options: [
      { label: 'A', text: "Because pattern matching is disabled inside declarative macro bodies within local thread memory" },
      { label: 'B', text: "Because pattern fragments must always be wrapped in parentheses within local thread memory" },
      { label: 'C', text: "To prevent grammar ambiguity and allow future syntax extensions without breaking macros" },
      { label: 'D', text: "To force procedural macros to handle all pattern transformations within local thread memory" },
    ],
    correctIndex: 2,
    hint: "Follow-set restrictions guarantee the macro parser can unambiguously determine when a fragment ends.",
    explanation: "Rust enforces follow-set rules: certain fragment specifiers (like `pat`, `expr`, `ty`) can only be followed by specific tokens (e.g. `=>`, `,`, `=`) so the parser can reliably detect the boundary of the fragment without lookahead ambiguity.",
  },
  {
    id: "macro-supporter-5",
    categorySlug: "macros",
    title: "Procedural Macro Types",
    prompt: "What are the three distinct categories of procedural macros in Rust?",
    tags: ["macros","proc-macro","categories"],
    difficulty: 2,
    language: 'rust',
    code: "// Custom Derive, Attribute-like, and Function-like proc macros",
    options: [
      { label: 'A', text: "Inline macros, Template macros, and Expression replacement macros in code" },
      { label: 'B', text: "Declarative macros, Hygiene macros, and Runtime reflection macros in code" },
      { label: 'C', text: "Static macros, Dynamic macros, and Const generic evaluation macros in code" },
      { label: 'D', text: "Custom Derive macros, Attribute-like macros, and Function-like macros" },
    ],
    correctIndex: 3,
    hint: "Derive (#[derive]), Attribute (#[my_attr]), and Function-like (my_macro!()) are the three proc macro types.",
    explanation: "Rust supports three kinds of procedural macros: 1) Custom Derive (`#[proc_macro_derive]`), 2) Attribute-like (`#[proc_macro_attribute]`), and 3) Function-like (`#[proc_macro]`).",
  },
  {
    id: "macro-supporter-6",
    categorySlug: "macros",
    title: "Macro Rules Matcher Order",
    prompt: "In what order does `macro_rules!` test its pattern matching arms?",
    tags: ["macros","matcher-order","evaluation"],
    difficulty: 2,
    language: 'rust',
    code: "macro_rules! test_order {\n    ($x:ident) => { println!(\"ident\"); };\n    ($x:expr) => { println!(\"expr\"); };\n}",
    options: [
      { label: 'A', text: "Top to bottom in order of declaration, using the first arm that matches" },
      { label: 'B', text: "Specificity order, prioritizing more restrictive matchers first in runtime memory" },
      { label: 'C', text: "Alphabetical order based on fragment specifier token names in runtime memory" },
      { label: 'D', text: "Non-deterministic order determined by LLVM AST optimization passes in code" },
    ],
    correctIndex: 0,
    hint: "macro_rules! evaluates arms sequentially from top to bottom.",
    explanation: "`macro_rules!` tests arms sequentially from top to bottom. The first arm whose pattern matches the provided input tokens is expanded; subsequent arms are ignored.",
  },
  {
    id: "macro-supporter-7",
    categorySlug: "macros",
    title: "Macro Export Scope",
    prompt: "What is the effect of placing `#[macro_export]` on a `macro_rules!` definition?",
    tags: ["macros","macro_export","modules"],
    difficulty: 2,
    language: 'rust',
    code: "#[macro_export]\nmacro_rules! global_macro {\n    () => { println!(\"global\"); };\n}",
    options: [
      { label: 'A', text: "Compiles the macro into a dynamic shared C library at build time in runtime memory" },
      { label: 'B', text: "Places the macro at the crate root and makes it accessible to downstream crates" },
      { label: 'C', text: "Disables all macro hygiene rules for identifiers generated by the macro in runtime memory" },
      { label: 'D', text: "Converts the macro into a procedural derive macro automatically within local thread memory" },
    ],
    correctIndex: 1,
    hint: "#[macro_export] exposes the macro at the root of the crate for external users.",
    explanation: "`#[macro_export]` lifts the macro into the crate root module (`$crate::global_macro`) and exports it so external dependent crates can use it.",
  },
  {
    id: "macro-supporter-8",
    categorySlug: "macros",
    title: "$crate Special Metavariable",
    prompt: "Why should exported declarative macros use `$crate::...` when referencing crate items?",
    tags: ["macros","crate-variable","hygiene"],
    difficulty: 3,
    language: 'rust',
    code: "#[macro_export]\nmacro_rules! call_internal {\n    () => {\n        $crate::internal_helper();\n    };\n}",
    options: [
      { label: 'A', text: "To prevent cargo from compiling unused items in release builds within local thread memory" },
      { label: 'B', text: "To convert function calls into inlined constant assembly instructions in runtime memory" },
      { label: 'C', text: "To correctly resolve items from the defining crate when called in external crates" },
      { label: 'D', text: "To verify that the calling module has identical Rust edition settings in runtime memory" },
    ],
    correctIndex: 2,
    hint: "$crate expands to the name of the crate where the macro was defined.",
    explanation: "`$crate` expands to the path of the defining crate (e.g. `crate` when used internally or `::my_crate` when used downstream), ensuring paths resolve correctly regardless of the caller's scope.",
  },
  {
    id: "macro-supporter-9",
    categorySlug: "macros",
    title: "pat_param Specifier in Rust 2021/2024",
    prompt: "What does the `$p:pat_param` fragment specifier match in declarative macros?",
    tags: ["macros","pat_param","rust-2024"],
    difficulty: 3,
    language: 'rust',
    code: "macro_rules! match_param {\n    ($p:pat_param | $rest:pat) => { println!(\"matched\"); };\n}",
    options: [
      { label: 'A', text: "A function parameter identifier without type annotations in runtime memory" },
      { label: 'B', text: "A constant generic value passed into a struct constructor in runtime memory" },
      { label: 'C', text: "A procedural macro attribute parameter string literal within local thread memory" },
      { label: 'D', text: "A pattern that does not include top-level or (`|`) pattern alternatives" },
    ],
    correctIndex: 3,
    hint: "pat_param matches patterns excluding top-level | alternatives, allowing | to be used as a delimiter.",
    explanation: "`pat_param` matches standard patterns excluding top-level `|` alternatives (e.g. matching `A` in `A | B`). This allows `|` to be used safely as a separator token after `$p:pat_param`.",
  },
  {
    id: "macro-supporter-10",
    categorySlug: "macros",
    title: "TT Muncher Pattern",
    prompt: "What is a \"TT muncher\" in Rust declarative macro design?",
    tags: ["macros","tt-muncher","recursive-macros"],
    difficulty: 3,
    language: 'rust',
    code: "macro_rules! munch {\n    ($head:tt $($tail:tt)*) => {\n        process_one!($head);\n        munch!($($tail)*);\n    };\n    () => {};\n}",
    options: [
      { label: 'A', text: "A recursive macro that processes tokens incrementally one token tree at a time" },
      { label: 'B', text: "A compiler pass that eliminates unused macro expansions from binaries in runtime memory" },
      { label: 'C', text: "A tool that converts procedural macro token streams into C headers in runtime memory" },
      { label: 'D', text: "A macro that evaluates integer arithmetic expressions during lexing in runtime memory" },
    ],
    correctIndex: 0,
    hint: "TT munchers match $head:tt $($tail:tt)* and recursively invoke themselves on the tail.",
    explanation: "A TT muncher is a recursive macro pattern that matches one token tree `$head:tt` and the rest `$($tail:tt)*`, processes `$head`, and recursively calls itself on the remaining `$tail` until empty.",
  },
  {
    id: "macro-supporter-11",
    categorySlug: "macros",
    title: "Macro Expansion Recursion Limit",
    prompt: "How can you increase the maximum recursion depth for deeply recursive macros?",
    tags: ["macros","recursion-limit","compiler"],
    difficulty: 2,
    language: 'rust',
    code: "#![recursion_limit = \"256\"]",
    options: [
      { label: 'A', text: "By passing `--max-depth 256` to the cargo build command line in code" },
      { label: 'B', text: "By adding `#![recursion_limit = \"256\"]` at the crate root level" },
      { label: 'C', text: "By annotating each recursive macro with `#[inline(deep)]` in code" },
      { label: 'D', text: "By allocating recursive token buffers on the global heap in runtime memory" },
    ],
    correctIndex: 1,
    hint: "#![recursion_limit = \"...\"] sets the maximum macro expansion depth for the crate.",
    explanation: "The inner attribute `#![recursion_limit = \"N\"]` at the root of a crate adjusts the maximum recursion depth for macro expansions, auto trait checks, and const evaluation.",
  },
  {
    id: "macro-supporter-12",
    categorySlug: "macros",
    title: "Literal Specifier (literal)",
    prompt: "Which inputs match the `$lit:literal` fragment specifier in declarative macros?",
    tags: ["macros","literal","specifiers"],
    difficulty: 2,
    language: 'rust',
    code: "macro_rules! check_lit {\n    ($lit:literal) => { println!(\"literal: {}\", $lit); };\n}",
    options: [
      { label: 'A', text: "Variable identifiers and module path expressions only within local thread memory" },
      { label: 'B', text: "Any expression that can be evaluated at compile time within local thread memory" },
      { label: 'C', text: "String literals, integer constants, boolean values, and char literals" },
      { label: 'D', text: "Type definitions and struct field declarations only within local thread memory" },
    ],
    correctIndex: 2,
    hint: "literal matches any literal token (e.g. 42, \"hello\", true, 'c').",
    explanation: "`$lit:literal` matches literal tokens like `\"string\"`, `123`, `true`, `3.14`, and `'a'`. It rejects variable identifiers, complex expressions, and keyword paths.",
  },
  {
    id: "macro-supporter-13",
    categorySlug: "macros",
    title: "Ident Fragment Specifier",
    prompt: "What does `$id:ident` match in a macro matcher?",
    tags: ["macros","ident","tokens"],
    difficulty: 1,
    language: 'rust',
    code: "macro_rules! make_fn {\n    ($name:ident) => {\n        fn $name() { println!(\"called\"); }\n    };\n}",
    options: [
      { label: 'A', text: "A full path including module separators like `std::vec::Vec` in runtime memory" },
      { label: 'B', text: "A string literal inside double quotes like `\"my_name\"` in runtime memory" },
      { label: 'C', text: "Any arbitrary block enclosed in curly braces `{ ... }` in runtime memory" },
      { label: 'D', text: "A single identifier or keyword token name (like `foo` or `MyStruct`)" },
    ],
    correctIndex: 3,
    hint: "ident matches a single valid Rust identifier name.",
    explanation: "`$id:ident` matches a single identifier name (variable name, function name, struct name). To match paths with `::`, use `$p:path`.",
  },
  {
    id: "macro-supporter-14",
    categorySlug: "macros",
    title: "Path Fragment Specifier",
    prompt: "What does `$p:path` match in declarative macros?",
    tags: ["macros","path","modules"],
    difficulty: 2,
    language: 'rust',
    code: "macro_rules! print_type {\n    ($p:path) => { println!(\"path used\"); };\n}",
    options: [
      { label: 'A', text: "A module or type path like `std::collections::HashMap`" },
      { label: 'B', text: "A filesystem directory path string like `\"/usr/bin\"` in code" },
      { label: 'C', text: "A trait bound constraint like `T: Send + Sync` during runtime execution" },
      { label: 'D', text: "An unsafe raw pointer address expression during runtime execution" },
    ],
    correctIndex: 0,
    hint: "path matches qualified item paths separated by double colons ::.",
    explanation: "`$p:path` matches item and type paths such as `crate::module::Item` or `std::sync::Arc`.",
  },
  {
    id: "macro-supporter-15",
    categorySlug: "macros",
    title: "Ty Fragment Specifier",
    prompt: "What does `$t:ty` match in macro matchers?",
    tags: ["macros","ty","types"],
    difficulty: 2,
    language: 'rust',
    code: "macro_rules! make_field {\n    ($name:ident : $t:ty) => {\n        struct Holder { $name: $t }\n    };\n}",
    options: [
      { label: 'A', text: "A single primitive type keyword only (like `u32` or `bool`) in code" },
      { label: 'B', text: "A complete Rust type specification, such as `Vec<Option<String>>`" },
      { label: 'C', text: "A type conversion expression implementing the `From` trait in runtime memory" },
      { label: 'D', text: "A trait implementation definition block `impl Trait for Type` in code" },
    ],
    correctIndex: 1,
    hint: "ty matches any valid Rust type expression, including references and generics.",
    explanation: "`$t:ty` matches any complete Rust type expression (e.g. `i32`, `&'a str`, `Option<Box<dyn Trait>>`, `[u8; 32]`).",
  },
  {
    id: "macro-supporter-16",
    categorySlug: "macros",
    title: "Block Fragment Specifier",
    prompt: "What does `$b:block` match in macro matchers?",
    tags: ["macros","block","syntax"],
    difficulty: 2,
    language: 'rust',
    code: "macro_rules! timed {\n    ($b:block) => {\n        let start = std::time::Instant::now();\n        $b\n        println!(\"elapsed: {:?}\", start.elapsed());\n    };\n}",
    options: [
      { label: 'A', text: "A continuous chunk of memory allocated on the heap in runtime memory" },
      { label: 'B', text: "A multithreaded blocking operation on a mutex lock in runtime memory" },
      { label: 'C', text: "A sequence of statements enclosed in curly braces `{ ... }`" },
      { label: 'D', text: "A block comment starting with `/*` and ending with `*/` in code" },
    ],
    correctIndex: 2,
    hint: "block matches a braced block of code { ... } as a single AST node.",
    explanation: "`$b:block` matches a code block delimited by braces `{ ... }`, containing zero or more statements and an optional trailing expression.",
  },
  {
    id: "macro-supporter-17",
    categorySlug: "macros",
    title: "Stmt Fragment Specifier",
    prompt: "What does `$s:stmt` match in macro matchers?",
    tags: ["macros","stmt","statements"],
    difficulty: 2,
    language: 'rust',
    code: "macro_rules! run_stmt {\n    ($s:stmt) => {\n        println!(\"running statement\");\n        $s\n    };\n}",
    options: [
      { label: 'A', text: "A string literal representing SQL database statements in runtime memory" },
      { label: 'B', text: "A state machine enum variant in async functions during runtime execution" },
      { label: 'C', text: "A static assertion evaluated at compile time during runtime execution" },
      { label: 'D', text: "A single Rust statement (like a let binding or item declaration)" },
    ],
    correctIndex: 3,
    hint: "stmt matches a single statement, which may or may not require a trailing semicolon.",
    explanation: "`$s:stmt` matches a single statement (such as `let x = 10;`, `foo();`, or an item declaration), allowing macro authors to wrap or sequence statements.",
  },
  {
    id: "macro-supporter-18",
    categorySlug: "macros",
    title: "Proc Macro TokenStream Representation",
    prompt: "What data structure is manipulated by procedural macros in the `proc_macro` crate?",
    tags: ["macros","proc-macro","token-stream"],
    difficulty: 2,
    language: 'rust',
    code: "// fn my_macro(input: TokenStream) -> TokenStream",
    options: [
      { label: 'A', text: "`proc_macro::TokenStream`, a stream of syntax token trees and source spans" },
      { label: 'B', text: "A plain ASCII string containing unprocessed source text within local thread memory" },
      { label: 'C', text: "A fully typed and resolved LLVM Intermediate Representation graph in runtime memory" },
      { label: 'D', text: "A JSON object mapping identifiers to compiler symbol addresses in runtime memory" },
    ],
    correctIndex: 0,
    hint: "proc_macro functions take and return TokenStream values.",
    explanation: "Procedural macros operate on `proc_macro::TokenStream`, which represents a stream of token trees with associated source location metadata (`Span`), enabling tools like `syn` and `quote` to parse and emit code.",
  },
  {
    id: "macro-supporter-19",
    categorySlug: "macros",
    title: "Proc Macro Crate Type",
    prompt: "What crate type declaration must be set in `Cargo.toml` to build a procedural macro library?",
    tags: ["macros","cargo","proc-macro"],
    difficulty: 2,
    language: 'rust',
    code: "// [lib]\n// proc-macro = true",
    options: [
      { label: 'A', text: "`[lib] crate-type = [\"dylib\"]`" },
      { label: 'B', text: "`[lib] proc-macro = true`" },
      { label: 'C', text: "`[package] macro-plugin = true`" },
      { label: 'D', text: "`[build] proc-macro = \"enabled\"`" },
    ],
    correctIndex: 1,
    hint: "proc-macro = true in [lib] declares a procedural macro crate.",
    explanation: "To define procedural macros, the crate's `Cargo.toml` must declare `[lib] proc-macro = true`. This compiles the crate as a dynamic library loaded by the compiler during compilation of dependent crates.",
  },
  {
    id: "macro-supporter-20",
    categorySlug: "macros",
    title: "Macro Span and Diagnostic Reporting",
    prompt: "Why is preserving `Span` information in procedural macros important for error messages?",
    tags: ["macros","proc-macro","spans"],
    difficulty: 3,
    language: 'rust',
    code: "// syn::Error::new(span, \"invalid syntax\")",
    options: [
      { label: 'A', text: "It prevents binary executable sizes from growing during debug builds in runtime memory" },
      { label: 'B', text: "It accelerates LLVM code generation by skipping AST verification in runtime memory" },
      { label: 'C', text: "It allows compiler errors to highlight the exact original source code lines" },
      { label: 'D', text: "It enables cross-crate trait specialization in stable Rust within local thread memory" },
    ],
    correctIndex: 2,
    hint: "Span associates tokens with original file and line/column numbers for diagnostics.",
    explanation: "`Span` attaches file, line, and column position information to tokens. When compiler or macro errors occur, the compiler uses the span to point precisely to the user's original code rather than macro internals.",
  },
  {
    id: "macro-supporter-21",
    categorySlug: "macros",
    title: "Macro Question Mark Operator in Repetition",
    prompt: "What does `$(,)?` match at the end of a macro argument list in modern Rust?",
    tags: ["macros","optional-repetition","syntax"],
    difficulty: 2,
    language: 'rust',
    code: "macro_rules! items {\n    ($($item:expr),* $(,)?) => {\n        vec![$($item),*]\n    };\n}",
    options: [
      { label: 'A', text: "An optional trailing comma" },
      { label: 'B', text: "A mandatory error operator" },
      { label: 'C', text: "A wildcard regex pattern" },
      { label: 'D', text: "A conditional compile flag" },
    ],
    correctIndex: 3,
    hint: "$(...)? specifies 0 or 1 occurrences of the enclosed token.",
    explanation: "In Rust macro repetition syntax, `$(...)?` denotes an optional occurrence (0 or 1 time). `$(,)?` conveniently permits an optional trailing comma at the end of parameter lists.",
  },
  {
    id: "macro-supporter-22",
    categorySlug: "macros",
    title: "Nested Macro Repetitions",
    prompt: "How are nested macro repetitions `$($($x:expr),*);*` expanded in a template?",
    tags: ["macros","nested-repetition","syntax"],
    difficulty: 3,
    language: 'rust',
    code: "macro_rules! matrix {\n    ($($($x:expr),*);*) => {\n        vec![$(vec![$($x),*]),*]\n    };\n}",
    options: [
      { label: 'A', text: "By matching inner and outer repetition levels in corresponding nested expansions" },
      { label: 'B', text: "By flattening all expressions into a single continuous 1D array within local thread memory" },
      { label: 'C', text: "By evaluating the outer loop at runtime and inner loop at compile time in runtime memory" },
      { label: 'D', text: "Nested repetitions are forbidden by rustc grammar specifications within local thread memory" },
    ],
    correctIndex: 0,
    hint: "Each nested expansion level corresponds to a matching repetition level in the pattern.",
    explanation: "When a macro pattern has multiple nested repetition levels, the expansion template must match the nesting depth so each inner repetition iterates within its corresponding outer repetition group.",
  },
  {
    id: "macro-supporter-23",
    categorySlug: "macros",
    title: "Vis Fragment Specifier",
    prompt: "What does `$v:vis` match in declarative macros?",
    tags: ["macros","vis","visibility"],
    difficulty: 2,
    language: 'rust',
    code: "macro_rules! make_struct {\n    ($v:vis struct $name:ident) => {\n        $v struct $name;\n    };\n}",
    options: [
      { label: 'A', text: "A visual studio compiler configuration parameter during runtime execution in code" },
      { label: 'B', text: "An optional visibility modifier (like `pub`, `pub(crate)`, or empty private)" },
      { label: 'C', text: "A variable scope lifetime identifier during runtime execution in runtime memory" },
      { label: 'D', text: "A virtual function dispatch keyword attribute during runtime execution in code" },
    ],
    correctIndex: 1,
    hint: "vis matches visibility modifiers including pub, pub(crate), or nothing.",
    explanation: "`$v:vis` matches visibility qualifiers (e.g. `pub`, `pub(crate)`, `pub(super)`, or nothing for private items), allowing macros to preserve the caller's intended visibility on generated items.",
  },
  {
    id: "macro-supporter-24",
    categorySlug: "macros",
    title: "Macro Scoping within Modules",
    prompt: "How does macro availability differ between `macro_rules!` without `#[macro_export]` and standard items?",
    tags: ["macros","scoping","textual-scope"],
    difficulty: 3,
    language: 'rust',
    code: "// call_me!(); // Error if defined below\nmacro_rules! call_me { () => {}; }\n// call_me!(); // OK here",
    options: [
      { label: 'A', text: "Macros are always visible anywhere within the same crate regardless of location in code" },
      { label: 'B', text: "Macros must be imported with `use super::*` in all child submodules within local thread memory" },
      { label: 'C', text: "Unexported `macro_rules!` are only visible textually *after* their definition point" },
      { label: 'D', text: "Macros are only visible inside the exact function where declared within local thread memory" },
    ],
    correctIndex: 2,
    hint: "Declarative macros follow textual order and are not visible before they are defined.",
    explanation: "Unlike functions and structs (which are available throughout their module regardless of declaration order), unexported `macro_rules!` follow strict textual scoping and are only available after their point of declaration in source order.",
  },
  {
    id: "macro-supporter-25",
    categorySlug: "macros",
    title: "Macro Use Directive (#[macro_use])",
    prompt: "What does `#[macro_use]` on a `mod` declaration do?",
    tags: ["macros","macro_use","modules"],
    difficulty: 2,
    language: 'rust',
    code: "#[macro_use]\nmod helpers {\n    macro_rules! greet { () => { println!(\"hi\"); }; }\n}\n\nfn main() {\n    greet!();\n}",
    options: [
      { label: 'A', text: "Exports all module functions into the global C ABI namespace in runtime memory" },
      { label: 'B', text: "Forces the compiler to inline all function calls in that module in runtime memory" },
      { label: 'C', text: "Converts all module constants into thread-local variables in runtime memory" },
      { label: 'D', text: "Brings macros defined in that module into the enclosing module's scope" },
    ],
    correctIndex: 3,
    hint: "#[macro_use] pushes macros from a module up into the parent scope.",
    explanation: "Applying `#[macro_use]` to a module brings all `macro_rules!` macros defined within that module into the parent module's scope, making them available without explicit path qualification.",
  },
  {
    id: "macro-supporter-26",
    categorySlug: "macros",
    title: "Meta Fragment Specifier (meta)",
    prompt: "What does `$m:meta` match in macro matchers?",
    tags: ["macros","meta","attributes"],
    difficulty: 2,
    language: 'rust',
    code: "macro_rules! apply_attr {\n    (#[$m:meta] fn $name:ident() {}) => {\n        #[$m] fn $name() {}\n    };\n}",
    options: [
      { label: 'A', text: "The contents of an attribute, such as `derive(Clone)` or `inline(always)`" },
      { label: 'B', text: "Metadata information stored in the compiled binary header within local thread memory" },
      { label: 'C', text: "A trait implementation metadata table definition during runtime execution" },
      { label: 'D', text: "A compiler flag passed to the cargo build pipeline within local thread memory" },
    ],
    correctIndex: 0,
    hint: "meta matches an attribute body (inside #[...]).",
    explanation: "`$m:meta` matches the inner content of an attribute (such as `inline`, `derive(Debug)`, or `doc = \"...\"`), allowing macros to accept and forward attributes.",
  },
  {
    id: "macro-supporter-27",
    categorySlug: "macros",
    title: "Derive Macro Helper Attributes",
    prompt: "What are \"helper attributes\" in custom derive procedural macros?",
    tags: ["macros","proc-macro","helper-attributes"],
    difficulty: 3,
    language: 'rust',
    code: "// #[proc_macro_derive(MyDerive, attributes(my_helper))]",
    options: [
      { label: 'A', text: "Attributes that run additional background thread compilation jobs within local thread memory" },
      { label: 'B', text: "Inert attributes that the derive macro can inspect on fields without compiler errors" },
      { label: 'C', text: "Helper functions exported into the C dynamic library table under current compiler safety rules" },
      { label: 'D', text: "Attributes that disable borrow checking on specific struct fields within local thread memory" },
    ],
    correctIndex: 1,
    hint: "Helper attributes are registered inert attributes used for per-field configuration.",
    explanation: "When declaring `#[proc_macro_derive(Trait, attributes(helper))]`, `helper` is registered as an inert attribute. The compiler permits `#[helper(...)]` on struct fields for the derive macro to read without raising \"unknown attribute\" errors.",
  },
  {
    id: "macro-supporter-28",
    categorySlug: "macros",
    title: "Attribute Proc Macro Signature",
    prompt: "What are the two arguments passed to a `#[proc_macro_attribute]` function?",
    tags: ["macros","proc-macro","attribute-macro"],
    difficulty: 3,
    language: 'rust',
    code: "// #[proc_macro_attribute]\n// pub fn my_attr(attr: TokenStream, item: TokenStream) -> TokenStream",
    options: [
      { label: 'A', text: "`name: &str` and `body: &str` during runtime execution during standard program runtime execution" },
      { label: 'B', text: "`ast: syn::DeriveInput` and `output: &mut TokenStream` during standard program runtime execution" },
      { label: 'C', text: "`attr: TokenStream` (the attribute arguments) and `item: TokenStream` (the annotated item)" },
      { label: 'D', text: "`config: HashMap<String, String>` and `code: String` during standard program runtime execution" },
    ],
    correctIndex: 2,
    hint: "Attribute macros take the attribute args tokens and the item tokens as arguments.",
    explanation: "An attribute macro has the signature `pub fn my_attr(attr: TokenStream, item: TokenStream) -> TokenStream`. `attr` holds any tokens inside `#[my_attr(...)]`, and `item` holds the item to which the attribute was applied.",
  },
  {
    id: "macro-supporter-29",
    categorySlug: "macros",
    title: "Quote Crate Role in Proc Macros",
    prompt: "What does the `quote!` macro from the `quote` crate do in procedural macros?",
    tags: ["macros","quote","proc-macro"],
    difficulty: 2,
    language: 'rust',
    code: "// quote! { fn #name() -> i32 { 42 } }",
    options: [
      { label: 'A', text: "Quotes string literals to prevent shell injection vulnerabilities under current compiler safety rules" },
      { label: 'B', text: "Parses raw token streams into Abstract Syntax Tree structs during standard program runtime execution" },
      { label: 'C', text: "Executes unit tests inside procedural macro test runners during standard program runtime execution" },
      { label: 'D', text: "Provides a templating quasiquoter to construct Rust `TokenStream`s with variable interpolation" },
    ],
    correctIndex: 3,
    hint: "quote! converts Rust code fragments into TokenStream instances with #variable interpolation.",
    explanation: "The `quote!` macro turns Rust syntax into a `proc_macro2::TokenStream`, allowing clean variable interpolation (`#variable`, `#(#items)*`) instead of manual token construction.",
  },
  {
    id: "macro-supporter-30",
    categorySlug: "macros",
    title: "Macro Rules Push-Down Accumulator",
    prompt: "What is the \"push-down accumulation\" pattern in `macro_rules!`?",
    tags: ["macros","push-down","design-patterns"],
    difficulty: 3,
    language: 'rust',
    code: "macro_rules! collect_items {\n    (@accum [$($acc:ident)*] $next:ident $($rest:ident)*) => {\n        collect_items!(@accum [$($acc)* $next] $($rest)*);\n    };\n    (@accum [$($acc:ident)*]) => {\n        println!(\"collected: {:?}\", stringify!($($acc)*));\n    };\n}",
    options: [
      { label: 'A', text: "Passing accumulated state through recursive macro invocations using internal `@` arms" },
      { label: 'B', text: "Pushing values into an OS environment variable table during compilation in runtime memory" },
      { label: 'C', text: "Accumulating CPU register allocations for inline assembly blocks within local thread memory" },
      { label: 'D', text: "Combining multiple crates into a single static library binary within local thread memory" },
    ],
    correctIndex: 0,
    hint: "Push-down accumulation collects parsed tokens inside a bracketed state buffer across recursive calls.",
    explanation: "Push-down accumulation is a declarative macro technique where intermediate state is collected into a helper bracketed buffer (like `[$($acc)*]`) and passed down through recursive macro calls until matching a terminal base case.",
  },
  {
    id: "macro-code-vec-of-strings",
    categorySlug: "macros",
    title: "String Vector Declarative Macro",
    difficulty: 2,
    language: 'rust',
    kind: 'coding',
    tags: ["macros", 'coding'],
    prompt: "Write a declarative macro `vec_of_strings!($($x:expr),*)` that takes comma-separated string literals and constructs a `Vec<String>`.",
    code: "#[macro_export]\nmacro_rules! vec_of_strings {\n    ($($x:expr),* $(,)?) => {\n        vec![$($x.to_string()),*]\n    };\n}",
    testHarness: "{{SOLUTION}}\n\nfn main() {\n    let v = vec_of_strings![\"hello\", \"rust\", \"crab\"];\n    assert_eq!(v, vec![String::from(\"hello\"), String::from(\"rust\"), String::from(\"crab\")]);\n    let empty: Vec<String> = vec_of_strings![];\n    assert!(empty.is_empty());\n    println!(\"test passed\");\n}\n",
    explanation: "Write a declarative macro `vec_of_strings!($($x:expr),*)` that takes comma-separated string literals and constructs a `Vec<String>`. Review the test cases to verify all assertions.",
  },
  {
    id: "macro-code-calc-min",
    categorySlug: "macros",
    title: "Minimum Expression Macro",
    difficulty: 2,
    language: 'rust',
    kind: 'coding',
    tags: ["macros", 'coding'],
    prompt: "Write a declarative macro `calc_min!(a, b)` and `calc_min!(a, b, c)` returning the smallest value among the passed arguments.",
    code: "#[macro_export]\nmacro_rules! calc_min {\n    ($a:expr, $b:expr) => {\n        if $a < $b { $a } else { $b }\n    };\n    ($a:expr, $b:expr, $c:expr) => {\n        calc_min!(calc_min!($a, $b), $c)\n    };\n}",
    testHarness: "{{SOLUTION}}\n\nfn main() {\n    assert_eq!(calc_min!(10, 5), 5);\n    assert_eq!(calc_min!(20, 15, 30), 15);\n    println!(\"test passed\");\n}\n",
    explanation: "Write a declarative macro `calc_min!(a, b)` and `calc_min!(a, b, c)` returning the smallest value among the passed arguments. Review the test cases to verify all assertions.",
  },
  {
    id: 'macro-hygiene-dollar-crate-1',
    categorySlug: 'macros',
    title: 'Macro Hygiene with $crate',
    prompt: 'Why is `$crate::` essential in exported declarative macros (`#[macro_export]`)?',
    tags: ['macros', 'hygiene', 'macro-export'],
    difficulty: 2,
    language: 'rust',
    options: [
      { label: 'A', text: 'It imports dependencies from crates.io at macro parse time' },
      { label: 'B', text: 'It allocates an isolated namespace on the thread stack frame' },
      { label: 'C', text: 'It resolves paths to the defining crate across external users' },
      { label: 'D', text: 'It generates a fresh random crate identifier during linking' },
    ],
    correctIndex: 2,
    hint: '$crate expands to the crate where the macro was defined regardless of call site.',
    explanation: '`$crate` ensures hygienic path resolution, expanding to the root path of the defining crate so helper items and dependencies resolve correctly in external crates.',
  },
  {
    id: 'macro-fragment-spec-expr-1',
    categorySlug: 'macros',
    title: 'Matcher Follow-Set Restrictions',
    prompt: 'What follow-set restriction applies to `$e:expr` matchers in `macro_rules!`?',
    tags: ['macros', 'fragment-specifiers', 'follow-set'],
    difficulty: 3,
    language: 'rust',
    options: [
      { label: 'A', text: 'It cannot be followed by arbitrary tokens like `+`' },
      { label: 'B', text: 'It can match any arbitrary token tree without limit' },
      { label: 'C', text: 'It evaluates the expression at macro expansion time' },
      { label: 'D', text: 'It forces the matched token to be an integer literal' },
    ],
    correctIndex: 0,
    hint: 'Follow-set restrictions prevent ambiguities in macro parsing.',
    explanation: 'Because `$e:expr` can end with arbitrary expressions, macro matchers restrict following tokens to delimiters (like `,`, `;`, or `=>`) to eliminate ambiguity in the parser.',
  },
  {
    id: 'macro-tt-muncher-base-1',
    categorySlug: 'macros',
    title: 'TT Muncher Pattern',
    prompt: 'What characterizes the "TT muncher" macro design pattern?',
    tags: ['macros', 'tt-muncher', 'design-patterns'],
    difficulty: 3,
    language: 'rust',
    options: [
      { label: 'A', text: 'Parsing all input tokens at once into dynamic hash maps' },
      { label: 'B', text: 'Processing tokens one item at a time through recursion' },
      { label: 'C', text: 'Disabling hygiene checks for all generated identifiers' },
      { label: 'D', text: 'Generating procedural macros directly from macro_rules!' },
    ],
    correctIndex: 1,
    hint: 'TT munchers match a single token tree at a time and recursively process the tail.',
    explanation: 'A TT (token tree) muncher pattern matches the leading token tree(s), transforms or stores them, and recursively invokes the macro on the remaining tail until empty.',
  },
  {
    id: 'macro-stringify-stringify-1',
    categorySlug: 'macros',
    title: 'Token Stringification with stringify!',
    prompt: 'What does the built-in `stringify!(...)` macro produce?',
    tags: ['macros', 'stringify'],
    difficulty: 1,
    language: 'rust',
    options: [
      { label: 'A', text: 'It evaluates variables and formats their debug values' },
      { label: 'B', text: 'It converts expressions into runtime JSON string maps' },
      { label: 'C', text: 'It parses arbitrary strings into executable bytecode' },
      { label: 'D', text: 'It yields the literal source tokens as a &str literal' },
    ],
    correctIndex: 3,
    hint: 'stringify! captures the exact tokens as written in code without evaluating them.',
    explanation: '`stringify!(...)` takes tokens at compile time and converts their exact textual representation into a static `&\'static str` literal without evaluating expressions.',
  },
  {
    id: 'macro-repetition-separator-1',
    categorySlug: 'macros',
    title: 'Macro Repetition Separator Syntax',
    prompt: 'What does the pattern `$($x:expr),*` match in a declarative macro?',
    tags: ['macros', 'repetition'],
    difficulty: 1,
    language: 'rust',
    options: [
      { label: 'A', text: 'It matches zero or more comma-separated expressions' },
      { label: 'B', text: 'It matches at least one mandatory expression sequence' },
      { label: 'C', text: 'It creates a fixed-size stack array containing items' },
      { label: 'D', text: 'It splits string literals across comma delimiters' },
    ],
    correctIndex: 0,
    hint: '* denotes 0 or more repetitions separated by comma.',
    explanation: 'In `macro_rules!`, `$($x:expr),*` matches zero or more repetitions of `$x:expr` separated by commas.',
  },
  {
    id: 'macro-proc-macro-derive-helper-attrs-1',
    categorySlug: 'macros',
    title: 'Custom Helper Attributes in Derive Macros',
    prompt: 'What is the purpose of `#[proc_macro_derive(MyTrait, attributes(my_helper))]`?',
    tags: ['macros', 'proc-macro', 'helper-attributes'],
    difficulty: 3,
    language: 'rust',
    options: [
      { label: 'A', text: 'They execute shell commands during procedural macro run' },
      { label: 'B', text: 'They turn off type checking for all annotated structs' },
      { label: 'C', text: 'They register inert attributes allowed on fields or items' },
      { label: 'D', text: 'They declare exported C-compatible dynamic symbol names' },
    ],
    correctIndex: 2,
    hint: 'The attributes(...) list registers inert attributes so the compiler does not reject them.',
    explanation: 'Listing `attributes(my_helper)` in `proc_macro_derive` informs `rustc` that `#[my_helper]` is an inert attribute meant for this derive macro, preventing "unknown attribute" errors.',
  },
  {
    id: 'macro-macro-rules-local-inner-macros-1',
    categorySlug: 'macros',
    title: 'local_inner_macros Attribute',
    prompt: 'What does `#[macro_export(local_inner_macros)]` do for declarative macros calling sibling helper macros?',
    tags: ['macros', 'local-inner-macros', 'hygiene'],
    difficulty: 3,
    language: 'rust',
    options: [
      { label: 'A', text: 'It prefixes internal macro invocations with $crate::' },
      { label: 'B', text: 'It prevents other crates from calling the macro rules' },
      { label: 'C', text: 'It hides macro definitions from the public rustdoc pages' },
      { label: 'D', text: 'It generates inline assembly stubs for macro expanders' },
    ],
    correctIndex: 0,
    hint: 'local_inner_macros automatically adds $crate:: to macro calls made within the macro body.',
    explanation: '`#[macro_export(local_inner_macros)]` tells the compiler to expand internal macro calls within the macro body by prefixing them with `$crate::`, allowing helper macros to resolve correctly.',
  },
  {
    id: 'macro-token-tree-group-delimiter-1',
    categorySlug: 'macros',
    title: 'Proc Macro TokenTree::Group Representation',
    prompt: 'How does `proc_macro::TokenTree::Group` represent delimited syntax like `(a, b)` or `[1, 2]`?',
    tags: ['macros', 'proc-macro', 'token-tree'],
    difficulty: 2,
    language: 'rust',
    options: [
      { label: 'A', text: 'TokenTree::Group can only contain literal string tokens' },
      { label: 'B', text: 'It represents delimited tokens preserving matched syntax' },
      { label: 'C', text: 'It converts token trees into dynamic binary byte arrays' },
      { label: 'D', text: 'It panics if token groups exceed sixteen elements total' },
    ],
    correctIndex: 1,
    hint: 'Group holds a delimiter (Parenthesis, Bracket, Brace, None) and an inner stream.',
    explanation: 'In procedural macro token streams, `Group` bundles delimited syntax with its delimiter kind (`Parenthesis`, `Bracket`, `Brace`, or `None`) and an inner `TokenStream`.',
  },
  {
    id: 'macro-ident-macro-hygiene-resolution-1',
    categorySlug: 'macros',
    title: 'Identifier Hygiene in macro_rules!',
    prompt: 'How does macro hygiene protect local variable bindings defined inside `macro_rules!`?',
    tags: ['macros', 'hygiene', 'macro_rules'],
    difficulty: 2,
    language: 'rust',
    options: [
      { label: 'A', text: 'Macro identifiers always resolve in global root crate scope' },
      { label: 'B', text: 'Identifiers created in macro bodies are visible everywhere' },
      { label: 'C', text: 'Hygiene prevents macros from producing executable functions' },
      { label: 'D', text: 'Identifiers introduced by macros cannot clash with callers' },
    ],
    correctIndex: 3,
    hint: 'Hygiene ensures variables defined in macros do not shadow or clash with caller bindings.',
    explanation: 'Declarative macros have identifier hygiene: variable bindings declared inside macro bodies cannot shadow or collide with variables in caller scopes.',
  },
  {
    id: 'macro-compile-error-diagnostic-1',
    categorySlug: 'macros',
    title: 'The compile_error! Macro',
    prompt: 'What is the role of `compile_error!("...")` in Rust macro authoring?',
    tags: ['macros', 'compile-error', 'diagnostics'],
    difficulty: 1,
    language: 'rust',
    options: [
      { label: 'A', text: 'It triggers a custom compilation error with message text' },
      { label: 'B', text: 'It generates an unrecoverable hardware segmentation fault' },
      { label: 'C', text: 'It logs warning messages to the standard error terminal' },
      { label: 'D', text: 'It panics at runtime when the program is first launched' },
    ],
    correctIndex: 0,
    hint: 'compile_error! emits a compile-time compiler error with a user-supplied message.',
    explanation: '`compile_error!("message")` causes compilation to fail with the specified error message, frequently used in macro match fallback arms to signal invalid macro arguments.',
  },
]
