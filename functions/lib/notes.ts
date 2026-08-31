import { createSupabaseClient, type Env } from './supabase'
import { getSessionUser } from './session'
import { corsHeaders } from './cors'
import { consumeRateLimit, getClientIP } from './rateLimit'
import { trackCodeExecution } from './executionStats'

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
    author_username?: string
    author_avatar?: unknown
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

export const BUILTIN_NOTE_TEMPLATES: Array<{
    id: string
    title: string
    description: string
    tags: string[]
    cells: NoteCell[]
}> = [
    {
        id: 'blank',
        title: 'My Rust Interactive Note',
        description: 'An interactive exploration of Rust concepts with runnable code snippets.',
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
    {
        id: 'ownership',
        title: 'Mastering Rust Ownership & Borrowing',
        description: 'Hands-on interactive experiments exploring Rust move semantics and borrow checker rules.',
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
    {
        id: 'concurrency',
        title: 'Fearless Concurrency with Threads & Channels',
        description: 'Hands-on multithreading experiments with thread::spawn, mpsc, and Arc<Mutex<T>>.',
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
    {
        id: 'zero-cost-iterators',
        title: 'Zero-Cost Iterators & Functional Pipelines',
        description: 'Deep dive into Rust iterator pipelines, lazy evaluation, and custom generator implementations with 0 runtime overhead.',
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
    {
        id: 'smart-pointers-memory',
        title: 'Smart Pointers & Interior Mutability Internals',
        description: 'Hands-on exploration of Box<T>, Rc<T>, and RefCell<T> patterns with runtime borrow check rules.',
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
    {
        id: 'error-handling-idioms',
        title: 'Idiomatic Error Handling with Result & Option',
        description: 'Master error propagation with the ? operator, match expressions, and typed domain error enums.',
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
    {
        id: 'unsafe-ffi-systems',
        title: 'Unsafe Rust & C FFI Interoperability Guide',
        description: 'Interactive guide on binding C foreign functions, raw pointer manipulation, and designing zero-cost safe wrappers.',
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
    {
        id: 'traits-generics-polymorphism',
        title: 'Traits, Generics & Dynamic Dispatch Architecture',
        description: 'Explore static monomorphization vs dynamic trait objects (dyn Trait) and clean software architecture in Rust.',
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
]

export function findBuiltinNoteTemplate(idOrSlug: string) {
    const clean = idOrSlug.trim().toLowerCase()
    return (
        BUILTIN_NOTE_TEMPLATES.find(
            (t) =>
                t.id === clean ||
                `template-${t.id}` === clean ||
                `cratery-${t.id}` === clean
        ) || null
    )
}

function jsonResponse(data: unknown, status = 200, env?: Env, request?: Request, extraHeaders?: HeadersInit): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            ...(env ? corsHeaders(env, request) : { 'Content-Type': 'application/json' }),
            ...extraHeaders,
        },
    })
}

function errorResponse(message: string, status = 400, env?: Env, request?: Request): Response {
    return jsonResponse({ status: 'error', error: message }, status, env, request)
}

function slugify(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .slice(0, 50)
        .replace(/^-+|-+$/g, '') || 'untitled-note'
}


export async function handleListNotes(request: Request, env: Env): Promise<Response> {
    const supabase = createSupabaseClient(env)
    const url = new URL(request.url)
    const isMine = url.searchParams.get('mine') === 'true'
    const searchQuery = url.searchParams.get('q')?.trim().toLowerCase()
    const tagFilter = url.searchParams.get('tag')?.trim().toLowerCase()
    const sort = url.searchParams.get('sort') || 'newest'
    const limit = Math.min(Math.max(1, parseInt(url.searchParams.get('limit') || '30', 10)), 100)

    if (isMine) {
        const user = await getSessionUser(request, env)
        if (!user) {
            return errorResponse('Authentication required to view your notes', 401, env, request)
        }

        const { data, error } = await supabase
            .from('user_notes')
            .select(`
                id, author_id, slug, title, description, is_public, tags, cells, views_count, runs_count, forks_count, created_at, updated_at,
                profiles:author_id (username, avatar)
            `)
            .eq('author_id', user.id)
            .order('updated_at', { ascending: false })
            .limit(limit)

        if (error) {
            return errorResponse(error.message, 500, env, request)
        }

        const notes = (data || []).map((row: any) => {
            return {
                ...row,
                views_count: Number(row.views_count) || 0,
                runs_count: Number(row.runs_count) || 0,
                forks_count: Number(row.forks_count) || 0,
                author_username: row.profiles?.username || user.username || 'rustacean',
                author_avatar: row.profiles?.avatar || null,
            }
        })

        return jsonResponse({ status: 'ok', notes }, 200, env, request)
    }

    
    let query = supabase
        .from('user_notes')
        .select(`
            id, author_id, slug, title, description, is_public, tags, cells, views_count, runs_count, forks_count, created_at, updated_at,
            profiles:author_id (username, avatar)
        `)
        .eq('is_public', true)

    if (tagFilter) {
        query = query.contains('tags', [tagFilter])
    }

    if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
    }

    if (sort === 'popular' || sort === 'views') {
        query = query.order('views_count', { ascending: false }).order('created_at', { ascending: false })
    } else {
        query = query.order('created_at', { ascending: false })
    }

    const { data, error } = await query.limit(limit)

    if (error) {
        return errorResponse(error.message, 500, env, request)
    }

    const notes = (data || []).map((row: any) => {
        return {
            ...row,
            views_count: Number(row.views_count) || 0,
            runs_count: Number(row.runs_count) || 0,
            forks_count: Number(row.forks_count) || 0,
            author_username: row.profiles?.username || 'rustacean',
            author_avatar: row.profiles?.avatar || null,
        }
    })

    return jsonResponse({ status: 'ok', notes }, 200, env, request)
}


export async function handleGetNote(request: Request, env: Env): Promise<Response> {
    const supabase = createSupabaseClient(env)
    const url = new URL(request.url)
    const idOrSlug = url.pathname.split('/').pop() || url.searchParams.get('id') || ''

    if (!idOrSlug) {
        return errorResponse('Note ID or slug required', 400, env, request)
    }

    const user = await getSessionUser(request, env)

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug)

    let query = supabase
        .from('user_notes')
        .select(`
            id, author_id, slug, title, description, is_public, tags, cells, views_count, runs_count, forks_count, created_at, updated_at,
            profiles:author_id (username, avatar)
        `)

    if (isUuid) {
        query = query.eq('id', idOrSlug)
    } else {
        query = query.eq('slug', idOrSlug)
    }

    const { data, error } = await query.maybeSingle()

    if (!error && data) {
        
        if (!data.is_public && (!user || user.id !== data.author_id)) {
            return errorResponse('This note is private', 403, env, request)
        }

        
        if (data.is_public) {
            void supabase.rpc('increment_note_views', { p_note_id: data.id })
        }

        const note = {
            ...data,
            views_count: (Number(data.views_count) || 0) + 1,
            runs_count: Number(data.runs_count) || 0,
            forks_count: Number(data.forks_count) || 0,
            author_username: (data as any).profiles?.username || 'rustacean',
            author_avatar: (data as any).profiles?.avatar || null,
        }

        return jsonResponse({ status: 'ok', note }, 200, env, request)
    }

    
    const tmpl = findBuiltinNoteTemplate(idOrSlug)
    if (tmpl) {
        const now = new Date().toISOString()
        return jsonResponse(
            {
                status: 'ok',
                note: {
                    id: `template-${tmpl.id}`,
                    author_id: 'cratery-team',
                    author_username: 'Cratery Core',
                    slug: `cratery-${tmpl.id}`,
                    title: tmpl.title,
                    description: tmpl.description,
                    is_public: true,
                    tags: tmpl.tags,
                    cells: tmpl.cells,
                    views_count: 0,
                    runs_count: 0,
                    forks_count: 0,
                    created_at: now,
                    updated_at: now,
                },
            },
            200,
            env,
            request
        )
    }

    return errorResponse('Note not found', 404, env, request)
}


export async function handleIncrementNoteViews(request: Request, env: Env): Promise<Response> {
    const supabase = createSupabaseClient(env)
    let body: any
    try {
        body = await request.json()
    } catch {
        return errorResponse('Invalid JSON body', 400, env, request)
    }

    const id = typeof body.id === 'string' ? body.id : ''
    if (!id) return errorResponse('Note ID required', 400, env, request)

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
    if (isUuid) {
        void supabase.rpc('increment_note_views', { p_note_id: id })
    }

    return jsonResponse({ status: 'ok' }, 200, env, request)
}


export async function handleIncrementNoteRuns(request: Request, env: Env): Promise<Response> {
    const supabase = createSupabaseClient(env)
    let body: any
    try {
        body = await request.json()
    } catch {
        return errorResponse('Invalid JSON body', 400, env, request)
    }

    const id = typeof body.id === 'string' ? body.id : ''
    if (!id) return errorResponse('Note ID required', 400, env, request)

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
    if (isUuid) {
        void supabase.rpc('increment_note_runs', { p_note_id: id })
    }

    trackCodeExecution(env)

    return jsonResponse({ status: 'ok' }, 200, env, request)
}


export async function handleCreateNote(request: Request, env: Env): Promise<Response> {
    const supabase = createSupabaseClient(env)
    const user = await getSessionUser(request, env)

    if (!user) {
        return errorResponse('Authentication required to create a note', 401, env, request)
    }

    const ip = getClientIP(request)
    const rateLimited = await consumeRateLimit(env, `note-create:${user.id}:${ip}`, 20, 3600)
    if (!rateLimited) {
        return errorResponse('Creation rate limit exceeded. Please wait a bit.', 429, env, request)
    }

    
    const maxNotebooks = 50
    const { count, error: countError } = await supabase
        .from('user_notes')
        .select('id', { count: 'exact', head: true })
        .eq('author_id', user.id)

    if (!countError && (count ?? 0) >= maxNotebooks) {
        return errorResponse(
            'Limit of 50 notebooks reached. Delete unused notebooks to create more.',
            403,
            env,
            request
        )
    }

    let body: any
    try {
        body = await request.json()
    } catch {
        return errorResponse('Invalid JSON body', 400, env, request)
    }

    const rawTitle = typeof body.title === 'string' ? body.title.trim() : ''
    if (rawTitle.length < 2) {
        return errorResponse('Title must be at least 2 characters', 400, env, request)
    }
    const title = rawTitle.slice(0, 140)

    const description = typeof body.description === 'string' ? body.description.trim().slice(0, 1000) : ''

    const isPublic = body.is_public !== false
    const tags = Array.isArray(body.tags)
        ? body.tags
              .map((t: unknown) => String(t).trim().toLowerCase().replace(/^#/, ''))
              .filter((t: string) => t.length > 0 && t.length <= 30)
              .slice(0, 10)
        : []

    const cells: NoteCell[] = Array.isArray(body.cells)
        ? body.cells.map((c: any, idx: number) => ({
              id: typeof c.id === 'string' ? c.id : `cell_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 6)}`,
              type: c.type === 'code' ? 'code' : 'markdown',
              content: typeof c.content === 'string' ? c.content : '',
              caption: typeof c.caption === 'string' ? c.caption : undefined,
              language: typeof c.language === 'string' ? c.language : 'rust',
          }))
        : [
              {
                  id: `cell_${Date.now()}_1`,
                  type: 'markdown',
                  content: `# ${title}\n\nStart writing notes and explanations in Markdown...`,
              },
              {
                  id: `cell_${Date.now()}_2`,
                  type: 'code',
                  content: `fn main() {\n    println!("Hello from Cratery Interactive Rust Notes!");\n}`,
                  caption: 'Interactive Rust Snippet',
                  language: 'rust',
              },
          ]

    const baseSlug = slugify(title)
    const uniqueSuffix = Math.random().toString(36).substring(2, 7)
    const slug = `${baseSlug}-${uniqueSuffix}`.slice(0, 80)

    const { data, error } = await supabase
        .from('user_notes')
        .insert({
            author_id: user.id,
            slug,
            title,
            description,
            is_public: isPublic,
            tags,
            cells,
            views_count: 0,
            runs_count: 0,
            forks_count: 0,
        })
        .select()
        .single()

    if (error) {
        return errorResponse(error.message, 500, env, request)
    }

    return jsonResponse({ status: 'ok', note: { ...data, author_username: user.username } }, 201, env, request)
}


export async function handleUpdateNote(request: Request, env: Env): Promise<Response> {
    const supabase = createSupabaseClient(env)
    const user = await getSessionUser(request, env)

    if (!user) {
        return errorResponse('Authentication required to edit note', 401, env, request)
    }

    let body: any
    try {
        body = await request.json()
    } catch {
        return errorResponse('Invalid JSON body', 400, env, request)
    }

    const id = typeof body.id === 'string' ? body.id : ''
    if (!id) {
        return errorResponse('Note ID is required', 400, env, request)
    }

    
    const { data: existing, error: findError } = await supabase
        .from('user_notes')
        .select('author_id')
        .eq('id', id)
        .maybeSingle()

    if (findError || !existing) {
        return errorResponse('Note not found', 404, env, request)
    }

    if (existing.author_id !== user.id) {
        return errorResponse('You are not authorized to edit this note', 403, env, request)
    }

    const updates: Record<string, unknown> = {}

    if (typeof body.title === 'string') {
        const title = body.title.trim()
        if (title.length < 2) {
            return errorResponse('Title must be at least 2 characters', 400, env, request)
        }
        updates.title = title.slice(0, 140)
    }

    if (typeof body.description === 'string') {
        updates.description = body.description.trim().slice(0, 1000)
    }

    if (typeof body.is_public === 'boolean') {
        updates.is_public = body.is_public
    }

    if (Array.isArray(body.tags)) {
        updates.tags = body.tags
            .map((t: unknown) => String(t).trim().toLowerCase().replace(/^#/, ''))
            .filter((t: string) => t.length > 0 && t.length <= 30)
            .slice(0, 10)
    }

    if (Array.isArray(body.cells)) {
        updates.cells = body.cells.map((c: any, idx: number) => ({
            id: typeof c.id === 'string' ? c.id : `cell_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 6)}`,
            type: c.type === 'code' ? 'code' : 'markdown',
            content: typeof c.content === 'string' ? c.content : '',
            caption: typeof c.caption === 'string' ? c.caption : undefined,
            language: typeof c.language === 'string' ? c.language : 'rust',
        }))
    }

    updates.updated_at = new Date().toISOString()

    const { data, error } = await supabase
        .from('user_notes')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        return errorResponse(error.message, 500, env, request)
    }

    return jsonResponse({ status: 'ok', note: { ...data, author_username: user.username } }, 200, env, request)
}


export async function handleDeleteNote(request: Request, env: Env): Promise<Response> {
    const supabase = createSupabaseClient(env)
    const user = await getSessionUser(request, env)

    if (!user) {
        return errorResponse('Authentication required to delete note', 401, env, request)
    }

    const url = new URL(request.url)
    const id = url.searchParams.get('id') || ''
    if (!id) {
        return errorResponse('Note ID is required', 400, env, request)
    }

    
    const { data: existing } = await supabase
        .from('user_notes')
        .select('author_id')
        .eq('id', id)
        .maybeSingle()

    if (!existing || existing.author_id !== user.id) {
        return errorResponse('Not authorized to delete this note', 403, env, request)
    }

    const { error } = await supabase.from('user_notes').delete().eq('id', id)

    if (error) {
        return errorResponse(error.message, 500, env, request)
    }

    return jsonResponse({ status: 'ok' }, 200, env, request)
}


export async function handleForkNote(request: Request, env: Env): Promise<Response> {
    const supabase = createSupabaseClient(env)
    const user = await getSessionUser(request, env)

    if (!user) {
        return errorResponse('Sign in required to fork notes to your workspace', 401, env, request)
    }

    let body: any
    try {
        body = await request.json()
    } catch {
        return errorResponse('Invalid JSON body', 400, env, request)
    }

    const rawNoteId = typeof body.note_id === 'string' ? body.note_id.trim() : (typeof body.id === 'string' ? body.id.trim() : '')
    if (!rawNoteId) {
        return errorResponse('Note ID is required', 400, env, request)
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawNoteId)

    let sourceNote: {
        id?: string
        title: string
        description?: string
        is_public: boolean
        author_id?: string
        tags?: string[]
        cells?: NoteCell[]
        forks_count?: number
    } | null = null

    if (isUuid) {
        const { data, error } = await supabase
            .from('user_notes')
            .select('*')
            .eq('id', rawNoteId)
            .maybeSingle()
        if (!error && data) {
            sourceNote = data
        }
    } else {
        const { data, error } = await supabase
            .from('user_notes')
            .select('*')
            .eq('slug', rawNoteId)
            .maybeSingle()
        if (!error && data) {
            sourceNote = data
        }
    }

    
    if (!sourceNote) {
        const tmpl = findBuiltinNoteTemplate(rawNoteId)
        if (tmpl) {
            sourceNote = {
                title: tmpl.title,
                description: tmpl.description,
                is_public: true,
                author_id: 'cratery-team',
                tags: tmpl.tags,
                cells: tmpl.cells,
                forks_count: 0,
            }
        }
    }

    if (!sourceNote) {
        return errorResponse('Source note not found', 404, env, request)
    }

    if (!sourceNote.is_public && sourceNote.author_id !== user.id) {
        return errorResponse('Cannot fork a private note', 403, env, request)
    }

    
    const maxNotebooks = 50
    const { count, error: countError } = await supabase
        .from('user_notes')
        .select('id', { count: 'exact', head: true })
        .eq('author_id', user.id)

    if (!countError && (count ?? 0) >= maxNotebooks) {
        return errorResponse(
            'Limit of 50 notebooks reached. Delete unused notebooks to fork more.',
            403,
            env,
            request
        )
    }

    const rawTitle = `Fork of ${sourceNote.title || 'Untitled Note'}`.trim()
    const title = rawTitle.slice(0, 140)

    const baseSlug = slugify(title)
    const uniqueSuffix = Math.random().toString(36).substring(2, 7)
    const slug = `${baseSlug}-${uniqueSuffix}`.slice(0, 80)

    const cells: NoteCell[] = Array.isArray(sourceNote.cells)
        ? sourceNote.cells.map((c: any, idx: number) => ({
              id: `cell_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 6)}`,
              type: c.type === 'code' ? 'code' : 'markdown',
              content: typeof c.content === 'string' ? c.content : '',
              caption: typeof c.caption === 'string' ? c.caption : undefined,
              language: typeof c.language === 'string' ? c.language : 'rust',
          }))
        : []

    const { data: forkedNote, error: insertError } = await supabase
        .from('user_notes')
        .insert({
            author_id: user.id,
            slug,
            title,
            description: (sourceNote.description || '').slice(0, 1000),
            is_public: false, 
            tags: Array.isArray(sourceNote.tags) ? sourceNote.tags.slice(0, 10) : [],
            cells,
            views_count: 0,
            runs_count: 0,
            forks_count: 0,
        })
        .select()
        .single()

    if (insertError) {
        return errorResponse(insertError.message, 500, env, request)
    }

    
    if (sourceNote.id && isUuid) {
        void supabase
            .from('user_notes')
            .update({ forks_count: (sourceNote.forks_count || 0) + 1 })
            .eq('id', sourceNote.id)
    }

    return jsonResponse({
        status: 'ok',
        note: {
            ...forkedNote,
            author_username: user.username,
        }
    }, 201, env, request)
}
