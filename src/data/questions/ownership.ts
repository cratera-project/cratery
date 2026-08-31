import type { Question } from '../../lib/quiz'

export const ownershipQuestions: Question[] = [
  {
    id: 'own-move-1',
    categorySlug: 'ownership',
    title: 'Value Movement',
    prompt: 'Why does the following code fail to compile?',
    tags: ['ownership', 'move'],
    difficulty: 1,
    language: 'rust',
    code: `fn main() {
    let s1 = String::from("hello");
    let s2 = s1;
    println!("{}, world!", s1);
}`,
    options: [
      { label: 'A', text: "`String` values are always immutable by default" },
      { label: 'B', text: "Ownership moved from `s1` into `s2` on assign" },
      { label: 'C', text: "Variables cannot be reassigned in the same scope" },
      { label: 'D', text: "`println!` requires a mutable reference argument" },
    ],
    correctIndex: 1,
    hint: 'Ask whether `String` is `Copy` after the assignment.',
    explanation:
      'Assigning a non-`Copy` value like `String` moves ownership. After `let s2 = s1`, `s1` is invalid, so using it in `println!` is a use-after-move error. This prevents a double free when both bindings would otherwise drop the same heap buffer.',
  },
  {
    id: 'own-copy-1',
    categorySlug: 'ownership',
    title: 'Copy Trait Semantics',
    prompt: 'Why is `x` still valid after being assigned to `y`?',
    tags: ['ownership', 'copy'],
    difficulty: 1,
    language: 'rust',
    code: `fn main() {
    let x = 5;
    let y = x;
    println!("x = {}, y = {}", x, y);
}`,
    options: [
      { label: 'A', text: '`i32` implements `Copy`, so assign duplicates it' },
      { label: 'B', text: 'All numeric types use shared reference semantics' },
      { label: 'C', text: 'Rust always clones values smaller than a pointer' },
      { label: 'D', text: 'Assignment creates shared ownership of the value' },
    ],
    correctIndex: 0,
    hint: 'Stack-only scalars often implement a special trait.',
    explanation:
      '`i32` implements `Copy`. Assignment bitwise-copies the value, so `x` and `y` are independent. Types with heap ownership (like `String`) do not implement `Copy` and move instead.',
  },
  {
    id: 'own-func-1',
    categorySlug: 'ownership',
    title: 'Ownership Transfer',
    prompt: 'What happens to `s` when `takes_ownership` is called?',
    tags: ['ownership', 'functions'],
    difficulty: 1,
    language: 'rust',
    code: `fn main() {
    let s = String::from("hello");
    takes_ownership(s);
    // s used here?
}

fn takes_ownership(some_string: String) {
    println!("{}", some_string);
}`,
    options: [
      { label: 'A', text: '`s` is passed as a temporary shared reference' },
      { label: 'B', text: 'Ownership of `s` moves into the parameter' },
      { label: 'C', text: '`s` is cloned; the original stays usable' },
      { label: 'D', text: '`s` becomes immutable but remains accessible' },
    ],
    correctIndex: 1,
    hint: 'By-value parameters are not borrows.',
    explanation:
      'Passing a non-`Copy` value by value moves ownership into the function. `some_string` owns the `String`, and `s` in `main` is invalidated. Borrow with `&s` (or clone) if the caller still needs it.',
  },
  {
    id: 'own-mut-borrow-1',
    categorySlug: 'ownership',
    title: 'Mutable Borrowing Check',
    prompt: 'Which rule prevents this code from compiling?',
    tags: ['borrowing', 'mutability'],
    difficulty: 2,
    language: 'rust',
    code: `fn main() {
    let mut s = String::from("hello");
    let r1 = &mut s;
    let r2 = &mut s;
    println!("{}, {}", r1, r2);
}`,
    options: [
      { label: 'A', text: 'Only one active `&mut` to a value is allowed' },
      { label: 'B', text: 'Mutable borrows always need lifetime annotations' },
      { label: 'C', text: '`String` forbids holding more than one reference' },
      { label: 'D', text: 'You must call `reborrow()` before a second `&mut`' },
    ],
    correctIndex: 0,
    hint: 'Alias XOR mutate: exclusivity for `&mut`.',
    explanation:
      'Rust allows either one mutable reference or any number of shared references, not overlapping mutable borrows. Two simultaneous `&mut s` values would alias and could race, so the borrow checker rejects this.',
  },
  {
    id: 'own-dangle-1',
    categorySlug: 'ownership',
    title: 'Dangling References',
    prompt: 'Why is returning a reference to a local variable rejected?',
    tags: ['ownership', 'lifetimes'],
    difficulty: 2,
    language: 'rust',
    code: `fn dangle() -> &String {
    let s = String::from("hello");
    &s
}`,
    options: [
      { label: 'A', text: 'The return type must wrap the ref in `Box`' },
      { label: 'B', text: 'Functions are never allowed to return references' },
      { label: 'C', text: 'Local `s` is dropped when the function returns' },
      { label: 'D', text: '`String` must implement a special `Return` trait' },
    ],
    correctIndex: 2,
    hint: 'Who still owns the data after `return`?',
    explanation:
      '`s` is owned by `dangle` and dropped at the end of the function. A returned `&s` would point at freed memory. Return an owned `String`, or borrow from data the caller provides.',
  },
  {
    id: 'own-vec-push-1',
    categorySlug: 'ownership',
    title: 'Vec Reallocation',
    prompt: 'Why does this code fail to compile?',
    tags: ['ownership', 'borrowing', 'vec'],
    difficulty: 2,
    language: 'rust',
    code: `fn main() {
    let mut v = vec![1, 2, 3];
    let first = &v[0];
    v.push(4);
    println!("First element: {}", first);
}`,
    options: [
      { label: 'A', text: 'Capacity must be reserved before any element borrow' },
      { label: 'B', text: '`push` needs `&mut v` while `first` still borrows' },
      { label: 'C', text: 'Indexing consumes ownership of the whole `Vec`' },
      { label: 'D', text: '`push` only works when you still own the `Vec`' },
    ],
    correctIndex: 1,
    hint: '`push` may reallocate the buffer behind `first`.',
    explanation:
      '`first` immutably borrows into `v`. `v.push(4)` needs a mutable borrow and may reallocate, invalidating that reference. The borrow checker forbids mutable access while the immutable borrow is live.',
  },
  {
    id: 'own-partial-move-1',
    categorySlug: 'ownership',
    title: 'Partial Move',
    prompt: 'What happens when this code runs?',
    tags: ['ownership', 'move', 'struct'],
    difficulty: 2,
    language: 'rust',
    code: `struct Person {
    name: String,
    age: u32,
}

fn main() {
    let p = Person {
        name: String::from("Alice"),
        age: 30,
    };
    let name = p.name;
    println!("Age: {}", p.age);
}`,
    options: [
      { label: 'A', text: '`p.age` still works; that field was not moved' },
      { label: 'B', text: 'Any field access freezes the whole struct' },
      { label: 'C', text: 'Error: no field use after a partial move' },
      { label: 'D', text: 'Moving one field always moves every field' },
    ],
    correctIndex: 0,
    hint: 'Only the fields you move are gone; the rest stay usable.',
    explanation:
      'Moving `p.name` is a partial move: the whole `p` and `p.name` cannot be used again, but fields that were not moved stay usable. Here `p.age` still works (`u32` is also `Copy`, so reading it does not move it). Remaining non-`Copy` fields can still be moved out one by one.',
  },
  {
    id: 'own-clone-1',
    categorySlug: 'ownership',
    title: 'Clone vs Copy',
    prompt: 'What is the key difference shown here?',
    tags: ['ownership', 'clone', 'copy'],
    difficulty: 2,
    language: 'rust',
    code: `fn main() {
    let s1 = String::from("hello");
    let s2 = s1.clone();

    let x1 = 5;
    let x2 = x1;

    println!("{} {} {} {}", s1, s2, x1, x2);
}`,
    options: [
      { label: 'A', text: '`Copy` types are always faster than `Clone`' },
      { label: 'B', text: '`clone()` is explicit; `Copy` happens on assign' },
      { label: 'C', text: '`Clone` makes references; `Copy` duplicates bytes' },
      { label: 'D', text: '`Copy` only applies to values under 64 bytes' },
    ],
    correctIndex: 1,
    hint: 'One trait is opt-in via a method call.',
    explanation:
      '`Clone` requires an explicit `.clone()` call (and may allocate). `Copy` is implicit on assignment for types that implement it. There is no size cutoff in the language; `Copy` means bitwise copy is always valid and cheap enough to be implicit.',
  },
  {
    id: 'own-ref-lifetime-1',
    categorySlug: 'ownership',
    title: 'Reference Validity',
    prompt: 'Why does the compiler reject this code?',
    tags: ['ownership', 'borrowing', 'scope'],
    difficulty: 2,
    language: 'rust',
    code: `fn main() {
    let r;
    {
        let x = 5;
        r = &x;
    }
    println!("r: {}", r);
}`,
    options: [
      { label: 'A', text: 'References must be initialized when first declared' },
      { label: 'B', text: 'Inner scopes can never produce lasting references' },
      { label: 'C', text: '`x` is dropped at block end before `r` prints' },
      { label: 'D', text: 'Integer references must use the static lifetime' },
    ],
    correctIndex: 2,
    hint: 'A reference cannot outlive its referent.',
    explanation:
      '`x` lives only in the inner block. When that block ends, `x` is dropped, but `r` would still hold a reference to it. The borrow checker rejects this dangling reference.',
  },
  {
    id: 'own-mut-immut-1',
    categorySlug: 'ownership',
    title: 'Mixed Borrows',
    prompt: 'What borrowing rule prevents compilation?',
    tags: ['borrowing', 'mutability'],
    difficulty: 2,
    language: 'rust',
    code: `fn main() {
    let mut s = String::from("hello");
    let r1 = &s;
    let r2 = &s;
    let r3 = &mut s;
    println!("{}, {}, {}", r1, r2, r3);
}`,
    options: [
      { label: 'A', text: 'At most two references may exist per value' },
      { label: 'B', text: 'Shared and mutable borrows cannot overlap' },
      { label: 'C', text: 'Mutable borrows must be declared first always' },
      { label: 'D', text: '`String` requires every borrow to match kind' },
    ],
    correctIndex: 1,
    hint: 'Many `&T`, or one `&mut T`, not both.',
    explanation:
      'You may have multiple shared borrows or one mutable borrow, but not both at once. Here `r1`/`r2` and `r3` overlap at the `println!`, so the code is rejected.',
  },
  {
    id: 'own-return-move-1',
    categorySlug: 'ownership',
    title: 'Return Value Ownership',
    prompt: 'What is the ownership flow in this code?',
    tags: ['ownership', 'functions'],
    difficulty: 1,
    language: 'rust',
    code: `fn create_string() -> String {
    let s = String::from("hello");
    s
}

fn main() {
    let my_string = create_string();
    println!("{}", my_string);
}`,
    options: [
      { label: 'A', text: 'Return implicitly clones the local `String` value' },
      { label: 'B', text: 'Elision extends `s` past the function return site' },
      { label: 'C', text: 'Error: returning a moved local value is forbidden' },
      { label: 'D', text: 'Ownership moves from the function to the caller' },
    ],
    correctIndex: 3,
    hint: 'Returning by value is a move, not a borrow.',
    explanation:
      'Returning `s` transfers ownership to the caller. No clone or lifetime magic is required; this is the usual way to hand heap data out of a function.',
  },
  {
    id: 'own-slice-borrow-1',
    categorySlug: 'ownership',
    title: 'Slice Borrowing',
    prompt: 'Why does this function compile?',
    tags: ['borrowing', 'slices'],
    difficulty: 2,
    language: 'rust',
    code: `fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }
    &s[..]
}`,
    options: [
      { label: 'A', text: 'Slicing allocates a fresh owned substring' },
      { label: 'B', text: 'Returning `&str` moves ownership of that span' },
      { label: 'C', text: 'The output borrow is tied to input `s`' },
      { label: 'D', text: 'The compiler promotes the slice to `\'static`' },
    ],
    correctIndex: 2,
    hint: 'Elision links the returned `&str` to `s`.',
    explanation:
      'A `&str` is a borrowed view into existing UTF-8 data. Lifetime elision treats this as borrowing from `s`, so the returned slice cannot outlive that input. Nothing is cloned or promoted to `\'static`.',
  },
  {
    id: 'own-method-self-1',
    categorySlug: 'ownership',
    title: 'Method Receiver Types',
    prompt: 'What happens to `p` after calling `consume`?',
    tags: ['ownership', 'methods'],
    difficulty: 2,
    language: 'rust',
    code: `struct Point { x: i32, y: i32 }

impl Point {
    fn consume(self) {
        println!("({}, {})", self.x, self.y);
    }
}

fn main() {
    let p = Point { x: 0, y: 0 };
    p.consume();
    // use p here?
}`,
    options: [
      { label: 'A', text: '`Point` is `Copy`, so `p` stays usable' },
      { label: 'B', text: 'Methods always return `self` after they finish' },
      { label: 'C', text: '`self` only mutably borrows, leaving `p` valid' },
      { label: 'D', text: '`self` takes ownership, so `p` is moved' },
    ],
    correctIndex: 3,
    hint: '`self` vs `&self` vs `&mut self` differ.',
    explanation:
      'A `self` receiver consumes the value. `Point` does not implement `Copy` here (no `#[derive(Copy)]`), so `p` is moved into `consume` and cannot be used afterward. Use `&self`/`&mut self` to borrow instead.',
  },
  {
    id: 'own-tuple-move-1',
    categorySlug: 'ownership',
    title: 'Tuple Ownership',
    prompt: 'What is the ownership behavior in this code?',
    tags: ['ownership', 'move', 'tuple'],
    difficulty: 2,
    language: 'rust',
    code: `fn main() {
    let s = String::from("hello");
    let x = 5;
    let t = (s, x);

    println!("{}", t.1);
    // println!("{}", s);
}`,
    options: [
      { label: 'A', text: 'Tuples always clone every contained value' },
      { label: 'B', text: '`s` moves into `t`; `x` is copied in' },
      { label: 'C', text: 'Both `s` and `x` remain valid afterward' },
      { label: 'D', text: 'The tuple only stores shared references' },
    ],
    correctIndex: 1,
    hint: 'Each field follows its own move/`Copy` rules.',
    explanation:
      'Building `(s, x)` moves the non-`Copy` `String` and copies the `i32`. `s` is invalidated; `x` remains valid. `t.1` reads the copied integer inside the tuple.',
  },
  {
    id: 'own-ref-mut-scope-1',
    categorySlug: 'ownership',
    title: 'Mutable Reference Scope',
    prompt: 'Why does this code compile?',
    tags: ['borrowing', 'mutability', 'nll'],
    difficulty: 2,
    language: 'rust',
    code: `fn main() {
    let mut s = String::from("hello");

    let r1 = &mut s;
    r1.push_str(" world");

    let r2 = &mut s;
    r2.push_str("!");

    println!("{}", s);
}`,
    options: [
      { label: 'A', text: 'Each `&mut` ends before the next one starts' },
      { label: 'B', text: 'The compiler merges sequential `&mut` borrows' },
      { label: 'C', text: '`String` allows many overlapping `&mut` uses' },
      { label: 'D', text: 'Method calls convert `&mut` into owned values' },
    ],
    correctIndex: 0,
    hint: 'NLL ends a borrow at its last use.',
    explanation:
      'With non-lexical lifetimes, `r1`’s borrow ends after its last use (`push_str`), so `r2` can borrow mutably afterward. The mutable borrows never overlap in use, which satisfies the exclusivity rule.',
  },
  {
    id: 'own-drop-1',
    categorySlug: 'ownership',
    title: 'Drop Timing',
    prompt: 'When is `s`’s heap buffer freed?',
    tags: ['ownership', 'drop'],
    difficulty: 1,
    language: 'rust',
    code: `fn main() {
    let s = String::from("hello");
    println!("{s}");
} // <-- here?`,
    options: [
      { label: 'A', text: 'Immediately after `String::from` finishes' },
      { label: 'B', text: 'Only if you call `drop(s)` yourself explicitly' },
      { label: 'C', text: 'At process exit via a global garbage collector' },
      { label: 'D', text: 'When `main` returns and `s` goes out of scope' },
    ],
    correctIndex: 3,
    hint: 'Rust frees owned values deterministically.',
    explanation:
      'Ownership implies a single owner that runs `Drop` when the binding goes out of scope. For `String`, that frees the heap buffer at the end of `main` (unless moved earlier). There is no GC; `drop(s)` only forces an earlier drop.',
  },
  {
    id: 'own-box-1',
    categorySlug: 'ownership',
    title: 'Box Move',
    prompt: 'What happens to `b1` after this assignment?',
    tags: ['ownership', 'box', 'move'],
    difficulty: 2,
    language: 'rust',
    code: `fn main() {
    let b1 = Box::new(String::from("hi"));
    let b2 = b1;
    // println!("{b1}");
    println!("{b2}");
}`,
    options: [
      { label: 'A', text: '`Box` is `Copy`, so both bindings stay valid' },
      { label: 'B', text: 'Assignment clones the heap `String` automatically' },
      { label: 'C', text: 'Ownership of the `Box` moves; `b1` is invalid' },
      { label: 'D', text: '`b1` becomes a dangling raw pointer value' },
    ],
    correctIndex: 2,
    hint: '`Box<T>` owns heap data; it is not `Copy`.',
    explanation:
      '`Box<T>` is an owning pointer. Assigning `b2 = b1` moves that ownership so only one `Box` will free the allocation. `b1` cannot be used afterward; use `.clone()` if you need two owned boxes.',
  },
  {
    id: 'own-copy-drop-1',
    categorySlug: 'ownership',
    title: 'Copy and Drop',
    prompt: 'Why can’t a type implement both `Copy` and `Drop`?',
    tags: ['ownership', 'copy', 'drop'],
    difficulty: 3,
    language: 'rust',
    code: `// Illustrating the rule: this combination is rejected:
// #[derive(Copy, Clone)]
// struct Bad;
// impl Drop for Bad { fn drop(&mut self) {} }`,
    options: [
      { label: 'A', text: '`Copy` forbids any type larger than one word' },
      { label: 'B', text: '`Drop` only works for heap-allocated types' },
      { label: 'C', text: 'The traits conflict only inside `unsafe` blocks' },
      { label: 'D', text: '`Drop` needs unique ownership for cleanup' },
    ],
    correctIndex: 3,
    hint: 'Implicit copies would break unique cleanup.',
    explanation:
      '`Copy` means assignment duplicates the value freely. `Drop` runs cleanup for a unique owner. If both were allowed, copies could cause double-free or skipped cleanup. The language therefore forbids implementing both.',
  },
  {
    id: 'own-reassign-mut-1',
    categorySlug: 'ownership',
    title: 'Reassigning Owned Value',
    prompt: 'What happens to the first `String` here?',
    tags: ['ownership', 'drop', 'mut'],
    difficulty: 2,
    language: 'rust',
    code: `fn main() {
    let mut s = String::from("one");
    s = String::from("two");
    println!("{s}");
}`,
    options: [
      { label: 'A', text: 'Both strings stay alive until `main` ends' },
      { label: 'B', text: 'The first string leaks unless `drop` is called' },
      { label: 'C', text: 'Reassignment is a move from `s` into itself' },
      { label: 'D', text: 'The first value is dropped when overwritten' },
    ],
    correctIndex: 3,
    hint: 'A binding holds one owner at a time.',
    explanation:
      'Reassigning `s` drops the previous owned value before storing the new one. The `"one"` allocation is freed at the assignment; `"two"` is what `println!` sees. No leak occurs in safe code.',
  },
  {
    id: 'own-shadow-1',
    categorySlug: 'ownership',
    title: 'Shadowing vs Move',
    prompt: 'Why does the second `let s` compile after printing the `String`?',
    tags: ['ownership', 'shadowing'],
    difficulty: 2,
    language: 'rust',
    code: `fn main() {
    let s = String::from("hello");
    println!("{s}");
    let s = s.len();
    println!("{s}");
}`,
    options: [
      { label: 'A', text: '`len()` returns a borrow of the original `s`' },
      { label: 'B', text: 'Integers and strings share the same binding' },
      { label: 'C', text: 'Shadowing makes a new binding; old `s` ends' },
      { label: 'D', text: 'The first `s` is implicitly cloned into `len`' },
    ],
    correctIndex: 2,
    hint: '`let s = ...` again is not the same as `s = ...`.',
    explanation:
      'The second `let s` shadows the first. RHS runs first: `s.len()` borrows the `String` and yields a `usize`. Then the new `s` binding takes that `usize`, and the previous owned `String` is dropped. This is shadowing, not a move of `s` into an integer.',
  },
  {
    id: 'own-into-iter-1',
    categorySlug: 'ownership',
    title: 'Consuming Iteration',
    prompt: 'Why can’t `v` be used after this loop?',
    tags: ['ownership', 'move', 'iterators'],
    difficulty: 2,
    language: 'rust',
    code: `fn main() {
    let v = vec![1, 2, 3];
    for x in v {
        println!("{x}");
    }
    // println!("{:?}", v); // error
}`,
    options: [
      { label: 'A', text: '`for` loops freeze vectors until the process exits' },
      { label: 'B', text: '`println!` inside the loop deletes the binding `v`' },
      { label: 'C', text: 'Integers in vectors are not printable after moving' },
      { label: 'D', text: '`for` in `v` takes ownership via `IntoIterator`' },
    ],
    correctIndex: 3,
    hint: 'Compare `for x in v` with `for x in &v`.',
    explanation:
      '`for x in v` desugars to `IntoIterator::into_iter(v)`, which consumes the vector. Use `for x in &v` or `v.iter()` to borrow, or `iter_mut` to mutate in place.',
  },
  {
    id: 'own-mem-replace-1',
    categorySlug: 'ownership',
    title: 'mem::replace Pattern',
    prompt: 'What does `mem::replace` help you do?',
    tags: ['ownership', 'mem'],
    difficulty: 2,
    language: 'rust',
    code: `use std::mem;
let mut s = String::from("old");
let old = mem::replace(&mut s, String::from("new"));`,
    options: [
      { label: 'A', text: 'Move the old value out and store a valid replacement' },
      { label: 'B', text: 'Clone `s` twice so both names own identical buffers' },
      { label: 'C', text: 'Swap `s` with an uninitialized hole without a new value' },
      { label: 'D', text: 'Convert `&mut String` into an owned `String` by copy' },
    ],
    correctIndex: 0,
    hint: 'You cannot leave `&mut` pointing at moved-from junk.',
    explanation:
      '`mem::replace` moves the current value out of a mutable place and writes a new owned value in. That keeps the place valid while you take ownership of the previous contents, which is common when a field must stay initialized.',
  },
  {
    id: 'own-rc-vs-clone-1',
    categorySlug: 'ownership',
    title: 'Clone vs Share',
    prompt: 'When is `Rc` a better fit than `Clone` on a large value?',
    tags: ['ownership', 'rc', 'clone'],
    difficulty: 2,
    language: 'rust',
    code: `// Large tree or graph nodes shared by many owners`,
    options: [
      { label: 'A', text: 'When every owner must deep-copy the entire payload' },
      { label: 'B', text: 'When many owners should share one allocation cheaply' },
      { label: 'C', text: 'When the value must cross thread boundaries unsafely' },
      { label: 'D', text: 'When you want mutation without any synchronization' },
    ],
    correctIndex: 1,
    hint: '`Clone` duplicates; `Rc` shares.',
    explanation:
      '`Clone` creates another owned copy (often expensive). `Rc` (single-threaded) shares one allocation via reference counts. Cross-thread sharing needs `Arc`; shared mutation needs interior mutability.',
  },
  {
    id: 'own-partial-reborrow-1',
    categorySlug: 'ownership',
    title: 'Use After Partial Move',
    prompt: 'Why is `p.age` usable while `p` as a whole is not?',
    tags: ['ownership', 'partial-move'],
    difficulty: 2,
    language: 'rust',
    code: `struct Person {
    name: String,
    age: u32,
}

fn main() {
    let p = Person { name: "Ada".into(), age: 36 };
    let n = p.name;
    println!("{n}");
    println!("{}", p.age);
    // println!("{:?}", p); // error: partial move
}`,
    options: [
      { label: 'A', text: 'Partial moves are illegal; this example never compiles' },
      { label: 'B', text: '`age` is borrowed immutably for the rest of `main`' },
      { label: 'C', text: '`name` moved out; unmoved fields like `age` stay usable' },
      { label: 'D', text: '`Person` implements `Copy`, so moves never invalidate it' },
    ],
    correctIndex: 2,
    hint: 'Which fields still own their data?',
    explanation:
      'Moving `p.name` partially moves out of `p`. Fields that were not moved stay usable (`p.age` here; `u32` is also `Copy`). Using the whole `p` needs every field, including the moved `name`, so that is rejected. Other non-`Copy` fields could still be moved out separately.',
  },
  {
    id: 'own-drop-order-1',
    categorySlug: 'ownership',
    title: 'Local Drop Order',
    prompt: 'What does this program print?',
    tags: ['ownership', 'drop'],
    difficulty: 2,
    language: 'rust',
    code: `struct D(&'static str);
impl Drop for D {
    fn drop(&mut self) {
        println!("{}", self.0);
    }
}
fn main() {
    let a = D("first");
    let b = D("second");
}`,
    options: [
      { label: 'A', text: '`first` then `second` (declaration order)' },
      { label: 'B', text: '`second` then `first` (reverse order)' },
      { label: 'C', text: 'Only `second`; `a` is moved into `b`' },
      { label: 'D', text: 'Nothing; locals skip `Drop` until `exit`' },
    ],
    correctIndex: 1,
    hint: 'Locals and struct fields do not use the same drop order.',
    explanation:
      'When a block ends, locals are dropped in reverse declaration order, so `b` prints `second` then `a` prints `first` (Reference, Destructors). Struct fields, by contrast, drop in declaration order. Leading-underscore names still drop; only a wildcard `let _ = ...` drops immediately.',
  },
  {
    id: 'own-mem-take-1',
    categorySlug: 'ownership',
    title: 'mem::take and Default',
    prompt: 'What is true after `mem::take(&mut s)`?',
    tags: ['ownership', 'mem'],
    difficulty: 2,
    language: 'rust',
    code: `use std::mem;
fn main() {
    let mut s = String::from("hi");
    let old = mem::take(&mut s);
}`,
    options: [
      { label: 'A', text: '`s` is left uninitialized until the next write' },
      { label: 'B', text: '`s` still holds `"hi"`; `old` is only a clone' },
      { label: 'C', text: '`old` owns `"hi"`; `s` is `Default` (empty)' },
      { label: 'D', text: '`take` panics unless `s` implements `Copy`' },
    ],
    correctIndex: 2,
    hint: '`take` is `replace` with a `Default` value.',
    explanation:
      '`mem::take` moves the old value out and writes `T::default()` into the place, so `old` is `"hi"` and `s` is an empty `String`. The place stays valid; nothing is cloned, and `Copy` is not required (`String` is not `Copy`). Use `mem::replace` when the stand-in is not `Default`.',
  },
  {
    id: 'own-destructure-ref-mut-1',
    categorySlug: 'ownership',
    title: 'Disjoint Tuple Borrowing',
    prompt: 'What is the result of compiling and running this code?',
    tags: ['ownership', 'borrowing', 'destructuring'],
    difficulty: 2,
    language: 'rust',
    code: `fn main() {
    let mut pair = (String::from("a"), String::from("b"));
    let (ref mut x, ref y) = pair;
    x.push_str("!");
    println!("{x} and {y}");
}`,
    options: [
      { label: 'A', text: 'Fails to compile because mut and shared borrows overlap' },
      { label: 'B', text: 'Prints a! and b because tuple fields borrow disjointly' },
      { label: 'C', text: 'Fails because destructuring always moves tuple contents' },
      { label: 'D', text: 'Panics at runtime due to a simultaneous borrow conflict' },
    ],
    correctIndex: 1,
    hint: 'Check whether the two references point to the exact same field.',
    explanation:
      "Rust's borrow checker understands disjoint field access for tuples and structs. In `let (ref mut x, ref y) = pair`, `x` holds an exclusive reference to `pair.0` (`&mut pair.0`) and `y` holds a shared reference to `pair.1` (`&pair.1`). Because the borrows target separate fields, they do not conflict and both are valid.",
  },
  {
    id: 'own-drop-prevent-partial-move-1',
    categorySlug: 'ownership',
    title: 'Drop Prevents Partial Move',
    prompt: 'Why does moving `p.header` fail to compile?',
    tags: ['ownership', 'drop', 'move'],
    difficulty: 2,
    language: 'rust',
    code: `struct Packet {
    header: String,
    body: String,
}

impl Drop for Packet {
    fn drop(&mut self) {}
}

fn main() {
    let p = Packet {
        header: String::from("id:1"),
        body: String::from("data"),
    };
    let h = p.header;
    println!("{h}");
}`,
    options: [
      { label: 'A', text: 'A struct implementing Drop cannot have private fields' },
      { label: 'B', text: 'Fields of a struct with Drop are implicitly immutable' },
      { label: 'C', text: 'Types implementing Drop forbid moving out single fields' },
      { label: 'D', text: 'String fields inside structs with Drop must be pinned' },
    ],
    correctIndex: 2,
    hint: 'Types with custom destructors must remain whole when dropped.',
    explanation:
      'Rust forbids moving individual fields out of types that implement the `Drop` trait (compiler error `E0509`). Because `drop(&mut self)` is called on the entire instance when it goes out of scope, leaving partially-moved or uninitialized fields would violate memory safety. To extract a field from a `Drop` type, you must take it through `std::mem::replace`, `Option::take`, or drop the wrapper entirely.',
  },
  
  {
    id: "own-supporter-1",
    categorySlug: "ownership",
    title: "ManuallyDrop Destructure",
    prompt: "What happens to the heap allocation when `ManuallyDrop::new` drops?",
    tags: ["ownership","manually-drop","memory"],
    difficulty: 3,
    language: 'rust',
    code: "use std::mem::ManuallyDrop;\nfn main() {\n    let s = ManuallyDrop::new(String::from(\"rust\"));\n    let _ = s;\n}",
    options: [
      { label: 'A', text: "The String buffer is leaked without dropping memory" },
      { label: 'B', text: "The String destructor runs normally at scope exit" },
      { label: 'C', text: "The compiler moves the String into static storage" },
      { label: 'D', text: "ManuallyDrop panics if inner value is not taken" },
    ],
    correctIndex: 0,
    hint: "ManuallyDrop suppresses the automatic drop glue for the wrapped value.",
    explanation: "`ManuallyDrop<T>` inhibits the compiler from running the destructor of `T`. When `s` goes out of scope, its memory buffer is not freed unless `ManuallyDrop::drop(&mut s)` is called explicitly with `unsafe`.",
  },
  {
    id: "own-supporter-2",
    categorySlug: "ownership",
    title: "mem::swap Exclusive Borrows",
    prompt: "Why does `std::mem::swap` require mutable references to both arguments?",
    tags: ["ownership","mem","swap"],
    difficulty: 2,
    language: 'rust',
    code: "use std::mem;\nfn main() {\n    let mut x = String::from(\"a\");\n    let mut y = String::from(\"b\");\n    mem::swap(&mut x, &mut y);\n    println!(\"{x} {y}\");\n}",
    options: [
      { label: 'A', text: "Stack copy takes O(1) time; heap allocation takes O(N) time" },
      { label: 'B', text: "Stack copy takes O(N) time; heap allocation takes O(1) time" },
      { label: 'C', text: "Stack allocation requires synchronization; heap is lock-free" },
      { label: 'D', text: "Stack data uses dynamic sizing; heap data uses static sizing" },
    ],
    correctIndex: 1,
    hint: "Exchanging contents in-place requires writing new data into both places.",
    explanation: "`std::mem::swap` exchanges the values at two mutable locations by copying their bit patterns without running destructors. Exclusive `&mut` references ensure neither location is read or aliased during the swap.",
  },
  {
    id: "own-supporter-3",
    categorySlug: "ownership",
    title: "Array By-Value Iteration",
    prompt: "What happens to `arr` when iterating with `for item in arr` in Rust 2024?",
    tags: ["ownership","arrays","into-iterator"],
    difficulty: 2,
    language: 'rust',
    code: "fn main() {\n    let arr = [String::from(\"x\"), String::from(\"y\")];\n    for item in arr {\n        println!(\"{item}\");\n    }\n    // arr used here?\n}",
    options: [
      { label: 'A', text: "`arr` is borrowed immutably and remains valid after" },
      { label: 'B', text: "`arr` is converted into a dynamically sized slice in code" },
      { label: 'C', text: "`arr` ownership is fully moved into the loop scope" },
      { label: 'D', text: "`arr` elements are cloned; original array persists" },
    ],
    correctIndex: 2,
    hint: "In modern editions, [T; N] implements IntoIterator by value.",
    explanation: "In Rust 2021 and 2024 editions, `[T; N]` implements `IntoIterator` yielding owned `T` values. Calling `for item in arr` moves the elements out of `arr`, making `arr` unavailable after the loop.",
  },
  {
    id: "own-supporter-4",
    categorySlug: "ownership",
    title: "Temporary Drop in Let Statement",
    prompt: "When is the temporary `String::from(\"temp\")` dropped?",
    tags: ["ownership","temporaries","drop"],
    difficulty: 3,
    language: 'rust',
    code: "fn main() {\n    let _ref = &String::from(\"temp\").len();\n    println!(\"after let\");\n}",
    options: [
      { label: 'A', text: "At the end of the entire enclosing `main` block" },
      { label: 'B', text: "Immediately before the call to `.len()` starts" },
      { label: 'C', text: "During program termination inside static runtime" },
      { label: 'D', text: "At the end of the `let` statement on that line" },
    ],
    correctIndex: 3,
    hint: "Temporary lifetime extension only extends the value being directly borrowed.",
    explanation: "Because `_ref` borrows the returned `usize` from `.len()`, the temporary `String` is not extended and is dropped at the end of the statement before `\"after let\"` prints.",
  },
  {
    id: "own-supporter-5",
    categorySlug: "ownership",
    title: "Option::take in &mut Method",
    prompt: "How does `take()` allow modifying an owned value inside `&mut self`?",
    tags: ["ownership","option","take"],
    difficulty: 2,
    language: 'rust',
    code: "struct Worker {\n    task: Option<String>,\n}\n\nimpl Worker {\n    fn run(&mut self) {\n        if let Some(t) = self.task.take() {\n            println!(\"doing {t}\");\n        }\n    }\n}",
    options: [
      { label: 'A', text: "It leaves None in place while moving out inner task" },
      { label: 'B', text: "It creates a shallow copy of the underlying String in code" },
      { label: 'C', text: "It promotes the String to a static heap allocation in code" },
      { label: 'D', text: "It temporarily transmutes &mut self into owned self" },
    ],
    correctIndex: 0,
    hint: "Option::take replaces the value with None and returns the old value.",
    explanation: "`Option::take` replaces `self.task` with `None` and returns the `Some(String)` by value. This leaves `self.task` initialized while safely moving ownership out through `&mut self`.",
  },
  {
    id: "own-supporter-6",
    categorySlug: "ownership",
    title: "Pattern Match Guard and Ownership",
    prompt: "Why does moving a value inside a match guard cause a compiler error?",
    tags: ["ownership","match","guards"],
    difficulty: 3,
    language: 'rust',
    code: "fn check(opt: Option<String>) {\n    match opt {\n        Some(ref s) if s.len() > 2 => println!(\"large\"),\n        _ => (),\n    }\n}",
    options: [
      { label: 'A', text: "Match guards only allow calling pure constant functions" },
      { label: 'B', text: "Guards cannot move bound values because tests may fail" },
      { label: 'C', text: "Option pattern matches require references exclusively in code" },
      { label: 'D', text: "into_bytes is forbidden inside pattern match branches in code" },
    ],
    correctIndex: 1,
    hint: "If the guard condition evaluates to false, subsequent arms must still see a valid value.",
    explanation: "A pattern match guard cannot move values out of bindings because if the guard evaluates to `false`, matching continues to subsequent arms where the value must still be intact and initialized.",
  },
  {
    id: "own-supporter-7",
    categorySlug: "ownership",
    title: "Drop Order of Tuple Elements",
    prompt: "In what order are elements of a tuple dropped when the tuple goes out of scope?",
    tags: ["ownership","drop-order","tuples"],
    difficulty: 2,
    language: 'rust',
    code: "struct PrintOnDrop(&'static str);\nimpl Drop for PrintOnDrop {\n    fn drop(&mut self) { print!(\"{}\", self.0); }\n}\n\nfn main() {\n    let _tuple = (PrintOnDrop(\"A\"), PrintOnDrop(\"B\"));\n}",
    options: [
      { label: 'A', text: "Values move by default unless implementing `Copy`" },
      { label: 'B', text: "Values clone by default unless marked with `move`" },
      { label: 'C', text: "Primitive numbers require heap allocation pointers" },
      { label: 'D', text: "All variables share memory through reference counting" },
    ],
    correctIndex: 2,
    hint: "Struct fields and tuple elements drop in declaration order (first to last).",
    explanation: "In Rust, fields of structs and elements of tuples are dropped in order of declaration: index 0 then index 1 (`A` then `B`). In contrast, local variables in a block are dropped in reverse order.",
  },
  {
    id: "own-supporter-8",
    categorySlug: "ownership",
    title: "Partial Struct Move with Copy Fields",
    prompt: "Which fields remain usable after `let name = user.name;`?",
    tags: ["ownership","partial-move","copy"],
    difficulty: 2,
    language: 'rust',
    code: "struct User {\n    name: String,\n    age: u32,\n    active: bool,\n}\n\nfn main() {\n    let user = User { name: String::from(\"Ada\"), age: 36, active: true };\n    let name = user.name;\n    println!(\"age: {}, active: {}\", user.age, user.active);\n}",
    options: [
      { label: 'A', text: "No fields; moving one field invalidates the whole struct" },
      { label: 'B', text: "Only age; boolean fields are invalidated on partial move" },
      { label: 'C', text: "Only active; numeric fields are invalidated on move in code" },
      { label: 'D', text: "Both age and active; un-moved fields remain fully valid" },
    ],
    correctIndex: 3,
    hint: "Rust tracks partial moves on individual fields independently.",
    explanation: "When a struct is partially moved, un-moved fields (like `user.age` and `user.active`) remain completely accessible. The struct as a whole cannot be used, but individual untouched fields can.",
  },
  {
    id: "own-supporter-9",
    categorySlug: "ownership",
    title: "Destructuring with ref and Value",
    prompt: "Why does this pattern match succeed in compiling?",
    tags: ["ownership","pattern","ref"],
    difficulty: 2,
    language: 'rust',
    code: "fn main() {\n    let pair = (String::from(\"data\"), 42);\n    let (ref s, n) = pair;\n    println!(\"{s} has number {n}\");\n    println!(\"original string is still {}\", pair.0);\n}",
    options: [
      { label: 'A', text: "`pair.0` is borrowed via `ref s` while `pair.1` is copied" },
      { label: 'B', text: "`String` implements `Copy` inside tuple patterns during runtime execution" },
      { label: 'C', text: "Tuple destructuring creates clones of all elements in runtime memory" },
      { label: 'D', text: "The compiler promotes `pair` to static program heap in code" },
    ],
    correctIndex: 0,
    hint: "ref borrows the first element without moving ownership.",
    explanation: "`ref s` creates a shared reference `&pair.0` without moving the `String`. `n` copies the `i32` (`Copy`). Because `pair.0` was only borrowed and `pair.1` is `Copy`, `pair.0` remains usable.",
  },
  {
    id: "own-supporter-10",
    categorySlug: "ownership",
    title: "Box Move vs Box Clone",
    prompt: "What happens in memory when `let b2 = b1;` executes for a `Box<[u8; 1024]>`?",
    tags: ["ownership","box","move"],
    difficulty: 2,
    language: 'rust',
    code: "fn main() {\n    let b1 = Box::new([0u8; 1024]);\n    let b2 = b1;\n    println!(\"{}\", b2[0]);\n}",
    options: [
      { label: 'A', text: "1024 bytes are allocated on heap for a second buffer during execution" },
      { label: 'B', text: "Only the single pointer on stack is copied and moved" },
      { label: 'C', text: "1024 bytes are copied onto the stack frame directly in code" },
      { label: 'D', text: "Both b1 and b2 become shared references to the heap in code" },
    ],
    correctIndex: 1,
    hint: "Moving a Box only moves the stack-allocated pointer itself.",
    explanation: "`Box<T>` is a pointer to heap memory. Moving `b1` into `b2` copies only the pointer metadata (usize) on the stack and invalidates `b1`. The 1024-byte heap allocation is untouched.",
  },
  {
    id: "own-supporter-11",
    categorySlug: "ownership",
    title: "Drop Order in If-Let Statement",
    prompt: "When is the temporary value dropped in `if let Some(_) = make_temp() { ... }`?",
    tags: ["ownership","if-let","drop"],
    difficulty: 3,
    language: 'rust',
    code: "struct Logger(&'static str);\nimpl Drop for Logger {\n    fn drop(&mut self) { println!(\"drop {}\", self.0); }\n}\n\nfn make_temp() -> Option<Logger> { Some(Logger(\"guard\")) }\n\nfn main() {\n    if let Some(_) = make_temp() {\n        println!(\"inside body\");\n    }\n    println!(\"after if-let\");\n}",
    options: [
      { label: 'A', text: "Drop guard prints, then inside body, then after if-let during execution" },
      { label: 'B', text: "Inside body prints, then after if-let, then drop guard" },
      { label: 'C', text: "Inside body prints, then drop guard, then after if-let" },
      { label: 'D', text: "Drop guard is deferred until main function completes in code" },
    ],
    correctIndex: 2,
    hint: "The scrutinee temporary lives until the end of the entire if-let block expression.",
    explanation: "In `if let Some(_) = make_temp()`, the temporary `Option<Logger>` created as the scrutinee lives for the duration of the if-let expression. It is dropped after the block body finishes, before `\"after if-let\"`.",
  },
  {
    id: "own-supporter-12",
    categorySlug: "ownership",
    title: "mem::replace Return Semantics",
    prompt: "What value is stored in `prev` after `mem::replace(&mut count, 10)`?",
    tags: ["ownership","mem","replace"],
    difficulty: 2,
    language: 'rust',
    code: "use std::mem;\nfn main() {\n    let mut count = 5;\n    let prev = mem::replace(&mut count, 10);\n    println!(\"prev: {prev}, count: {count}\");\n}",
    options: [
      { label: 'A', text: "`prev` is 10 and `count` is 5 (values are cloned) in code" },
      { label: 'B', text: "`prev` is 10 and `count` is 10 (both are updated) in code" },
      { label: 'C', text: "`prev` is 5 and `count` is 5 (assignment is deferred)" },
      { label: 'D', text: "`prev` is 5 and `count` is 10 (old value returned)" },
    ],
    correctIndex: 3,
    hint: "mem::replace moves the new value in and returns the old value.",
    explanation: "`mem::replace(&mut dest, src)` writes `src` into `dest` and returns the previous value that was in `dest`. Here, `prev` receives 5 and `count` becomes 10.",
  },
  {
    id: "own-supporter-13",
    categorySlug: "ownership",
    title: "Partial Move in Pattern with Wildcard",
    prompt: "Why does `let (a, _) = pair;` allow `a` to move while ignoring the rest?",
    tags: ["ownership","patterns","wildcard"],
    difficulty: 2,
    language: 'rust',
    code: "fn main() {\n    let pair = (String::from(\"keep\"), String::from(\"discard\"));\n    let (a, _) = pair;\n    println!(\"{a}\");\n}",
    options: [
      { label: 'A', text: "`_` moves the second element and drops it immediately" },
      { label: 'B', text: "`_` prevents any allocation from occurring on stack in code" },
      { label: 'C', text: "`_` binds by reference without altering variable state" },
      { label: 'D', text: "`_` turns the entire tuple into a static reference in code" },
    ],
    correctIndex: 0,
    hint: "The wildcard pattern _ drops unmatched values immediately on binding.",
    explanation: "In pattern matching, `_` does not bind a variable name. The value corresponding to `_` is moved and dropped immediately, leaving `a` as the sole owned binding.",
  },
  {
    id: "own-supporter-14",
    categorySlug: "ownership",
    title: "Pass-by-Value vs Inherent Methods",
    prompt: "What happens when calling `fn consume(self)` on an uncopyable struct?",
    tags: ["ownership","methods","self"],
    difficulty: 2,
    language: 'rust',
    code: "struct Buffer(Vec<u8>);\n\nimpl Buffer {\n    fn consume(self) -> usize {\n        self.0.len()\n    }\n}\n\nfn main() {\n    let buf = Buffer(vec![1, 2, 3]);\n    let len = buf.consume();\n    println!(\"{len}\");\n    // buf.consume(); // error\n}",
    options: [
      { label: 'A', text: "Creates a deep copy of heap data and updates capacity pointers" },
      { label: 'B', text: "Creates a shallow bitwise copy of stack bytes with no heap work" },
      { label: 'C', text: "Transfers ownership and resets the source struct memory to zero" },
      { label: 'D', text: "Allocates a new vector on the thread-local heap allocation pool" },
    ],
    correctIndex: 1,
    hint: "Methods taking self by value take ownership of the receiver.",
    explanation: "Methods taking `self` (by value) move the receiver out of the caller. Once `buf.consume()` completes, `buf` is consumed and can no longer be used.",
  },
  {
    id: "own-supporter-15",
    categorySlug: "ownership",
    title: "Box Leak Lifetime",
    prompt: "What is the lifetime of the reference returned by `Box::leak`?",
    tags: ["ownership","box","leak"],
    difficulty: 2,
    language: 'rust',
    code: "fn main() {\n    let s = Box::new(String::from(\"immortal\"));\n    let r: &'static mut String = Box::leak(s);\n    r.push_str(\"!\");\n    println!(\"{r}\");\n}",
    options: [
      { label: 'A', text: "Tied to the lexical scope of the enclosing function in runtime memory" },
      { label: 'B', text: "An anonymous lifetime bounded by the thread runtime in runtime memory" },
      { label: 'C', text: "'static because the memory will never be freed automatically" },
      { label: 'D', text: "Invalid; Box::leak returns raw pointers instead of refs in code" },
    ],
    correctIndex: 2,
    hint: "Box::leak deliberately gives up ownership of the heap memory.",
    explanation: "`Box::leak` consumes the `Box` without running its destructor and yields a mutable reference with lifetime `'static` (`&'static mut T`), valid for the remaining duration of the program.",
  },
  {
    id: "own-supporter-16",
    categorySlug: "ownership",
    title: "Vec IntoIter Ownership",
    prompt: "What is yielded by `vec.into_iter()` when called on `Vec<String>`?",
    tags: ["ownership","vec","into-iter"],
    difficulty: 2,
    language: 'rust',
    code: "fn main() {\n    let items = vec![String::from(\"alpha\"), String::from(\"beta\")];\n    for item in items.into_iter() {\n        println!(\"{item}\");\n    }\n}",
    options: [
      { label: 'A', text: "Shared references `&String` borrowing the original vector" },
      { label: 'B', text: "Mutable references `&mut String` for in-place editing" },
      { label: 'C', text: "String slice views `&str` pointing to heap buffer in code" },
      { label: 'D', text: "Owned `String` values, consuming the original `items`" },
    ],
    correctIndex: 3,
    hint: "into_iter consumes the collection by value.",
    explanation: "`Vec::into_iter` consumes the vector by value and yields owned elements (`String`), transferring ownership of each element to the loop body.",
  },
  {
    id: "own-supporter-17",
    categorySlug: "ownership",
    title: "Reborrowing in Loop",
    prompt: "Why does reborrowing `&mut *slice` inside a loop compile without move errors?",
    tags: ["ownership","reborrow","loops"],
    difficulty: 3,
    language: 'rust',
    code: "fn modify(s: &mut [i32]) {\n    for _ in 0..3 {\n        let r = &mut *s;\n        r[0] += 1;\n    }\n}",
    options: [
      { label: 'A', text: "Reborrowing creates a temporary shorter borrow per iteration" },
      { label: 'B', text: "The compiler moves `s` into `r` and restores it on drop in code" },
      { label: 'C', text: "Mutable references implement Copy inside loop statements in code" },
      { label: 'D', text: "Loop iterations execute sequentially on distinct threads in code" },
    ],
    correctIndex: 0,
    hint: "Reborrowing &mut *s does not move the reference; it creates a shorter sub-borrow.",
    explanation: "In Rust, `&mut *s` reborrows from `s` for a shorter lifetime matching each loop iteration. Because the reborrow expires at the end of each iteration, `s` is available for the next iteration.",
  },
  {
    id: "own-supporter-18",
    categorySlug: "ownership",
    title: "Drop Flags in Stack Memory",
    prompt: "How does the runtime know whether `val` needs to be dropped after conditional moves?",
    tags: ["ownership","drop-flags","runtime"],
    difficulty: 3,
    language: 'rust',
    code: "fn process(cond: bool) {\n    let val = String::from(\"resource\");\n    if cond {\n        drop(val);\n    }\n    // runtime drop check here\n}",
    options: [
      { label: 'A', text: "It polls global memory allocators for allocation state during execution" },
      { label: 'B', text: "It checks runtime drop flags stored on the stack frame" },
      { label: 'C', text: "It executes both branches speculatively in CPU cache in code" },
      { label: 'D', text: "It queries operating system page tables on function exit" },
    ],
    correctIndex: 1,
    hint: "When moves are conditional, the compiler introduces hidden boolean stack flags.",
    explanation: "When a variable might or might not be moved based on runtime conditions (e.g. `if cond`), the compiler generates a hidden boolean drop flag on the stack frame to track initialization status.",
  },
  {
    id: "own-supporter-19",
    categorySlug: "ownership",
    title: "Cell Get and Set Semantics",
    prompt: "Why does `Cell<T>` require `T: Copy` for `cell.get()`?",
    tags: ["ownership","cell","copy"],
    difficulty: 2,
    language: 'rust',
    code: "use std::cell::Cell;\nfn main() {\n    let c = Cell::new(42);\n    let val = c.get();\n    println!(\"{val}\");\n}",
    options: [
      { label: 'A', text: "Cell wraps all contents in immutable shared atomic counters" },
      { label: 'B', text: "Primitive types are the only types supported by standard Cell" },
      { label: 'C', text: "Cell cannot return references and must copy the inner data" },
      { label: 'D', text: "Cell synchronizes memory access across multiple OS threads" },
    ],
    correctIndex: 2,
    hint: "Cell provides interior mutability without giving out references to its interior.",
    explanation: "`Cell<T>` never hands out references to its interior to avoid aliasing bugs. Therefore, `get()` must return an owned duplicate of `T`, requiring `T: Copy`. For non-`Copy` types, use `take()` or `replace()`.",
  },
  {
    id: "own-supporter-20",
    categorySlug: "ownership",
    title: "Underscore Variable Drop Timing",
    prompt: "What is the difference between `let _ = guard;` and `let _guard = guard;`?",
    tags: ["ownership","underscore","drop"],
    difficulty: 3,
    language: 'rust',
    code: "struct Guard;\nimpl Drop for Guard {\n    fn drop(&mut self) { println!(\"dropped\"); }\n}\n\nfn main() {\n    let _ = Guard; // line A\n    println!(\"middle\");\n    let _guard = Guard; // line B\n    println!(\"end\");\n}",
    options: [
      { label: 'A', text: "Both drop immediately on their respective declaration lines in code" },
      { label: 'B', text: "Both are deferred and drop at the end of main function in code" },
      { label: 'C', text: "`_` drops at scope end; `_guard` drops immediately on line B" },
      { label: 'D', text: "`_` drops immediately on line A; `_guard` drops at scope end" },
    ],
    correctIndex: 3,
    hint: "A wildcard let _ = expr does not bind a variable and drops the value immediately.",
    explanation: "`let _ = Guard` does not create a variable binding; the expression is evaluated and dropped immediately. In contrast, `let _guard = Guard` creates a named binding that lives until the end of the enclosing block.",
  },
  {
    id: "own-supporter-21",
    categorySlug: "ownership",
    title: "Option::unwrap_or vs unwrap_or_else",
    prompt: "Why does `opt.unwrap_or(make_default())` evaluate `make_default()` eagerly?",
    tags: ["ownership","option","evaluation"],
    difficulty: 2,
    language: 'rust',
    code: "fn make_default() -> String {\n    println!(\"computed\");\n    String::from(\"default\")\n}\n\nfn main() {\n    let opt = Some(String::from(\"val\"));\n    let _res = opt.unwrap_or(make_default());\n}",
    options: [
      { label: 'A', text: "Rust evaluates function arguments before entering the call" },
      { label: 'B', text: "Option methods are macros that expand expressions inline in code" },
      { label: 'C', text: "The compiler optimizes away branch conditions in release mode" },
      { label: 'D', text: "String construction is guaranteed to execute at compile time" },
    ],
    correctIndex: 0,
    hint: "unwrap_or takes a value directly, so the argument expression is evaluated before calling.",
    explanation: "Because `unwrap_or` takes `default: T` by value, the expression passed to it is evaluated eagerly before the method is called. To compute defaults lazily only when needed, use `unwrap_or_else(make_default)`.",
  },
  {
    id: "own-supporter-22",
    categorySlug: "ownership",
    title: "Disjoint Struct Field Mutation",
    prompt: "Can you mutably borrow `user.name` while holding an immutable borrow of `user.age`?",
    tags: ["ownership","borrow-checker","disjoint"],
    difficulty: 2,
    language: 'rust',
    code: "struct User {\n    name: String,\n    age: u32,\n}\n\nfn main() {\n    let mut u = User { name: String::from(\"Sam\"), age: 25 };\n    let age_ref = &u.age;\n    u.name.push_str(\"!\");\n    println!(\"{} is {}\", u.name, *age_ref);\n}",
    options: [
      { label: 'A', text: "No; borrowing any field exclusively borrows the entire struct in code" },
      { label: 'B', text: "Yes; the borrow checker allows disjoint borrows of struct fields" },
      { label: 'C', text: "No; age_ref is invalidated as soon as u is touched mutably in code" },
      { label: 'D', text: "Yes, but only if all struct fields implement the Copy trait in code" },
    ],
    correctIndex: 1,
    hint: "The borrow checker tracks distinct fields of local structs independently.",
    explanation: "Rust understands disjoint field access for local structs. Because `u.name` and `u.age` occupy distinct memory locations, an exclusive borrow of `u.name` does not conflict with a shared borrow of `u.age`.",
  },
  {
    id: "own-supporter-23",
    categorySlug: "ownership",
    title: "Moving Out of Deref Coercion",
    prompt: "Why is `let s = *box_ref;` rejected when `box_ref` is `&Box<String>`?",
    tags: ["ownership","deref","move"],
    difficulty: 3,
    language: 'rust',
    code: "fn extract(box_ref: &Box<String>) {\n    // let s: Box<String> = *box_ref; // compile error\n}",
    options: [
      { label: 'A', text: "Box pointers cannot be dereferenced with the * operator in code" },
      { label: 'B', text: "String requires manual free before moving its container in code" },
      { label: 'C', text: "Cannot move owned Box value out behind a shared reference" },
      { label: 'D', text: "Type inference cannot deduce the target type of dereference" },
    ],
    correctIndex: 2,
    hint: "You cannot move out of a place behind a shared reference.",
    explanation: "Dereferencing `&Box<String>` yields the owned `Box<String>`, but moving out of a shared reference (`&T`) is forbidden because the referent must remain valid for other readers. Clone or borrow instead.",
  },
  {
    id: "own-supporter-24",
    categorySlug: "ownership",
    title: "Ownership in Closure Captures",
    prompt: "What capture mode is used for `s` in `let c = || println!(\"{s}\");`?",
    tags: ["ownership","closures","capture"],
    difficulty: 2,
    language: 'rust',
    code: "fn main() {\n    let s = String::from(\"hello\");\n    let c = || println!(\"{s}\");\n    c();\n    println!(\"still valid: {s}\");\n}",
    options: [
      { label: 'A', text: "To prevent automatic stack deallocation on drop" },
      { label: 'B', text: "To force immediate memory deallocation on drop" },
      { label: 'C', text: "To reallocate the inner buffer on the system heap" },
      { label: 'D', text: "To convert the instance into a thread-safe mutex" },
    ],
    correctIndex: 3,
    hint: "Closures capture variables with the least restrictive mode required by their body.",
    explanation: "Because `println!(\"{s}\")` only needs read-only access to `s`, the closure captures `s` by shared reference `&s`. Thus `s` remains fully valid in `main` after calling `c()`.",
  },
  {
    id: "own-supporter-25",
    categorySlug: "ownership",
    title: "move Keyword on Closures",
    prompt: "How does adding the `move` keyword alter closure variable captures?",
    tags: ["ownership","closures","move"],
    difficulty: 2,
    language: 'rust',
    code: "fn main() {\n    let s = String::from(\"data\");\n    let c = move || println!(\"{s}\");\n    c();\n    // println!(\"{s}\"); // error: use of moved value\n}",
    options: [
      { label: 'A', text: "Forces all captured variables to be moved by value" },
      { label: 'B', text: "Allows the closure to mutate immutable outer bindings" },
      { label: 'C', text: "Promotes closure stack frames to the global heap in code" },
      { label: 'D', text: "Converts closure invocations into background threads" },
    ],
    correctIndex: 0,
    hint: "The move keyword forces ownership of referenced variables into the closure.",
    explanation: "The `move` keyword forces a closure to take ownership of all referenced outer variables by value (moving non-`Copy` types and copying `Copy` types), even if the body only reads them.",
  },
  {
    id: "own-supporter-26",
    categorySlug: "ownership",
    title: "Temporary Lifetime in Method Chain",
    prompt: "Why does `let bytes = String::from(\"hello\").as_bytes();` fail to compile?",
    tags: ["ownership","temporaries","borrow-checker"],
    difficulty: 2,
    language: 'rust',
    code: "fn main() {\n    // let bytes = String::from(\"hello\").as_bytes(); // error\n}",
    options: [
      { label: 'A', text: "`as_bytes()` requires a mutable reference to the String during execution" },
      { label: 'B', text: "The temporary String is dropped at end of the statement" },
      { label: 'C', text: "Byte slices are not allowed to be stored in local let bindings" },
      { label: 'D', text: "String literals cannot be converted directly into byte slices" },
    ],
    correctIndex: 1,
    hint: "The temporary String created on the right-hand side drops at the semicolon.",
    explanation: "`String::from(\"hello\")` is a temporary owned value that is dropped at the end of the `let` statement. The returned `&[u8]` slice would be left pointing to deallocated heap memory, causing a compiler error.",
  },
  {
    id: "own-supporter-27",
    categorySlug: "ownership",
    title: "Drop Trait on Generic Types",
    prompt: "When is `Drop::drop` executed for a generic container `Wrapper<T>`?",
    tags: ["ownership","drop","generics"],
    difficulty: 2,
    language: 'rust',
    code: "struct Wrapper<T>(T);\n\nimpl<T> Drop for Wrapper<T> {\n    fn drop(&mut self) {\n        println!(\"dropping wrapper\");\n    }\n}",
    options: [
      { label: 'A', text: "The inner `T` drops first, followed by `Wrapper::drop` in runtime memory" },
      { label: 'B', text: "Only `Wrapper::drop` runs; inner `T` is never dropped in runtime memory" },
      { label: 'C', text: "`Wrapper::drop` runs first, followed by the destructor of `T`" },
      { label: 'D', text: "`Wrapper::drop` only executes if `T` implements the Copy trait" },
    ],
    correctIndex: 2,
    hint: "Custom drop logic runs before fields are recursively dropped.",
    explanation: "When an instance of a type implementing `Drop` is destroyed, its `drop(&mut self)` method is executed first, and then the compiler automatically runs the destructors for all its individual fields.",
  },
  {
    id: "own-supporter-28",
    categorySlug: "ownership",
    title: "Destructuring Non-Copy Struct in Match",
    prompt: "What happens to `p` after `match p { Point { x, y } => ... }`?",
    tags: ["ownership","match","destructuring"],
    difficulty: 2,
    language: 'rust',
    code: "struct Point {\n    x: String,\n    y: String,\n}\n\nfn main() {\n    let p = Point { x: String::from(\"1\"), y: String::from(\"2\") };\n    match p {\n        Point { x, y } => println!(\"{x}, {y}\"),\n    }\n    // p used here?\n}",
    options: [
      { label: 'A', text: "`p` remains valid because matching creates temporary shared borrows" },
      { label: 'B', text: "`p` fields are cloned and original `p` remains untouched on stack" },
      { label: 'C', text: "`p` is promoted to a static heap reference by the compiler in runtime memory" },
      { label: 'D', text: "`p` is moved into `x` and `y`, making `p` unavailable after match" },
    ],
    correctIndex: 3,
    hint: "By-value pattern matching moves non-Copy fields out of the matched value.",
    explanation: "Matching `Point { x, y }` by value moves both `x` and `y` out of `p`. Because `String` is not `Copy`, `p` is fully consumed and cannot be used after the `match` block.",
  },
  {
    id: "own-supporter-29",
    categorySlug: "ownership",
    title: "Vec::retain Closure Ownership",
    prompt: "What type of closure parameter is passed to `Vec::retain`?",
    tags: ["ownership","vec","retain"],
    difficulty: 2,
    language: 'rust',
    code: "fn main() {\n    let mut vec = vec![1, 2, 3, 4];\n    vec.retain(|&x| x % 2 == 0);\n    println!(\"{vec:?}\");\n}",
    options: [
      { label: 'A', text: "A closure taking each item by reference `&T`" },
      { label: 'B', text: "A closure taking each item by value `T` in code" },
      { label: 'C', text: "A closure taking each item by exclusive ref `&mut T`" },
      { label: 'D', text: "A closure taking the entire vector by slice `&[T]`" },
    ],
    correctIndex: 0,
    hint: "Vec::retain calls its predicate with a shared reference &T to decide retention.",
    explanation: "`Vec::retain` takes `mut f: impl FnMut(&T) -> bool`. It passes a reference `&T` to the predicate so elements can be inspected without being moved out of the vector.",
  },
  {
    id: "own-supporter-30",
    categorySlug: "ownership",
    title: "ManuallyDrop::into_inner",
    prompt: "What does `ManuallyDrop::into_inner(slot)` return?",
    tags: ["ownership","manually-drop","inner"],
    difficulty: 3,
    language: 'rust',
    code: "use std::mem::ManuallyDrop;\n\nfn main() {\n    let slot = ManuallyDrop::new(String::from(\"data\"));\n    let value: String = ManuallyDrop::into_inner(slot);\n    println!(\"{value}\");\n}",
    options: [
      { label: 'A', text: "A shared reference to the inner value without moving in runtime memory" },
      { label: 'B', text: "The contained value by value, restoring normal drop semantics" },
      { label: 'C', text: "An unsafe raw pointer pointing to the heap buffer during runtime execution" },
      { label: 'D', text: "A cloned copy of the value while keeping slot alive in runtime memory" },
    ],
    correctIndex: 1,
    hint: "into_inner extracts the wrapped value out of the ManuallyDrop container.",
    explanation: "`ManuallyDrop::into_inner` consumes the `ManuallyDrop<T>` wrapper and extracts the contained `T` by value. Normal destructor semantics are restored for the returned value.",
  },
  {
    id: "own-supporter-31",
    categorySlug: "ownership",
    title: "Rc Clone vs Value Clone",
    prompt: "How does `rc.clone()` differ from `(*rc).clone()` for `Rc<Vec<u8>>`?",
    tags: ["ownership","rc","clone"],
    difficulty: 2,
    language: 'rust',
    code: "use std::rc::Rc;\nfn main() {\n    let data = Rc::new(vec![0u8; 10000]);\n    let shared = data.clone();\n    println!(\"{}\", Rc::strong_count(&shared));\n}",
    options: [
      { label: 'A', text: "`rc.clone()` duplicates the vector; `(*rc).clone()` increments count during execution" },
      { label: 'B', text: "Both expressions perform an identical deep copy of the buffer in runtime memory" },
      { label: 'C', text: "`rc.clone()` increments ref count; `(*rc).clone()` duplicates vector" },
      { label: 'D', text: "Both expressions only increment the reference counter by one in runtime memory" },
    ],
    correctIndex: 2,
    hint: "Calling clone directly on Rc copies the pointer and bumps the reference count.",
    explanation: "`Rc::clone(&rc)` (or `rc.clone()`) is a cheap pointer copy that increments the strong reference count. Dereferencing `(*rc).clone()` invokes `Vec::clone`, duplicating all 10,000 bytes on the heap.",
  },
  {
    id: "own-supporter-32",
    categorySlug: "ownership",
    title: "Temporary Lifetime Extension with ref",
    prompt: "Why does `let ref x = 5;` extend the temporary integer lifetime?",
    tags: ["ownership","temporaries","lifetime-extension"],
    difficulty: 2,
    language: 'rust',
    code: "fn main() {\n    let ref x = 5 + 5;\n    println!(\"{x}\");\n}",
    options: [
      { label: 'A', text: "Integers are automatically stored in static binary data in code" },
      { label: 'B', text: "The ref keyword converts numbers into heap allocations in code" },
      { label: 'C', text: "Primitive operations evaluate inside global compiler table" },
      { label: 'D', text: "Temporary lifetime extension keeps it alive for the block" },
    ],
    correctIndex: 3,
    hint: "Binding a temporary expression directly to a reference in a let statement extends its lifetime.",
    explanation: "When a temporary expression is directly bound by reference (`let ref x = ...` or `let x = &...`), Rust extends the temporary lifetime to match the scope of the enclosing block.",
  },
  {
    id: "own-supporter-33",
    categorySlug: "ownership",
    title: "Pattern Matching on Box<T>",
    prompt: "What happens when matching `box s` in `let box s = Box::new(String::from(\"a\"));`?",
    tags: ["ownership","box","pattern"],
    difficulty: 3,
    language: 'rust',
    code: "fn main() {\n    let b = Box::new(String::from(\"unboxed\"));\n    let s = *b;\n    println!(\"{s}\");\n}",
    options: [
      { label: 'A', text: "Dereferencing moves the String out and deallocates the Box" },
      { label: 'B', text: "The Box allocation remains alive as a dangling container in code" },
      { label: 'C', text: "String is copied bitwise without freeing the Box pointer in code" },
      { label: 'D', text: "Dereferencing an owned Box is forbidden in safe Rust code in code" },
    ],
    correctIndex: 0,
    hint: "Dereferencing an owned Box moves the inner value out and frees the Box box allocation.",
    explanation: "In safe Rust, `let s = *b;` on an owned `Box<T>` moves the `T` out of the box and immediately deallocates the heap pointer memory without running the destructor on `T` (which is now owned by `s`).",
  },
  {
    id: "own-supporter-34",
    categorySlug: "ownership",
    title: "Drop Guard in Panic Unwind",
    prompt: "Are local variable destructors guaranteed to run during normal panic unwinding?",
    tags: ["ownership","panic","unwind"],
    difficulty: 2,
    language: 'rust',
    code: "struct CleanUp;\nimpl Drop for CleanUp {\n    fn drop(&mut self) { println!(\"cleaned up\"); }\n}\n\nfn risky() {\n    let _guard = CleanUp;\n    panic!(\"boom\");\n}",
    options: [
      { label: 'A', text: "No; panics abort execution immediately without dropping" },
      { label: 'B', text: "Yes; stack unwinding drops locals in reverse order" },
      { label: 'C', text: "Only variables implementing the Copy trait are dropped" },
      { label: 'D', text: "Destructors run in parallel background worker threads" },
    ],
    correctIndex: 1,
    hint: "Under the default panic=unwind strategy, Rust walks the stack and runs destructors.",
    explanation: "When panic unwinding occurs (`panic = \"unwind\"`), Rust unwinds the stack frame by frame, running the destructors of all live local variables in reverse order of declaration.",
  },
  {
    id: "own-supporter-35",
    categorySlug: "ownership",
    title: "Option::as_deref Ownership",
    prompt: "What is the return type of `opt.as_deref()` when `opt` is `&Option<String>`?",
    tags: ["ownership","option","deref"],
    difficulty: 2,
    language: 'rust',
    code: "fn check(opt: &Option<String>) {\n    let view: Option<&str> = opt.as_deref();\n    if let Some(s) = view {\n        println!(\"{s}\");\n    }\n}",
    options: [
      { label: 'A', text: "`Option<String>` by cloning the inner string value in code" },
      { label: 'B', text: "`Option<&mut str>` for in-place string modification" },
      { label: 'C', text: "`Option<&str>` by dereferencing the inner `&String`" },
      { label: 'D', text: "`&Option<&str>` borrowing the outer option wrapper in code" },
    ],
    correctIndex: 2,
    hint: "as_deref converts Option<T> or &Option<T> to Option<&T::Target>.",
    explanation: "`Option::as_deref` converts `&Option<T>` (or `Option<T>`) into `Option<&T::Target>` by coercing the inner reference via `Deref`. For `String`, it returns `Option<&str>` without cloning or moving.",
  },
  {
    id: 'own-code-clone-vec',
    categorySlug: 'ownership',
    title: 'Duplicate Vector Elements',
    difficulty: 1,
    language: 'rust',
    kind: 'coding',
    tags: ['ownership', 'clone', 'coding'],
    prompt: 'Implement `duplicate_items` to take an owned `Vec<String>`, clone it, and return a tuple `(Vec<String>, Vec<String>)` containing both vectors.',
    code: `pub fn duplicate_items(v: Vec<String>) -> (Vec<String>, Vec<String>) {
    // TODO: Clone and return both
    todo!()
}`,
    testHarness: `{{SOLUTION}}

fn main() {
    let v = vec![String::from("a"), String::from("b")];
    let (v1, v2) = duplicate_items(v);
    assert_eq!(v1, vec!["a", "b"]);
    assert_eq!(v2, vec!["a", "b"]);
    println!("all tests passed");
}
`,
    hint: 'Use .clone() on the vector to duplicate its heap allocation.',
    explanation: 'Calling `v.clone()` creates an independent heap copy of the vector and its string elements, allowing you to return both the original owned vector and its clone.',
  },
  {
    id: 'own-code-take-ownership',
    categorySlug: 'ownership',
    title: 'Append Suffix in Place',
    difficulty: 1,
    language: 'rust',
    kind: 'coding',
    tags: ['ownership', 'string', 'coding'],
    prompt: 'Implement `append_suffix` taking an owned `String` and a string slice `&str`, appending the suffix to the string in-place, and returning the updated `String`.',
    code: `pub fn append_suffix(mut s: String, suffix: &str) -> String {
    // TODO: Append suffix and return s
    todo!()
}`,
    testHarness: `{{SOLUTION}}

fn main() {
    let s = String::from("Rust");
    let res = append_suffix(s, "acean");
    assert_eq!(res, "Rustacean");
    println!("all tests passed");
}
`,
    hint: 'Use s.push_str(suffix) on the mutable String.',
    explanation: 'Taking `mut s: String` by value allows in-place mutation without reallocating a new string if capacity allows, and returning it transfers ownership back to the caller.',
  },
  {
    id: 'own-code-swap-values',
    categorySlug: 'ownership',
    title: 'Swap Strings In-Place',
    difficulty: 1,
    language: 'rust',
    kind: 'coding',
    tags: ['ownership', 'mem', 'coding'],
    prompt: 'Implement `swap_strings` to swap the contents of two mutable `String` references without allocating or cloning.',
    code: `pub fn swap_strings(a: &mut String, b: &mut String) {
    // TODO: Swap contents in-place
    todo!()
}`,
    testHarness: `{{SOLUTION}}

fn main() {
    let mut s1 = String::from("left");
    let mut s2 = String::from("right");
    swap_strings(&mut s1, &mut s2);
    assert_eq!(s1, "right");
    assert_eq!(s2, "left");
    println!("all tests passed");
}
`,
    hint: 'Check std::mem::swap.',
    explanation: '`std::mem::swap` exchanges the values at two mutable locations safely without copying or allocating heap memory.',
  },
  {
    id: 'own-code-drain-filter',
    categorySlug: 'ownership',
    title: 'Retain Lower Numbers',
    difficulty: 2,
    language: 'rust',
    kind: 'coding',
    tags: ['ownership', 'vec', 'coding'],
    prompt: 'Implement `retain_below` to keep only elements strictly less than `threshold` in the given vector, modifying it in-place.',
    code: `pub fn retain_below(v: &mut Vec<i32>, threshold: i32) {
    // TODO: Retain elements < threshold
    todo!()
}`,
    testHarness: `{{SOLUTION}}

fn main() {
    let mut nums = vec![1, 5, 2, 8, 3, 10];
    retain_below(&mut nums, 5);
    assert_eq!(nums, vec![1, 2, 3]);
    println!("all tests passed");
}
`,
    hint: 'Vec::retain accepts a predicate closure.',
    explanation: '`Vec::retain` modifies the vector in-place by dropping elements for which the predicate returns false, shifting remaining items without allocating a new buffer.',
  },
  {
    id: 'own-code-option-take',
    categorySlug: 'ownership',
    title: 'Extract Option Value',
    difficulty: 1,
    language: 'rust',
    kind: 'coding',
    tags: ['ownership', 'option', 'coding'],
    prompt: 'Implement `extract_val` to take the value out of a mutable `Option<String>` reference using `.take()`, leaving `None` in its place.',
    code: `pub fn extract_val(opt: &mut Option<String>) -> Option<String> {
    // TODO: Take inner value out
    todo!()
}`,
    testHarness: `{{SOLUTION}}

fn main() {
    let mut item = Some(String::from("data"));
    let extracted = extract_val(&mut item);
    assert_eq!(extracted, Some(String::from("data")));
    assert_eq!(item, None);
    println!("all tests passed");
}
`,
    hint: 'Option::take leaves None in place of the taken value.',
    explanation: '`Option::take` extracts the owned `Some` value from a mutable reference and replaces the slot with `None`, avoiding ownership violation.',
  },
  {
    id: 'own-code-struct-destructure',
    categorySlug: 'ownership',
    title: 'Consume Struct and Extract Field',
    difficulty: 1,
    language: 'rust',
    kind: 'coding',
    tags: ['ownership', 'struct', 'coding'],
    prompt: 'Define a struct `User { pub name: String, pub age: u32 }` and implement `consume_user(user: User) -> (String, u32)` that consumes the struct by moving its fields.',
    code: `pub struct User {
    pub name: String,
    pub age: u32,
}

pub fn consume_user(user: User) -> (String, u32) {
    // TODO: Deconstruct and return tuple
    todo!()
}`,
    testHarness: `{{SOLUTION}}

fn main() {
    let u = User { name: String::from("Alice"), age: 30 };
    let (name, age) = consume_user(u);
    assert_eq!(name, "Alice");
    assert_eq!(age, 30);
    println!("all tests passed");
}
`,
    hint: 'Destructure the struct with (user.name, user.age).',
    explanation: 'Taking `User` by value allows moving its individual fields into a new tuple without requiring `Clone` or `Copy`.',
  },
  {
    id: 'own-box-leak-1',
    categorySlug: 'ownership',
    title: 'Box Leak Behavior',
    prompt: 'What happens to the heap allocation when `Box::leak(b)` is called?',
    tags: ['ownership', 'box', 'leak'],
    difficulty: 2,
    language: 'rust',
    code: `fn make_static(s: String) -> &'static str {
    let b = s.into_boxed_str();
    Box::leak(b)
}`,
    options: [
      { label: 'A', text: 'The heap memory is instantly deallocated and invalidated' },
      { label: 'B', text: 'The heap allocation is transferred to the OS thread pool' },
      { label: 'C', text: 'The heap buffer is leaked and never freed on scope exit' },
      { label: 'D', text: 'The box converts automatically into a static raw pointer' },
    ],
    correctIndex: 2,
    hint: 'Leaking gives up ownership and skips running the destructor.',
    explanation: '`Box::leak` consumes the `Box` and returns a mutable reference with `\'static` lifetime without dropping the allocated heap memory.',
  },
  {
    id: 'own-cow-clone-1',
    categorySlug: 'ownership',
    title: 'Cow Clone-on-Write Semantics',
    prompt: 'What is the primary ownership benefit of `std::borrow::Cow`?',
    tags: ['ownership', 'cow'],
    difficulty: 2,
    language: 'rust',
    options: [
      { label: 'A', text: 'It avoids heap allocation until mutation is needed' },
      { label: 'B', text: 'It enforces immutable thread-local caching on read' },
      { label: 'C', text: 'It converts borrowed string slices into static strings' },
      { label: 'D', text: 'It performs immediate deep cloning on initial creation' },
    ],
    correctIndex: 0,
    hint: 'Cow allows returning borrowed data or cloning lazily.',
    explanation: '`Cow` (Clone-on-Write) holds either borrowed data (`Cow::Borrowed`) or owned data (`Cow::Owned`), allocating only when modification (`to_mut()`) is required.',
  },
  {
    id: 'own-pin-drop-1',
    categorySlug: 'ownership',
    title: 'Pinning and Drop Guarantee',
    prompt: 'What guarantee does `Pin` enforce regarding value destruction?',
    tags: ['ownership', 'pin', 'drop'],
    difficulty: 3,
    language: 'rust',
    options: [
      { label: 'A', text: 'The pinned value cannot ever implement the `Drop` trait' },
      { label: 'B', text: 'The value is guaranteed to drop in a static background thread' },
      { label: 'C', text: 'The memory is immediately repurposed prior to destructor run' },
      { label: 'D', text: "The value's destructor is run before memory location is freed" },
    ],
    correctIndex: 3,
    hint: 'Memory of a pinned value cannot be reused before Drop completes.',
    explanation: 'The `Pin` drop guarantee ensures that once a value is pinned, its allocated memory will not be overwritten or reused until its `Drop` implementation is executed.',
  },
  {
    id: 'own-manually-drop-1',
    categorySlug: 'ownership',
    title: 'ManuallyDrop Wrapper',
    prompt: 'What is the behavior of a `ManuallyDrop<T>` when it goes out of scope?',
    tags: ['ownership', 'manually-drop'],
    difficulty: 2,
    language: 'rust',
    options: [
      { label: 'A', text: 'The compiler will panic at runtime on scope exit' },
      { label: 'B', text: 'The inner destructor is inhibited and not executed' },
      { label: 'C', text: 'The memory is bitwise zeroed out by the compiler' },
      { label: 'D', text: 'The wrapped instance is cloned to stack memory' },
    ],
    correctIndex: 1,
    hint: 'ManuallyDrop tells the compiler not to call drop automatically.',
    explanation: '`ManuallyDrop<T>` disables the automatic destructor call for `T` when the wrapper goes out of scope, leaving cleanup responsibility to the programmer.',
  },
  {
    id: 'own-slice-into-vec-1',
    categorySlug: 'ownership',
    title: 'Slice to Vector Conversion',
    prompt: 'How does `[T]::to_vec(&self)` manage memory when `T: Clone`?',
    tags: ['ownership', 'slice', 'vec'],
    difficulty: 1,
    language: 'rust',
    options: [
      { label: 'A', text: 'It reuses the slice capacity without allocation' },
      { label: 'B', text: 'It converts the reference into a fat raw pointer' },
      { label: 'C', text: 'It clones each item into a newly allocated vector' },
      { label: 'D', text: 'It borrows the underlying backing slice in-place' },
    ],
    correctIndex: 2,
    hint: 'Creating an owned Vec from a borrowed slice requires allocating.',
    explanation: '`to_vec` allocates a new `Vec<T>` on the heap and clones each element from the borrowed slice into the newly allocated buffer.',
  },
  {
    id: 'own-temp-val-drop-1',
    categorySlug: 'ownership',
    title: 'Temporary Value Scope',
    prompt: 'When are temporary values created inside an expression dropped by default?',
    tags: ['ownership', 'temporary', 'drop'],
    difficulty: 2,
    language: 'rust',
    options: [
      { label: 'A', text: 'At the end of the enclosing statement delimiter' },
      { label: 'B', text: 'At the exit point of the entire enclosing function' },
      { label: 'C', text: 'Immediately when the temporary is first evaluated' },
      { label: 'D', text: 'When the garbage collector sweeps unreferenced data' },
    ],
    correctIndex: 0,
    hint: 'Temporaries live until the semicolon of the enclosing statement.',
    explanation: 'In Rust, temporary values created within an expression are dropped at the end of the statement (the semicolon), unless extended by a `let` binding.',
  },
  {
    id: 'own-into-raw-leak-1',
    categorySlug: 'ownership',
    title: 'Box into_raw Ownership Transfer',
    prompt: 'What happens to ownership when calling `Box::into_raw(b)`?',
    tags: ['ownership', 'box', 'raw-pointers'],
    difficulty: 2,
    language: 'rust',
    options: [
      { label: 'A', text: 'The allocation is deallocated immediately on return' },
      { label: 'B', text: 'Ownership is transferred to the returned raw pointer' },
      { label: 'C', text: 'The pointer is wrapped in an atomic reference count' },
      { label: 'D', text: 'The compiler emits a dynamic stack memory warning' },
    ],
    correctIndex: 1,
    hint: 'into_raw consumes the Box without dropping the allocated heap memory.',
    explanation: '`Box::into_raw` consumes the `Box` and returns a raw pointer `*mut T`. The destructor is not run, transferring memory cleanup responsibility to the caller.',
  },
  {
    id: 'own-rc-try-unwrap-1',
    categorySlug: 'ownership',
    title: 'Rc try_unwrap Extraction',
    prompt: 'Under what condition does `Rc::try_unwrap(rc)` succeed in returning `Ok(T)`?',
    tags: ['ownership', 'rc', 'unwrap'],
    difficulty: 2,
    language: 'rust',
    options: [
      { label: 'A', text: 'It returns Ok(T) if strong_count is exactly 1' },
      { label: 'B', text: 'It clones the inner value if multiple handles exist' },
      { label: 'C', text: 'It converts the Rc pointer into an Arc thread handle' },
      { label: 'D', text: 'It resets the strong reference counter to zero value' },
    ],
    correctIndex: 0,
    hint: 'try_unwrap extracts the inner value only if no other strong references exist.',
    explanation: '`Rc::try_unwrap` returns `Ok(value)` if there is exactly one strong reference (strong count = 1), consuming the `Rc`. Otherwise, it returns `Err(rc)`.',
  },
  {
    id: 'own-box-from-raw-1',
    categorySlug: 'ownership',
    title: 'Box from_raw Safety Invariant',
    prompt: 'What safety invariant is required when calling `Box::from_raw(raw_ptr)`?',
    tags: ['ownership', 'box', 'from-raw', 'safety'],
    difficulty: 3,
    language: 'rust',
    options: [
      { label: 'A', text: 'It must be called on stack pointers allocated by let' },
      { label: 'B', text: 'It allocates a new Box buffer and copies raw bytes' },
      { label: 'C', text: 'The pointer must come from Box::into_raw with same type' },
      { label: 'D', text: 'It zeroes out the underlying memory buffer on entry' },
    ],
    correctIndex: 2,
    hint: 'from_raw reconstructs a Box from a pointer previously allocated via Box.',
    explanation: '`Box::from_raw` requires that the pointer was previously obtained from `Box::into_raw` with the matching allocator layout, alignment, and type `T`.',
  },
  {
    id: 'own-string-shrink-to-fit-1',
    categorySlug: 'ownership',
    title: 'String Capacity Shrinking',
    prompt: 'What does calling `s.shrink_to_fit()` do on an owned `String`?',
    tags: ['ownership', 'string', 'capacity'],
    difficulty: 1,
    language: 'rust',
    options: [
      { label: 'A', text: 'It clears all characters from the string buffer' },
      { label: 'B', text: 'It converts the string slice into a static literal' },
      { label: 'C', text: 'It forces the compiler to inline the heap buffer' },
      { label: 'D', text: 'It reduces buffer capacity to match current length' },
    ],
    correctIndex: 3,
    hint: 'shrink_to_fit requests the allocator to reclaim unused excess capacity.',
    explanation: '`shrink_to_fit()` requests the global allocator to reallocate the string\'s heap buffer to match its current length, releasing excess allocated capacity.',
  },
  {
    id: 'own-mem-take-default-1',
    categorySlug: 'ownership',
    title: 'std::mem::take Semantics',
    prompt: 'What is the behavior of `std::mem::take(&mut dest)` for a type implementing `Default`?',
    tags: ['ownership', 'mem', 'take'],
    difficulty: 2,
    language: 'rust',
    options: [
      { label: 'A', text: 'It replaces the destination with Default::default()' },
      { label: 'B', text: 'It zeroes out destination memory using byte writes' },
      { label: 'C', text: 'It clones the destination value into a new heap box' },
      { label: 'D', text: 'It marks the borrowed location as completely invalid' },
    ],
    correctIndex: 0,
    hint: 'mem::take replaces the value at a mutable reference with its default.',
    explanation: '`std::mem::take` moves the owned value out of `dest` and replaces it with `Default::default()`, leaving a valid value in the reference without allocating.',
  },
  {
    id: 'own-drop-glue-order-1',
    categorySlug: 'ownership',
    title: 'Struct Field Drop Order',
    prompt: 'In what order does Rust drop the individual fields of a struct when the struct is dropped?',
    tags: ['ownership', 'drop', 'fields'],
    difficulty: 2,
    language: 'rust',
    options: [
      { label: 'A', text: 'Struct fields are dropped in reverse definition order' },
      { label: 'B', text: 'Struct fields are dropped in arbitrary random order' },
      { label: 'C', text: 'Struct fields are dropped in direct declaration order' },
      { label: 'D', text: 'Struct fields are all dropped simultaneously in parallel' },
    ],
    correctIndex: 2,
    hint: 'Struct fields are dropped in the exact order they are declared in source code.',
    explanation: 'According to the Rust reference (§Destructors), the fields of a struct are dropped in declaration order (first field declared is dropped first).',
  },
]
