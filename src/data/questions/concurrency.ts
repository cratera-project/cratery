import type { Question } from '../../lib/quiz'

export const concurrencyQuestions: Question[] = [
  {
    id: 'conc-thread-1',
    categorySlug: 'concurrency',
    title: 'Thread Execution',
    prompt: 'Why is the print order of `"A"` and `"B"` unpredictable?',
    tags: ['concurrency', 'threads'],
    difficulty: 1,
    language: 'rust',
    code: `use std::thread;

fn main() {
    let handle = thread::spawn(|| {
        println!("A");
    });
    println!("B");
    handle.join().unwrap();
}`,
    options: [
      { label: 'A', text: "The OS scheduler decides when each thread runs" },
      { label: 'B', text: "Rust evaluates threads in nondeterministic source order" },
      { label: 'C', text: "`println!` queues output and flushes asynchronously" },
      { label: 'D', text: "The spawned thread is optimized away until `join`" },
    ],
    correctIndex: 0,
    hint: 'Spawning starts another OS thread; nothing pins print order before join.',
    explanation:
      'Both threads are runnable concurrently. The OS scheduler chooses when each runs, so `"A"` may print before or after `"B"`. `join()` only waits for the spawned thread to finish; it does not fix relative ordering of earlier prints.',
  },
  {
    id: 'conc-move-1',
    categorySlug: 'concurrency',
    title: 'Move Closures',
    prompt: 'Why does this spawn use a `move` closure?',
    tags: ['concurrency', 'closures'],
    difficulty: 2,
    language: 'rust',
    code: `use std::thread;

fn main() {
    let v = vec![1, 2];
    thread::spawn(move || {
        println!("{:?}", v);
    })
    .join()
    .unwrap();
}`,
    options: [
      { label: 'A', text: 'So the closure borrows `v` for the new thread' },
      { label: 'B', text: 'So ownership of `v` moves into the new thread' },
      { label: 'C', text: 'So `v` becomes mutable inside the new thread' },
      { label: 'D', text: 'So the compiler places `v` in thread-local storage' },
    ],
    correctIndex: 1,
    hint: '`thread::spawn` requires a `\'static` closure; stack borrows usually will not do.',
    explanation:
      '`std::thread::spawn` needs `Send + \'static`. A borrow of `v` would not outlive the caller safely. `move` transfers ownership of `v` into the closure so the new thread owns the data.',
  },
  {
    id: 'conc-channel-1',
    categorySlug: 'concurrency',
    title: 'Message Passing',
    prompt: 'After a successful `send` of a non-`Copy` value, who owns it?',
    tags: ['concurrency', 'channels'],
    difficulty: 2,
    language: 'rust',
    code: `use std::sync::mpsc;

fn main() {
    let (tx, rx) = mpsc::channel();
    let val = String::from("hi");
    tx.send(val).unwrap();
    // can we use val here?
    let got = rx.recv().unwrap();
    println!("{got}");
}`,
    options: [
      { label: 'A', text: 'Both ends share `val` through the channel buffer' },
      { label: 'B', text: '`val` is promoted to a `\'static` allocation' },
      { label: 'C', text: 'The sender keeps ownership; the receiver only borrows' },
      { label: 'D', text: 'Ownership moves to the receiver on a successful send' },
    ],
    correctIndex: 3,
    hint: 'Think of `send` like moving into a queue, not sharing.',
    explanation:
      'For non-`Copy` types, `Sender::send` moves the value into the channel. The sender cannot use `val` afterward; `recv` gives ownership to the receiver. `Copy` types are copied instead.',
  },
  {
    id: 'conc-mutex-1',
    categorySlug: 'concurrency',
    title: 'Mutex Sharing',
    prompt: 'Why wrap the `Mutex` in `Arc` before spawning?',
    tags: ['concurrency', 'mutex', 'arc'],
    difficulty: 2,
    language: 'rust',
    code: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let c = Arc::clone(&counter);
    thread::spawn(move || {
        *c.lock().unwrap() += 1;
    })
    .join()
    .unwrap();
}`,
    options: [
      { label: 'A', text: '`Arc` makes mutex lock and unlock operations faster' },
      { label: 'B', text: '`Arc` shares ownership of one mutex across threads' },
      { label: 'C', text: '`Arc` is required because `Mutex` alone is not `Send`' },
      { label: 'D', text: '`Arc` replaces locking and prevents data races alone' },
    ],
    correctIndex: 1,
    hint: '`Mutex` protects the data; something still has to own that mutex in each thread.',
    explanation:
      '`Mutex<T>` is a single-owner value. `Arc` provides shared ownership of that mutex so each thread can hold a clone and lock the same guard. `Mutex` is already `Send`/`Sync` when `T: Send`; `Arc` is about ownership, not replacing the lock.',
  },
  {
    id: 'conc-send-1',
    categorySlug: 'concurrency',
    title: 'Send Trait',
    prompt: 'What does the `Send` bound on `T` allow here?',
    tags: ['concurrency', 'traits', 'send'],
    difficulty: 3,
    language: 'rust',
    code: `use std::thread;

fn run_job<T>(job: T)
where
    T: Send + 'static,
{
    thread::spawn(move || {
        let _ = job;
    });
}`,
    options: [
      { label: 'A', text: 'Transfer of ownership of `T` into another thread' },
      { label: 'B', text: 'Safe concurrent access through shared references only' },
      { label: 'C', text: 'Guaranteed immutability for the life of the job' },
      { label: 'D', text: 'Automatic heap allocation of `T` before the spawn' },
    ],
    correctIndex: 0,
    hint: 'Do not confuse `Send` with `Sync`.',
    explanation:
      '`Send` means it is safe to move ownership of a value to another thread. `Sync` is about sharing `&T` across threads. Types like `Rc<T>` are not `Send` because their refcounts are not atomic.',
  },
  {
    id: 'conc-sync-1',
    categorySlug: 'concurrency',
    title: 'Sync and Sharing',
    prompt: 'Why can both scoped threads borrow `data` without `Arc`?',
    tags: ['concurrency', 'threads', 'sync'],
    difficulty: 3,
    language: 'rust',
    code: `use std::thread;

fn main() {
    let data = vec![1, 2, 3];
    thread::scope(|s| {
        s.spawn(|| println!("{}", data.len()));
        s.spawn(|| println!("{}", data[0]));
    });
}`,
    options: [
      { label: 'A', text: 'Scoped threads join before exit, and `Vec<i32>` is `Sync`' },
      { label: 'B', text: '`println!` serializes access so borrows never overlap' },
      { label: 'C', text: '`Vec<i32>` is `Copy`, so each thread gets its own copy' },
      { label: 'D', text: 'Scoped threads always run one after another, never together' },
    ],
    correctIndex: 0,
    hint: 'Two ingredients: lifetime of the threads, and whether `&T` may cross threads.',
    explanation:
      '`thread::scope` joins all spawned threads before returning, so borrows of stack data are sound. Sharing `&Vec<i32>` across threads also requires `Vec<i32>: Sync`, which holds for `i32`.',
  },
  {
    id: 'conc-static-1',
    categorySlug: 'concurrency',
    title: 'Spawn Lifetime',
    prompt: 'Why does capturing `s` by reference fail with `thread::spawn`?',
    tags: ['concurrency', 'threads', 'lifetimes'],
    difficulty: 2,
    language: 'rust',
    code: `use std::thread;

fn main() {
    let s = String::from("hi");
    let handle = thread::spawn(|| {
        println!("{s}");
    });
    handle.join().unwrap();
}`,
    options: [
      { label: 'A', text: '`thread::spawn` forbids capturing any `String` values' },
      { label: 'B', text: 'Threads may only capture data that lives on the heap' },
      { label: 'C', text: 'The OS may relocate locals between cores at any time' },
      { label: 'D', text: 'The new thread may outlive this stack frame\'s locals' },
    ],
    correctIndex: 3,
    hint: 'Check the `\'static` bound on `thread::spawn`\'s closure.',
    explanation:
      '`thread::spawn` requires `F: Send + \'static` because the thread can outlive the caller. Borrowing `s` would be a non-`\'static` capture. Fix with `move`, owned data, or `thread::scope`.',
  },
  {
    id: 'conc-scope-1',
    categorySlug: 'concurrency',
    title: 'Scoped Threads',
    prompt: 'What problem does `std::thread::scope` solve here?',
    tags: ['concurrency', 'threads'],
    difficulty: 2,
    language: 'rust',
    code: `use std::thread;

fn main() {
    let s = String::from("hello");
    thread::scope(|scope| {
        scope.spawn(|| {
            println!("{}", s.len());
        });
    });
}`,
    options: [
      { label: 'A', text: 'It makes every mutex acquire locks in FIFO order' },
      { label: 'B', text: 'It forces a fixed run order among spawned threads' },
      { label: 'C', text: 'It lets threads borrow locals; they join before exit' },
      { label: 'D', text: 'It replaces the OS scheduler with a Rust runtime' },
    ],
    correctIndex: 2,
    hint: 'Compare the lifetime bound on `scope.spawn` with `thread::spawn`.',
    explanation:
      'Scoped threads are joined before `thread::scope` returns, so borrowing parent-stack data is safe. They do not guarantee scheduling order or fairness of locks.',
  },
  {
    id: 'conc-mutexguard-1',
    categorySlug: 'concurrency',
    title: 'MutexGuard Lifetime',
    prompt: 'When is this mutex unlocked?',
    tags: ['concurrency', 'mutex'],
    difficulty: 2,
    language: 'rust',
    code: `use std::sync::Mutex;

fn main() {
    let m = Mutex::new(123);
    {
        let guard = m.lock().unwrap();
        println!("{}", *guard);
    } // ?
}`,
    options: [
      { label: 'A', text: 'Only when the `Mutex` value itself is dropped' },
      { label: 'B', text: 'Only when the owning thread finishes completely' },
      { label: 'C', text: 'When the `MutexGuard` is dropped at end of scope' },
      { label: 'D', text: 'Immediately after the first read through the guard' },
    ],
    correctIndex: 2,
    hint: 'RAII: the lock lives as long as the guard value.',
    explanation:
      '`lock()` returns a `MutexGuard`. The mutex stays locked until that guard is dropped: end of scope or an explicit `drop(guard)`. Reading through the guard does not unlock early.',
  },
  {
    id: 'conc-mpsc-iter-1',
    categorySlug: 'concurrency',
    title: 'Receiver Iterator',
    prompt: 'What does `for msg in rx` do with an `mpsc` receiver?',
    tags: ['concurrency', 'channels'],
    difficulty: 2,
    language: 'rust',
    code: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel::<i32>();
    thread::spawn(move || {
        tx.send(1).unwrap();
        tx.send(2).unwrap();
    });
    for msg in rx {
        println!("{msg}");
    }
}`,
    options: [
      { label: 'A', text: 'It panics as soon as the channel has no waiting sender' },
      { label: 'B', text: 'It busy-waits in a spin loop until messages arrive' },
      { label: 'C', text: 'It yields `None` after each message for fairness' },
      { label: 'D', text: 'It blocks for messages and ends when all senders drop' },
    ],
    correctIndex: 3,
    hint: 'The iterator ends when the channel is disconnected.',
    explanation:
      '`Receiver`\'s iterator blocks waiting for the next message. When every `Sender`/`SyncSender` is dropped, the channel hangs up and the iterator ends with no panic and no spin loop.',
  },
  {
    id: 'conc-condvar-1',
    categorySlug: 'concurrency',
    title: 'Condvar Wait',
    prompt: 'What does `Condvar::wait` do with the mutex lock?',
    tags: ['concurrency', 'mutex', 'condvar'],
    difficulty: 3,
    language: 'rust',
    code: `use std::sync::{Arc, Condvar, Mutex};
use std::thread;

