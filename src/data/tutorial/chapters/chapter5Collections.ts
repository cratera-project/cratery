import type { TutorialChapter } from '../types'

export const chapter5Collections: TutorialChapter = {
  id: 'collections',
  number: 5,
  title: 'Standard Collections in Depth',
  description: 'Master vectors, heap allocations, UTF-8 strings, and hash maps with the Entry API.',
  icon: '📦',
  lessons: [
    {
      id: '16-vectors',
      chapterId: 'collections',
      chapterNumber: 5,
      lessonNumber: 1,
      title: 'Vectors: Growable Heap Arrays (`Vec<T>`)',
      tagline: 'Dynamic arrays on the heap, capacity vs length, and borrow safety.',
      readTimeMinutes: 7,
      difficulty: 'intermediate',
      tags: ['vec', 'collections', 'heap', 'capacity'],
      overview: 'Vectors (`Vec<T>`) allow you to store more than one value in a single contiguous data structure on the heap. Vectors can grow and shrink dynamically at runtime.',
      sections: [
        {
          id: 'vec-basics',
          title: 'Creating and Modifying Vectors',
          content: `You can create a new vector with \`Vec::new()\` or with the convenient \`vec![]\` macro:`,
          codeSnippet: {
            code: `fn main() {
    let mut v: Vec<i32> = Vec::new();
    v.push(1);
    v.push(2);
    v.push(3);
    
    // Macro initialization
    let mut names = vec!["Alice", "Bob", "Charlie"];
    names.pop(); // removes "Charlie"
    
    println!("Length: {}, Capacity: {}", v.len(), v.capacity());
}`,
            caption: 'Creating, pushing, and inspecting vectors.',
          },
        },
        {
          id: 'borrow-reallocation',
          title: 'Borrow Checker & Vector Reallocations',
          content: `When a vector runs out of capacity, pushing a new element allocates a larger heap buffer and copies all existing elements to the new memory location.

Because of this, **Rust forbids holding a reference to a vector element while pushing to the vector**:`,
          codeSnippet: {
            code: `let mut v = vec![1, 2, 3];
let first = &v[0]; // Immutable borrow

// v.push(4); // COMPILE ERROR: cannot borrow \`v\` as mutable because it is also borrowed as immutable
println!("First is: {}", first);
v.push(4); // Valid here after 'first' is no longer used!`,
            caption: 'The borrow checker prevents dangling pointers when vectors reallocate.',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Modifying a vector while iterating over it',
          badCode: `let mut v = vec![1, 2, 3];
for item in &v {
    if *item == 2 {
        v.push(99); // Error: cannot borrow \`v\` as mutable because it is also borrowed as immutable
    }
}`,
          badExplanation: 'Iterating borrows `v` immutably. Pushing requires a mutable borrow `&mut v`. Holding both causes a compile-time borrow error.',
          goodCode: `let mut v = vec![1, 2, 3];
let mut additions = Vec::new();
for &item in &v {
    if item == 2 { additions.push(99); }
}
v.extend(additions);`,
          goodExplanation: 'Collect new additions separately or use `.retain()` for filtering.',
        },
      ],
      keyTakeaways: [
        '`Vec<T>` allocates its elements on the heap with dynamic length and capacity.',
        'Pushing when `len == capacity` triggers heap reallocation to larger memory.',
        'Rust guarantees references to vector items cannot become dangling pointers.',
      ],
      quests: [
        {
          id: 'tut-16-dedup-vec',
          type: 'coding',
          title: 'Filter and Deduplicate Vector',
          prompt: 'Implement `filter_evens_unique(nums: Vec<i32>) -> Vec<i32>`. The function should take an owned vector `nums`, retain only the even numbers, remove consecutive duplicates, and return the resulting vector.',
          signature: 'pub fn filter_evens_unique(nums: Vec<i32>) -> Vec<i32>',
          starterCode: `pub fn filter_evens_unique(nums: Vec<i32>) -> Vec<i32> {
    // TODO: Filter only even numbers and remove consecutive duplicates
    todo!()
}`,
          testHarness: `{{SOLUTION}}

fn main() {
    assert_eq!(filter_evens_unique(vec![1, 2, 2, 3, 4, 4, 4, 5, 6]), vec![2, 4, 6]);
    assert_eq!(filter_evens_unique(vec![1, 3, 5]), vec![]);
    assert_eq!(filter_evens_unique(vec![0, 0, 2, 2, 0]), vec![0, 2, 0]);
    println!("all tests passed");
}`,
          hints: [
            'Filter with `let mut evens: Vec<i32> = nums.into_iter().filter(|n| n % 2 == 0).collect();`',
            'Then call `evens.dedup();` to remove consecutive duplicates.',
          ],
          solutionCode: `pub fn filter_evens_unique(nums: Vec<i32>) -> Vec<i32> {
    let mut result: Vec<i32> = nums.into_iter().filter(|n| n % 2 == 0).collect();
    result.dedup();
    result
}`,
          solutionWalkthrough: 'We filter out odd numbers with `.filter(|n| n % 2 == 0)`, collect into a mutable `Vec<i32>`, and call `.dedup()` to collapse consecutive duplicate even integers.',
          xpReward: 15,
        },
        {
          id: 'tut-16-quiz-vec-capacity',
          type: 'quiz',
          title: 'Concept Check: Vector Reallocation Safety',
          prompt: 'Why does Rust forbid pushing to a `Vec<T>` while holding a reference `&v[0]` to an element inside it?',
          options: [
            { label: 'A', text: 'Because pushing to a vector changes the type of the vector elements.' },
            { label: 'B', text: 'Because if the vector runs out of capacity, it reallocates on the heap, which would make the reference a dangling pointer.' },
            { label: 'C', text: 'Because vectors can only hold 256 elements.' },
            { label: 'D', text: 'Because references to heap objects are illegal in safe Rust.' },
          ],
          correctIndex: 1,
          explanation: 'When capacity is exceeded, pushing reallocates new memory and deallocates the old buffer. If Rust permitted holding `&v[0]`, that reference would point to freed memory (a use-after-free bug).',
          hint: 'Think about what happens to the underlying memory address when a vector grows beyond its capacity.',
          xpReward: 10,
        },
      ],
    },
    {
      id: '17-strings-in-depth',
      chapterId: 'collections',
      chapterNumber: 5,
      lessonNumber: 2,
      title: 'Strings in Depth: UTF-8 & Graphemes',
      tagline: 'Why Rust does not allow string indexing by number and how UTF-8 works.',
      readTimeMinutes: 7,
      difficulty: 'intermediate',
      tags: ['strings', 'utf-8', 'chars', 'bytes'],
      overview: 'Rust strings are always guaranteed to be valid UTF-8 encoded sequences. Because UTF-8 characters can take between 1 and 4 bytes, direct integer indexing (such as `s[0]`) is not supported.',
      sections: [
        {
          id: 'string-utf8',
          title: 'Bytes vs Chars vs Graphemes',
          content: `In Rust:
1. **Bytes** (\`s.bytes()\`): The raw 8-bit bytes in memory.
2. **Chars** (\`s.chars()\`): Unicode Scalar Values (4 bytes each).
3. **Grapheme Clusters**: Visual human characters (e.g. \`é\` composed of \`e\` + accent modifier).`,
          codeSnippet: {
            code: `let s = "🦀 hi";
println!("Byte length: {}", s.len()); // 7 bytes ('🦀' is 4 bytes + ' ' is 1 + 'h' is 1 + 'i' is 1)
println!("Char count: {}", s.chars().count()); // 4 chars

for c in s.chars() {
    print!("[{}] ", c);
}
// Outputs: [🦀] [ ] [h] [i]`,
            caption: 'Iterating over Unicode scalar values.',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Direct integer string indexing',
          badCode: `let s = "hello";
let c = s[0]; // Error: the type \`str\` cannot be indexed by \`{integer}\``,
          badExplanation: 'Because UTF-8 characters have variable byte lengths, finding the N-th character in O(1) time without scanning is impossible.',
          goodCode: `let s = "hello";
let first_char = s.chars().next(); // Some('h')`,
          goodExplanation: 'Use `.chars().nth(index)` or string slice iteration.',
        },
      ],
      keyTakeaways: [
        'Rust `String` and `&str` are strictly guaranteed to be valid UTF-8.',
        '`s.len()` returns the byte count, NOT the character count.',
        'Rust prevents direct indexing `s[i]` to protect against O(n) performance traps and invalid UTF-8 slicing.',
      ],
      quests: [
        {
          id: 'tut-17-reverse-words',
          type: 'coding',
          title: 'Reverse Words in a Sentence',
          prompt: 'Implement `reverse_words(sentence: &str) -> String`. The function should split the sentence by whitespace, reverse the order of the words, and join them back with single spaces.',
          signature: 'pub fn reverse_words(sentence: &str) -> String',
          starterCode: `pub fn reverse_words(sentence: &str) -> String {
    // TODO: Split words, reverse their order, and join with space
    todo!()
}`,
          testHarness: `{{SOLUTION}}

fn main() {
    assert_eq!(reverse_words("hello world"), "world hello");
    assert_eq!(reverse_words("the quick brown fox"), "fox brown quick the");
    assert_eq!(reverse_words("cratery"), "cratery");
    assert_eq!(reverse_words(""), "");
    println!("all tests passed");
}`,
          hints: [
            'Use `sentence.split_whitespace().rev().collect::<Vec<_>>().join(" ")`.',
          ],
          solutionCode: `pub fn reverse_words(sentence: &str) -> String {
    sentence.split_whitespace().rev().collect::<Vec<_>>().join(" ")
}`,
          solutionWalkthrough: '`split_whitespace()` splits on arbitrary spaces, `.rev()` reverses the iterator order, and `.join(" ")` joins the word slices into a new owned `String`.',
          xpReward: 15,
        },
        {
          id: 'tut-17-quiz-string-indexing',
          type: 'quiz',
          title: 'Concept Check: Why Rust Disallows `s[0]`',
          prompt: 'Why does the Rust compiler reject string indexing with integers like `s[0]`?',
          options: [
            { label: 'A', text: 'Because strings in Rust do not have a fixed start address in memory.' },
            { label: 'B', text: 'Because UTF-8 characters have variable byte lengths, so indexing cannot be guaranteed in O(1) time and could land inside a multi-byte character.' },
            { label: 'C', text: 'Because strings are compiled to linked lists in binary code.' },
            { label: 'D', text: 'Because indexing is only allowed on mutable variables.' },
          ],
          correctIndex: 1,
          explanation: 'In UTF-8, characters can be 1, 2, 3, or 4 bytes long. Indexing into byte 0 might only get a fragment of a multi-byte character, and calculating the Nth character requires scanning from the beginning, which cannot be O(1).',
          hint: 'Consider what happens to Unicode characters like emojis that take 4 bytes.',
          xpReward: 10,
        },
      ],
    },
    {
      id: '18-hashmaps',
      chapterId: 'collections',
      chapterNumber: 5,
      lessonNumber: 3,
      title: 'HashMaps & The Entry API',
      tagline: 'Key-value mapping and idiomatic in-place updates with `.entry()`.',
      readTimeMinutes: 7,
      difficulty: 'intermediate',
      tags: ['hashmap', 'entry-api', 'key-value', 'collections'],
      overview: 'The type `HashMap<K, V>` stores a mapping of keys of type `K` to values of type `V` using a hashing function. Rust\'s `Entry` API provides an elegant, zero-overhead way to inspect, insert, and update map entries in place.',
      sections: [
        {
          id: 'hashmap-basics',
          title: 'Basic HashMap Operations',
          content: `To use \`HashMap\`, import it from \`std::collections::HashMap\`:`,
          codeSnippet: {
            code: `use std::collections::HashMap;

fn main() {
    let mut scores = HashMap::new();
    scores.insert("Blue", 10);
    scores.insert("Yellow", 50);

    // Reading values
    let team_name = "Blue";
    if let Some(&score) = scores.get(team_name) {
        println!("{}: {}", team_name, score);
    }
}`,
            caption: 'Basic HashMap insertion and retrieval.',
          },
        },
        {
          id: 'entry-api',
          title: 'The Powerful Entry API (`.entry().or_insert()`)',
          content: `The \`.entry()\` method checks if a key is present and returns an \`Entry\` enum. Calling \`.or_insert()\` returns a mutable reference \`&mut V\` to the value, inserting the default if it didn't exist:`,
          codeSnippet: {
            code: `use std::collections::HashMap;

fn word_count(text: &str) -> HashMap<&str, u32> {
    let mut counts = HashMap::new();
    for word in text.split_whitespace() {
        let count = counts.entry(word).or_insert(0);
        *count += 1; // Dereference and increment in place!
    }
    counts
}`,
            caption: 'Counting frequencies cleanly with the Entry API.',
          },
        },
      ],
      commonMistakes: [
        {
          title: 'Using separate `.contains_key()` followed by `.insert()`',
          badCode: `let mut map = HashMap::new();
let key = "apple";
if !map.contains_key(key) {
    map.insert(key, 0); // Performs 2 separate hash lookups!
}`,
          badExplanation: 'Calling `contains_key` then `insert` hashes and traverses the bucket table twice.',
          goodCode: `let mut map = HashMap::new();
map.entry("apple").or_insert(0); // Performs 1 single hash lookup`,
          goodExplanation: 'The Entry API performs the lookup and potential insertion in a single efficient pass.',
        },
      ],
      keyTakeaways: [
        'HashMaps map keys to values using `std::collections::HashMap`.',
        '`.get(&key)` returns `Option<&V>`.',
        'Use `.entry(key).or_insert(default)` for concise, single-pass lookup and mutation.',
      ],
      quests: [
        {
          id: 'tut-18-char-frequencies',
          type: 'coding',
          title: 'Character Frequency Counter with Entry API',
          prompt: 'Implement `char_frequencies(text: &str) -> std::collections::HashMap<char, usize>`. Count the frequency of each ASCII alphanumeric character in `text`, converted to lowercase. Ignore spaces and punctuation.',
          signature: 'pub fn char_frequencies(text: &str) -> std::collections::HashMap<char, usize>',
          starterCode: `use std::collections::HashMap;

pub fn char_frequencies(text: &str) -> HashMap<char, usize> {
    // TODO: Count frequency of each alphanumeric char (lowercase)
    todo!()
}`,
          testHarness: `{{SOLUTION}}

fn main() {
    let freq = char_frequencies("Hello, World!");
    assert_eq!(freq.get(&'h'), Some(&1));
    assert_eq!(freq.get(&'e'), Some(&1));
    assert_eq!(freq.get(&'l'), Some(&3));
    assert_eq!(freq.get(&'o'), Some(&2));
    assert_eq!(freq.get(&'w'), Some(&1));
    assert_eq!(freq.get(&'r'), Some(&1));
    assert_eq!(freq.get(&'d'), Some(&1));
    assert_eq!(freq.get(&' '), None); // spaces ignored
    assert_eq!(freq.get(&'!'), None); // punctuation ignored
    println!("all tests passed");
}`,
          hints: [
            'Filter with `c.is_alphanumeric()`, convert with `c.to_ascii_lowercase()`.',
            'Update map with `*map.entry(c).or_insert(0) += 1;`.',
          ],
          solutionCode: `use std::collections::HashMap;

pub fn char_frequencies(text: &str) -> HashMap<char, usize> {
    let mut map = HashMap::new();
    for c in text.chars() {
        if c.is_alphanumeric() {
            let lower = c.to_ascii_lowercase();
            *map.entry(lower).or_insert(0) += 1;
        }
    }
    map
}`,
          solutionWalkthrough: 'We iterate through all characters in the string slice, filter for alphanumeric characters, convert to lowercase, and update counts with `*map.entry(lower).or_insert(0) += 1;`.',
          xpReward: 15,
        },
        {
          id: 'tut-18-quiz-entry-api',
          type: 'quiz',
          title: 'Concept Check: What does `.entry(key).or_insert(default)` return?',
          prompt: 'What type does the method call `map.entry(key).or_insert(0)` return in Rust?',
          options: [
            { label: 'A', text: 'A boolean indicating if the key was newly inserted.' },
            { label: 'B', text: 'A mutable reference `&mut V` to the value for the key in the map.' },
            { label: 'C', text: 'A clone of the entire HashMap.' },
            { label: 'D', text: 'An immutable integer value.' },
          ],
          correctIndex: 1,
          explanation: '`.or_insert()` returns a mutable reference `&mut V` to the value corresponding to `key` (either existing or newly inserted), allowing you to dereference and modify it in place with `*ref += 1`.',
          hint: 'Remember that you can dereference and mutate the result directly with `*`.',
          xpReward: 10,
        },
      ],
    },
  ],
}
