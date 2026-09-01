import { customAuth } from './customAuth'
import { isLocalDev } from './turnstile'
import type { AvatarConfig } from './avatar'

export type NoteCellType = 'markdown' | 'code'

export type NoteCell = {
  id: string
  type: NoteCellType
  content: string
  caption?: string
  language?: string
}

export type UserNote = {
  id: string
  author_id: string
  author_username: string
  author_avatar?: AvatarConfig | null
  slug: string
  title: string
  description: string
  is_public: boolean
  tags: string[]
  cells: NoteCell[]
  views_count: number
  runs_count: number
  forks_count: number
  created_at: string
  updated_at: string
}

export type NoteDraft = {
  title: string
  description: string
  is_public: boolean
  tags: string[]
  cells: NoteCell[]
}

export type NoteTemplate = {
  id: string
  name: string
  description: string
  tags: string[]
  draft: NoteDraft
}

const LOCAL_NOTES_KEY = 'cratery_local_user_notes'
const LOCAL_DRAFT_KEY = 'cratery_active_note_draft'

export async function incrementNoteViews(noteId: string): Promise<void> {
  void apiRequest('/api/notes/view', {
    method: 'POST',
    body: JSON.stringify({ id: noteId }),
  }).catch(() => {})
}

export async function incrementNoteRuns(noteId: string): Promise<void> {
  void apiRequest('/api/notes/run', {
    method: 'POST',
    body: JSON.stringify({ id: noteId }),
  }).catch(() => {})
}