fn main() {
    let pair = Arc::new((Mutex::new(false), Condvar::new()));
    let pair2 = Arc::clone(&pair);
    thread::spawn(move || {
        let (lock, cvar) = &*pair2;
        let mut ready = lock.lock().unwrap();
        *ready = true;
        cvar.notify_one();
    });
    let (lock, cvar) = &*pair;
    let mut ready = lock.lock().unwrap();
    while !*ready {
        ready = cvar.wait(ready).unwrap();
    }
}`,
    options: [
      { label: 'A', text: 'It keeps the mutex locked the whole time while waiting' },
      { label: 'B', text: 'It unlocks forever and returns without locking again' },
      { label: 'C', text: 'It unlocks while waiting, then re-locks before return' },
      { label: 'D', text: 'It sleeps without touching the mutex ownership at all' },
    ],
    correctIndex: 2,
    hint: 'Another thread must be able to take the lock and set the condition.',
    explanation:
      '`wait` atomically releases the mutex and blocks. On wake it reacquires the lock and returns a new `MutexGuard`. That is why the `while !*ready` loop can recheck the condition safely. Spurious wakeups are why the loop is needed.',
  },
  {
    id: 'conc-parking-1',
    categorySlug: 'concurrency',
    title: 'Thread Parking',
    prompt: 'What happens if this thread is never unparked?',
    tags: ['concurrency', 'threads'],
    difficulty: 2,
    language: 'rust',
    code: `use std::thread;

fn main() {
    let handle = thread::spawn(|| {
        thread::park();
        println!("after park");
    });
    // no unpark
    handle.join().unwrap();
}`,
    options: [
      { label: 'A', text: '`park` returns immediately and printing continues' },
      { label: 'B', text: 'The parked thread panics after a short timeout' },
      { label: 'C', text: 'The runtime wakes parked threads when memory is idle' },
      { label: 'D', text: '`join` blocks forever waiting on the parked thread' },
    ],
    correctIndex: 3,
    hint: '`park` waits for a matching `unpark` (or a prior park token).',
    explanation:
      '`thread::park` blocks until the thread is unparked (or already has a park token). With no `unpark` and `main` blocked in `join`, the program hangs. Prefer channels or `Condvar` for most coordination.',
  },
  {
    id: 'conc-rwlock-1',
    categorySlug: 'concurrency',
    title: 'RwLock Semantics',
    prompt: 'What capability does `RwLock` add compared with `Mutex`?',
    tags: ['concurrency', 'rwlock'],
    difficulty: 2,
    language: 'rust',
    code: `use std::sync::RwLock;

fn main() {
    let lock = RwLock::new(5);
    let _r1 = lock.read().unwrap();
    let _r2 = lock.read().unwrap();
}`,
    options: [
      { label: 'A', text: 'It synchronizes access across separate processes' },
      { label: 'B', text: 'It makes deadlock impossible by design alone' },
      { label: 'C', text: 'Many readers may hold the lock; writers are exclusive' },
      { label: 'D', text: 'All reads become lock-free atomic loads always' },
    ],
    correctIndex: 2,
    hint: 'Look at how many simultaneous `read()` guards are allowed.',
    explanation:
      '`RwLock` allows multiple concurrent readers or one writer. `Mutex` always grants exclusive access, even for read-only use. Neither removes deadlock risk if lock order is wrong.',
  },
  {
    id: 'conc-barrier-1',
    categorySlug: 'concurrency',
    title: 'Barrier Synchronization',
    prompt: 'What does `Barrier::wait` guarantee for `N` participants?',
    tags: ['concurrency', 'synchronization'],
    difficulty: 2,
    language: 'rust',
    code: `use std::sync::{Arc, Barrier};
use std::thread;

