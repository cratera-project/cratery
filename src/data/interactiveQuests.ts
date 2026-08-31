import { getContestSolution } from './contestSolutions'
import type { Contest } from './contests'

export const interactiveQuests: Contest[] = [
  {
    id: 'add-two-numbers',
    title: 'Add Two Numbers',
    weekLabel: 'Tier I · Novice Trial',
    difficulty: 1,
    opensAt: '2020-01-01T00:00:00.000Z',
    closesAt: '2099-01-01T00:00:00.000Z',
    signature: 'pub fn add(a: i32, b: i32) -> i32',
    prompt: `Welcome to Forge Trials! Write a function \`add\` that takes two 32-bit signed integers and returns their sum.

Hit **Run** to execute sample tests in the microVM judge, and **Submit** to verify against the full test harness.`,
    examples: [
      {
        input: 'add(2, 3)',
        output: '5',
        explanation: '2 + 3 = 5',
      },
    ],
    starterCode: `pub fn add(a: i32, b: i32) -> i32 {
    todo!()
}`,
    testHarness: `{{SOLUTION}}

fn main() {
    assert_eq!(add(2, 3), 5);
    assert_eq!(add(-1, 1), 0);
    assert_eq!(add(0, 0), 0);
    assert_eq!(add(-5, -5), -10);
    assert_eq!(add(100, 250), 350);
    println!("all tests passed");
}
`,
    loadSolution: () => Promise.resolve(getContestSolution('add-two-numbers')!),
  },
  {
    id: 'make-mutable',
    title: 'Push to Vector',
    weekLabel: 'Tier I · Novice Trial',
    difficulty: 1,
    opensAt: '2020-01-01T00:00:00.000Z',
    closesAt: '2099-01-01T00:00:00.000Z',
    signature: 'pub fn append_val(list: Vec<i32>, val: i32) -> Vec<i32>',
    prompt: `In Rust, variables and parameters are immutable by default.

Implement \`append_val\` to take an owned vector of integers, append \`val\` to the end using \`.push()\`, and return the modified vector.`,
    examples: [
      {
        input: 'append_val(vec![1, 2], 3)',
        output: 'vec![1, 2, 3]',
        explanation: '3 is pushed to the back of the vector.',
      },
    ],
    starterCode: `pub fn append_val(list: Vec<i32>, val: i32) -> Vec<i32> {
    todo!()
}`,
    testHarness: `{{SOLUTION}}

fn main() {
    assert_eq!(append_val(vec![1, 2], 3), vec![1, 2, 3]);
    assert_eq!(append_val(vec![], 42), vec![42]);
    assert_eq!(append_val(vec![10], -5), vec![10, -5]);
    println!("all tests passed");
}
`,
    loadSolution: () => Promise.resolve(getContestSolution('make-mutable')!),
  },
  {
    id: 'string-length',
    title: 'Unicode Character Count',
    weekLabel: 'Tier I · Novice Trial',
    difficulty: 1,
    opensAt: '2020-01-01T00:00:00.000Z',
    closesAt: '2099-01-01T00:00:00.000Z',
    signature: 'pub fn char_count(s: &str) -> usize',
    prompt: `In Rust, \`s.len()\` returns the byte length (UTF-8 bytes), not the number of human-perceived characters.

Implement \`char_count\` to return the count of Unicode characters (scalar values) in the string slice \`s\`.`,
    examples: [
      {
        input: 'char_count("🦀 rust")',
        output: '6',
        explanation: '1 crab emoji + 1 space + 4 letters = 6 characters (even though byte len is 9).',
      },
    ],
    starterCode: `pub fn char_count(s: &str) -> usize {
    todo!()
}`,
    testHarness: `{{SOLUTION}}

fn main() {
    assert_eq!(char_count("hello"), 5);
    assert_eq!(char_count(""), 0);
    assert_eq!(char_count("🦀 ferris"), 8);
    assert_eq!(char_count("cratery"), 7);
    println!("all tests passed");
}
`,
    loadSolution: () => Promise.resolve(getContestSolution('string-length')!),
  },
  {
    id: 'clamp-value',
    title: 'Clamp Number in Range',
    weekLabel: 'Tier I · Novice Trial',
    difficulty: 1,
    opensAt: '2020-01-01T00:00:00.000Z',
    closesAt: '2099-01-01T00:00:00.000Z',
    signature: 'pub fn clamp(val: i32, min: i32, max: i32) -> i32',
    prompt: `Implement \`clamp\` to restrict a value to a given closed interval \`[min, max]\`.
- If \`val < min\`, return \`min\`.
- If \`val > max\`, return \`max\`.
- Otherwise, return \`val\`.`,
    examples: [
      {
        input: 'clamp(15, 0, 10)',
        output: '10',
        explanation: '15 exceeds max bound 10, clamped to 10.',
      },
    ],
    starterCode: `pub fn clamp(val: i32, min: i32, max: i32) -> i32 {
    todo!()
}`,
    testHarness: `{{SOLUTION}}

fn main() {
    assert_eq!(clamp(5, 1, 10), 5);
    assert_eq!(clamp(-5, 0, 10), 0);
    assert_eq!(clamp(15, 0, 10), 10);
    assert_eq!(clamp(10, 10, 10), 10);
    println!("all tests passed");
}
`,
    loadSolution: () => Promise.resolve(getContestSolution('clamp-value')!),
  },
  {
    id: 'wrap-option',
    title: 'Positive Number Filter',
    weekLabel: 'Tier I · Novice Trial',
    difficulty: 1,
    opensAt: '2020-01-01T00:00:00.000Z',
    closesAt: '2099-01-01T00:00:00.000Z',
    signature: 'pub fn positive_only(n: i64) -> Option<i64>',
    prompt: `Rust avoids null pointers using the \`Option<T>\` enum (\`Some(T)\` or \`None\`).

Implement \`positive_only\` to return \`Some(n)\` if \`n > 0\`, and \`None\` if \`n <= 0\`.`,
    examples: [
      {
        input: 'positive_only(42)',
        output: 'Some(42)',
        explanation: '42 is strictly greater than zero.',
      },
    ],
    starterCode: `pub fn positive_only(n: i64) -> Option<i64> {
    todo!()
}`,
    testHarness: `{{SOLUTION}}

fn main() {
    assert_eq!(positive_only(10), Some(10));
    assert_eq!(positive_only(1), Some(1));
    assert_eq!(positive_only(0), None);
    assert_eq!(positive_only(-42), None);
    println!("all tests passed");
}
`,
    loadSolution: () => Promise.resolve(getContestSolution('wrap-option')!),
  },
  {
    id: 'safe-divide',
    title: 'Safe Integer Division',
    weekLabel: 'Tier I · Novice Trial',
    difficulty: 1,
    opensAt: '2020-01-01T00:00:00.000Z',
    closesAt: '2099-01-01T00:00:00.000Z',
    signature: 'pub fn safe_divide(a: i32, b: i32) -> Result<i32, &\'static str>',
    prompt: `Rust models recoverable errors using \`Result<T, E>\` (\`Ok(T)\` or \`Err(E)\`).

Implement \`safe_divide\` to return:
- \`Err("division by zero")\` if \`b == 0\`.
- \`Ok(a / b)\` otherwise.`,
    examples: [
      {
        input: 'safe_divide(10, 2)',
        output: 'Ok(5)',
        explanation: '10 / 2 = 5.',
      },
    ],
    starterCode: `pub fn safe_divide(a: i32, b: i32) -> Result<i32, &'static str> {
    todo!()
}`,
    testHarness: `{{SOLUTION}}

fn main() {
    assert_eq!(safe_divide(10, 2), Ok(5));
    assert_eq!(safe_divide(7, 3), Ok(2));
    assert_eq!(safe_divide(10, 0), Err("division by zero"));
    assert_eq!(safe_divide(0, 5), Ok(0));
    println!("all tests passed");
}
`,
    loadSolution: () => Promise.resolve(getContestSolution('safe-divide')!),
  },
  {
    id: 'greet-rustacean',
    title: 'Optional Name Greeting',
    weekLabel: 'Tier I · Novice Trial',
    difficulty: 1,
    opensAt: '2020-01-01T00:00:00.000Z',
    closesAt: '2099-01-01T00:00:00.000Z',
    signature: 'pub fn greet(name: Option<&str>) -> String',
    prompt: `Implement \`greet\` to format a greeting message:
- If \`name\` is \`Some(n)\`, return \`format!("Hello, {}!", n)\`.
- If \`name\` is \`None\`, return \`"Hello, Rustacean!".to_string()\`.`,
    examples: [
      {
        input: 'greet(Some("Ferris"))',
        output: '"Hello, Ferris!"',
        explanation: 'Formats the provided name into the greeting.',
      },
    ],
    starterCode: `pub fn greet(name: Option<&str>) -> String {
    todo!()
}`,
    testHarness: `{{SOLUTION}}

fn main() {
    assert_eq!(greet(Some("Ferris")), "Hello, Ferris!");
    assert_eq!(greet(Some("Alice")), "Hello, Alice!");
    assert_eq!(greet(None), "Hello, Rustacean!");
    println!("all tests passed");
}
`,
    loadSolution: () => Promise.resolve(getContestSolution('greet-rustacean')!),
  },
  {
    id: 'count-vowels',
    title: 'Count ASCII Vowels',
    weekLabel: 'Tier II · Apprentice Trial',
    difficulty: 1,
    opensAt: '2020-01-01T00:00:00.000Z',
    closesAt: '2099-01-01T00:00:00.000Z',
    signature: 'pub fn count_vowels(s: &str) -> usize',
    prompt: `Implement \`count_vowels\` to count all ASCII vowels (\`'a', 'e', 'i', 'o', 'u'\`, case-insensitive) in the string slice \`s\`.`,
    examples: [
      {
        input: 'count_vowels("Cratery")',
        output: '2',
        explanation: 'Contains vowels "a" and "e".',
      },
    ],
    starterCode: `pub fn count_vowels(s: &str) -> usize {
    todo!()
}`,
    testHarness: `{{SOLUTION}}

fn main() {
    assert_eq!(count_vowels("rust"), 1);
    assert_eq!(count_vowels("Cratery"), 2);
    assert_eq!(count_vowels("AEIOU"), 5);
    assert_eq!(count_vowels("rhythm"), 0);
    assert_eq!(count_vowels(""), 0);
    println!("all tests passed");
}
`,
    loadSolution: () => Promise.resolve(getContestSolution('count-vowels')!),
  },
  {
    id: 'rectangle-area',
    title: 'Rectangle Struct Methods',
    weekLabel: 'Tier II · Apprentice Trial',
    difficulty: 1,
    opensAt: '2020-01-01T00:00:00.000Z',
    closesAt: '2099-01-01T00:00:00.000Z',
    signature: 'Rectangle - new / area / is_square / can_hold',
    prompt: `Define and implement methods on a \`Rectangle\` struct:
1. \`new(width: u32, height: u32) -> Self\`
2. \`area(&self) -> u32\`: returns \`width * height\`
3. \`is_square(&self) -> bool\`: returns true if \`width == height\`
4. \`can_hold(&self, other: &Rectangle) -> bool\`: returns true if \`self.width >= other.width && self.height >= other.height\``,
    examples: [
      {
        input: 'Rectangle::new(30, 50).area()',
        output: '1500',
        explanation: '30 * 50 = 1500.',
      },
    ],
    starterCode: `pub struct Rectangle {
    pub width: u32,
    pub height: u32,
}

impl Rectangle {
    pub fn new(width: u32, height: u32) -> Self {
        todo!()
    }

    pub fn area(&self) -> u32 {
        todo!()
    }

    pub fn is_square(&self) -> bool {
        todo!()
    }

    pub fn can_hold(&self, other: &Rectangle) -> bool {
        todo!()
    }
}`,
    testHarness: `{{SOLUTION}}

fn main() {
    let r1 = Rectangle::new(30, 50);
    let r2 = Rectangle::new(10, 40);
    let r3 = Rectangle::new(60, 45);
    let sq = Rectangle::new(20, 20);

    assert_eq!(r1.area(), 1500);
    assert!(!r1.is_square());
    assert!(sq.is_square());
    assert!(r1.can_hold(&r2));
    assert!(!r1.can_hold(&r3));
    println!("all tests passed");
}
`,
    loadSolution: () => Promise.resolve(getContestSolution('rectangle-area')!),
  },
  {
    id: 'traffic-light-enum',
    title: 'Traffic Light State Machine',
    weekLabel: 'Tier II · Apprentice Trial',
    difficulty: 1,
    opensAt: '2020-01-01T00:00:00.000Z',
    closesAt: '2099-01-01T00:00:00.000Z',
    signature: 'TrafficLight - Red / Yellow / Green & next / duration_secs',
    prompt: `Define an enum \`TrafficLight\` with variants \`Red\`, \`Yellow\`, and \`Green\`.
Implement:
1. \`next(&self) -> Self\`: Green advances to Yellow, Yellow advances to Red, Red advances to Green.
2. \`duration_secs(&self) -> u32\`: Red is 60s, Yellow is 5s, Green is 45s.`,
    examples: [
      {
        input: 'TrafficLight::Green.next()',
        output: 'TrafficLight::Yellow',
        explanation: 'Green advances to Yellow.',
      },
    ],
    starterCode: `#[derive(Debug, PartialEq, Clone, Copy)]
pub enum TrafficLight {
    Red,
    Yellow,
    Green,
}

impl TrafficLight {
    pub fn next(&self) -> Self {
        todo!()
    }

    pub fn duration_secs(&self) -> u32 {
        todo!()
    }
}`,
    testHarness: `{{SOLUTION}}

fn main() {
    let light = TrafficLight::Green;
    assert_eq!(light.duration_secs(), 45);
    let light = light.next();
    assert_eq!(light, TrafficLight::Yellow);
    assert_eq!(light.duration_secs(), 5);
    let light = light.next();
    assert_eq!(light, TrafficLight::Red);
    assert_eq!(light.duration_secs(), 60);
    let light = light.next();
    assert_eq!(light, TrafficLight::Green);
    println!("all tests passed");
}
`,
    loadSolution: () => Promise.resolve(getContestSolution('traffic-light-enum')!),
  },
  {
    id: 'filter-evens',
    title: 'Functional Even Filter',
    weekLabel: 'Tier II · Apprentice Trial',
    difficulty: 1,
    opensAt: '2020-01-01T00:00:00.000Z',
    closesAt: '2099-01-01T00:00:00.000Z',
    signature: 'pub fn filter_evens(nums: &[i32]) -> Vec<i32>',
    prompt: `Implement \`filter_evens\` using iterator adapters to take a slice of integers and return a \`Vec<i32>\` containing only the even integers (\`n % 2 == 0\`).`,
    examples: [
      {
        input: 'filter_evens(&[1, 2, 3, 4, 5, 6])',
        output: 'vec![2, 4, 6]',
        explanation: 'Even elements are preserved in original order.',
      },
    ],
    starterCode: `pub fn filter_evens(nums: &[i32]) -> Vec<i32> {
    todo!()
}`,
    testHarness: `{{SOLUTION}}

fn main() {
    assert_eq!(filter_evens(&[1, 2, 3, 4, 5, 6]), vec![2, 4, 6]);
    assert_eq!(filter_evens(&[1, 3, 5]), vec![]);
    assert_eq!(filter_evens(&[]), vec![]);
    assert_eq!(filter_evens(&[-2, -1, 0, 1]), vec![-2, 0]);
    println!("all tests passed");
}
`,
    loadSolution: () => Promise.resolve(getContestSolution('filter-evens')!),
  },
  {
    id: 'parse-port-number',
    title: 'Parse Network Port',
    weekLabel: 'Tier II · Apprentice Trial',
    difficulty: 1,
    opensAt: '2020-01-01T00:00:00.000Z',
    closesAt: '2099-01-01T00:00:00.000Z',
    signature: 'pub fn parse_port(s: &str) -> Result<u16, &\'static str>',
    prompt: `Implement \`parse_port\` to parse a string slice into a valid TCP/UDP port number (\`1..=65535\`).
- If parsing fails or the port number is \`0\`, return \`Err("invalid port number")\`.
- Otherwise return \`Ok(port)\`.`,
    examples: [
      {
        input: 'parse_port("8080")',
        output: 'Ok(8080)',
        explanation: '8080 is a valid non-zero u16 port.',
      },
    ],
    starterCode: `pub fn parse_port(s: &str) -> Result<u16, &'static str> {
    todo!()
}`,
    testHarness: `{{SOLUTION}}

fn main() {
    assert_eq!(parse_port("8080"), Ok(8080));
    assert_eq!(parse_port("443"), Ok(443));
    assert_eq!(parse_port("0"), Err("invalid port number"));
    assert_eq!(parse_port("70000"), Err("invalid port number"));
    assert_eq!(parse_port("abc"), Err("invalid port number"));
    println!("all tests passed");
}
`,
    loadSolution: () => Promise.resolve(getContestSolution('parse-port-number')!),
  },
  {
    id: 'impl-display-point',
    title: 'Implement Display Trait',
    weekLabel: 'Tier II · Apprentice Trial',
    difficulty: 1,
    opensAt: '2020-01-01T00:00:00.000Z',
    closesAt: '2099-01-01T00:00:00.000Z',
    signature: 'Point(x, y) - impl std::fmt::Display',
    prompt: `Implement \`std::fmt::Display\` for \`struct Point { pub x: i32, pub y: i32 }\` so that formatting with \`"{}"\` outputs \`"(x, y)"\` (e.g. \`"(10, -5)"\`).`,
    examples: [
      {
        input: 'format!("{}", Point::new(10, -5))',
        output: '"(10, -5)"',
        explanation: 'Formats coordinates inside parentheses with comma separator.',
      },
    ],
    starterCode: `use std::fmt;

pub struct Point {
    pub x: i32,
    pub y: i32,
}

impl Point {
    pub fn new(x: i32, y: i32) -> Self {
        Self { x, y }
    }
}

impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        todo!()
    }
}`,
    testHarness: `{{SOLUTION}}

fn main() {
    let p = Point::new(10, -5);
    assert_eq!(format!("{p}"), "(10, -5)");
    let origin = Point::new(0, 0);
    assert_eq!(format!("{origin}"), "(0, 0)");
    println!("all tests passed");
}
`,
    loadSolution: () => Promise.resolve(getContestSolution('impl-display-point')!),
  },
  {
    id: 'find-first-duplicate',
    title: 'Find First Duplicate',
    weekLabel: 'Tier II · Apprentice Trial',
    difficulty: 1,
    opensAt: '2020-01-01T00:00:00.000Z',
    closesAt: '2099-01-01T00:00:00.000Z',
    signature: 'pub fn first_duplicate(nums: &[i32]) -> Option<i32>',
    prompt: `Implement \`first_duplicate\` using \`std::collections::HashSet\` to find the first integer in \`nums\` that has already appeared previously in the slice.
If all elements are distinct or the slice is empty, return \`None\`.`,
    examples: [
      {
        input: 'first_duplicate(&[2, 1, 3, 5, 3, 2])',
        output: 'Some(3)',
        explanation: '3 is the first element whose second occurrence is encountered.',
      },
    ],
    starterCode: `use std::collections::HashSet;

pub fn first_duplicate(nums: &[i32]) -> Option<i32> {
    todo!()
}`,
    testHarness: `{{SOLUTION}}

fn main() {
    assert_eq!(first_duplicate(&[2, 1, 3, 5, 3, 2]), Some(3));
    assert_eq!(first_duplicate(&[1, 2, 3, 4]), None);
    assert_eq!(first_duplicate(&[5, 5]), Some(5));
    assert_eq!(first_duplicate(&[]), None);
    println!("all tests passed");
}
`,
    loadSolution: () => Promise.resolve(getContestSolution('find-first-duplicate')!),
  },
  {
    id: 'chunk-by',
    title: 'Custom ChunkBy Iterator Adapter',
    weekLabel: 'Tier III · Adept Trial',
    difficulty: 2,
    opensAt: '2020-01-01T00:00:00.000Z',
    closesAt: '2099-01-01T00:00:00.000Z',
    signature: 'ChunkBy<I, F> / IteratorExt::chunk_by_fn',
    prompt: `Implement a custom iterator adapter struct (\`ChunkBy<I, F>\`) and extension trait (\`IteratorExt\`) that chunks consecutive elements together whenever a binary predicate returns true.

Your implementation should:
1. Define a struct \`ChunkBy<I: Iterator, F>\` that wraps an underlying iterator and a predicate closure \`F\`.
2. Implement \`Iterator\` for \`ChunkBy<I, F>\` where \`F: FnMut(&I::Item, &I::Item) -> bool\`, yielding \`Vec<I::Item>\`.
3. Define an extension trait \`IteratorExt: Iterator + Sized\` providing \`fn chunk_by_fn<F>(self, predicate: F) -> ChunkBy<Self, F>\`.`,
    examples: [
      {
        input: `vec![1, 1, 2, 3, 3]
  .into_iter()
  .chunk_by_fn(|a, b| a == b)
  .collect::<Vec<_>>()`,
        output: `vec![vec![1, 1], vec![2], vec![3, 3]]`,
        explanation: 'Consecutive equal elements are grouped into distinct chunks.',
      },
    ],
    starterCode: `pub struct ChunkBy<I: Iterator, F> {
    iter: I,
    predicate: F,
    head: Option<I::Item>,
}

impl<I: Iterator, F> ChunkBy<I, F> {
    pub fn new(iter: I, predicate: F) -> Self {
        todo!()
    }
}

impl<I, F> Iterator for ChunkBy<I, F>
where
    I: Iterator,
    F: FnMut(&I::Item, &I::Item) -> bool,
{
    type Item = Vec<I::Item>;

    fn next(&mut self) -> Option<Self::Item> {
        todo!()
    }
}

pub trait IteratorExt: Iterator + Sized {
    fn chunk_by_fn<F>(self, predicate: F) -> ChunkBy<Self, F>
    where
        F: FnMut(&Self::Item, &Self::Item) -> bool,
    {
        ChunkBy::new(self, predicate)
    }
}

impl<I: Iterator> IteratorExt for I {}`,
    testHarness: `{{SOLUTION}}

fn main() {
    // test_consecutive_equality
    {
        let data = vec![1, 1, 2, 3, 3, 3, 4, 5, 5];
        let groups: Vec<Vec<i32>> = data.into_iter().chunk_by_fn(|a, b| a == b).collect();
        assert_eq!(
            groups,
            vec![
                vec![1, 1],
                vec![2],
                vec![3, 3, 3],
                vec![4],
                vec![5, 5],
            ]
        );
    }

    // test_empty_and_single
    {
        let empty: Vec<i32> = vec![];
        let empty_groups: Vec<Vec<i32>> = empty.into_iter().chunk_by_fn(|a, b| a == b).collect();
        assert!(empty_groups.is_empty());

        let single = vec![42];
        let single_groups: Vec<Vec<i32>> = single.into_iter().chunk_by_fn(|a, b| a == b).collect();
        assert_eq!(single_groups, vec![vec![42]]);
    }

    println!("all tests passed");
}
`,
    loadSolution: () => Promise.resolve(getContestSolution('chunk-by')!),
  },
  {
    id: 'type-map',
    title: 'Type-Safe AnyMap Container',
    weekLabel: 'Tier III · Adept Trial',
    difficulty: 2,
    opensAt: '2020-01-01T00:00:00.000Z',
    closesAt: '2099-01-01T00:00:00.000Z',
    signature: 'TypeMap - insert / get / get_mut / contains / remove / len',
    prompt: `Implement a heterogeneous, type-safe associative container (\`TypeMap\`) that stores at most one instance of any \`'static\` type using \`std::any::{Any, TypeId}\`.`,
    examples: [
      {
        input: `let mut map = TypeMap::new();
map.insert(42i32);
map.get::<i32>()`,
        output: `Some(&42)`,
        explanation: 'Values are safely stored and downcast based on their static TypeId.',
      },
    ],
    starterCode: `use std::any::{Any, TypeId};
use std::collections::HashMap;

#[derive(Default)]
pub struct TypeMap {
    map: HashMap<TypeId, Box<dyn Any>>,
}

impl TypeMap {
    pub fn new() -> Self {
        Self {
            map: HashMap::new(),
        }
    }

    pub fn insert<T: 'static>(&mut self, value: T) -> Option<T> {
        todo!()
    }

    pub fn get<T: 'static>(&self) -> Option<&T> {
        todo!()
    }

    pub fn get_mut<T: 'static>(&mut self) -> Option<&mut T> {
        todo!()
    }

    pub fn contains<T: 'static>(&self) -> bool {
        todo!()
    }

    pub fn remove<T: 'static>(&mut self) -> Option<T> {
        todo!()
    }

    pub fn len(&self) -> usize {
        todo!()
    }

    pub fn is_empty(&self) -> bool {
        todo!()
    }

    pub fn clear(&mut self) {
        todo!()
    }
}`,
    testHarness: `{{SOLUTION}}

fn main() {
    let mut map = TypeMap::new();

    assert_eq!(map.insert(42i32), None);
    assert_eq!(map.insert(String::from("rust")), None);

    assert_eq!(map.get::<i32>(), Some(&42));
    assert_eq!(map.get::<String>(), Some(&String::from("rust")));
    assert_eq!(map.get::<u64>(), None);
    assert_eq!(map.len(), 2);

    println!("all tests passed");
}
`,
    loadSolution: () => Promise.resolve(getContestSolution('type-map')!),
  },
  {
    id: 'trie-map',
    title: 'Prefix Trie String Map',
    weekLabel: 'Tier IV · Expert Trial',
    difficulty: 2,
    opensAt: '2020-01-01T00:00:00.000Z',
    closesAt: '2099-01-01T00:00:00.000Z',
    signature: 'TrieMap<V> - insert / get / starts_with / remove',
    prompt: `Implement a prefix tree dictionary (\`TrieMap<V>\`) that maps UTF-8 string keys to generic values \`V\`. Support efficient prefix searching and exact key lookups.`,
    examples: [
      {
        input: `let mut trie = TrieMap::new();
trie.insert("rust", 10);
trie.starts_with("ru")`,
        output: 'true',
        explanation: 'Checks if any key with the given prefix exists.',
      },
    ],
    starterCode: `use std::collections::HashMap;

pub struct TrieNode<V> {
    pub value: Option<V>,
    pub children: HashMap<char, TrieNode<V>>,
}

impl<V> Default for TrieNode<V> {
    fn default() -> Self {
        Self {
            value: None,
            children: HashMap::new(),
        }
    }
}

pub struct TrieMap<V> {
    root: TrieNode<V>,
    len: usize,
}

impl<V> Default for TrieMap<V> {
    fn default() -> Self {
        Self::new()
    }
}

impl<V> TrieMap<V> {
    pub fn new() -> Self {
        Self {
            root: TrieNode::default(),
            len: 0,
        }
    }

    pub fn insert(&mut self, key: &str, value: V) -> Option<V> {
        todo!()
    }

    pub fn get(&self, key: &str) -> Option<&V> {
        todo!()
    }

    pub fn starts_with(&self, prefix: &str) -> bool {
        todo!()
    }

    pub fn len(&self) -> usize {
        todo!()
    }

    pub fn is_empty(&self) -> bool {
        todo!()
    }
}`,
    testHarness: `{{SOLUTION}}

fn main() {
    let mut trie = TrieMap::new();
    assert_eq!(trie.insert("rust", 100), None);
    assert_eq!(trie.insert("rustacean", 200), None);
    assert_eq!(trie.insert("ruby", 50), None);

    assert_eq!(trie.get("rust"), Some(&100));
    assert_eq!(trie.get("rustacean"), Some(&200));
    assert_eq!(trie.get("python"), None);

    assert!(trie.starts_with("ru"));
    assert!(trie.starts_with("rust"));
    assert!(!trie.starts_with("golang"));

    assert_eq!(trie.len(), 3);
    println!("all tests passed");
}
`,
    loadSolution: () => Promise.resolve(getContestSolution('trie-map')!),
  },
  {
    id: 'byte-arena',
    title: 'Byte Arena Allocator',
    weekLabel: 'Tier V · Master Trial',
    difficulty: 3,
    opensAt: '2020-01-01T00:00:00.000Z',
    closesAt: '2099-01-01T00:00:00.000Z',
    signature: 'ByteArena - new / alloc / alloc_str / total_allocated',
    prompt: `Implement an arena allocator (\`ByteArena\`) that manages chunked memory allocations and hands out zero-copy borrowed slices (\`&[u8]\` and \`&str\`).`,
    examples: [
      {
        input: `let arena = ByteArena::new(128);
let s = arena.alloc_str("hello");`,
        output: `s == "hello"`,
        explanation: 'Slices borrowed from the arena remain valid for the arena lifetime.',
      },
    ],
    starterCode: `pub struct ByteArena {
    chunk_size: usize,
    chunks: std::cell::RefCell<Vec<Vec<u8>>>,
}

impl ByteArena {
    pub fn new(chunk_size: usize) -> Self {
        assert!(chunk_size >= 64);
        Self {
            chunk_size,
            chunks: std::cell::RefCell::new(vec![Vec::with_capacity(chunk_size)]),
        }
    }

    pub fn alloc(&self, data: &[u8]) -> &[u8] {
        todo!()
    }

    pub fn alloc_str(&self, s: &str) -> &str {
        todo!()
    }

    pub fn total_allocated(&self) -> usize {
        todo!()
    }
}`,
    testHarness: `{{SOLUTION}}

fn main() {
    let arena = ByteArena::new(128);
    let s1 = arena.alloc_str("hello");
    let s2 = arena.alloc_str("world");
    let b1 = arena.alloc(&[1, 2, 3, 4, 5]);

    assert_eq!(s1, "hello");
    assert_eq!(s2, "world");
    assert_eq!(b1, &[1, 2, 3, 4, 5]);
    assert_eq!(arena.total_allocated(), 5 + 5 + 5);
    println!("all tests passed");
}
`,
    loadSolution: () => Promise.resolve(getContestSolution('byte-arena')!),
  },
  {
    id: 'broadcast-queue',
    title: 'Ring-Buffer Broadcast Queue',
    weekLabel: 'Tier VI · Grandmaster Trial',
    difficulty: 3,
    opensAt: '2020-01-01T00:00:00.000Z',
    closesAt: '2099-01-01T00:00:00.000Z',
    signature: 'BroadcastQueue<T> / Receiver<T>',
    prompt: `Implement a multi-consumer broadcast queue (\`BroadcastQueue<T>\`) backed by a fixed-capacity ring buffer.
Consumers receive clones of all broadcasted items from their creation point onward.`,
    examples: [
      {
        input: `let mut q = BroadcastQueue::new(16);
let mut rx = q.subscribe();
q.publish("event");
rx.recv()`,
        output: 'Some("event")',
        explanation: 'Receivers receive items published after subscription.',
      },
    ],
    starterCode: `pub struct BroadcastQueue<T> {
    capacity: usize,
    items: Vec<(u64, T)>,
    tail_seq: u64,
}

pub struct Receiver {
    next_seq: u64,
}

impl<T: Clone> BroadcastQueue<T> {
    pub fn new(capacity: usize) -> Self {
        Self {
            capacity,
            items: Vec::new(),
            tail_seq: 0,
        }
    }

    pub fn subscribe(&self) -> Receiver {
        todo!()
    }

    pub fn publish(&mut self, item: T) {
        todo!()
    }

    pub fn recv(&self, rx: &mut Receiver) -> Option<T> {
        todo!()
    }
}`,
    testHarness: `{{SOLUTION}}

fn main() {
    let mut q = BroadcastQueue::new(4);
    let mut rx1 = q.subscribe();

    q.publish("msg1");
    q.publish("msg2");

    let mut rx2 = q.subscribe();
    q.publish("msg3");

    assert_eq!(q.recv(&mut rx1), Some("msg1"));
    assert_eq!(q.recv(&mut rx1), Some("msg2"));
    assert_eq!(q.recv(&mut rx1), Some("msg3"));

    assert_eq!(q.recv(&mut rx2), Some("msg3"));
    assert_eq!(q.recv(&mut rx2), None);
    println!("all tests passed");
}
`,
    loadSolution: () => Promise.resolve(getContestSolution('broadcast-queue')!),
  },
]

export function getInteractiveQuest(id: string): Contest | undefined {
  return interactiveQuests.find((q) => q.id === id)
}