export const NOTE_TEMPLATES: NoteTemplate[] = [
  {
    id: 'blank',
    name: 'Blank Interactive Note',
    description: 'A clean slate with a markdown heading and a runnable Rust snippet.',
    tags: ['playground', 'rust'],
    draft: {
      title: 'My Rust Interactive Note',
      description: 'An interactive exploration of Rust concepts with runnable code snippets.',
      is_public: true,
      tags: ['rust', 'playground'],
      cells: [
        {
          id: 'cell_m_1',
          type: 'markdown',
          content: `# My Rust Interactive Note\n\nWelcome to your **Cratery Interactive Note**! You can write explanations, formulas, code breakdowns, and embed **runnable Rust code cells**.\n\n### How to use this notebook:\n- Click **Run** on any code cell to compile and execute it inside the isolated microVM judge.\n- Use the toolbar below to add new **Markdown** or **Code** cells.\n- Toggle between **Edit** and **View** mode at any time.`,
        },
        {
          id: 'cell_c_1',
          type: 'code',
          content: `fn main() {\n    let message = "Hello from Cratery Interactive Notes!";\n    println!("🦀 {}", message);\n    \n    // Try modifying this loop and click Run!\n    for i in 1..=5 {\n        println!("Step {}: result = {}", i, i * 42);\n    }\n}`,
          caption: 'Interactive Entry Point',
          language: 'rust',
        },
      ],
    },
  },
  {
    id: 'ownership',
    name: 'Ownership & Borrowing Lab',
    description: 'Interactive walkthrough exploring move semantics, shared borrows, and exclusive mutability.',
    tags: ['ownership', 'borrow-checker', 'memory'],
    draft: {
      title: 'Mastering Rust Ownership & Borrowing',
      description: 'Hands-on interactive experiments exploring Rust move semantics and borrow checker rules.',
      is_public: true,
      tags: ['ownership', 'borrow-checker', 'memory'],
      cells: [
        {
          id: 'cell_m_1',
          type: 'markdown',
          content: `# Mastering Rust Ownership & Borrowing\n\nRust achieves memory safety without a garbage collector through its **Ownership Model**.\n\n### The 3 Core Rules:\n1. Each value in Rust has an **owner**.\n2. There can only be **one owner at a time**.\n3. When the owner goes out of scope, the value is automatically **dropped**.\n\nLet's test move semantics interactively:`,
        },
        {
          id: 'cell_c_1',
          type: 'code',
          content: `fn main() {\n    let s1 = String::from("cratery_data");\n    // Ownership of heap buffer moves from s1 to s2:\n    let s2 = s1;\n    \n    // Uncommenting the next line triggers compiler error E0382:\n    // println!("{}", s1);\n    \n    println!("s2 holds the owned string: {}", s2);\n}`,
          caption: 'Move Semantics Demonstration',
          language: 'rust',
        },
        {
          id: 'cell_m_2',
          type: 'markdown',
          content: `## Shared vs Exclusive Borrowing\n\nRust enforces the **Aliasing XOR Mutability** invariant at compile time:\n- You may have any number of shared references (\`&T\`), **OR**\n- Exactly one mutable reference (\`&mut T\`), but **never both simultaneously**.\n\nRun the cell below to see Non-Lexical Lifetimes (NLL) in action:`,
        },
        {
          id: 'cell_c_2',
          type: 'code',
          content: `fn main() {\n    let mut numbers = vec![10, 20, 30];\n    \n    // Shared borrow\n    let first = &numbers[0];\n    println!("First element is: {}", first);\n    // 'first' is not used after this point (NLL ends the borrow)\n    \n    // Now mutable borrow is permitted:\n    numbers.push(40);\n    println!("Updated vector: {:?}", numbers);\n}`,
          caption: 'Non-Lexical Lifetimes (NLL) with Vec',
          language: 'rust',
        },
      ],
    },
  },
  {
    id: 'concurrency',
    name: 'Fearless Concurrency Sandbox',
    description: 'Explore threads, message passing channels (mpsc), and shared state concurrency (Arc<Mutex<T>>).',
    tags: ['concurrency', 'threads', 'channels', 'mutex'],
    draft: {
      title: 'Fearless Concurrency with Threads & Channels',
      description: 'Hands-on multithreading experiments with thread::spawn, mpsc, and Arc<Mutex<T>>.',
      is_public: true,
      tags: ['concurrency', 'threads', 'channels'],
      cells: [
        {
          id: 'cell_m_1',
          type: 'markdown',
          content: `# Fearless Concurrency in Rust\n\nRust guarantees data-race freedom at compile time using the \`Send\` and \`Sync\` marker traits.\n\n### 1. Message Passing with Channels (\`mpsc\`)\nDo not communicate by sharing memory; instead, **share memory by communicating**.`,
        },
        {
          id: 'cell_c_1',
          type: 'code',
          content: `use std::sync::mpsc;\nuse std::thread;\n\nfn main() {\n    let (tx, rx) = mpsc::channel();\n    \n    let sender = thread::spawn(move || {\n        let msgs = vec!["chunk-alpha", "chunk-beta", "chunk-gamma"];\n        for msg in msgs {\n            tx.send(msg).unwrap();\n        }\n    });\n    \n    for received in rx {\n        println!("Worker received: {}", received);\n    }\n    \n    sender.join().unwrap();\n    println!("Channel processing complete.");\n}`,
          caption: 'MPSC Channel Pipeline',
          language: 'rust',
        },
        {
          id: 'cell_m_2',
          type: 'markdown',
          content: `### 2. Shared Mutable State with \`Arc<Mutex<T>>\`\nWhen multiple threads must mutate shared state concurrently, pair \`Arc\` (Atomic Reference Counted pointer) with \`Mutex\` (Mutual Exclusion lock).`,
        },
        {
          id: 'cell_c_2',
          type: 'code',
          content: `use std::sync::{Arc, Mutex};\nuse std::thread;\n\nfn main() {\n    let counter = Arc::new(Mutex::new(0));\n    let mut handles = vec![];\n    \n    for i in 0..8 {\n        let counter_clone = Arc::clone(&counter);\n        let handle = thread::spawn(move || {\n            let mut num = counter_clone.lock().unwrap();\n            *num += 1;\n            println!("Thread {} incremented counter to {}", i, *num);\n        });\n        handles.push(handle);\n    }\n    \n    for h in handles {\n        h.join().unwrap();\n    }\n    \n    println!("Final Counter Total: {}", *counter.lock().unwrap());\n}`,
          caption: '8 Concurrent Threads Incrementing Shared Mutex',
          language: 'rust',
        },
      ],
    },
  },
  {
    id: 'zero-cost-iterators',
    name: 'Zero-Cost Iterators & Pipelines',
    description: 'Master functional iterator combinators, lazy evaluation, zip, fold, and custom Iterator implementations.',
    tags: ['iterators', 'functional', 'performance'],
    draft: {
      title: 'Zero-Cost Iterators & Functional Pipelines',
      description: 'Deep dive into Rust iterator pipelines, lazy evaluation, and custom generator implementations with 0 runtime overhead.',
      is_public: true,
      tags: ['iterators', 'functional', 'performance'],
      cells: [
        {
          id: 'cell_m_1',
          type: 'markdown',
          content: `# Zero-Cost Iterators in Rust\n\nIn Rust, iterator combinators (\`map\`, \`filter\`, \`zip\`, \`fold\`) compile down to the same or even faster assembly than hand-written C \`for\` loops due to aggressive LLVM unrolling and vectorization.\n\n### Lazy Evaluation in Action\nIterators do nothing until consumed by an adapter like \`collect()\` or \`sum()\`.`,
        },
        {
          id: 'cell_c_1',
          type: 'code',
          content: `fn main() {\n    let numbers = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\n\n    // Lazy iterator pipeline: filtered and mapped with zero heap allocations\n    let sum_of_even_squares: i32 = numbers\n        .iter()\n        .filter(|&&x| x % 2 == 0)\n        .map(|&x| x * x)\n        .sum();\n\n    println!("Sum of even squares (2² + 4² + 6² + 8² + 10²): {}", sum_of_even_squares);\n    assert_eq!(sum_of_even_squares, 4 + 16 + 36 + 64 + 100);\n}`,
          caption: 'Functional Iterator Pipeline',
          language: 'rust',
        },
        {
          id: 'cell_m_2',
          type: 'markdown',
          content: `## Implementing Custom Iterators\n\nImplementing the \`Iterator\` trait only requires providing a single method: \`fn next(&mut self) -> Option<Self::Item>\`.\n\nAll other combinators (\`take\`, \`skip\`, \`enumerate\`, \`filter\`) are provided for free by the standard library!`,
        },
        {
          id: 'cell_c_2',
          type: 'code',
          content: `struct Fibonacci {\n    curr: u64,\n    next: u64,\n}\n\nimpl Fibonacci {\n    fn new() -> Self {\n        Self { curr: 0, next: 1 }\n    }\n}\n\nimpl Iterator for Fibonacci {\n    type Item = u64;\n\n    fn next(&mut self) -> Option<Self::Item> {\n        let new_next = self.curr + self.next;\n        let output = self.curr;\n        self.curr = self.next;\n        self.next = new_next;\n        Some(output)\n    }\n}\n\nfn main() {\n    let first_ten: Vec<u64> = Fibonacci::new().take(10).collect();\n    println!("First 10 Fibonacci numbers: {:?}", first_ten);\n    assert_eq!(first_ten, vec![0, 1, 1, 2, 3, 5, 8, 13, 21, 34]);\n}`,
          caption: 'Custom Fibonacci Generator Iterator',
          language: 'rust',
        },
      ],
    },
  },
  {
    id: 'smart-pointers-memory',
    name: 'Smart Pointers & Interior Mutability',
    description: 'Explore heap allocation with Box<T>, multiple ownership with Rc<T>, and RefCell<T> dynamic borrow checking.',
    tags: ['smart-pointers', 'memory', 'interior-mutability'],
    draft: {
      title: 'Smart Pointers & Interior Mutability Internals',
      description: 'Hands-on exploration of Box<T>, Rc<T>, and RefCell<T> patterns with runtime borrow check rules.',
      is_public: true,
      tags: ['smart-pointers', 'memory', 'interior-mutability'],
      cells: [
        {
          id: 'cell_m_1',
          type: 'markdown',
          content: `# Smart Pointers: Reference Counting (\`Rc<T>\`)\n\nWhen a single value needs to have multiple owners across your data structures, use \`std::rc::Rc\` (Reference Counted pointer).\n\n\`Rc<T>\` keeps track of the number of active references to determine when memory can be safely dropped.`,
        },
        {
          id: 'cell_c_1',
          type: 'code',
          content: `use std::rc::Rc;\n\n#[derive(Debug)]\nenum List {\n    Cons(i32, Rc<List>),\n    Nil,\n}\n\nuse List::{Cons, Nil};\n\nfn main() {\n    let tail = Rc::new(Cons(10, Rc::new(Nil)));\n    println!("Tail initial strong reference count: {}", Rc::strong_count(&tail));\n\n    let list_a = Cons(3, Rc::clone(&tail));\n    println!("Count after list_a references tail: {}", Rc::strong_count(&tail));\n\n    let list_b = Cons(4, Rc::clone(&tail));\n    println!("Count after list_b references tail: {}", Rc::strong_count(&tail));\n\n    println!("List A: {:?}", list_a);\n    println!("List B: {:?}", list_b);\n}`,
          caption: 'Multiple Shared Ownership with Rc<T>',
          language: 'rust',
        },
        {
          id: 'cell_m_2',
          type: 'markdown',
          content: `## Interior Mutability with \`RefCell<T>\`\n\n\`RefCell<T>\` moves the borrow rules from **compile time to runtime**.\n\nIt allows mutating data even when there are immutable references to that data:`,
        },
        {
          id: 'cell_c_2',
          type: 'code',
          content: `use std::cell::RefCell;\n\nstruct Logger {\n    logs: RefCell<Vec<String>>,\n}\n\nimpl Logger {\n    fn new() -> Self {\n        Self { logs: RefCell::new(vec![]) }\n    }\n\n    // Notice &self is immutable, yet we append logs via interior mutability:\n    fn log(&self, msg: &str) {\n        self.logs.borrow_mut().push(msg.to_string());\n    }\n\n    fn print_all(&self) {\n        for (i, entry) in self.logs.borrow().iter().enumerate() {\n            println!("[Log #{}] {}", i + 1, entry);\n        }\n    }\n}\n\nfn main() {\n    let logger = Logger::new();\n    logger.log("Kernel booted.");\n    logger.log("Jailer initialized isolated microVM.");\n    logger.log("Execution completed with status AC.");\n\n    logger.print_all();\n}`,
          caption: 'RefCell Interior Mutability Logger',
          language: 'rust',
        },
      ],
    },
  },
  {
    id: 'error-handling-idioms',
    name: 'Idiomatic Error Handling & Results',
    description: 'Learn Result<T, E>, Option<T>, the ? try operator, combinators, and custom domain error hierarchies.',
    tags: ['errors', 'result', 'option', 'idioms'],
    draft: {
      title: 'Idiomatic Error Handling with Result & Option',
      description: 'Master error propagation with the ? operator, match expressions, and typed domain error enums.',
      is_public: true,
      tags: ['errors', 'result', 'option'],
      cells: [
        {
          id: 'cell_m_1',
          type: 'markdown',
          content: `# Idiomatic Error Handling in Rust\n\nRust does not have exceptions. Instead, recoverable errors are represented with \`Result<T, E>\` and missing values with \`Option<T>\`.\n\n### Propagating Errors with the \`?\` Operator\nThe \`?\` operator automatically returns early with \`Err(e)\` if the operation failed, or unwraps \`Ok(v)\` to continue execution.`,
        },
        {
          id: 'cell_c_1',
          type: 'code',
          content: `#[derive(Debug, PartialEq)]\nenum MathError {\n    DivisionByZero,\n    NegativeSquareRoot,\n}\n\nfn safe_divide(numerator: f64, denominator: f64) -> Result<f64, MathError> {\n    if denominator == 0.0 {\n        Err(MathError::DivisionByZero)\n    } else {\n        Ok(numerator / denominator)\n    }\n}\n\nfn safe_sqrt(value: f64) -> Result<f64, MathError> {\n    if value < 0.0 {\n        Err(MathError::NegativeSquareRoot)\n    } else {\n        Ok(value.sqrt())\n    }\n}\n\n// Chaining operations using the ? operator\nfn calculate_hypotenuse_ratio(a: f64, b: f64, divisor: f64) -> Result<f64, MathError> {\n    let sum_of_squares = a * a + b * b;\n    let hypotenuse = safe_sqrt(sum_of_squares)?;\n    let ratio = safe_divide(hypotenuse, divisor)?;\n    Ok(ratio)\n}\n\nfn main() {\n    match calculate_hypotenuse_ratio(3.0, 4.0, 2.0) {\n        Ok(res) => println!("Hypotenuse ratio: {:.2}", res),\n        Err(err) => println!("Calculation failed: {:?}", err),\n    }\n\n    assert_eq!(calculate_hypotenuse_ratio(3.0, 4.0, 0.0), Err(MathError::DivisionByZero));\n}`,
          caption: 'Error Propagation Pipeline with ?',
          language: 'rust',
        },
        {
          id: 'cell_m_2',
          type: 'markdown',
          content: `## Functional Option & Result Combinators\n\nAvoid nested \`match\` blocks by using expressive combinators like \`map\`, \`and_then\`, and \`unwrap_or_default\`.`,
        },
        {
          id: 'cell_c_2',
          type: 'code',
          content: `fn find_first_even_double(items: &[i32]) -> Option<i32> {\n    items.iter().find(|&&x| x % 2 == 0).map(|&x| x * 2)\n}\n\nfn main() {\n    let dataset1 = [1, 3, 5, 8, 9];\n    let dataset2 = [1, 3, 5, 7];\n\n    println!("Dataset 1 even double: {:?}", find_first_even_double(&dataset1));\n    println!("Dataset 2 even double: {:?}", find_first_even_double(&dataset2));\n\n    assert_eq!(find_first_even_double(&dataset1), Some(16));\n    assert_eq!(find_first_even_double(&dataset2), None);\n}`,
          caption: 'Option Combinators',
          language: 'rust',
        },
      ],
    },
  },
  {
    id: 'unsafe-ffi-systems',
    name: 'Unsafe Rust & C FFI Interoperability',
    description: 'Learn foreign function interface (FFI) bindings, raw pointers, #[repr(C)] memory layouts, and safe abstractions.',
    tags: ['unsafe', 'ffi', 'systems', 'c-interop'],
    draft: {
      title: 'Unsafe Rust & C FFI Interoperability Guide',
      description: 'Interactive guide on binding C foreign functions, raw pointer manipulation, and designing zero-cost safe wrappers.',
      is_public: true,
      tags: ['unsafe', 'ffi', 'systems'],
      cells: [
        {
          id: 'cell_m_1',
          type: 'markdown',
          content: `# Unsafe Rust & C Standard Library FFI\n\nRust can seamlessly invoke foreign C functions and export Rust functions to C with zero overhead.\n\n### Calling C Standard Library Functions\nDeclare foreign functions inside an \`unsafe extern "C"\` block:`,
        },
        {
          id: 'cell_c_1',
          type: 'code',
          content: `unsafe extern "C" {\n    // Declarations from C standard library libc\n    fn abs(x: i32) -> i32;\n}\n\nfn main() {\n    let val = -42;\n    let absolute = unsafe { abs(val) };\n    println!("C standard library abs({}) = {}", val, absolute);\n    assert_eq!(absolute, 42);\n}`,
          caption: 'C Standard Library FFI Call',
          language: 'rust',
        },
        {
          id: 'cell_m_2',
          type: 'markdown',
          content: `## Memory Layouts & \`#[repr(C)]\`\n\nBy default, the Rust compiler is free to reorder struct fields to minimize padding. When communicating across FFI boundaries, attach \`#[repr(C)]\` to guarantee C-compatible layout in memory.`,
        },
        {
          id: 'cell_c_2',
          type: 'code',
          content: `#[repr(C)]\n#[derive(Debug, PartialEq, Clone, Copy)]\npub struct Point {\n    pub x: f64,\n    pub y: f64,\n}\n\n#[unsafe(no_mangle)]\npub extern "C" fn point_distance_squared(p1: Point, p2: Point) -> f64 {\n    let dx = p1.x - p2.x;\n    let dy = p1.y - p2.y;\n    dx * dx + dy * dy\n}\n\nfn main() {\n    let a = Point { x: 0.0, y: 0.0 };\n    let b = Point { x: 3.0, y: 4.0 };\n\n    let dist_sq = point_distance_squared(a, b);\n    println!("Squared distance between {:?} and {:?} = {}", a, b, dist_sq);\n    assert_eq!(dist_sq, 25.0);\n}`,
          caption: 'C ABI Struct and Exported Function',
          language: 'rust',
        },
      ],
    },
  },
  {
    id: 'traits-generics-polymorphism',
    name: 'Traits, Generics & Dynamic Dispatch',
    description: 'Compare static dispatch (monomorphization) with dynamic dispatch (&dyn Trait vtables), associated types, and marker traits.',
    tags: ['traits', 'generics', 'polymorphism', 'architecture'],
    draft: {
      title: 'Traits, Generics & Dynamic Dispatch Architecture',
      description: 'Explore static monomorphization vs dynamic trait objects (dyn Trait) and clean software architecture in Rust.',
      is_public: true,
      tags: ['traits', 'generics', 'polymorphism'],
      cells: [
        {
          id: 'cell_m_1',
          type: 'markdown',
          content: `# Traits & Static Dispatch (Monomorphization)\n\nTraits define shared behavior across types. When you use generics like \`fn process<T: Summary>(item: &T)\`, the compiler generates specialized, optimized machine code for each concrete type (Static Dispatch).`,
        },
        {
          id: 'cell_c_1',
          type: 'code',
          content: `trait Summary {\n    fn summarize(&self) -> String;\n}\n\nstruct Article {\n    title: String,\n    author: String,\n}\n\nimpl Summary for Article {\n    fn summarize(&self) -> String {\n        format!("'{}' by {}", self.title, self.author)\n    }\n}\n\nstruct Tweet {\n    username: String,\n    content: String,\n}\n\nimpl Summary for Tweet {\n    fn summarize(&self) -> String {\n        format!("@{}: {}", self.username, self.content)\n    }\n}\n\n// Static dispatch via generics (monomorphized at compile time with 0 runtime overhead)\nfn print_summary_static<T: Summary>(item: &T) {\n    println!("Static dispatch: {}", item.summarize());\n}\n\nfn main() {\n    let article = Article {\n        title: String::from("Rust 2026 Edition Advances"),\n        author: String::from("Ferris"),\n    };\n    let tweet = Tweet {\n        username: String::from("rustlang"),\n        content: String::from("Excited for fearless concurrency!"),\n    };\n\n    print_summary_static(&article);\n    print_summary_static(&tweet);\n}`,
          caption: 'Static Dispatch Monomorphization',
          language: 'rust',
        },
        {
          id: 'cell_m_2',
          type: 'markdown',
          content: `## Dynamic Dispatch with Trait Objects (\`&dyn Trait\`)\n\nWhen you need heterogeneous collections (e.g. a UI canvas holding buttons, text inputs, and sliders in a single \`Vec\`), use dynamic dispatch with Trait Objects.`,
        },
        {
          id: 'cell_c_2',
          type: 'code',
          content: `trait Renderer {\n    fn render(&self) -> String;\n}\n\nstruct Button { label: String }\nimpl Renderer for Button {\n    fn render(&self) -> String {\n        format!("[ Button: {} ]", self.label)\n    }\n}\n\nstruct TextBox { placeholder: String }\nimpl Renderer for TextBox {\n    fn render(&self) -> String {\n        format!("[ Input: {}... ]", self.placeholder)\n    }\n}\n\n// Dynamic dispatch using trait objects (&dyn Trait with vtable lookup)\nfn render_ui_screen(widgets: &[&dyn Renderer]) {\n    println!("--- UI Canvas ---");\n    for (i, w) in widgets.iter().enumerate() {\n        println!("Widget #{}: {}", i + 1, w.render());\n    }\n}\n\nfn main() {\n    let btn = Button { label: String::from("Submit Solution") };\n    let input = TextBox { placeholder: String::from("Type your answer") };\n\n    let screen: Vec<&dyn Renderer> = vec![&btn, &input];\n    render_ui_screen(&screen);\n}`,
          caption: 'Heterogeneous Dynamic Trait Objects',
          language: 'rust',
        },
      ],
    },
  },
]

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T & { error?: string }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const token = customAuth.getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(path, { ...options, headers })
  const data = (await response.json().catch(() => ({}))) as T & { error?: string }
  if (!response.ok && !data.error) data.error = `Request failed (${response.status})`
  return data
}