fn main() {
    let barrier = Arc::new(Barrier::new(3));
    let mut handles = vec![];
    for _ in 0..3 {
        let b = Arc::clone(&barrier);
        handles.push(thread::spawn(move || {
            b.wait();
        }));
    }
    for h in handles {
        h.join().unwrap();
    }
}`,
    options: [
      { label: 'A', text: 'Waiting threads acquire locks in strict FIFO order' },
      { label: 'B', text: 'Exactly one thread is chosen and the others exit early' },
      { label: 'C', text: 'Each `wait` yields once, then continues immediately' },
      { label: 'D', text: 'No thread proceeds until all `N` threads have waited' },
    ],
    correctIndex: 3,
    hint: 'It is a rendezvous point, not a mutex.',
    explanation:
      'A barrier blocks each caller of `wait` until `N` threads have arrived. Then all are released together. One thread\'s `BarrierWaitResult` reports `is_leader()`, but leadership is not the main guarantee.',
  },
  {
    id: 'conc-poisoned-1',
    categorySlug: 'concurrency',
    title: 'Poisoned Mutex',
    prompt: 'When does a later `lock()` return `Err(PoisonError)`?',
    tags: ['concurrency', 'mutex', 'panics'],
    difficulty: 3,
    language: 'rust',
    code: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let lock = Arc::new(Mutex::new(0));
    let lock2 = Arc::clone(&lock);
    let _ = thread::spawn(move || {
        let mut n = lock2.lock().unwrap();
        *n += 1;
        panic!("boom");
    })
    .join();
    println!("{:?}", lock.lock().is_err());
}`,
    options: [
      { label: 'A', text: 'When a thread holds the lock longer than a timeout' },
      { label: 'B', text: 'When two threads contend for the same mutex' },
      { label: 'C', text: 'When `unlock` is called twice on the same guard' },
      { label: 'D', text: 'When a thread panics while still holding the lock' },
    ],
    correctIndex: 3,
    hint: 'Poisoning marks that protected data may be inconsistent.',
    explanation:
      'If a thread panics while holding a `Mutex`, the mutex is poisoned. Later `lock()` calls return `Err(PoisonError<_>)` so callers can decide whether to recover with `into_inner` or propagate failure.',
  },
  {
    id: 'conc-atomic-ordering-1',
    categorySlug: 'concurrency',
    title: 'Relaxed Atomics',
    prompt: 'What does `Ordering::Relaxed` guarantee for an atomic op?',
    tags: ['concurrency', 'atomics'],
    difficulty: 3,
    language: 'rust',
    code: `use std::sync::atomic::{AtomicUsize, Ordering};

fn main() {
    let x = AtomicUsize::new(0);
    x.store(1, Ordering::Relaxed);
}`,
    options: [
      { label: 'A', text: 'Atomicity of the op, without sync with other memory' },
      { label: 'B', text: 'Full sequential consistency with all other atomics' },
      { label: 'C', text: 'Acquire-release pairing with matching loads/stores' },
      { label: 'D', text: 'Visibility of the write only on a single-core CPU' },
    ],
    correctIndex: 0,
    hint: 'Atomicity and synchronization ordering are separate ideas.',
    explanation:
      '`Relaxed` operations are still indivisible, but they do not create happens-before edges with other memory ops. Use stronger orderings (or fences) when one thread must publish data another must observe.',
  },
  {
    id: 'conc-mpsc-clone-1',
    categorySlug: 'concurrency',
    title: 'mpsc Cloning',
    prompt: 'Why can you `clone` an `mpsc::Sender` but not a `Receiver`?',
    tags: ['concurrency', 'channels'],
    difficulty: 2,
    language: 'rust',
    code: `use std::sync::mpsc;

fn main() {
    let (tx, rx) = mpsc::channel::<i32>();
    let _tx2 = tx.clone();
    let _ = rx;
}`,
    options: [
      { label: 'A', text: 'Cloning a receiver would silently drop every message' },
      { label: 'B', text: 'Receivers are constrained to run only on the main thread' },
      { label: 'C', text: 'The channel is MPSC: many senders, one receiver' },
      { label: 'D', text: 'Senders implement `Copy`, so cloning is always free' },
    ],
    correctIndex: 2,
    hint: 'Expand the acronym in `mpsc`.',
    explanation:
      'Standard library `mpsc` channels are multiple-producer, single-consumer. Cloning `Sender` supports extra producers; a single `Receiver` keeps consume-once semantics. `Sender` is `Clone`, not `Copy`.',
  },
  {
    id: 'conc-once-1',
    categorySlug: 'concurrency',
    title: 'Once Initialization',
    prompt: 'What does a successful `Once::call_once` guarantee?',
    tags: ['concurrency', 'initialization'],
    difficulty: 2,
    language: 'rust',
    code: `use std::sync::Once;
use std::thread;

static INIT: Once = Once::new();

fn main() {
    let mut handles = vec![];
    for _ in 0..4 {
        handles.push(thread::spawn(|| {
            INIT.call_once(|| {
                // init work
            });
        }));
    }
    for h in handles {
        h.join().unwrap();
    }
}`,
    options: [
      { label: 'A', text: 'The closure body runs at most once across all threads' },
      { label: 'B', text: 'The closure body runs once separately on each thread' },
      { label: 'C', text: 'The closure body always runs on the main thread only' },
      { label: 'D', text: 'The closure body may finish successfully multiple times' },
    ],
    correctIndex: 0,
    hint: '`Once` is a one-shot initialization latch shared by threads.',
    explanation:
      'After a successful `call_once`, the closure does not run again; other callers wait for completion then proceed. Prefer `OnceLock`/`LazyLock` for storing an initialized value. A panic during init poisons the `Once`.',
  },
  {
    id: 'conc-thread-local-1',
    categorySlug: 'concurrency',
    title: 'Thread Local Storage',
    prompt: 'What does the spawned thread print?',
    tags: ['concurrency', 'threads', 'tls'],
    difficulty: 3,
    language: 'rust',
    code: `use std::cell::Cell;
use std::thread;

thread_local! {
    static COUNTER: Cell<u32> = Cell::new(0);
}

fn main() {
    COUNTER.with(|c| c.set(5));
    let h = thread::spawn(|| {
        COUNTER.with(|c| println!("{}", c.get()));
    });
    h.join().unwrap();
}`,
    options: [
      { label: 'A', text: '`5`, inherited from the main thread\'s cell' },
      { label: 'B', text: '`0`, from a fresh cell for that thread' },
      { label: 'C', text: 'It panics because TLS cannot cross thread::spawn' },
      { label: 'D', text: 'An arbitrary value from an unsynchronized race' },
    ],
    correctIndex: 1,
    hint: 'Each thread initializes its own TLS instance.',
    explanation:
      '`thread_local!` gives each thread a separate `COUNTER`. Setting it in `main` does not affect the spawned thread, which still starts at `0`. There is no data race; the cells are distinct.',
  },
  {
    id: 'conc-scope-return-1',
    categorySlug: 'concurrency',
    title: 'Scoped Return Values',
    prompt: 'Why can the scoped thread return a borrow of `s`?',
    tags: ['concurrency', 'threads', 'lifetimes'],
    difficulty: 3,
    language: 'rust',
    code: `use std::thread;

fn main() {
    let s = String::from("hello");
    thread::scope(|scope| {
        let h = scope.spawn(|| &s[0..1]);
        let first: &str = h.join().unwrap();
        println!("{first}");
    });
}`,
    options: [
      { label: 'A', text: 'Every `&str` is implicitly `\'static` in return position' },
      { label: 'B', text: 'The scope joins the thread before `s` can be dropped' },
      { label: 'C', text: '`spawn` always erases borrow checking for closures' },
      { label: 'D', text: '`String` is `Copy`, so the slice outlives freely' },
    ],
    correctIndex: 1,
    hint: 'Scoped joins make the borrow\'s lifetime finite and known.',
    explanation:
      'Scoped threads cannot outlive the `thread::scope` call, so a reference into `s` remains valid until `join` returns inside the scope. Plain `thread::spawn` would require `\'static` and reject this borrow.',
  },
  {
    id: 'conc-join-1',
    categorySlug: 'concurrency',
    title: 'Join Handle Results',
    prompt: 'What does `JoinHandle::join` return on success?',
    tags: ['concurrency', 'threads'],
    difficulty: 2,
    language: 'rust',
    code: `use std::thread;
let handle = thread::spawn(|| 7);
let n = handle.join().unwrap();`,
    options: [
      { label: 'A', text: 'Always `()` because threads cannot return values' },
      { label: 'B', text: 'A borrowed reference into the child thread’s stack' },
      { label: 'C', text: '`Ok` holding the closure’s return value' },
      { label: 'D', text: 'The child thread’s OS pid wrapped in a `Mutex`' },
    ],
    correctIndex: 2,
    hint: 'The handle carries the closure’s output type.',
    explanation:
      '`join` waits for the thread and returns `Result<T, _>` where `T` is the closure’s return type. Panic in the child becomes `Err`. It does not borrow the child’s stack.',
  },
  {
    id: 'conc-move-closure-1',
    categorySlug: 'concurrency',
    title: 'Move Closures in Spawn',
    prompt: 'Why is `move` often required for `thread::spawn`?',
    tags: ['concurrency', 'closures', 'move'],
    difficulty: 2,
    language: 'rust',
    code: `use std::thread;
let name = String::from("worker");
thread::spawn(move || {
    println!("{name}");
}).join().unwrap();`,
    options: [
      { label: 'A', text: '`move` makes the closure `Copy` so it can run twice' },
      { label: 'B', text: 'Spawned threads must own captures to outlive callers' },
      { label: 'C', text: '`move` is only a style hint and never changes captures' },
      { label: 'D', text: '`move` disables the borrow checker inside the closure' },
    ],
    correctIndex: 1,
    hint: 'The thread may outlive the spawning stack frame.',
    explanation:
      "`thread::spawn` requires a `'static` closure. `move` forces captures by value so the thread owns what it needs instead of borrowing the caller’s stack. Scoped threads can borrow without `'static`.",
  },
  {
    id: 'conc-channel-drop-1',
    categorySlug: 'concurrency',
    title: 'Channel Disconnect',
    prompt: 'What happens when all `Sender`s are dropped?',
    tags: ['concurrency', 'channels'],
    difficulty: 2,
    language: 'rust',
    code: `use std::sync::mpsc;
let (tx, rx) = mpsc::channel::<i32>();
drop(tx);
let msg = rx.recv();`,
    options: [
      { label: 'A', text: '`recv` returns `Err`, signaling a disconnected channel' },
      { label: 'B', text: '`recv` blocks forever waiting for a replacement sender' },
      { label: 'C', text: '`recv` panics because empty channels are invalid state' },
      { label: 'D', text: '`recv` invents a default `i32` and returns `Ok(0)`' },
    ],
    correctIndex: 0,
    hint: 'No producers left means the stream is finished.',
    explanation:
      'When every `Sender` is dropped, `recv` unblocks with `Err(RecvError)` so consumers can stop cleanly. It does not hang forever or fabricate values.',
  },
  {
    id: 'conc-mutex-poison-1',
    categorySlug: 'concurrency',
    title: 'Mutex Poisoning',
    prompt: 'When does `Mutex::lock` return `Err`?',
    tags: ['concurrency', 'mutex'],
    difficulty: 2,
    language: 'rust',
    code: `use std::sync::{Arc, Mutex};
use std::thread;

let m = Arc::new(Mutex::new(0));
let m2 = Arc::clone(&m);
let _ = thread::spawn(move || {
    let _g = m2.lock().unwrap();
    panic!("boom");
}).join();
let result = m.lock();`,
    options: [
      { label: 'A', text: 'Whenever another thread currently holds the mutex' },
      { label: 'B', text: 'Only if you call `lock` twice on the same thread' },
      { label: 'C', text: 'Never; `lock` always returns `Ok` on stable Rust' },
      { label: 'D', text: 'After a holder panics before releasing the mutex' },
    ],
    correctIndex: 3,
    hint: 'Poison flags “previous holder panicked.”',
    explanation:
      'If a thread panics while holding a `MutexGuard`, the mutex becomes poisoned. Later `lock` calls return `Err(PoisonError<_>)` so you can decide whether to recover with `into_inner` or propagate.',
  },
  {
    id: 'conc-lazylock-1',
    categorySlug: 'concurrency',
    title: 'LazyLock Initialization',
    prompt: 'When does the `LazyLock` closure run?',
    tags: ['concurrency', 'lazylock'],
    difficulty: 2,
    language: 'rust',
    code: `use std::sync::LazyLock;
static N: LazyLock<i32> = LazyLock::new(|| 1 + 1);

fn main() {
    assert_eq!(*N, 2);
    assert_eq!(*N, 2);
}`,
    options: [
      { label: 'A', text: 'At program start, before `main`, on every OS' },
      { label: 'B', text: 'Each time `*N` is evaluated, including later' },
      { label: 'C', text: 'Only after an explicit `N.init()` call first' },
      { label: 'D', text: 'Once on first deref; later reads reuse it' },
    ],
    correctIndex: 3,
    hint: '`LazyLock` looks like `&T` because deref initializes.',
    explanation:
      '`LazyLock` (stable since 1.80) runs its closure once on first deref or `force()`, even if several threads race; others wait. Later accesses reuse the stored value. Unlike `OnceLock`, the initializer is fixed at `new` and you do not pass extra arguments later. A panic in the closure poisons the lock unrecoverably.',
  },
  {
    id: 'conc-sync-channel-1',
    categorySlug: 'concurrency',
    title: 'Bounded sync_channel',
    prompt: 'How does `sync_channel(1)` differ from `channel()`?',
    tags: ['concurrency', 'channels'],
    difficulty: 2,
    language: 'rust',
    code: `use std::sync::mpsc::sync_channel;
use std::thread;

fn main() {
    let (tx, rx) = sync_channel(1);
    tx.send(1).unwrap();
    thread::spawn(move || {
        tx.send(2).unwrap();
    });
    assert_eq!(rx.recv().unwrap(), 1);
    assert_eq!(rx.recv().unwrap(), 2);
}`,
    options: [
      { label: 'A', text: 'It allows any number of receivers, unlike `channel`' },
      { label: 'B', text: 'Sends block once the bounded buffer is full' },
      { label: 'C', text: 'Messages may arrive in a different send order' },
      { label: 'D', text: 'The sender cannot be cloned for extra producers' },
    ],
    correctIndex: 1,
    hint: 'The `1` is a buffer size, not a thread count.',
    explanation:
      '`sync_channel(bound)` is a bounded channel: `send` returns immediately while space remains, then blocks until a `recv` frees a slot. `bound == 0` is a rendezvous channel. Order is still FIFO, `SyncSender` can be cloned, and there is still a single `Receiver`, like `channel()`.',
  },
  {
    id: 'conc-scoped-threads-borrow-1',
    categorySlug: 'concurrency',
    title: 'Scoped Threads Borrowing',
    prompt: "Why can the spawned thread borrow `numbers` without `'static` or `Arc`?",
    tags: ['concurrency', 'threads', 'scope'],
    difficulty: 2,
    language: 'rust',
    code: `fn main() {
    let mut numbers = vec![1, 2, 3];
    std::thread::scope(|s| {
        s.spawn(|| {
            println!("len: {}", numbers.len());
        });
    });
    numbers.push(4);
    println!("final: {:?}", numbers);
}`,
    options: [
      { label: 'A', text: 'thread::scope guarantees threads finish before scope exits' },
      { label: 'B', text: 's.spawn automatically clones numbers across thread boundaries' },
      { label: 'C', text: 'Vec implements a lock-free internal pointer for all threads' },
      { label: 'D', text: 'The compiler promotes stack references inside spawn to static' },
    ],
    correctIndex: 0,
    hint: 'What guarantee does thread::scope make about when spawned threads join?',
    explanation:
      '`std::thread::scope` creates a scoped thread environment where all threads spawned via `s.spawn` are guaranteed to terminate and join before the scope closure returns. Because the threads cannot outlive the stack frame, they can safely borrow non-`\'static` stack data without `Arc` or `Mutex`. Once the scope block finishes, exclusive access to `numbers` is restored.',
  },
  {
    id: 'conc-compare-exchange-order-rule-1',
    categorySlug: 'concurrency',
    title: 'compare_exchange Ordering Rules',
    prompt: 'Why is line X rejected at runtime with a panic?',
    tags: ['concurrency', 'atomics', 'ordering'],
    difficulty: 3,
    language: 'rust',
    code: `use std::sync::atomic::{AtomicBool, Ordering};

fn main() {
    let lock = AtomicBool::new(false);
    let _ = lock.compare_exchange(
        false,
        true,
        Ordering::Acquire,
        Ordering::Release, // line X
    );
}`,
    options: [
      { label: 'A', text: 'AtomicBool only supports Relaxed and SeqCst orderings' },
      { label: 'B', text: 'Failure orderings must always be strictly SeqCst level' },
      { label: 'C', text: 'Acquire and Release cannot be used on the same instance' },
      { label: 'D', text: 'Failure ordering cannot be Release or AcqRel in atomics' },
    ],
    correctIndex: 3,
    hint: 'What kind of memory operation occurs when compare_exchange fails?',
    explanation:
      "In Rust's atomic `compare_exchange`, the failure ordering specifies the memory ordering for the load operation performed when the comparison fails. A failed `compare_exchange` only reads memory; it does not write or release any values. Therefore, the failure ordering cannot be `Release` or `AcqRel`, and cannot be stronger than the success ordering. Passing `Release` panics at runtime.",
  },
  {
    id: 'conc-rwlock-read-recursion-1',
    categorySlug: 'concurrency',
    title: 'RwLock Read Reentrancy',
    prompt: 'What happens when this code executes?',
    tags: ['concurrency', 'rwlock', 'synchronization'],
    difficulty: 2,
    language: 'rust',
    code: `use std::sync::RwLock;

fn main() {
    let lock = RwLock::new(5);
    let r1 = lock.read().unwrap();
    let r2 = lock.read().unwrap();
    println!("{}", *r1 + *r2);
}`,
    options: [
      { label: 'A', text: 'It panics because read locks cannot be acquired twice' },
      { label: 'B', text: 'It prints 10 because multiple shared reads are allowed' },
      { label: 'C', text: 'It deadlocks unconditionally on the second read() call' },
      { label: 'D', text: 'It fails to compile because r1 holds exclusive access' },
    ],
    correctIndex: 1,
    hint: 'Does RwLock permit multiple concurrent readers?',
    explanation:
      '`std::sync::RwLock` allows multiple concurrent read locks as long as no writer holds or waits for an exclusive lock. Here, both `r1` and `r2` obtain shared access on the same thread without issue, and `*r1 + *r2` evaluates to 10. Note that recursive read locks can still deadlock if another thread queues a pending write lock in between.',
  },
  
  {
    id: "conc-supporter-1",
    categorySlug: "concurrency",
    title: "Atomic Failure Ordering Constraints",
    prompt: "Why cannot the failure ordering of `compare_exchange` be `Release` or `AcqRel`?",
    tags: ["concurrency","atomics","memory-ordering"],
    difficulty: 3,
    language: 'rust',
    code: "use std::sync::atomic::{AtomicUsize, Ordering};\n\nfn main() {\n    let a = AtomicUsize::new(0);\n    let _ = a.compare_exchange(0, 1, Ordering::SeqCst, Ordering::Relaxed);\n}",
    options: [
      { label: 'A', text: "Atomic registers cannot synchronize memory during hardware bus faults" },
      { label: 'B', text: "Failure performs a read operation only, so no stores can be released" },
      { label: 'C', text: "Hardware cache lines are invalidated on failed compare-and-swap" },
      { label: 'D', text: "Release ordering requires exclusive write locks in the kernel scheduler" },
    ],
    correctIndex: 1,
    hint: "When a compare-and-swap fails, no store takes place.",
    explanation: "A failed `compare_exchange` performs only a load (read) of the current value. Because no store (write) occurs on failure, it cannot establish a \"release\" synchronization relationship.",
  },
  {
    id: "conc-supporter-2",
    categorySlug: "concurrency",
    title: "compare_exchange_weak Spurious Failure",
    prompt: "Why is `compare_exchange_weak` preferred in a retry loop on LL/SC architectures (ARM/RISC-V)?",
    tags: ["concurrency","atomics","compare-exchange"],
    difficulty: 3,
    language: 'rust',
    code: "use std::sync::atomic::{AtomicI32, Ordering};\n\nfn add_atomic(val: &AtomicI32, n: i32) {\n    let mut current = val.load(Ordering::Relaxed);\n    while let Err(actual) = val.compare_exchange_weak(\n        current,\n        current + n,\n        Ordering::Relaxed,\n        Ordering::Relaxed,\n    ) {\n        current = actual;\n    }\n}",
    options: [
      { label: 'A', text: "It prevents memory allocations in the kernel scheduler under current compiler safety rules" },
      { label: 'B', text: "It executes in constant time regardless of thread count under current compiler safety rules" },
      { label: 'C', text: "It generates faster load-linked/store-conditional instructions without extra retry loops" },
      { label: 'D', text: "It bypasses hardware cache coherence protocols completely under current compiler safety rules" },
    ],
    correctIndex: 2,
    hint: "compare_exchange_weak can fail spuriously but avoids the overhead of an inner loop on LL/SC.",
    explanation: "On Load-Linked/Store-Conditional architectures (ARM, RISC-V), `compare_exchange_weak` maps directly to single LL/SC pairs without wrapping them in an inner loop to handle spurious failures, making it faster when already inside a loop.",
  },
  {
    id: "conc-supporter-3",
    categorySlug: "concurrency",
    title: "Scoped Threads Lifetime Guarantees",
    prompt: "How do scoped threads (`std::thread::scope`) safely borrow non-'static local data?",
    tags: ["concurrency","scoped-threads","lifetimes"],
    difficulty: 2,
    language: 'rust',
    code: "use std::thread;\n\nfn main() {\n    let mut numbers = vec![1, 2, 3];\n    thread::scope(|s| {\n        s.spawn(|| {\n            numbers.push(4);\n        });\n    });\n    println!(\"{numbers:?}\");\n}",
    options: [
      { label: 'A', text: "The vector buffer is cloned and moved into thread-local storage in runtime memory" },
      { label: 'B', text: "The OS converts stack allocations into reference-counted heap pages in code" },
      { label: 'C', text: "The compiler disables context switching until all threads terminate in code" },
      { label: 'D', text: "`scope` guarantees all spawned threads finish before the closure exits" },
    ],
    correctIndex: 3,
    hint: "thread::scope joins all spawned threads before returning.",
    explanation: "`thread::scope` joins all threads spawned within the scope before returning. This guarantees that all threads finish before the stack frame of the enclosing function is popped, making borrowing stack data 100% safe.",
  },
  {
    id: "conc-supporter-4",
    categorySlug: "concurrency",
    title: "Mutex Poisoning and Recovery",
    prompt: "What happens when a thread holding a `std::sync::Mutex` panics?",
    tags: ["concurrency","mutex","poisoning"],
    difficulty: 2,
    language: 'rust',
    code: "use std::sync::Mutex;\n\nfn main() {\n    let m = Mutex::new(42);\n    let guard = m.lock().unwrap();\n    println!(\"{}\", *guard);\n}",
    options: [
      { label: 'A', text: "The Mutex becomes poisoned, returning `Err(PoisonError)` to future lock callers" },
      { label: 'B', text: "The Mutex deadlocks permanently and halts the operating system process in runtime memory" },
      { label: 'C', text: "The inner value is reset to its Default implementation automatically in runtime memory" },
      { label: 'D', text: "The panic is propagated immediately to all waiting listener threads in runtime memory" },
    ],
    correctIndex: 0,
    hint: "Panic while holding a lock poisons the mutex.",
    explanation: "If a thread holding a `MutexGuard` panics, the `Mutex` is flagged as poisoned. Future calls to `lock()` return `Err(PoisonError<MutexGuard>)`, allowing other threads to detect potentially inconsistent state or recover via `into_inner()`.",
  },
  {
    id: "conc-supporter-5",
    categorySlug: "concurrency",
    title: "OnceLock vs LazyLock Initialization",
    prompt: "What is the main semantic difference between `std::sync::LazyLock` and `OnceLock`?",
    tags: ["concurrency","lazylock","oncelock"],
    difficulty: 2,
    language: 'rust',
    code: "use std::sync::LazyLock;\n\nstatic CONFIG: LazyLock<String> = LazyLock::new(|| {\n    String::from(\"initialized\")\n});\n\nfn main() {\n    println!(\"{}\", *CONFIG);\n}",
    options: [
      { label: 'A', text: "`OnceLock` can be written to multiple times across different threads in code" },
      { label: 'B', text: "`LazyLock` takes an init closure and auto-evaluates on first dereference" },
      { label: 'C', text: "`LazyLock` requires unsafe code to read the underlying stored value in code" },
      { label: 'D', text: "`OnceLock` is non-thread-safe and intended only for single-thread apps in code" },
    ],
    correctIndex: 1,
    hint: "LazyLock wraps a closure and initializes automatically upon Deref.",
    explanation: "`LazyLock` takes an initialization closure at declaration and computes the value upon first dereference (`Deref`). `OnceLock` is manually written to with `get_or_init` or `set`.",
  },
  {
    id: "conc-supporter-6",
    categorySlug: "concurrency",
    title: "Memory Ordering Acquire-Release Pair",
    prompt: "What guarantee is provided by pairing a `Release` store with an `Acquire` load?",
    tags: ["concurrency","memory-ordering","acquire-release"],
    difficulty: 3,
    language: 'rust',
    code: "use std::sync::atomic::{AtomicBool, Ordering};\n\nstatic READY: AtomicBool = AtomicBool::new(false);\nstatic mut DATA: i32 = 0;\n\nfn writer() {\n    unsafe { DATA = 42; }\n    READY.store(true, Ordering::Release);\n}\n\nfn reader() -> Option<i32> {\n    if READY.load(Ordering::Acquire) {\n        Some(unsafe { DATA })\n    } else {\n        None\n    }\n}",
    options: [
      { label: 'A', text: "The entire program establishes a globally unified sequential execution order" },
      { label: 'B', text: "Operating system thread scheduling is synchronized across CPU cores in code" },
      { label: 'C', text: "All prior writes in writer are visible to reader once load returns true" },
      { label: 'D', text: "The memory buffer is transferred through a kernel hardware pipeline in code" },
    ],
    correctIndex: 2,
    hint: "Release synchronizes with Acquire to publish preceding memory modifications.",
    explanation: "An `Acquire` load synchronizes-with a `Release` store on the same atomic variable. Any memory operations preceding the `Release` store in program order become visible to the thread that observes the store via an `Acquire` load.",
  },
  {
    id: "conc-supporter-7",
    categorySlug: "concurrency",
    title: "Condvar Spurious Wakeups",
    prompt: "Why must `Condvar::wait` always be called inside a `while` loop condition check?",
    tags: ["concurrency","condvar","synchronization"],
    difficulty: 2,
    language: 'rust',
    code: "use std::sync::{Condvar, Mutex};\n\nfn wait_for_ready(pair: &(Mutex<bool>, Condvar)) {\n    let (lock, cvar) = pair;\n    let mut ready = lock.lock().unwrap();\n    while !*ready {\n        ready = cvar.wait(ready).unwrap();\n    }\n}",
    options: [
      { label: 'A', text: "Condvar unlocks the mutex only after the while loop body completes in runtime memory" },
      { label: 'B', text: "The compiler disables loop unrolling optimization for condition checks in runtime memory" },
      { label: 'C', text: "Thread identifiers are recycled and must be verified on each wakeup in runtime memory" },
      { label: 'D', text: "The operating system can wake waiting threads spuriously without notification" },
    ],
    correctIndex: 3,
    hint: "OS condvars can wake up spuriously without notify being called.",
    explanation: "Condition variables can wake up spuriously (without any thread calling `notify_one` or `notify_all`) due to operating system scheduling details. The predicate condition must always be rechecked in a `while` loop.",
  },
  {
    id: "conc-supporter-8",
    categorySlug: "concurrency",
    title: "RwLock Reader-Writer Priority",
    prompt: "What hazard can occur when multiple threads hold shared read locks on `RwLock`?",
    tags: ["concurrency","rwlock","starvation"],
    difficulty: 3,
    language: 'rust',
    code: "use std::sync::RwLock;\n\nfn main() {\n    let lock = RwLock::new(0);\n    let r1 = lock.read().unwrap();\n    let r2 = lock.read().unwrap();\n    println!(\"{} {}\", *r1, *r2);\n}",
    options: [
      { label: 'A', text: "Writer starvation if incoming read locks continuously overlap in time" },
      { label: 'B', text: "Automatic deadlock upon attempting any subsequent read operation in code" },
      { label: 'C', text: "Heap corruption caused by parallel unsynchronized cache accesses in code" },
      { label: 'D', text: "The compiler demoting the RwLock into an unshared Cell object in runtime memory" },
    ],
    correctIndex: 0,
    hint: "Continuous streams of read locks can prevent writers from ever acquiring the lock.",
    explanation: "If reader threads acquire shared locks in an overlapping fashion, writer threads attempting to acquire an exclusive lock may be starved indefinitely (\"writer starvation\") depending on the OS scheduler and lock implementation.",
  },
  {
    id: "conc-supporter-9",
    categorySlug: "concurrency",
    title: "Arc vs Rc Thread Safety",
    prompt: "Why does `std::sync::Arc` implement `Send` and `Sync` while `std::rc::Rc` does not?",
    tags: ["concurrency","arc","rc"],
    difficulty: 2,
    language: 'rust',
    code: "use std::sync::Arc;\n\nfn main() {\n    let data = Arc::new(100);\n    let clone = Arc::clone(&data);\n    std::thread::spawn(move || {\n        println!(\"{clone}\");\n    }).join().unwrap();\n}",
    options: [
      { label: 'A', text: "`Arc` allocates memory in the operating system kernel heap space in code" },
      { label: 'B', text: "`Arc` uses atomic CPU instructions to update its reference counts" },
      { label: 'C', text: "`Rc` uses mutex locks which are forbidden across thread boundaries" },
      { label: 'D', text: "`Arc` creates deep clones of contained data whenever spawned in code" },
    ],
    correctIndex: 1,
    hint: "Arc stands for Atomically Reference Counted.",
    explanation: "`Arc` (\"Atomic Reference Counted\") uses atomic fetch-add and fetch-sub instructions to safely update its reference count from multiple threads concurrently, whereas `Rc` uses non-atomic arithmetic and is not thread-safe.",
  },
  {
    id: "conc-supporter-10",
    categorySlug: "concurrency",
    title: "Arc::make_mut Copy-on-Write",
    prompt: "What does `Arc::make_mut(&mut arc)` do when `strong_count > 1`?",
    tags: ["concurrency","arc","cow"],
    difficulty: 3,
    language: 'rust',
    code: "use std::sync::Arc;\n\nfn main() {\n    let mut data = Arc::new(vec![1, 2, 3]);\n    let _other = Arc::clone(&data);\n    let mutable_ref = Arc::make_mut(&mut data);\n    mutable_ref.push(4);\n    println!(\"{data:?}\");\n}",
    options: [
      { label: 'A', text: "Panics immediately because shared pointers cannot be mutated in runtime memory" },
      { label: 'B', text: "Blocks the current thread until all other Arc clones are dropped in code" },
      { label: 'C', text: "Clones the inner value to create a private unique copy before mutation" },
      { label: 'D', text: "Modifies the shared buffer in-place without notifying other handles in code" },
    ],
    correctIndex: 2,
    hint: "Arc::make_mut provides Copy-on-Write semantics.",
    explanation: "`Arc::make_mut` checks if the `Arc` is uniquely owned. If `strong_count > 1`, it clones the inner data into a fresh unique `Arc` allocation and returns a mutable reference `&mut T` to the private copy.",
  },
  {
    id: "conc-supporter-11",
    categorySlug: "concurrency",
    title: "mpsc Channel Disconnect on Drop",
    prompt: "What does `rx.recv()` return when all corresponding `Sender` handles have dropped?",
    tags: ["concurrency","channels","mpsc"],
    difficulty: 2,
    language: 'rust',
    code: "use std::sync::mpsc::channel;\n\nfn main() {\n    let (tx, rx) = channel::<i32>();\n    drop(tx);\n    let result = rx.recv();\n    assert!(result.is_err());\n}",
    options: [
      { label: 'A', text: "Blocks the thread waiting for future sender connections in code" },
      { label: 'B', text: "`Ok(0)` returning the default value of the channel payload in code" },
      { label: 'C', text: "Panics immediately with a broken pipe system signal in runtime memory" },
      { label: 'D', text: "`Err(RecvError)` signaling that the channel is disconnected" },
    ],
    correctIndex: 3,
    hint: "When all senders are dropped, the channel disconnects and returns an error on recv.",
    explanation: "When all `Sender` instances for an `mpsc` channel are dropped, the channel is closed. Any pending messages in the buffer are yielded first; once empty, `rx.recv()` returns `Err(RecvError)`.",
  },
  {
    id: "conc-supporter-12",
    categorySlug: "concurrency",
    title: "Sync Trait Definition",
    prompt: "What is the formal definition of `Sync` in terms of `Send`?",
    tags: ["concurrency","sync","send"],
    difficulty: 3,
    language: 'rust',
    code: "// pub unsafe trait Sync {}",
    options: [
      { label: 'A', text: "`T: Sync` if and only if `&T: Send`" },
      { label: 'B', text: "`T: Sync` if and only if `T: Copy + Send`" },
      { label: 'C', text: "`T: Sync` if and only if `&mut T: Send`" },
      { label: 'D', text: "`T: Sync` if and only if `T: 'static`" },
    ],
    correctIndex: 0,
    hint: "A type T is Sync if it is safe to share references &T across threads (i.e. &T is Send).",
    explanation: "In Rust, `T: Sync` is defined as: `&T: Send`. In other words, a type `T` is `Sync` if and only if a shared reference `&T` can safely be sent across thread boundaries.",
  },
  {
    id: "conc-supporter-13",
    categorySlug: "concurrency",
    title: "Cell and RefCell !Sync",
    prompt: "Why are `Cell<T>` and `RefCell<T>` not `Sync` (`!Sync`)?",
    tags: ["concurrency","cell","sync"],
    difficulty: 2,
    language: 'rust',
    code: "use std::cell::Cell;\n\nfn main() {\n    let c = Cell::new(42);\n    c.set(43);\n    println!(\"{}\", c.get());\n}",
    options: [
      { label: 'A', text: "They use heap allocation mechanisms that are local to the OS process" },
      { label: 'B', text: "They allow mutation through `&self` without thread synchronization" },
      { label: 'C', text: "They contain raw pointers that cannot be formatted with Display in code" },
      { label: 'D', text: "They disable compiler optimizations across thread barriers in runtime memory" },
    ],
    correctIndex: 1,
    hint: "Interior mutability without atomic synchronization is not thread-safe.",
    explanation: "`Cell` and `RefCell` provide interior mutability via shared references (`&Cell<T>`) without using atomic operations or mutexes. Sharing `&Cell<T>` across multiple threads would cause unsynchronized concurrent writes (data races).",
  },
  {
    id: "conc-supporter-14",
    categorySlug: "concurrency",
    title: "Atomic Sequential Consistency (SeqCst)",
    prompt: "What does `Ordering::SeqCst` enforce beyond Acquire and Release?",
    tags: ["concurrency","atomics","seqcst"],
    difficulty: 3,
    language: 'rust',
    code: "use std::sync::atomic::{AtomicBool, Ordering};\n\nstatic FLAG: AtomicBool = AtomicBool::new(false);\n\nfn main() {\n    FLAG.store(true, Ordering::SeqCst);\n    let _ = FLAG.load(Ordering::SeqCst);\n}",
    options: [
      { label: 'A', text: "Complete suspension of compiler vectorization and unrolling in code" },
      { label: 'B', text: "Automatic deadlock prevention on nested Mutex locks in runtime memory" },
      { label: 'C', text: "A globally uniform total execution order observed by all threads" },
      { label: 'D', text: "Kernel-level thread prioritization for the active core in runtime memory" },
    ],
    correctIndex: 2,
    hint: "Sequential consistency establishes a single total program order.",
    explanation: "`Ordering::SeqCst` enforces a single, globally agreed-upon total execution order of all `SeqCst` operations across all threads in the system, preventing reordering that could otherwise appear in Acquire/Release.",
  },
  {
    id: "conc-supporter-15",
    categorySlug: "concurrency",
    title: "thread_local! Initialization Timing",
    prompt: "When is a `thread_local!` variable initialized?",
    tags: ["concurrency","thread-local","initialization"],
    difficulty: 2,
    language: 'rust',
    code: "use std::cell::Cell;\n\nthread_local! {\n    static COUNTER: Cell<u32> = const { Cell::new(1) };\n}\n\nfn main() {\n    COUNTER.with(|c| {\n        println!(\"{}\", c.get());\n    });\n}",
    options: [
      { label: 'A', text: "Eagerly when the main application binary is launched" },
      { label: 'B', text: "During compilation and baked into read-only binary text" },
      { label: 'C', text: "When the thread exits and terminates its stack frame" },
      { label: 'D', text: "Lazily upon first access by each respective thread" },
    ],
    correctIndex: 3,
    hint: "Thread local variables initialize lazily when first accessed via .with().",
    explanation: "`thread_local!` static variables are initialized lazily per-thread the first time that specific thread accesses the variable using `.with(...)`. Each thread maintains its own independent copy.",
  },
  {
    id: "conc-supporter-16",
    categorySlug: "concurrency",
    title: "Relaxed Ordering Guarantees",
    prompt: "What guarantee is provided by atomic operations with `Ordering::Relaxed`?",
    tags: ["concurrency","atomics","relaxed"],
    difficulty: 3,
    language: 'rust',
    code: "use std::sync::atomic::{AtomicU32, Ordering};\n\nfn increment(counter: &AtomicU32) {\n    counter.fetch_add(1, Ordering::Relaxed);\n}",
    options: [
      { label: 'A', text: "Atomicity and modification order of that single variable only" },
      { label: 'B', text: "Synchronization of all surrounding memory reads and writes in code" },
      { label: 'C', text: "Deterministic instruction execution order across CPU pipelines" },
      { label: 'D', text: "Hardware memory barrier synchronization across all cores in code" },
    ],
    correctIndex: 0,
    hint: "Relaxed only guarantees atomicity of the operation itself with no cross-variable ordering.",
    explanation: "`Ordering::Relaxed` guarantees only that the atomic operation itself is atomic (no tearing) and that all threads agree on a single modification order for that specific atomic variable, with zero cross-variable synchronization or ordering.",
  },
  {
    id: "conc-supporter-17",
    categorySlug: "concurrency",
    title: "Spinlock Memory Ordering",
    prompt: "What ordering should be used for locking a spinlock with `swap` and unlocking with `store`?",
    tags: ["concurrency","atomics","spinlock"],
    difficulty: 3,
    language: 'rust',
    code: "use std::sync::atomic::{AtomicBool, Ordering};\n\nstruct SpinLock(AtomicBool);\n\nimpl SpinLock {\n    fn lock(&self) {\n        while self.0.swap(true, Ordering::Acquire) {\n            std::hint::spin_loop();\n        }\n    }\n    fn unlock(&self) {\n        self.0.store(false, Ordering::Release);\n    }\n}",
    options: [
      { label: 'A', text: "`Relaxed` on lock acquisition, `SeqCst` on lock release in code" },
      { label: 'B', text: "`Acquire` on lock acquisition, `Release` on lock release" },
      { label: 'C', text: "`Release` on lock acquisition, `Acquire` on lock release" },
      { label: 'D', text: "`Relaxed` for both acquisition and release operations in code" },
    ],
    correctIndex: 1,
    hint: "Locking acquires access (Acquire); unlocking releases modifications (Release).",
    explanation: "Acquiring the lock requires `Ordering::Acquire` so subsequent critical section memory operations cannot be reordered before the lock. Releasing requires `Ordering::Release` so critical section writes become visible.",
  },
  {
    id: "conc-supporter-18",
    categorySlug: "concurrency",
    title: "std::hint::spin_loop Utility",
    prompt: "What is the purpose of calling `std::hint::spin_loop()` in busy-wait loops?",
    tags: ["concurrency","spin-loop","cpu"],
    difficulty: 2,
    language: 'rust',
    code: "use std::sync::atomic::{AtomicBool, Ordering};\n\nfn spin(flag: &AtomicBool) {\n    while !flag.load(Ordering::Relaxed) {\n        std::hint::spin_loop();\n    }\n}",
    options: [
      { label: 'A', text: "Forces the OS kernel to preempt the thread immediately within local thread memory" },
      { label: 'B', text: "Flushes all L1 and L2 CPU caches to main RAM memory within local thread memory" },
      { label: 'C', text: "Emits a CPU pause instruction to optimize power and pipeline performance" },
      { label: 'D', text: "Allocates a temporary mutex lock in user space during runtime execution in code" },
    ],
    correctIndex: 2,
    hint: "spin_loop emits a CPU pause (e.g. PAUSE on x86, YIELD on ARM) to reduce pipeline stalls.",
    explanation: "`std::hint::spin_loop()` emits processor-specific spin-wait hints (such as `PAUSE` on x86 or `YIELD` on ARM), preventing memory order violation pipeline stalls and saving CPU power.",
  },
  {
    id: "conc-supporter-19",
    categorySlug: "concurrency",
    title: "Mutex Deadlock Self-Locking",
    prompt: "What happens when a thread attempts to call `lock()` on a `std::sync::Mutex` it already holds?",
    tags: ["concurrency","mutex","deadlock"],
    difficulty: 2,
    language: 'rust',
    code: "use std::sync::Mutex;\n\nfn main() {\n    let m = Mutex::new(10);\n    let _g1 = m.lock().unwrap();\n    // let _g2 = m.lock().unwrap(); // deadlocks\n}",
    options: [
      { label: 'A', text: "The Mutex increments its internal recursion depth counter in runtime memory" },
      { label: 'B', text: "The second lock call returns `Err(AlreadyLockedError)` in runtime memory" },
      { label: 'C', text: "The first lock is dropped automatically and replaced by the second in code" },
      { label: 'D', text: "The thread deadlocks waiting on itself because Mutex is non-reentrant" },
    ],
    correctIndex: 3,
    hint: "Rust's standard Mutex is not reentrant.",
    explanation: "Standard `std::sync::Mutex` is non-reentrant. Attempting to acquire the lock a second time from the same thread causes a permanent deadlock waiting for itself to release the lock.",
  },
  {
    id: "conc-supporter-20",
    categorySlug: "concurrency",
    title: "SyncChannel Bounded Buffer",
    prompt: "How does `std::sync::mpsc::sync_channel(bound)` behave when the buffer is full?",
    tags: ["concurrency","channels","sync-channel"],
    difficulty: 2,
    language: 'rust',
    code: "use std::sync::mpsc::sync_channel;\n\nfn main() {\n    let (tx, rx) = sync_channel::<i32>(2);\n    tx.send(1).unwrap();\n    tx.send(2).unwrap();\n    // tx.send(3); // blocks until rx.recv()\n}",
    options: [
      { label: 'A', text: "`tx.send()` blocks the calling thread until a receiver consumes an item" },
      { label: 'B', text: "`tx.send()` discards older messages silently from the queue in runtime memory" },
      { label: 'C', text: "`tx.send()` panics immediately with a buffer overflow exception in runtime memory" },
      { label: 'D', text: "`tx.send()` returns `Err(BufferFullError)` without blocking in runtime memory" },
    ],
    correctIndex: 0,
    hint: "sync_channel provides backpressure by blocking send when the bound is reached.",
    explanation: "`sync_channel(bound)` creates a bounded channel. When the queue reaches capacity (`bound`), further calls to `tx.send(item)` block the sending thread until a receiver pulls an item with `recv()`.",
  },
  {
    id: "conc-supporter-21",
    categorySlug: "concurrency",
    title: "UnsafeCell Send Implementation",
    prompt: "Under what condition is `UnsafeCell<T>` marked `Send`?",
    tags: ["concurrency","unsafecell","send"],
    difficulty: 3,
    language: 'rust',
    code: "use std::cell::UnsafeCell;\n\nfn check_send<T: Send>() {}\n\nfn main() {\n    check_send::<UnsafeCell<String>>();\n}",
    options: [
      { label: 'A', text: "A non-blocking read operation with lock upgrade capability" },
      { label: 'B', text: "A blocking write lock operation with priority scheduling" },
      { label: 'C', text: "An asynchronous thread channel receiver with polling" },
      { label: 'D', text: "A spin-loop barrier synchronization point across cores" },
    ],
    correctIndex: 1,
    hint: "Moving ownership of an UnsafeCell across threads is safe if T can be moved (T: Send).",
    explanation: "`UnsafeCell<T>` implements `Send` if `T: Send`. Moving ownership of an `UnsafeCell` across threads transfers exclusive ownership of `T`, which is safe whenever `T` can be sent.",
  },
  {
    id: "conc-supporter-22",
    categorySlug: "concurrency",
    title: "Atomic Pointer Ordering",
    prompt: "What atomic type is used for atomic raw pointer operations?",
    tags: ["concurrency","atomic-ptr","raw-pointers"],
    difficulty: 2,
    language: 'rust',
    code: "use std::sync::atomic::{AtomicPtr, Ordering};\n\nfn main() {\n    let mut val = 42;\n    let ptr = AtomicPtr::new(&mut val);\n    let loaded = ptr.load(Ordering::Acquire);\n    assert!(!loaded.is_null());\n}",
    options: [
      { label: 'A', text: "The lock remains acquired until the guard goes out of scope" },
      { label: 'B', text: "The lock is released immediately after the closure returns" },
      { label: 'C', text: "The lock is transferred to the operating system kernel mutex" },
      { label: 'D', text: "The lock is cloned into all child background worker threads" },
    ],
    correctIndex: 2,
    hint: "AtomicPtr<T> provides atomic operations on raw mutable pointers *mut T.",
    explanation: "`std::sync::atomic::AtomicPtr<T>` provides atomic load, store, swap, and compare-and-swap operations on `*mut T` pointers across threads.",
  },
  {
    id: "conc-supporter-23",
    categorySlug: "concurrency",
    title: "Barrier Synchronization",
    prompt: "What happens when a thread calls `std::sync::Barrier::wait()`?",
    tags: ["concurrency","barrier","coordination"],
    difficulty: 2,
    language: 'rust',
    code: "use std::sync::{Arc, Barrier};\nuse std::thread;\n\nfn main() {\n    let barrier = Arc::new(Barrier::new(2));\n    let c = Arc::clone(&barrier);\n    thread::spawn(move || {\n        c.wait();\n    });\n    barrier.wait();\n}",
    options: [
      { label: 'A', text: "Signals a condition variable and terminates the calling thread in runtime memory" },
      { label: 'B', text: "Acquires exclusive write access to a shared memory pool in runtime memory" },
      { label: 'C', text: "Spawns background OS worker threads to balance CPU load in runtime memory" },
      { label: 'D', text: "Blocks until the specified number of threads have all called `wait()`" },
    ],
    correctIndex: 3,
    hint: "A Barrier blocks all calling threads until N threads have arrived.",
    explanation: "A `Barrier` enables multiple threads to synchronize the beginning of some computation. Calling `barrier.wait()` blocks the thread until exactly `N` threads have called `wait()`, at which point all threads are released simultaneously.",
  },
  {
    id: "conc-supporter-24",
    categorySlug: "concurrency",
    title: "False Sharing and Alignment",
    prompt: "How do concurrent programs prevent false sharing on multicore CPUs in Rust?",
    tags: ["concurrency","false-sharing","alignment"],
    difficulty: 3,
    language: 'rust',
    code: "#[repr(align(64))]\nstruct CachePadded<T>(T);",
    options: [
      { label: 'A', text: "By aligning variables to the CPU cache line boundary (`#[repr(align(64))]`)" },
      { label: 'B', text: "By disabling L1 CPU caches during compilation with compiler flags in runtime memory" },
      { label: 'C', text: "By wrapping all atomic variables inside standard Mutex locks in runtime memory" },
      { label: 'D', text: "By allocating all shared variables on distinct thread stacks in runtime memory" },
    ],
    correctIndex: 0,
    hint: "False sharing occurs when independent variables share a single 64-byte cache line.",
    explanation: "False sharing occurs when variables modified by different cores reside on the same cache line (typically 64 bytes), causing unnecessary cache invalidations. Using `#[repr(align(64))]` ensures each variable occupies its own cache line.",
  },
  {
    id: "conc-supporter-25",
    categorySlug: "concurrency",
    title: "AtomicBool Fetch Operations",
    prompt: "What does `flag.fetch_or(true, Ordering::SeqCst)` return?",
    tags: ["concurrency","atomics","fetch-or"],
    difficulty: 2,
    language: 'rust',
    code: "use std::sync::atomic::{AtomicBool, Ordering};\n\nfn main() {\n    let flag = AtomicBool::new(false);\n    let old = flag.fetch_or(true, Ordering::SeqCst);\n    assert_eq!(old, false);\n    assert_eq!(flag.load(Ordering::SeqCst), true);\n}",
    options: [
      { label: 'A', text: "The new boolean value resulting from the OR operation in code" },
      { label: 'B', text: "The previous boolean value before the OR operation occurred" },
      { label: 'C', text: "`true` if and only if the bitwise operation changed state in code" },
      { label: 'D', text: "A boolean error flag indicating whether bus collision occurred" },
    ],
    correctIndex: 1,
    hint: "All fetch_* methods on atomics return the previous value held by the atomic.",
    explanation: "`AtomicBool::fetch_or(val, ...)` performs a bitwise OR operation and returns the *previous* boolean value that was contained in the atomic before the operation.",
  },
  {
    id: "conc-supporter-26",
    categorySlug: "concurrency",
    title: "Arc Weak Downgrade",
    prompt: "What is the purpose of `Arc::downgrade`?",
    tags: ["concurrency","arc","weak"],
    difficulty: 2,
    language: 'rust',
    code: "use std::sync::{Arc, Weak};\n\nfn main() {\n    let strong = Arc::new(10);\n    let weak: Weak<i32> = Arc::downgrade(&strong);\n    assert!(weak.upgrade().is_some());\n}",
    options: [
      { label: 'A', text: "Converts an atomic Arc into a thread-local single-threaded Rc in runtime memory" },
      { label: 'B', text: "Demotes the priority of the thread accessing the shared resource in runtime memory" },
      { label: 'C', text: "Creates a non-owning `Weak` reference to prevent circular reference leaks" },
      { label: 'D', text: "Releases memory back to the operating system heap immediately in runtime memory" },
    ],
    correctIndex: 2,
    hint: "Weak references do not prevent the inner value from being dropped.",
    explanation: "`Arc::downgrade` creates a `Weak<T>` pointer that tracks reference counts without preventing the inner value from being dropped when all `Arc` instances go out of scope, preventing memory cycles.",
  },
  {
    id: "conc-supporter-27",
    categorySlug: "concurrency",
    title: "AtomicI64 vs AtomicIsize Portability",
    prompt: "Why might `AtomicI64` be unavailable on certain 32-bit embedded targets?",
    tags: ["concurrency","atomics","portability"],
    difficulty: 3,
    language: 'rust',
    code: "use std::sync::atomic::AtomicI64;\n\nfn main() {\n    let _ = AtomicI64::new(0);\n}",
    options: [
      { label: 'A', text: "Rust 2024 deprecated 64-bit integer atomics across all platforms in runtime memory" },
      { label: 'B', text: "32-bit platforms forbid all atomic operations by specification in runtime memory" },
      { label: 'C', text: "Embedded targets require floating point coprocessors for atomics in runtime memory" },
      { label: 'D', text: "The target CPU architecture lacks 64-bit atomic load/store instructions" },
    ],
    correctIndex: 3,
    hint: "Lock-free atomics require hardware CPU support for the corresponding word size.",
    explanation: "Some 32-bit processors do not support hardware 64-bit atomic instructions. On such architectures, `AtomicI64` is omitted or requires library emulation, while `AtomicIsize` is guaranteed to match the pointer width.",
  },
  {
    id: "conc-supporter-28",
    categorySlug: "concurrency",
    title: "Send Trait on MutexGuard",
    prompt: "Why is `std::sync::MutexGuard` marked `!Send` on some platforms?",
    tags: ["concurrency","mutex-guard","send"],
    difficulty: 3,
    language: 'rust',
    code: "use std::sync::Mutex;\n\nfn main() {\n    let m = Mutex::new(1);\n    let guard = m.lock().unwrap();\n    println!(\"{}\", *guard);\n}",
    options: [
      { label: 'A', text: "Underlying OS primitives (like POSIX pthreads) require unlocks from the locking thread" },
      { label: 'B', text: "Mutex guards contain internal heap pointers that cannot be copied within local thread memory" },
      { label: 'C', text: "The compiler cannot generate drop glue for mutex guards across threads within local thread memory" },
      { label: 'D', text: "Mutex guards automatically poison the mutex when moved under current compiler safety rules" },
    ],
    correctIndex: 0,
    hint: "POSIX pthread mutexes mandate that the thread that locked the mutex must be the one to unlock it.",
    explanation: "Many operating systems (including POSIX pthread mutexes) mandate that a mutex must be unlocked by the exact same thread that locked it. Therefore, `MutexGuard` is `!Send` to prevent releasing the lock on a different thread.",
  },
  {
    id: "conc-supporter-29",
    categorySlug: "concurrency",
    title: "Atomic Fence Operations",
    prompt: "What is `std::sync::atomic::fence` used for?",
    tags: ["concurrency","fence","memory-ordering"],
    difficulty: 3,
    language: 'rust',
    code: "use std::sync::atomic::{fence, Ordering};\n\nfn sync_memory() {\n    fence(Ordering::SeqCst);\n}",
    options: [
      { label: 'A', text: "Blocks thread execution until all CPU cache lines are completely drained in runtime memory" },
      { label: 'B', text: "Establishes memory synchronization order without binding to a specific variable" },
      { label: 'C', text: "Prevents thread interrupts and context switches in kernel space within local thread memory" },
      { label: 'D', text: "Allocates a hardware synchronization barrier on the processor bus in runtime memory" },
    ],
    correctIndex: 1,
    hint: "Atomic fences establish ordering constraints independent of individual atomic variables.",
    explanation: "`std::sync::atomic::fence(ordering)` inserts a memory barrier that synchronizes memory accesses without operating directly on a specific atomic variable.",
  },
  {
    id: "conc-supporter-30",
    categorySlug: "concurrency",
    title: "Thread Builder Stack Size",
    prompt: "How can you configure the stack size for a newly spawned OS thread in Rust?",
    tags: ["concurrency","threads","stack-size"],
    difficulty: 2,
    language: 'rust',
    code: "use std::thread;\n\nfn main() {\n    let builder = thread::Builder::new().stack_size(4 * 1024 * 1024);\n    let handler = builder.spawn(|| {\n        println!(\"custom stack size\");\n    }).unwrap();\n    handler.join().unwrap();\n}",
    options: [
      { label: 'A', text: "By passing a size argument directly to `thread::spawn`" },
      { label: 'B', text: "By configuring the `RUST_STACK_SIZE` environment variable" },
      { label: 'C', text: "Using `std::thread::Builder::new().stack_size(...)`" },
      { label: 'D', text: "Through the `#[stack(4096)]` compiler attribute on the closure" },
    ],
    correctIndex: 2,
    hint: "std::thread::Builder allows configuring thread name and stack size.",
    explanation: "`std::thread::Builder` provides fine-grained control over thread attributes, allowing callers to set the thread name (`name`) and stack size (`stack_size`) before spawning.",
  },
  {
    id: "conc-supporter-31",
    categorySlug: "concurrency",
    title: "AtomicUsize vs Mutex<usize> Performance",
    prompt: "Why is `AtomicUsize` generally faster than `Mutex<usize>` for a single counter?",
    tags: ["concurrency","atomics","mutex"],
    difficulty: 2,
    language: 'rust',
    code: "use std::sync::atomic::{AtomicUsize, Ordering};\n\nstatic COUNTER: AtomicUsize = AtomicUsize::new(0);\n\nfn tick() {\n    COUNTER.fetch_add(1, Ordering::Relaxed);\n}",
    options: [
      { label: 'A', text: "It runs the increment asynchronously on a background thread pool in runtime memory" },
      { label: 'B', text: "It stores counter data in CPU register space permanently in runtime memory" },
      { label: 'C', text: "It disables compiler bounds checks during arithmetic updates in runtime memory" },
      { label: 'D', text: "It maps to single hardware CPU instructions without OS context switches" },
    ],
    correctIndex: 3,
    hint: "Atomics use hardware lock-free instructions (like LOCK XADD on x86) with no syscalls.",
    explanation: "`AtomicUsize` compiles directly to single hardware atomic CPU instructions (e.g. `LOCK XADD` on x86), avoiding OS syscalls, thread parking, and context switches involved in `Mutex`.",
  },
  {
    id: "conc-supporter-32",
    categorySlug: "concurrency",
    title: "Arc Strong Count vs Weak Count",
    prompt: "When does `Arc<T>` deallocate the underlying heap allocation for `T`?",
    tags: ["concurrency","arc","drop"],
    difficulty: 3,
    language: 'rust',
    code: "use std::sync::Arc;\n\nfn main() {\n    let strong = Arc::new(String::from(\"data\"));\n    let weak = Arc::downgrade(&strong);\n    drop(strong);\n    assert!(weak.upgrade().is_none());\n}",
    options: [
      { label: 'A', text: "`T` is dropped when `strong_count` hits 0; memory is freed when `weak_count` also hits 0" },
      { label: 'B', text: "Memory and `T` are both immediately deallocated when `strong_count` hits 0 in runtime memory" },
      { label: 'C', text: "`T` is kept alive until the process terminates regardless of counts within local thread memory" },
      { label: 'D', text: "`T` is moved onto the stack of the last thread referencing `weak` within local thread memory" },
    ],
    correctIndex: 0,
    hint: "The inner T is dropped when strong count reaches 0, but the counter block persists until weak count is 0.",
    explanation: "When `strong_count` drops to 0, the inner `T` is destroyed (`Drop::drop`). However, the memory block containing the reference counters remains allocated until all `Weak` references are dropped (`weak_count == 0`).",
  },
  {
    id: "conc-supporter-33",
    categorySlug: "concurrency",
    title: "Thread Park and Unpark",
    prompt: "How do `std::thread::park()` and `thread::unpark()` coordinate threads?",
    tags: ["concurrency","threads","park"],
    difficulty: 2,
    language: 'rust',
    code: "use std::thread;\nuse std::time::Duration;\n\nfn main() {\n    let handle = thread::spawn(|| {\n        thread::park();\n        println!(\"unparked!\");\n    });\n    thread::sleep(Duration::from_millis(10));\n    handle.thread().unpark();\n    handle.join().unwrap();\n}",
    options: [
      { label: 'A', text: "`park` saves thread registers to disk storage for later resumption within local thread memory" },
      { label: 'B', text: "`park` suspends the current thread until another thread calls `unpark` on its handle" },
      { label: 'C', text: "`unpark` forces immediate termination of the target thread handle within local thread memory" },
      { label: 'D', text: "`park` causes the thread to continuously poll CPU in a busy loop within local thread memory" },
    ],
    correctIndex: 1,
    hint: "Thread parking allows efficient low-level thread sleeping and waking.",
    explanation: "`std::thread::park()` blocks the current thread until its token is made available via `handle.thread().unpark()`. Unpark tokens are saturated (at most 1), avoiding lost wakeups if `unpark` is called before `park`.",
  },
  {
    id: "conc-supporter-34",
    categorySlug: "concurrency",
    title: "Atomic CAS ABA Problem",
    prompt: "What is the ABA problem in lock-free concurrent programming?",
    tags: ["concurrency","atomics","lock-free"],
    difficulty: 3,
    language: 'rust',
    code: "// Value changes from A -> B -> A; CAS succeeds despite intervening changes",
    options: [
      { label: 'A', text: "Two threads deadlocking on atomic variable assignment order under current compiler safety rules" },
      { label: 'B', text: "Bitwise integer overflow causing undefined behavior in release mode within local thread memory" },
      { label: 'C', text: "A location changes from A to B and back to A, tricking a CAS into falsely assuming no change" },
      { label: 'D', text: "A compiler bug reordering atomic load instructions ahead of stores under current compiler safety rules" },
    ],
    correctIndex: 2,
    hint: "ABA occurs when a value looks unchanged to CAS despite intermediate modifications.",
    explanation: "The ABA problem occurs when a memory location is read as `A`, modified to `B` by another thread, and then modified back to `A`. A subsequent CAS succeeds because the value is `A`, even though internal state or pointer targets may have changed.",
  },
  {
    id: "conc-supporter-35",
    categorySlug: "concurrency",
    title: "Sync Trait on Raw Pointers",
    prompt: "Why do `*const T` and `*mut T` not implement `Send` or `Sync`?",
    tags: ["concurrency","raw-pointers","safety"],
    difficulty: 2,
    language: 'rust',
    code: "fn check_sync<T: Sync>() {}\n\n// check_sync::<*const i32>(); // Error: *const i32 is not Sync",
    options: [
      { label: 'A', text: "Raw pointers cannot be formatted with Debug or Display traits in runtime memory" },
      { label: 'B', text: "64-bit pointers cannot fit inside CPU registers across threads in runtime memory" },
      { label: 'C', text: "Raw pointers are automatically freed when crossing thread borders in runtime memory" },
      { label: 'D', text: "Raw pointers lack compiler lifetime and aliasing guarantees across threads" },
    ],
    correctIndex: 3,
    hint: "Raw pointers have no aliasing or lifetime checks, so sending or sharing them is inherently unsafe.",
    explanation: "Because raw pointers bypass Rust's borrow checker (allowing unconstrained aliasing, mutation, and nullability), the compiler cannot verify thread-safety invariants. Developers must manually use `unsafe impl Send` / `Sync` after verifying safety.",
  },
  {
    id: "conc-code-spawn-join",
    categorySlug: "concurrency",
    title: "Parallel Thread Sum",
    difficulty: 2,
    language: 'rust',
    kind: 'coding',
    tags: ["concurrency", 'coding'],
    prompt: "Implement `parallel_sum(a: i32, b: i32) -> i32` spawning two threads: one computing `a * 2`, one computing `b * 3`, and joining both to return their sum.",
    code: "use std::thread;\n\npub fn parallel_sum(a: i32, b: i32) -> i32 {\n    let h1 = thread::spawn(move || a * 2);\n    let h2 = thread::spawn(move || b * 3);\n    h1.join().unwrap() + h2.join().unwrap()\n}",
    testHarness: "{{SOLUTION}}\n\nfn main() {\n    assert_eq!(parallel_sum(5, 4), 10 + 12);\n    println!(\"test passed\");\n}\n",
    explanation: "Implement `parallel_sum(a: i32, b: i32) -> i32` spawning two threads: one computing `a * 2`, one computing `b * 3`, and joining both to return their sum. Review the test cases to verify all assertions.",
  },
  {
    id: "conc-code-mpsc-channel",
    categorySlug: "concurrency",
    title: "MPSC Channel Message Sum",
    difficulty: 2,
    language: 'rust',
    kind: 'coding',
    tags: ["concurrency", 'coding'],
    prompt: "Implement `channel_sum(numbers: Vec<i32>) -> i32` sending each number through an `mpsc::channel` from a worker thread, and summing received messages in the main thread.",
    code: "use std::sync::mpsc;\nuse std::thread;\n\npub fn channel_sum(numbers: Vec<i32>) -> i32 {\n    let (tx, rx) = mpsc::channel();\n    thread::spawn(move || {\n        for n in numbers {\n            tx.send(n).unwrap();\n        }\n    });\n\n    let mut sum = 0;\n    while let Ok(val) = rx.recv() {\n        sum += val;\n    }\n    sum\n}",
    testHarness: "{{SOLUTION}}\n\nfn main() {\n    let res = channel_sum(vec![1, 2, 3, 4, 5]);\n    assert_eq!(res, 15);\n    println!(\"test passed\");\n}\n",
    explanation: "Implement `channel_sum(numbers: Vec<i32>) -> i32` sending each number through an `mpsc::channel` from a worker thread, and summing received messages in the main thread. Review the test cases to verify all assertions.",
  },
  {
    id: "conc-code-mutex-counter",
    categorySlug: "concurrency",
    title: "Shared Mutex Counter",
    difficulty: 2,
    language: 'rust',
    kind: 'coding',
    tags: ["concurrency", 'coding'],
    prompt: "Implement `concurrent_count(threads: usize, increments_per_thread: usize) -> usize` using `Arc<Mutex<usize>>` to coordinate concurrent increments across threads.",
    code: "use std::sync::{Arc, Mutex};\nuse std::thread;\n\npub fn concurrent_count(threads: usize, increments_per_thread: usize) -> usize {\n    let counter = Arc::new(Mutex::new(0));\n    let mut handles = Vec::new();\n\n    for _ in 0..threads {\n        let c = Arc::clone(&counter);\n        handles.push(thread::spawn(move || {\n            for _ in 0..increments_per_thread {\n                let mut lock = c.lock().unwrap();\n                *lock += 1;\n            }\n        }));\n    }\n\n    for h in handles {\n        h.join().unwrap();\n    }\n\n    let final_val = *counter.lock().unwrap();\n    final_val\n}",
    testHarness: "{{SOLUTION}}\n\nfn main() {\n    let total = concurrent_count(4, 250);\n    assert_eq!(total, 1000);\n    println!(\"test passed\");\n}\n",
    explanation: "Implement `concurrent_count(threads: usize, increments_per_thread: usize) -> usize` using `Arc<Mutex<usize>>` to coordinate concurrent increments across threads. Review the test cases to verify all assertions.",
  },
  {
    id: "conc-code-rwlock-read",
    categorySlug: "concurrency",
    title: "Concurrent Read with RwLock",
    difficulty: 2,
    language: 'rust',
    kind: 'coding',
    tags: ["concurrency", 'coding'],
    prompt: "Implement `read_shared_map(map: &std::sync::RwLock<std::collections::HashMap<String, i32>>, key: &str) -> Option<i32>` acquiring a shared read lock.",
    code: "use std::collections::HashMap;\nuse std::sync::RwLock;\n\npub fn read_shared_map(map: &RwLock<HashMap<String, i32>>, key: &str) -> Option<i32> {\n    let reader = map.read().unwrap();\n    reader.get(key).copied()\n}",
    testHarness: "{{SOLUTION}}\n\nfn main() {\n    let mut init = HashMap::new();\n    init.insert(String::from(\"key1\"), 42);\n    let lock = RwLock::new(init);\n\n    assert_eq!(read_shared_map(&lock, \"key1\"), Some(42));\n    assert_eq!(read_shared_map(&lock, \"key2\"), None);\n    println!(\"test passed\");\n}\n",
    explanation: "Implement `read_shared_map(map: &std::sync::RwLock<std::collections::HashMap<String, i32>>, key: &str) -> Option<i32>` acquiring a shared read lock. Review the test cases to verify all assertions.",
  },
  {
    id: "conc-code-atomic-bool",
    categorySlug: "concurrency",
    title: "Lock-Free Atomic Flag",
    difficulty: 2,
    language: 'rust',
    kind: 'coding',
    tags: ["concurrency", 'coding'],
    prompt: "Implement `AtomicFlag` using `std::sync::atomic::AtomicBool`. Support `new()`, `set()`, and `is_set() -> bool` with `Ordering::SeqCst`.",
    code: "use std::sync::atomic::{AtomicBool, Ordering};\n\npub struct AtomicFlag {\n    flag: AtomicBool,\n}\n\nimpl AtomicFlag {\n    pub fn new() -> Self {\n        Self { flag: AtomicBool::new(false) }\n    }\n\n    pub fn set(&self) {\n        self.flag.store(true, Ordering::SeqCst);\n    }\n\n    pub fn is_set(&self) -> bool {\n        self.flag.load(Ordering::SeqCst)\n    }\n}",
    testHarness: "{{SOLUTION}}\n\nfn main() {\n    let flag = AtomicFlag::new();\n    assert!(!flag.is_set());\n    flag.set();\n    assert!(flag.is_set());\n    println!(\"test passed\");\n}\n",
    explanation: "Implement `AtomicFlag` using `std::sync::atomic::AtomicBool`. Support `new()`, `set()`, and `is_set() -> bool` with `Ordering::SeqCst`. Review the test cases to verify all assertions.",
  },
  {
    id: "conc-code-barrier-sync",
    categorySlug: "concurrency",
    title: "Thread Synchronization with Barrier",
    difficulty: 3,
    language: 'rust',
    kind: 'coding',
    tags: ["concurrency", 'coding'],
    prompt: "Implement `sync_workers(n_workers: usize)` using `std::sync::Barrier` to coordinate `n_workers` threads reaching a rendezvous point before completing.",
    code: "use std::sync::{Arc, Barrier};\nuse std::thread;\n\npub fn sync_workers(n_workers: usize) -> Vec<usize> {\n    let barrier = Arc::new(Barrier::new(n_workers));\n    let mut handles = Vec::new();\n\n    for i in 0..n_workers {\n        let b = Arc::clone(&barrier);\n        handles.push(thread::spawn(move || {\n            b.wait();\n            i\n        }));\n    }\n\n    handles.into_iter().map(|h| h.join().unwrap()).collect()\n}",
    testHarness: "{{SOLUTION}}\n\nfn main() {\n    let results = sync_workers(4);\n    assert_eq!(results.len(), 4);\n    println!(\"test passed\");\n}\n",
    explanation: "Implement `sync_workers(n_workers: usize)` using `std::sync::Barrier` to coordinate `n_workers` threads reaching a rendezvous point before completing. Review the test cases to verify all assertions.",
  },
  {
    id: 'conc-sync-send-raw-ptr-1',
    categorySlug: 'concurrency',
    title: 'Send and Sync for Raw Pointers',
    prompt: 'What are the default `Send` and `Sync` implementations for `*const T` and `*mut T`?',
    tags: ['concurrency', 'send', 'sync', 'raw-pointers'],
    difficulty: 2,
    language: 'rust',
    options: [
      { label: 'A', text: 'They are automatically marked Send by the borrow checker' },
      { label: 'B', text: 'They do not implement Send or Sync without unsafe impl' },
      { label: 'C', text: 'They can be sent across threads only if cast to usize' },
      { label: 'D', text: 'They implement Sync but require locks to implement Send' },
    ],
    correctIndex: 1,
    hint: 'Raw pointers are !Send and !Sync by default to preserve thread safety.',
    explanation: 'Raw pointers do not implement `Send` or `Sync` because the compiler cannot verify aliasing or safety across threads. Implementing them requires explicit `unsafe impl`.',
  },
  {
    id: 'conc-condvar-wait-mutex-1',
    categorySlug: 'concurrency',
    title: 'Condvar wait Mutex Release',
    prompt: 'What happens atomically when calling `condvar.wait(guard)`?',
    tags: ['concurrency', 'condvar', 'mutex'],
    difficulty: 2,
    language: 'rust',
    options: [
      { label: 'A', text: 'It unlocks the Mutex and suspends the current thread' },
      { label: 'B', text: 'It polls the condition variable in a tight CPU loop' },
      { label: 'C', text: 'It converts the Mutex into a non-blocking spin lock' },
      { label: 'D', text: 'It spawns a detached background thread to run checks' },
    ],
    correctIndex: 0,
    hint: 'wait releases the mutex lock and blocks the thread atomically.',
    explanation: '`Condvar::wait` atomically unlocks the associated `MutexGuard` and blocks the calling thread, re-acquiring the lock before returning when notified.',
  },
  {
    id: 'conc-atomic-fetch-update-1',
    categorySlug: 'concurrency',
    title: 'Atomic fetch_update Loop',
    prompt: 'How does `AtomicI32::fetch_update` achieve lock-free mutation?',
    tags: ['concurrency', 'atomics', 'fetch-update'],
    difficulty: 3,
    language: 'rust',
    options: [
      { label: 'A', text: 'It acquires a coarse global reader-writer lock mutex' },
      { label: 'B', text: 'It allocates temporary atomic tokens in thread memory' },
      { label: 'C', text: 'It crashes if another thread modifies value in flight' },
      { label: 'D', text: 'It applies a closure repeatedly inside an atomic loop' },
    ],
    correctIndex: 3,
    hint: 'fetch_update wraps compare_exchange in a retry loop applying your update function.',
    explanation: '`fetch_update` repeatedly loads the current value, computes the new value via closure, and performs `compare_exchange_weak` in a lock-free CAS loop until successful.',
  },
  {
    id: 'conc-rwlock-upgrade-deadlock-1',
    categorySlug: 'concurrency',
    title: 'RwLock Upgrade Deadlock Risk',
    prompt: 'Why does `std::sync::RwLock` not allow direct lock upgrading from read to write?',
    tags: ['concurrency', 'rwlock', 'deadlock'],
    difficulty: 2,
    language: 'rust',
    options: [
      { label: 'A', text: 'Upgrading from read to write lock is always lock-free' },
      { label: 'B', text: 'The reader lock is silently dropped and re-acquired' },
      { label: 'C', text: 'Two readers trying to acquire write lock will deadlock' },
      { label: 'D', text: 'RwLock prevents multiple readers from reading at once' },
    ],
    correctIndex: 2,
    hint: 'If two threads holding read locks attempt to upgrade simultaneously, neither can proceed.',
    explanation: 'If multiple threads holding shared read locks attempt to upgrade to exclusive write access, they will mutually wait for each other to release the read lock, causing deadlock.',
  },
  {
    id: 'conc-once-cell-lazy-init-1',
    categorySlug: 'concurrency',
    title: 'OnceLock Thread-Safe Initialization',
    prompt: 'What guarantee does `std::sync::OnceLock::get_or_init` provide?',
    tags: ['concurrency', 'once-lock', 'lazy'],
    difficulty: 1,
    language: 'rust',
    options: [
      { label: 'A', text: 'It requires manual lock acquisition and unlock calls' },
      { label: 'B', text: 'It guarantees the initializer runs at most once total' },
      { label: 'C', text: 'It evaluates initialization eagerly on thread spawn' },
      { label: 'D', text: 'It allocates every initialized struct on system heap' },
    ],
    correctIndex: 1,
    hint: 'OnceLock initializes a value lazily and thread-safely exactly once.',
    explanation: '`OnceLock::get_or_init` guarantees that even under concurrent multi-threaded access, the initialization closure is executed at most once, safely sharing the result.',
  },
  {
    id: 'conc-atomic-ordering-release-acquire-1',
    categorySlug: 'concurrency',
    title: 'Acquire-Release Memory Ordering',
    prompt: 'How do `Ordering::Release` and `Ordering::Acquire` synchronize across threads in Rust?',
    tags: ['concurrency', 'atomics', 'memory-ordering', 'acquire-release'],
    difficulty: 3,
    language: 'rust',
    options: [
      { label: 'A', text: 'Acquire stores synchronize with Release load operations' },
      { label: 'B', text: 'Release and Acquire enforce total sequential consistency' },
      { label: 'C', text: 'Release stores synchronize with Acquire loads on same atom' },
      { label: 'D', text: 'Relaxed ordering provides mutual exclusion across threads' },
    ],
    correctIndex: 2,
    hint: 'A store-Release establishes a happens-before relationship with a load-Acquire observing that store.',
    explanation: 'A store with `Ordering::Release` synchronizes-with a load with `Ordering::Acquire` that reads the stored value, ensuring all prior writes are visible to the acquiring thread.',
  },
  {
    id: 'conc-scoped-threads-stack-borrow-1',
    categorySlug: 'concurrency',
    title: 'std::thread::scope Borrow Safety',
    prompt: 'Why can threads spawned via `std::thread::scope` borrow non-\'static stack data safely?',
    tags: ['concurrency', 'scoped-threads', 'lifetimes'],
    difficulty: 2,
    language: 'rust',
    options: [
      { label: 'A', text: 'It guarantees threads join before the scope closure returns' },
      { label: 'B', text: 'It converts local stack variables into heap-allocated Arcs' },
      { label: 'C', text: 'It requires all borrowed stack references to live forever' },
      { label: 'D', text: 'It runs all spawned thread closures sequentially in order' },
    ],
    correctIndex: 0,
    hint: 'The scope closure cannot exit until all spawned threads have terminated and joined.',
    explanation: '`thread::scope` guarantees that all spawned threads complete before the scope exits, ensuring any stack references borrowed by threads remain valid for their entire execution.',
  },
  {
    id: 'conc-mutex-poisoning-unwind-panic-1',
    categorySlug: 'concurrency',
    title: 'Mutex Poisoning Semantics',
    prompt: 'What happens to a `std::sync::Mutex` if a thread panics while holding the `MutexGuard`?',
    tags: ['concurrency', 'mutex', 'poisoning'],
    difficulty: 2,
    language: 'rust',
    options: [
      { label: 'A', text: 'The lock is automatically freed and marked completely sound' },
      { label: 'B', text: 'The Mutex is poisoned, returning PoisonError on next lock' },
      { label: 'C', text: 'The process aborts immediately with a hardware exception' },
      { label: 'D', text: 'The locked data is reset to its Default::default() value' },
    ],
    correctIndex: 1,
    hint: 'Panicking with an active lock poisons the Mutex to protect invariants.',
    explanation: 'When a thread panics while holding a `MutexGuard`, the `Mutex` becomes "poisoned". Subsequent `lock()` attempts return `Err(PoisonError)`, signaling potential invariant corruption.',
  },
  {
    id: 'conc-atomic-fence-synchronization-1',
    categorySlug: 'concurrency',
    title: 'Atomic Fences Synchronization',
    prompt: 'What does `std::sync::atomic::fence(Ordering)` do in concurrent algorithms?',
    tags: ['concurrency', 'atomics', 'fence'],
    difficulty: 3,
    language: 'rust',
    options: [
      { label: 'A', text: 'Fences lock all CPU hardware cores in a global busy loop' },
      { label: 'B', text: 'Fences allocate dynamic synchronization barriers on heap' },
      { label: 'C', text: 'Fences replace atomic instructions with operating mutexes' },
      { label: 'D', text: 'Fences establish memory ordering without modifying memory' },
    ],
    correctIndex: 3,
    hint: 'An atomic fence establishes memory ordering constraints on prior/subsequent operations without an atomic read/write.',
    explanation: '`atomic::fence` establishes synchronization and memory ordering constraints between threads without performing an atomic operation on a specific memory location.',
  },
  {
    id: 'conc-channel-disconnection-hang-1',
    categorySlug: 'concurrency',
    title: 'MPSC Channel Disconnection Behavior',
    prompt: 'What happens when calling `rx.recv()` on a channel after all `Sender` instances have been dropped?',
    tags: ['concurrency', 'channels', 'mpsc'],
    difficulty: 1,
    language: 'rust',
    options: [
      { label: 'A', text: 'rx.recv() returns Err(RecvError) when all senders drop' },
      { label: 'B', text: 'rx.recv() hangs forever waiting for fresh message data' },
      { label: 'C', text: 'rx.recv() panics dynamically at runtime upon channel end' },
      { label: 'D', text: 'rx.recv() creates a new Sender channel handle in thread' },
    ],
    correctIndex: 0,
    hint: 'When all senders are dropped and buffer is empty, recv() unblocks and returns Err(RecvError).',
    explanation: 'When all `Sender` handles have dropped and the queue is empty, `rx.recv()` returns `Err(RecvError)`, indicating the channel is disconnected.',
  },
]
