import type { TutorialChapter } from '../types'

export const chapter11Concurrency: TutorialChapter = {
  id: 'concurrency',
  number: 11,
  title: 'Fearless Concurrency',
  description: 'Parallel programming without data races: thread spawning, message channels, and Arc<Mutex<T>>.',
  icon: '⚔️',
  lessons: [
    {
      id: '30-threads-and-spawn',
      chapterId: 'concurrency',
      chapterNumber: 11,
      lessonNumber: 1,
      title: 'Spawning Threads & `move` Closures',
      tagline: 'Creating operating system threads and joining their results safely.',
      readTimeMinutes: 7,
      difficulty: 'advanced',
      tags: ['threads', 'spawn', 'join', 'concurrency'],
      overview: 'Rust offers 1:1 operating system threads via `std::thread`. The type system and borrow checker guarantee that data races and concurrency errors are caught at compile time.',
      sections: [
        {
          id: 'spawning-threads',
          title: 'Spawning Threads with `thread::spawn`',
          content: `Call \`thread::spawn\` to start a new thread. Use \`handle.join().unwrap()\` to wait for the spawned thread to finish and retrieve its returned value:`,
          codeSnippet: {
            code: `use std::thread;
use std::time::Duration;

fn main() {
    let handle = thread::spawn(|| {
        for i in 1..5 {
            println!("Thread counter: {}", i);
            thread::sleep(Duration::from_millis(1));
        }
        42 // thread return value
    });

    let result = handle.join().unwrap();
    println!("Spawned thread finished with result: {}", result);
}`,
            caption: 'Spawning and joining threads in Rust.',
          },
        },
        {
          id: 'move-closures-threads',
          title: 'Using `move` Closures with Threads',
          content: `Because the spawned thread could outlive the function that created it, the compiler forces closures passed to \`thread::spawn\` to take ownership of captured variables with \`move\`:`,
          codeSnippet: {
            code: `use std::thread;

fn main() {
    let v = vec![1, 2, 3];

    // 'move' transfers ownership of 'v' into the thread
    let handle = thread::spawn(move || {
        println!("Here's a vector: {:?}", v);
    });

    handle.join().unwrap();
}`,
            caption: 'Transferring ownership to spawned threads with move.',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Attempting to borrow a stack variable into a spawned thread without `move`',
          badCode: `let v = vec![1, 2, 3];
thread::spawn(|| {
    println!("{:?}", v); // Error: closure may outlive the current function, but it borrows \`v\`
});`,
          badExplanation: 'The main thread might return and deallocate `v` while the spawned thread is still running.',
          goodCode: `let v = vec![1, 2, 3];
thread::spawn(move || {
    println!("{:?}", v);
});`,
          goodExplanation: 'Use `move` to transfer ownership of `v` safely into the spawned thread.',
        },
      ],
      keyTakeaways: [
        '`thread::spawn` creates a native OS thread.',
        'Calling `join()` waits for a thread to complete and catches any thread panics.',
        'Threads require `move` closures to ensure captured data lives for the thread\'s full lifetime.',
      ],
      quests: [
        {
          id: 'tut-30-parallel-sum',
          type: 'coding',
          title: 'Parallel Chunk Sum with Threads',
          prompt: 'Implement `parallel_chunk_sum(first_half: Vec<i64>, second_half: Vec<i64>) -> i64`. Spawn a new thread with `std::thread::spawn` to sum `first_half`. Compute the sum of `second_half` on the current thread. Then `join()` the spawned thread and return the total sum of both halves.',
          signature: 'pub fn parallel_chunk_sum(first_half: Vec<i64>, second_half: Vec<i64>) -> i64',
          starterCode: `use std::thread;

pub fn parallel_chunk_sum(first_half: Vec<i64>, second_half: Vec<i64>) -> i64 {
    // TODO: Spawn a thread for first_half, compute second_half, join, and return total
    todo!()
}`,
          testHarness: `{{SOLUTION}}

fn main() {
    let sum = parallel_chunk_sum(vec![1, 2, 3], vec![4, 5, 6]);
    assert_eq!(sum, 21);

    let empty_sum = parallel_chunk_sum(vec![], vec![100]);
    assert_eq!(empty_sum, 100);
    println!("all tests passed");
}`,
          hints: [
            '`let handle = thread::spawn(move || first_half.into_iter().sum::<i64>());`'
          ],
          solutionCode: `use std::thread;

pub fn parallel_chunk_sum(first_half: Vec<i64>, second_half: Vec<i64>) -> i64 {
    let handle = thread::spawn(move || {
        first_half.into_iter().sum::<i64>()
    });

    let sum2: i64 = second_half.into_iter().sum();
    let sum1 = handle.join().unwrap();
    sum1 + sum2
}`,
          solutionWalkthrough: '`thread::spawn(move || ...)` transfers ownership of `first_half` to the background thread. We compute `sum2` on the main thread and add `handle.join().unwrap()` to get the total.',
          xpReward: 15,
        },
        {
          id: 'tut-30-quiz-thread-move',
          type: 'quiz',
          title: 'Concept Check: Why is `move` needed on `thread::spawn` closures?',
          prompt: 'Why does the Rust compiler require `move` closures when capturing local variables in `thread::spawn`?',
          options: [
            { label: 'A', text: 'Because closures cannot read data without moving.' },
            { label: 'B', text: 'Because the spawned thread might outlive the creating function\'s stack frame, which would leave borrowed references pointing to deallocated memory.' },
            { label: 'C', text: 'Because spawned threads run in a different process.' },
            { label: 'D', text: 'Because move makes variables immutable.' },
          ],
          correctIndex: 1,
          explanation: 'Since threads run concurrently and independently, the main thread could finish and destroy its stack frame before the spawned thread finishes. Moving ownership guarantees the data remains valid as long as the thread is alive.',
          hint: 'Think about what happens if the main function returns before the thread finishes.',
          xpReward: 10,
        },
      ],
    },
    {
      id: '31-channels-and-shared-state',
      chapterId: 'concurrency',
      chapterNumber: 11,
      lessonNumber: 2,
      title: 'Message Channels & `Arc<Mutex<T>>`',
      tagline: '"Do not communicate by sharing memory; instead, share memory by communicating."',
      readTimeMinutes: 8,
      difficulty: 'advanced',
      tags: ['mpsc', 'mutex', 'arc', 'send', 'sync'],
      overview: 'Rust supports both major concurrency paradigms: **Message Passing** (via multi-producer, single-consumer channels `mpsc`) and **Shared State Concurrency** (via `Arc<Mutex<T>>`). The `Send` and `Sync` traits automatically enforce thread safety at compile time.',
      sections: [
        {
          id: 'mpsc-channels',
          title: 'Message Passing Channels (`mpsc`)',
          content: `To create a channel, use \`std::sync::mpsc::channel()\`. It returns a \`(Sender, Receiver)\` tuple:`,
          codeSnippet: {
            code: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let val = String::from("cratery quest");
        tx.send(val).unwrap(); // Ownership of 'val' is sent over the channel!
    });

    let received = rx.recv().unwrap();
    println!("Got: {}", received);
}`,
            caption: 'Passing data across threads via mpsc channels.',
          },
        },
        {
          id: 'arc-mutex',
          title: 'Shared State Concurrency (`Arc<Mutex<T>>`)',
          content: `A **Mutex** (mutual exclusion) allows only one thread to access data at any given time. Calling \`.lock()\` blocks until the lock is acquired and returns a \`MutexGuard\` RAII lock that automatically releases when dropped:`,
          codeSnippet: {
            code: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter_clone = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = counter_clone.lock().unwrap();
            *num += 1; // MutexGuard automatically unlocks upon going out of scope!
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Result: {}", *counter.lock().unwrap()); // 10
}`,
            caption: 'Coordinating 10 concurrent threads modifying a shared Mutex.',
          },
        },
        {
          id: 'send-sync',
          title: 'The `Send` and `Sync` Marker Traits',
          content: `- **\`Send\`**: Indicates that ownership of the type can be transferred across thread boundaries.
- **\`Sync\`**: Indicates that it is safe for multiple threads to access the type concurrently via shared references (\`&T\` is \`Send\`).

Almost all primitive types in Rust are \`Send\` and \`Sync\`. Types with non-thread-safe interior mutability (like \`Rc\` and \`RefCell\`) are not \`Send\`/\`Sync\`, preventing race conditions at compile time!`,
          codeSnippet: {
            code: `// The compiler automatically implements Send and Sync for types composed of Send and Sync fields.`,
            caption: 'Compile-time fearless concurrency markers.',
            runnable: false,
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Trying to use `Mutex` with `Rc` instead of `Arc` across threads',
          badCode: `let lock = std::rc::Rc::new(std::sync::Mutex::new(0));
std::thread::spawn(move || { ... }); // Error: \`Rc\` cannot be sent between threads safely`,
          badExplanation: '`Rc` is not `Send`. You must pair `Mutex` with `Arc` for multi-threaded sharing.',
          goodCode: `let lock = std::sync::Arc::new(std::sync::Mutex::new(0));`,
          goodExplanation: 'Use `Arc<Mutex<T>>` for multi-threaded shared mutable state.',
        },
      ],
      keyTakeaways: [
        '`mpsc::channel()` enables message passing without shared locks.',
        '`Arc<Mutex<T>>` provides thread-safe shared mutable state with RAII lock release.',
        '`Send` and `Sync` marker traits enforce concurrency safety at compile time.',
      ],
      quests: [
        {
          id: 'tut-31-concurrent-work-queue',
          type: 'coding',
          title: 'Concurrent Worker Channel Dispatcher',
          prompt: 'Implement `distribute_and_sum(tasks: Vec<i32>) -> i32`. Create an `mpsc::channel()`. For each task in `tasks`, clone the sender `tx` and spawn a thread that computes `task * 2` and sends the result through `tx`. Explicitly drop the original `tx` so the receiver closes, then accumulate and return the sum of all received messages from `rx`.',
          signature: 'pub fn distribute_and_sum(tasks: Vec<i32>) -> i32',
          starterCode: `use std::sync::mpsc;
use std::thread;

pub fn distribute_and_sum(tasks: Vec<i32>) -> i32 {
    // TODO: Spawn worker threads for each task and collect results via channel
    todo!()
}`,
          testHarness: `{{SOLUTION}}

fn main() {
    let result = distribute_and_sum(vec![1, 2, 3, 4, 5]);
    assert_eq!(result, 30); // (1+2+3+4+5) * 2 = 15 * 2 = 30

    assert_eq!(distribute_and_sum(vec![]), 0);
    assert_eq!(distribute_and_sum(vec![10]), 20);
    println!("all tests passed");
}`,
          hints: [
            'Clone `let tx_clone = tx.clone();` for each thread.',
            'Drop `drop(tx);` before reading `for val in rx { sum += val; }`.'
          ],
          solutionCode: `use std::sync::mpsc;
use std::thread;

pub fn distribute_and_sum(tasks: Vec<i32>) -> i32 {
    let (tx, rx) = mpsc::channel();

    for task in tasks {
        let tx_clone = tx.clone();
        thread::spawn(move || {
            tx_clone.send(task * 2).unwrap();
        });
    }

    // Drop original sender so receiver knows when all threads finished
    drop(tx);

    let mut sum = 0;
    for result in rx {
        sum += result;
    }
    sum
}`,
          solutionWalkthrough: 'Each spawned thread calculates `task * 2` and sends it down the channel. Dropping the initial `tx` ensures that when all worker threads drop their `tx_clone` handles, the `rx` iterator terminates cleanly.',
          xpReward: 15,
        },
        {
          id: 'tut-31-quiz-send-sync',
          type: 'quiz',
          title: 'Concept Check: The `Sync` Trait',
          prompt: 'What does it mean for a type `T` to implement the `Sync` marker trait in Rust?',
          options: [
            { label: 'A', text: 'Values of type `T` can only be used on the main thread.' },
            { label: 'B', text: 'It is safe for multiple threads to access `&T` (an immutable reference to T) concurrently.' },
            { label: 'C', text: 'Type `T` automatically synchronizes with remote databases.' },
            { label: 'D', text: 'Type `T` is serialized to JSON before sending.' },
          ],
          correctIndex: 1,
          explanation: '`T` is `Sync` if and only if `&T` is `Send`, meaning immutable references to `T` can be safely passed to and accessed by multiple concurrent threads without data races.',
          hint: 'Remember: Sync means shared references (&T) are safe across threads.',
          xpReward: 10,
        },
      ],
    },
  ],
}