function getLocalNotes(): UserNote[] {
  try {
    const raw = localStorage.getItem(LOCAL_NOTES_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  return []
}

function saveLocalNotes(notes: UserNote[]): void {
  try {
    localStorage.setItem(LOCAL_NOTES_KEY, JSON.stringify(notes))
  } catch {
    /* ignore */
  }
}

export async function listCommunityNotes(params?: {
  q?: string
  tag?: string
  sort?: 'newest' | 'popular'
}): Promise<UserNote[]> {
  let notesFromApi: UserNote[] = []

  try {
    const query = new URLSearchParams()
    if (params?.q) query.set('q', params.q)
    if (params?.tag) query.set('tag', params.tag)
    if (params?.sort) query.set('sort', params.sort)

    const res = await apiRequest<{ status: string; notes?: UserNote[] }>(
      `/api/notes?${query.toString()}`
    )
    if (res.notes && Array.isArray(res.notes)) {
      notesFromApi = res.notes.map((n) => ({
        ...n,
        views_count: Number(n.views_count) || 0,
        runs_count: Number(n.runs_count) || 0,
        forks_count: Number(n.forks_count) || 0,
      }))
    }
  } catch {
    /* fallback */
  }

  
  const local = getLocalNotes()
    .filter((n) => n.is_public)
    .map((n) => ({
      ...n,
      views_count: Number(n.views_count) || 0,
      runs_count: Number(n.runs_count) || 0,
      forks_count: Number(n.forks_count) || 0,
    }))

  const templateNotes: UserNote[] = NOTE_TEMPLATES.map((tmpl) => {
    const now = new Date().toISOString()
    return {
      id: `template-${tmpl.id}`,
      author_id: 'cratery-team',
      author_username: 'Cratery Core',
      slug: `cratery-${tmpl.id}`,
      title: tmpl.draft.title,
      description: tmpl.draft.description,
      is_public: true,
      tags: tmpl.draft.tags,
      cells: tmpl.draft.cells,
      views_count: 0,
      runs_count: 0,
      forks_count: 0,
      created_at: now,
      updated_at: now,
    }
  })

  const combined = notesFromApi.length > 0 ? notesFromApi : [...local, ...templateNotes]

  if (params?.q) {
    const q = params.q.toLowerCase()
    return combined.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q))
    )
  }
  if (params?.tag) {
    const tag = params.tag.toLowerCase()
    return combined.filter((n) => n.tags.some((t) => t.toLowerCase() === tag))
  }
  return combined
}


export async function listMyNotes(): Promise<UserNote[]> {
  if (!isLocalDev) {
    try {
      const res = await apiRequest<{ status: string; notes?: UserNote[] }>('/api/notes?mine=true')
      if (res.notes && Array.isArray(res.notes)) {
        return res.notes.map((n) => ({
          ...n,
          views_count: Number(n.views_count) || 0,
          runs_count: Number(n.runs_count) || 0,
          forks_count: Number(n.forks_count) || 0,
        }))
      }
    } catch {
      /* fallback */
    }
  }

  const currentUser = customAuth.getUser()
  const local = getLocalNotes()
  const filtered = isLocalDev
    ? local
    : currentUser
      ? local.filter((n) => n.author_id === currentUser.id)
      : []
  return filtered.map((n) => ({
    ...n,
    views_count: Number(n.views_count) || 0,
    runs_count: Number(n.runs_count) || 0,
    forks_count: Number(n.forks_count) || 0,
  }))
}


export async function getNote(idOrSlug: string): Promise<UserNote | null> {
  try {
    const res = await apiRequest<{ status: string; note?: UserNote }>(
      `/api/notes/${encodeURIComponent(idOrSlug)}`
    )
    if (res.note) {
      void incrementNoteViews(res.note.id)
      return {
        ...res.note,
        views_count: (Number(res.note.views_count) || 0) + 1,
        runs_count: Number(res.note.runs_count) || 0,
        forks_count: Number(res.note.forks_count) || 0,
      }
    }
  } catch {
    /* fallback */
  }

  
  const local = getLocalNotes()
  const foundLocal = local.find((n) => n.id === idOrSlug || n.slug === idOrSlug)
  if (foundLocal) {
    foundLocal.views_count += 1
    saveLocalNotes(local)
    return {
      ...foundLocal,
      views_count: Number(foundLocal.views_count) || 0,
      runs_count: Number(foundLocal.runs_count) || 0,
      forks_count: Number(foundLocal.forks_count) || 0,
    }
  }

  
  const foundTemplate = NOTE_TEMPLATES.find(
    (t) => `template-${t.id}` === idOrSlug || `cratery-${t.id}` === idOrSlug || t.id === idOrSlug
  )
  if (foundTemplate) {
    const now = new Date().toISOString()
    return {
      id: `template-${foundTemplate.id}`,
      author_id: 'cratery-team',
      author_username: 'Cratery Core',
      slug: `cratery-${foundTemplate.id}`,
      title: foundTemplate.draft.title,
      description: foundTemplate.draft.description,
      is_public: true,
      tags: foundTemplate.draft.tags,
      cells: foundTemplate.draft.cells,
      views_count: 0,
      runs_count: 0,
      forks_count: 0,
      created_at: now,
      updated_at: now,
    }
  }

  return null
}


export async function createNote(
  draft: NoteDraft
): Promise<{ ok: boolean; note?: UserNote; error?: string }> {
  const currentUser = customAuth.getUser()

  if (!isLocalDev) {
    if (!currentUser) {
      return { ok: false, error: 'You must be signed in to create and share interactive notes.' }
    }
    try {
      const res = await apiRequest<{ status: string; note?: UserNote; error?: string }>('/api/notes', {
        method: 'POST',
        body: JSON.stringify(draft),
      })

      if (res.note) {
        clearActiveNoteDraft()
        return { ok: true, note: res.note }
      }
      if (res.error) {
        return { ok: false, error: res.error }
      }
    } catch (err: unknown) {
      console.warn('Backend note creation failed, saving locally:', err)
    }
  }

  const newNote: UserNote = {
    id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    author_id: currentUser ? currentUser.id : 'local-user',
    author_username: currentUser ? currentUser.username : 'You (Local)',
    author_avatar: null,
    slug:
      draft.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') + `-${Math.random().toString(36).slice(2, 6)}`,
    title: draft.title,
    description: draft.description,
    is_public: draft.is_public,
    tags: draft.tags,
    cells: draft.cells,
    views_count: 1,
    runs_count: 0,
    forks_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const existing = getLocalNotes()
  existing.unshift(newNote)
  saveLocalNotes(existing)
  clearActiveNoteDraft()

  return { ok: true, note: newNote }
}


export async function updateNote(
  id: string,
  draft: Partial<NoteDraft>
): Promise<{ ok: boolean; note?: UserNote; error?: string }> {
  try {
    const res = await apiRequest<{ status: string; note?: UserNote; error?: string }>('/api/notes', {
      method: 'PUT',
      body: JSON.stringify({ id, ...draft }),
    })

    if (res.note) return { ok: true, note: res.note }
    if (res.error) return { ok: false, error: res.error }
  } catch {
    /* fallback */
  }

  const existing = getLocalNotes()
  const idx = existing.findIndex((n) => n.id === id)
  if (idx !== -1) {
    existing[idx] = {
      ...existing[idx],
      ...draft,
      updated_at: new Date().toISOString(),
    }
    saveLocalNotes(existing)
    return { ok: true, note: existing[idx] }
  }

  return { ok: false, error: 'Note not found to update' }
}


export async function deleteNote(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await apiRequest<{ status: string; error?: string }>(
      `/api/notes?id=${encodeURIComponent(id)}`,
      { method: 'DELETE' }
    )
    if (res.status === 'ok') return { ok: true }
    if (res.error) return { ok: false, error: res.error }
  } catch {
    /* fallback */
  }

  const existing = getLocalNotes().filter((n) => n.id !== id)
  saveLocalNotes(existing)
  return { ok: true }
}


export async function forkNote(
  noteId: string
): Promise<{ ok: boolean; note?: UserNote; error?: string }> {
  const currentUser = customAuth.getUser()

  if (!isLocalDev) {
    if (!currentUser) {
      return { ok: false, error: 'Sign in to fork notes into your workspace.' }
    }
    try {
      const res = await apiRequest<{ status: string; note?: UserNote; error?: string }>(
        '/api/notes/fork',
        {
          method: 'POST',
          body: JSON.stringify({ note_id: noteId }),
        }
      )
      if (res.note) return { ok: true, note: res.note }
      if (res.error) {
        const errLower = res.error.toLowerCase()
        if (
          errLower.includes('limit') ||
          errLower.includes('sign in') ||
          errLower.includes('private') ||
          errLower.includes('authorized')
        ) {
          return { ok: false, error: res.error }
        }
      }
    } catch {
      /* fallback */
    }
  }

  const source = await getNote(noteId)
  if (!source) return { ok: false, error: 'Source note not found' }

  return await createNote({
    title: `Fork of ${source.title}`.slice(0, 140),
    description: source.description || '',
    is_public: false,
    tags: source.tags || [],
    cells: (source.cells || []).map((c, idx) => ({
      ...c,
      id: `cell_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 6)}`,
    })),
  })
}


export function saveActiveNoteDraft(draft: NoteDraft): void {
  try {
    localStorage.setItem(LOCAL_DRAFT_KEY, JSON.stringify(draft))
  } catch {
    /* ignore */
  }
}

export function loadActiveNoteDraft(): NoteDraft | null {
  try {
    const raw = localStorage.getItem(LOCAL_DRAFT_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  return null
}

export function clearActiveNoteDraft(): void {
  try {
    localStorage.removeItem(LOCAL_DRAFT_KEY)
  } catch {
    /* ignore */
  }
}
