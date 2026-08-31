import { getContestSolution } from './contestSolutions'
import { withSolutionHarness } from '../lib/playground'
import { contestCalendarEntry } from './contestCalendar'
import { practiceContests } from './practiceContests'

type ContestExample = {
  input: string
  output: string
  explanation?: string
}

export type ContestSolution = {
  solutionCode: string
  solutionWalkthrough?: string
}


export const SUPPORTED_LANGUAGES = [
  'rust',
  'python',
  'cpp',
  'c',
  'go',
  'javascript',
  'typescript',
  'java',
  'csharp',
] as const

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]


export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  rust: 'Rust',
  python: 'Python',
  cpp: 'C++',
  c: 'C',
  go: 'Go',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  java: 'Java',
  csharp: 'C#',
}


export const LANGUAGE_MONACO_IDS: Record<SupportedLanguage, string> = {
  rust: 'rust',
  python: 'python',
  cpp: 'cpp',
  c: 'c',
  go: 'go',
  javascript: 'javascript',
  typescript: 'typescript',
  java: 'java',
  csharp: 'csharp',
}


export type LanguageStarterMap = Partial<Record<SupportedLanguage, string>>

export type Contest = {
  id: string
  title: string
  weekLabel: string
  difficulty: 1 | 2 | 3
  opensAt: string
  closesAt: string
  prompt: string
  signature: string
  examples: ContestExample[]
  
  starterCode: string
  
  starterCodes?: LanguageStarterMap
  
  supportedLanguages?: readonly SupportedLanguage[]
  
  testHarness: string
  
  solutionUnlocksAt?: string
  
  loadSolution?: () => Promise<ContestSolution>
}


export function getContestLanguages(contest: Contest): readonly SupportedLanguage[] {
  return contest.supportedLanguages ?? SUPPORTED_LANGUAGES
}


export function getStarterCode(contest: Contest, lang: SupportedLanguage): string {
  return contest.starterCodes?.[lang] ?? contest.starterCode
}


const versionedKvStore: Contest = {
  ...contestCalendarEntry('2026-08-27-versioned-kv'),
  supportedLanguages: ['rust'] as const,
  solutionUnlocksAt: '2026-08-28T12:00:00.000Z',
  prompt: `In distributed databases and transaction engines, multi-version concurrency control (MVCC) maintains historical states of keys to provide point-in-time snapshot isolation and time-travel reads.

Implement the in-memory \`VersionedKvStore\` supporting point-in-time queries, tombstone deletions, alphabetical snapshots, and historical compaction:

Methods to implement on \`VersionedKvStore\`:
1. \`new() -> Self\`: Initialize an empty store.
2. \`set(&mut self, key: &str, value: &str, timestamp: u64)\`: Insert or overwrite a key at a given \`timestamp\`. If a version already exists at the exact same timestamp, update its value.
3. \`get(&self, key: &str, timestamp: u64) -> Option<&str>\`: Return the value of \`key\` as of \`timestamp\` (i.e. the most recent version with \`ver_timestamp <= timestamp\`). If the key did not exist or was deleted at/before \`timestamp\` without a subsequent \`set\`, return \`None\`.
4. \`delete(&mut self, key: &str, timestamp: u64)\`: Write a tombstone deletion marker at \`timestamp\`. Subsequent \`get\` queries with \`query_ts >= timestamp\` return \`None\` until a newer \`set\` is recorded.
5. \`snapshot(&self, timestamp: u64) -> Vec<(String, String)>\`: Return all active (non-deleted) key-value pairs visible at \`timestamp\`, sorted alphabetically by \`key\` in ascending order.
6. \`compact(&mut self, before_timestamp: u64) -> usize\`: Prune obsolete historical versions. For every key, remove all historical versions with \`ts <= before_timestamp\` *except* the newest one <= \`before_timestamp\` (so point-in-time queries at \`before_timestamp\` remain valid). Returns the total count of pruned historical records.

Constraints:
- 0 <= key.len(), value.len() <= 128
- 0 <= timestamp <= 1_000_000_000
- Standard library only. No external crates.

Beat other rustaceans on guest execution time (microseconds) and memory RSS. Official solution write-up unlocks in 12 hours.`,
  signature: 'impl VersionedKvStore { pub fn new() -> Self; ... }',
  examples: [
    {
      input: `let mut store = VersionedKvStore::new();
store.set("user:101", "Alice", 10);
store.set("user:101", "Alice Smith", 20);
store.get("user:101", 5);
store.get("user:101", 15);
store.get("user:101", 20);`,
      output: `None
Some("Alice")
Some("Alice Smith")`,
      explanation: 'Point-in-time lookups return the latest version visible at or before the queried timestamp.',
    },
    {
      input: `store.delete("user:101", 25);
store.get("user:101", 20);
store.get("user:101", 25);
store.set("user:101", "Alice Revived", 30);
store.get("user:101", 30);`,
      output: `Some("Alice Smith")
None
Some("Alice Revived")`,
      explanation: 'Tombstones hide keys for queries after the deletion timestamp, but allow newer versions to be set later.',
    },
    {
      input: `// user:101 has versions at ts=10, ts=20
let pruned = store.compact(20);
store.get("user:101", 15);
store.get("user:101", 20);`,
      output: `pruned = 1
None
Some("Alice Smith")`,
      explanation: 'Compaction removes ts=10 (superseded by ts=20) while preserving the active state at ts=20.',
    },
  ],
  starterCode: `use std::collections::{BTreeMap, HashMap};

pub struct VersionedKvStore {
    // TODO: Define internal fields
}

impl VersionedKvStore {
    pub fn new() -> Self {
        // TODO: Initialize store
        todo!()
    }

    pub fn set(&mut self, key: &str, value: &str, timestamp: u64) {
        // TODO: Record key-value at timestamp
        todo!()
    }

    pub fn get(&self, key: &str, timestamp: u64) -> Option<&str> {
        // TODO: Point-in-time lookup
        todo!()
    }

    pub fn delete(&mut self, key: &str, timestamp: u64) {
        // TODO: Record tombstone at timestamp
        todo!()
    }

    pub fn snapshot(&self, timestamp: u64) -> Vec<(String, String)> {
        // TODO: Active keys visible at timestamp in alphabetical order
        todo!()
    }

    pub fn compact(&mut self, before_timestamp: u64) -> usize {
        // TODO: Prune historical versions superseded before cutoff
        todo!()
    }
}`,
  testHarness: `{{SOLUTION}}

fn main() {
    let mut store = VersionedKvStore::new();

    // 1. Basic Set and Get with time-travel
    store.set("user:101", "Alice", 10);
    store.set("user:101", "Alice Smith", 20);
    store.set("user:102", "Bob", 15);

    assert_eq!(store.get("user:101", 5), None);
    assert_eq!(store.get("user:101", 10), Some("Alice"));
    assert_eq!(store.get("user:101", 15), Some("Alice"));
    assert_eq!(store.get("user:101", 20), Some("Alice Smith"));
    assert_eq!(store.get("user:101", 100), Some("Alice Smith"));
    assert_eq!(store.get("user:102", 14), None);
    assert_eq!(store.get("user:102", 15), Some("Bob"));

    // 2. Overwrite at same timestamp
    store.set("user:101", "Alice S.", 20);
    assert_eq!(store.get("user:101", 20), Some("Alice S."));

    // 3. Out-of-order writes
    store.set("key:order", "v3", 30);
    store.set("key:order", "v1", 10);
    store.set("key:order", "v2", 20);
    assert_eq!(store.get("key:order", 9), None);
    assert_eq!(store.get("key:order", 10), Some("v1"));
    assert_eq!(store.get("key:order", 19), Some("v1"));
    assert_eq!(store.get("key:order", 20), Some("v2"));
    assert_eq!(store.get("key:order", 29), Some("v2"));
    assert_eq!(store.get("key:order", 30), Some("v3"));

    // 4. Tombstone deletion & revival
    store.delete("user:102", 25);
    assert_eq!(store.get("user:102", 20), Some("Bob"));
    assert_eq!(store.get("user:102", 25), None);
    assert_eq!(store.get("user:102", 30), None);

    store.set("user:102", "Bob Revived", 35);
    assert_eq!(store.get("user:102", 30), None);
    assert_eq!(store.get("user:102", 35), Some("Bob Revived"));

    // 5. Snapshot queries (alphabetical order)
    let snap_15 = store.snapshot(15);
    assert_eq!(
        snap_15,
        vec![
            ("key:order".to_string(), "v1".to_string()),
            ("user:101".to_string(), "Alice".to_string()),
            ("user:102".to_string(), "Bob".to_string()),
        ]
    );

    let snap_28 = store.snapshot(28);
    assert_eq!(
        snap_28,
        vec![
            ("key:order".to_string(), "v2".to_string()),
            ("user:101".to_string(), "Alice S.".to_string()),
        ]
    );

    let snap_40 = store.snapshot(40);
    assert_eq!(
        snap_40,
        vec![
            ("key:order".to_string(), "v3".to_string()),
            ("user:101".to_string(), "Alice S.".to_string()),
            ("user:102".to_string(), "Bob Revived".to_string()),
        ]
    );

    // 6. Historical Compaction
    let pruned = store.compact(20);
    assert_eq!(pruned, 2);

    assert_eq!(store.get("user:101", 20), Some("Alice S."));
    assert_eq!(store.get("user:101", 100), Some("Alice S."));
    assert_eq!(store.get("user:101", 15), None);

    let pruned2 = store.compact(30);
    assert_eq!(pruned2, 2);

    // 7. Empty store
    let empty_store = VersionedKvStore::new();
    assert_eq!(empty_store.get("nonexistent", 100), None);
    assert_eq!(empty_store.snapshot(100), vec![]);

    // 8. Stress test with 3,000 operations
    let mut stress = VersionedKvStore::new();
    for i in 0..1000 {
        let key = format!("k_{}", i % 50);
        let val = format!("val_{}", i);
        stress.set(&key, &val, i as u64 * 10);
    }
    for i in (0..1000).step_by(5) {
        let key = format!("k_{}", i % 50);
        stress.delete(&key, i as u64 * 10 + 5);
    }
    let p = stress.compact(5000);
    assert!(p > 0);
    let s = stress.snapshot(10000);
    assert!(s.len() <= 50);

    println!("all tests passed");
}
`,
  loadSolution: () => Promise.resolve(getContestSolution('versioned-kv')!),
}


const frameMultiplexer: Contest = {
  ...contestCalendarEntry('2026-08-20-frame-multiplexer'),
  supportedLanguages: ['rust'] as const,
  solutionUnlocksAt: '2026-08-21T03:00:00.000Z',
  prompt: `Inside Cratera's Firecracker execution engine, guest microVMs communicate with the host coordinator through a zero-network virtual socket (vsock) channel. When guest threads stream stdout, stderr, and execution telemetry simultaneously, frame chunks arrive interleaved, in arbitrary order, and occasionally with overlapping byte slices.

Implement the stream multiplexer and frame reassembler:

Given a list of \`FrameChunk\`:
- \`stream_id: u8\`: Channel identifier (e.g. 1 = stdout, 2 = stderr, 3 = telemetry).
- \`offset: u32\`: 0-indexed byte offset where this slice begins in the stream.
- \`payload: String\`: UTF-8 payload data.
- \`is_last: bool\`: True if this chunk marks the final byte of the stream.

Return \`Vec<StreamResult>\`:
- \`stream_id: u8\`: Stream identifier.
- \`data: String\`: Reconstructed contiguous stream data starting from offset 0.
- \`complete: bool\`: \`true\` if the stream is contiguous from offset 0 to the end of the \`is_last\` frame without any gaps; \`false\` otherwise.

Rules:
1. Return streams sorted by \`stream_id\` ascending.
2. If chunks overlap on identical byte ranges, duplicate bytes must be seamlessly deduplicated.
3. If an offset gap occurs from offset 0 (e.g. bytes 0..5 received, then 8..12 received without 4..8), assemble contiguous data up to the first gap and mark \`complete: false\`.
4. If no \`is_last\` frame was received for a stream, \`complete\` is \`false\`.
5. Empty inputs return \`vec![]\`.

Constraints:
- 0 <= chunks.len() <= 5_000
- 0 <= offset <= 1_000_000
- Standard library only. No external crates.

Beat other solvers on guest execution time (microseconds) and memory RSS. Official solution write-up unlocks in 12 hours.`,
  signature: 'fn reassemble_streams(chunks: Vec<FrameChunk>) -> Vec<StreamResult>',
  examples: [
    {
      input: `chunks = [
  FrameChunk { stream_id: 1, offset: 0, payload: "Hello ", is_last: false },
  FrameChunk { stream_id: 1, offset: 6, payload: "World!", is_last: true },
]`,
      output: `[
  StreamResult { stream_id: 1, data: "Hello World!", complete: true },
]`,
      explanation: 'Two in-order chunks assembled into a complete contiguous stream.',
    },
    {
      input: `chunks = [
  FrameChunk { stream_id: 1, offset: 5, payload: " World!", is_last: true },
  FrameChunk { stream_id: 1, offset: 0, payload: "Hello ",  is_last: false },
  FrameChunk { stream_id: 1, offset: 2, payload: "llo ",    is_last: false },
]`,
      output: `[
  StreamResult { stream_id: 1, data: "Hello World!", complete: true },
]`,
      explanation: 'Arrived out of order with overlapping duplicate slice [2..6]; deduplicated cleanly.',
    },
    {
      input: `chunks = [
  FrameChunk { stream_id: 1, offset: 0,  payload: "part1", is_last: false },
  FrameChunk { stream_id: 1, offset: 10, payload: "part3", is_last: true },
]`,
      output: `[
  StreamResult { stream_id: 1, data: "part1", complete: false },
]`,
      explanation: 'Missing bytes 5..10 (offset gap); assembled contiguous data up to the gap with complete = false.',
    },
  ],
  starterCode: `#[derive(Debug, Clone, PartialEq, Eq)]
pub struct FrameChunk {
    pub stream_id: u8,
    pub offset: u32,
    pub payload: String,
    pub is_last: bool,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct StreamResult {
    pub stream_id: u8,
    pub data: String,
    pub complete: bool,
}

pub struct Solution;

impl Solution {
    pub fn reassemble_streams(chunks: Vec<FrameChunk>) -> Vec<StreamResult> {
        // TODO: Assemble out-of-order and overlapping frame chunks
        Vec::new()
    }
}`,
  testHarness: `{{SOLUTION}}

fn chunk(stream_id: u8, offset: u32, payload: &str, is_last: bool) -> FrameChunk {
    FrameChunk {
        stream_id,
        offset,
        payload: payload.to_string(),
        is_last,
    }
}

fn res(stream_id: u8, data: &str, complete: bool) -> StreamResult {
    StreamResult {
        stream_id,
        data: data.to_string(),
        complete,
    }
}

fn main() {
    // 1. Basic in-order stream
    assert_eq!(
        Solution::reassemble_streams(vec![
            chunk(1, 0, "Hello ", false),
            chunk(1, 6, "World!", true),
        ]),
        vec![res(1, "Hello World!", true)]
    );

    // 2. Out of order with overlapping duplicate slice
    assert_eq!(
        Solution::reassemble_streams(vec![
            chunk(1, 5, " World!", true),
            chunk(1, 0, "Hello ", false),
            chunk(1, 2, "llo ", false),
        ]),
        vec![res(1, "Hello World!", true)]
    );

    // 3. Multiple interleaved streams
    assert_eq!(
        Solution::reassemble_streams(vec![
            chunk(2, 0, "ERROR: connection lost", true),
            chunk(1, 0, "stdout line 1\\n", false),
            chunk(3, 0, "cpu_us=120", false),
            chunk(1, 14, "stdout line 2\\n", true),
            chunk(3, 10, ",rss_kb=2048", true),
        ]),
        vec![
            res(1, "stdout line 1\\nstdout line 2\\n", true),
            res(2, "ERROR: connection lost", true),
            res(3, "cpu_us=120,rss_kb=2048", true),
        ]
    );

    // 4. Missing chunk / gap in stream
    assert_eq!(
        Solution::reassemble_streams(vec![
            chunk(1, 0, "part1", false),
            chunk(1, 10, "part3", true),
        ]),
        vec![res(1, "part1", false)]
    );

    // 5. Missing offset 0 entirely
    assert_eq!(
        Solution::reassemble_streams(vec![
            chunk(1, 5, "middle", true),
        ]),
        vec![res(1, "", false)]
    );

    // 6. No is_last flag received
    assert_eq!(
        Solution::reassemble_streams(vec![
            chunk(1, 0, "running forever...", false),
        ]),
        vec![res(1, "running forever...", false)]
    );

    // 7. Empty input
    assert_eq!(Solution::reassemble_streams(vec![]), vec![]);

    // 8. Stress test with 3000 interleaved frames
    let mut stress = Vec::with_capacity(3000);
    for i in (0..1000).rev() {
        stress.push(chunk(1, i * 4, "data", i == 999));
        stress.push(chunk(2, i * 2, "ok", i == 999));
        stress.push(chunk(3, i * 1, "x", i == 999));
    }
    let out = Solution::reassemble_streams(stress);
    assert_eq!(out.len(), 3);
    assert!(out[0].complete);
    assert!(out[1].complete);
    assert!(out[2].complete);
    assert_eq!(out[0].data.len(), 4000);
    assert_eq!(out[1].data.len(), 2000);
    assert_eq!(out[2].data.len(), 1000);

    println!("all tests passed");
}
`,
  loadSolution: () => Promise.resolve(getContestSolution('frame-multiplexer')!),
}


const alienLexicon: Contest = {
  ...contestCalendarEntry('2026-08-13-lexicon'),
  supportedLanguages: ['rust'] as const,
  solutionUnlocksAt: '2026-08-14T14:30:00.000Z',
  prompt: `rustc just inherited a crate from another planet. The crate's identifiers are already sorted. Nobody wrote down the alphabet.

You are given a list of words in **strictly sorted alien order**. Recover the alphabet:

- Return a string of every distinct letter that appears, in alphabet order.
- If several alphabets fit the dictionary, return the **lexicographically smallest** string (ordinary English \`<\` on the result).
- If the dictionary is contradictory (a cycle, or a longer word placed before its own prefix), return \`""\`.

How to read the dictionary: compare each adjacent pair. At the first index where they differ, that letter comes before the other. If they share a prefix and the left word is longer, the list cannot be sorted (invalid).

Letters are lowercase \`a\`–\`z\` only. Letters with no direct rule still appear; they just float until the lex-smallest rule places them.

Constraints:
- 0 <= words.len() <= 10_000
- 1 <= words[i].len() <= 100 when words is non-empty
- Total characters <= 100_000
- Target time: O(total characters + 26)
- Use only std. No unsafe.

This is the one problem this week. Beat other solvers on time and memory. Official write-up stays locked for 24 hours.`,
  signature: 'fn alien_order(words: Vec<String>) -> String',
  examples: [
    {
      input: `words = [
  "wrt",
  "wrf",
  "er",
  "ett",
  "rftt",
]`,
      output: `"wertf"`,
      explanation:
        'Adjacent pairs force w<e, e<r, t<f, r<t. The unique topological order is "wertf".',
    },
    {
      input: `words = ["z", "x"]`,
      output: `"zx"`,
      explanation: 'z comes before x. Both letters must appear in output.',
    },
    {
      input: `words = ["zxy"]`,
      output: `"xyz"`,
      explanation:
        'One word, no pairwise rule. Any permutation is valid; return lex-smallest: "xyz".',
    },
  ],
  starterCode: `pub struct Solution;

impl Solution {
    pub fn alien_order(words: Vec<String>) -> String {
        // TODO: graph from adjacent pairs, then lex-smallest topo order
        String::new()
    }
}`,
  testHarness: `{{SOLUTION}}

fn w(xs: &[&str]) -> Vec<String> {
    xs.iter().map(|s| s.to_string()).collect()
}

fn main() {
    assert_eq!(
        Solution::alien_order(w(&["wrt", "wrf", "er", "ett", "rftt"])),
        "wertf"
    );
    assert_eq!(Solution::alien_order(w(&["z", "x"])), "zx");
    assert_eq!(Solution::alien_order(w(&["zxy"])), "xyz");
    assert_eq!(Solution::alien_order(w(&["z", "x", "z"])), "");
    assert_eq!(Solution::alien_order(w(&["abc", "ab"])), "");
    assert_eq!(Solution::alien_order(w(&["abc", "abc"])), "abc");
    assert_eq!(Solution::alien_order(w(&["ab", "adc"])), "abcd");
    assert_eq!(Solution::alien_order(w(&["ac", "ab", "zc", "zb"])), "acbz");
    assert_eq!(Solution::alien_order(Vec::new()), "");
    assert_eq!(Solution::alien_order(w(&["a", "a", "a"])), "a");
    assert_eq!(Solution::alien_order(w(&["a", "b", "c"])), "abc");
    assert_eq!(Solution::alien_order(w(&["ab", "a"])), "");
    assert_eq!(Solution::alien_order(w(&["abc", "abd"])), "abcd");
    assert_eq!(Solution::alien_order(w(&["z", "zy", "zyx"])), "xyz");
    assert_eq!(Solution::alien_order(w(&["wrt", "wrf"])), "rtfw");
    assert_eq!(Solution::alien_order(w(&["x", "xy"])), "xy");
    assert_eq!(Solution::alien_order(w(&["aaa", "ab"])), "ab");
    assert_eq!(Solution::alien_order(w(&["cab", "cba"])), "abc");
    assert_eq!(Solution::alien_order(w(&["za", "zb", "ca", "cb"])), "abzc");
    assert_eq!(Solution::alien_order(w(&["cba", "cbd", "cda"])), "abcd");
    assert_eq!(Solution::alien_order(w(&["z", "z"])), "z");
    assert_eq!(Solution::alien_order(w(&["z", "xy"])), "yzx");
    let stress: Vec<String> = (0..4000)
        .map(|i| {
            format!("{i:04}")
                .bytes()
                .map(|b| (b - b'0' + b'a') as char)
                .collect()
        })
        .collect();
    assert_eq!(Solution::alien_order(stress), "abcdefghij");
    println!("all tests passed");
}
`,
  loadSolution: () => Promise.resolve(getContestSolution('alien-lexicon')!),
}


const intervalTaskScheduler: Contest = {
  ...contestCalendarEntry('2026-08-06-scheduler'),
  supportedLanguages: ['rust'] as const,
  prompt: `You are given n tasks. Each task is [start, end, profit]:
- start: inclusive begin time
- end: inclusive end time
- profit: reward for completing the task

A worker runs at most one task at a time. Two tasks overlap if their closed intervals share any point. In particular, a task ending at time t and another starting at time t overlap and cannot both be chosen.

Return the maximum total profit from any non-overlapping subset of tasks.

Constraints (design for these even if the playground suite is smaller):
- 1 <= n <= 100_000
- 0 <= start < end <= 1_000_000_000
- 1 <= profit <= 1_000_000
- Target time: O(n log n)
- Target space: O(n)
- Use i64 for accumulated profit (sums can exceed i32)

Hints:
- Sort by end time.
- For each task, binary-search the latest prior task that ends strictly before this one starts.
- dp[i] = best profit using the first i tasks in that order.

You may only edit the code below. Hit Run to compile and test against the judge, then Submit to verify.`,
  signature: 'fn max_profit(tasks: Vec<Vec<i64>>) -> i64',
  examples: [
    {
      input: `tasks = [
  [1, 3, 50],
  [2, 5, 20],
  [4, 6, 70],
  [6, 7, 60],
]`,
      output: `120`,
      explanation:
        'Take [1,3,50] and [4,6,70] for total profit 120. (Tasks ending at 6 and starting at 6 overlap and cannot both be taken).',
    },
    {
      input: `tasks = [
  [1, 4, 10],
  [2, 3, 40],
  [3, 5, 15],
  [6, 8, 30],
]`,
      output: `70`,
      explanation: 'Optimal non-overlapping selection is [2,3,40] + [6,8,30] = 70.',
    },
  ],
  starterCode: `pub struct Solution;

impl Solution {
    pub fn max_profit(tasks: Vec<Vec<i64>>) -> i64 {
        // TODO: O(n log n) weighted interval scheduling
        0
    }
}`,
  testHarness: `{{SOLUTION}}

fn main() {
    assert_eq!(
        Solution::max_profit(vec![
            vec![1, 3, 50],
            vec![2, 5, 20],
            vec![4, 6, 70],
            vec![6, 7, 60],
        ]),
        120
    );
    assert_eq!(
        Solution::max_profit(vec![
            vec![1, 4, 10],
            vec![2, 3, 40],
            vec![3, 5, 15],
            vec![6, 8, 30],
        ]),
        70
    );
    assert_eq!(
        Solution::max_profit(vec![
            vec![1, 2, 100],
            vec![1, 2, 200],
            vec![3, 4, 150],
        ]),
        350
    );
    assert_eq!(Solution::max_profit(vec![vec![0, 1, 1_000_000]]), 1_000_000);
    assert_eq!(
        Solution::max_profit(vec![
            vec![1, 10, 5],
            vec![2, 9, 12],
            vec![3, 8, 8],
            vec![4, 7, 3],
        ]),
        12
    );
    assert_eq!(
        Solution::max_profit(vec![
            vec![1, 2, 10],
            vec![3, 4, 20],
            vec![5, 6, 30],
            vec![7, 8, 40],
        ]),
        100
    );
    // Closed intervals: end == next start still overlaps, so pick the better single task.
    assert_eq!(
        Solution::max_profit(vec![
            vec![1, 5, 50],
            vec![5, 10, 60],
            vec![1, 10, 40],
        ]),
        60
    );
    assert_eq!(
        Solution::max_profit(vec![
            vec![1, 2, 1_000_000],
            vec![3, 4, 1_000_000],
            vec![5, 6, 1_000_000],
            vec![7, 8, 1_000_000],
            vec![9, 10, 1_000_000],
        ]),
        5_000_000
    );
    assert_eq!(
        Solution::max_profit(vec![
            vec![5, 9, 100],
            vec![1, 3, 40],
            vec![4, 6, 70],
            vec![2, 8, 60],
        ]),
        140
    );
    assert_eq!(Solution::max_profit(Vec::new()), 0);
    println!("all tests passed");
}
`,
  loadSolution: () => Promise.resolve(getContestSolution('interval-task-scheduler')!),
}


const lifetimeSafeCache: Contest = {
  ...contestCalendarEntry('2026-01-29-cache'),
  supportedLanguages: ['rust'] as const,
  prompt: `Implement a query result cache for a database connection pool. The cache stores query results in memory to avoid repeated database hits. 

**Note**: Correctness tests accept any working implementation. Performance scoring is separate and documented in the rubric. A Vec-based solution with O(n) removals will pass all correctness tests.

You may change or replace the internal data structures; only the public behavior matters. Use only the Rust standard library. No \`unsafe\` code allowed.

Target completion time: 90-120 minutes.

## Technical Considerations
- When do you clone \`K\` vs move it? Minimize allocations while maintaining correctness.
- How do you maintain access order? A Vec-based approach is O(n) for removal but simple, while an index-based or arena-based approach offers better complexity.
- **Note**: This problem intentionally exercises Rust's ownership system. The combination of HashMap, mutable access, and LRU tracking often requires restructuring your data layout. This is expected, not a bug.
- Safe solutions exist without \`unsafe\`.

You may only edit the code below. Hit Run to compile and test against the judge, then Submit to verify.`,
  signature: "QueryCache<K, V> - new / insert / get / get_mut / take / transform / drain_matching",
  examples: [
    {
      input: `let mut cache = QueryCache::new(2);
cache.insert(1, "one");
cache.insert(2, "two");
cache.get(&1);
cache.insert(3, "three");`,
      output: `cache.get(&2) == None // Key 2 was evicted (LRU)`,
      explanation:
        'Accessing key 1 marks it MRU; inserting key 3 evicts key 2.',
    },
    {
      input: `let mut cache = QueryCache::new(2);
cache.insert(1, "value");
let taken = cache.take(&1);`,
      output: `taken == Some("value") && cache.get(&1) == None`,
      explanation:
        'take removes the entry and returns owned value.',
    },
  ],
  starterCode: `use std::collections::HashMap;

struct QueryCache<K, V> {
    store: HashMap<K, V>,
    capacity: usize,
    access_order: Vec<K>,
}

impl<K, V> QueryCache<K, V>
where
    K: Eq + std::hash::Hash + Clone,
{
    fn new(capacity: usize) -> Self {
        assert!(capacity > 0, "Cache capacity must be at least 1");
        todo!()
    }

    fn insert(&mut self, key: K, value: V) -> Option<V> {
        todo!()
    }

    fn get(&mut self, key: &K) -> Option<&V> {
        todo!()
    }

    fn get_mut(&mut self, key: &K) -> Option<&mut V> {
        todo!()
    }

    fn take(&mut self, key: &K) -> Option<V> {
        todo!()
    }

    fn transform<U, F>(&self, f: F) -> Vec<U>
    where
        F: FnMut(&V) -> U,
    {
        todo!()
    }

    fn drain_matching<F>(&mut self, predicate: F) -> Vec<V>
    where
        F: FnMut(&V) -> bool,
    {
        todo!()
    }
}
`,
  testHarness: `{{SOLUTION}}

fn main() {
    // test_basic_operations

    let mut cache = QueryCache::new(3);

    assert_eq!(cache.insert(1, "one".to_string()), None);
    assert_eq!(cache.insert(2, "two".to_string()), None);
    assert_eq!(cache.insert(3, "three".to_string()), None);

    assert_eq!(cache.get(&2), Some(&"two".to_string()));
    assert_eq!(cache.get(&1), Some(&"one".to_string()));
        

    // test_eviction

    let mut cache = QueryCache::new(2);

    cache.insert(1, "one".to_string());
    cache.insert(2, "two".to_string());

    cache.get(&1);

    let evicted = cache.insert(3, "three".to_string());
    assert_eq!(evicted, Some("two".to_string()));

    assert_eq!(cache.get(&2), None);
    assert_eq!(cache.get(&1), Some(&"one".to_string()));
    assert_eq!(cache.get(&3), Some(&"three".to_string()));
        

    // test_mutation

    let mut cache = QueryCache::new(2);

    cache.insert(1, vec![1, 2, 3]);
    cache.insert(2, vec![4, 5, 6]);

    if let Some(v) = cache.get_mut(&1) {
        v.push(4);
    }

    assert_eq!(cache.get(&1), Some(&vec![1, 2, 3, 4]));
        

    // test_take_ownership

    let mut cache = QueryCache::new(2);

    cache.insert(1, "one".to_string());
    cache.insert(2, "two".to_string());

    let owned = cache.take(&1);
    assert_eq!(owned, Some("one".to_string()));
    assert_eq!(cache.get(&1), None);
        

    // test_transform

    let mut cache = QueryCache::new(3);

    cache.insert(1, 10);
    cache.insert(2, 20);
    cache.insert(3, 30);

    cache.get(&2);
    cache.get(&3);

    let doubled: Vec<i32> = cache.transform(|&v| v * 2);
    assert_eq!(doubled, vec![60, 40, 20]);
        

    // test_update_existing

    let mut cache = QueryCache::new(2);
    cache.insert(1, "one".to_string());
    let old = cache.insert(1, "ONE".to_string());
    assert_eq!(old, Some("one".to_string()));
    assert_eq!(cache.get(&1), Some(&"ONE".to_string()));
        

    // test_drain_matching

    let mut cache = QueryCache::new(5);

    cache.insert(1, 10);
    cache.insert(2, 25);
    cache.insert(3, 30);
    cache.insert(4, 15);
    cache.insert(5, 40);

    let mut drained = cache.drain_matching(|&v| v > 20);
    drained.sort();

    assert_eq!(drained, vec![25, 30, 40]);
    assert_eq!(cache.get(&1), Some(&10));
    assert_eq!(cache.get(&4), Some(&15));
    assert_eq!(cache.get(&2), None);
        

    // test_eviction_order

    let mut cache = QueryCache::new(3);

    cache.insert(1, "a".to_string());
    cache.insert(2, "b".to_string());
    cache.insert(3, "c".to_string());

    cache.get(&1);
    cache.get(&2);

    let evicted = cache.insert(4, "d".to_string());
    assert_eq!(evicted, Some("c".to_string()));
        

    // test_get_mut_updates_lru

    let mut cache = QueryCache::new(2);

    cache.insert(1, vec![100]);
    cache.insert(2, vec![200]);

    cache.get_mut(&1);

    let evicted = cache.insert(3, vec![300]);
    assert_eq!(evicted, Some(vec![200]));
    assert_eq!(cache.get(&1), Some(&vec![100]));
        

    // test_capacity_one

    let mut cache = QueryCache::new(1);

    assert_eq!(cache.insert(1, "one".to_string()), None);
    assert_eq!(cache.insert(2, "two".to_string()), Some("one".to_string()));
    assert_eq!(cache.get(&1), None);
    assert_eq!(cache.get(&2), Some(&"two".to_string()));
        

    // test_update_at_capacity

    let mut cache = QueryCache::new(2);

    cache.insert(1, "one".to_string());
    cache.insert(2, "two".to_string());

    let old = cache.insert(1, "ONE".to_string());
    assert_eq!(old, Some("one".to_string()));

    assert_eq!(cache.get(&1), Some(&"ONE".to_string()));
    assert_eq!(cache.get(&2), Some(&"two".to_string()));
        

    // test_drain_all

    let mut cache = QueryCache::new(3);

    cache.insert(1, 10);
    cache.insert(2, 20);
    cache.insert(3, 30);

    let drained = cache.drain_matching(|_| true);
    assert_eq!(drained.len(), 3);

    assert_eq!(cache.get(&1), None);
    assert_eq!(cache.get(&2), None);
    assert_eq!(cache.get(&3), None);
        

    // test_take_nonexistent

    let mut cache: QueryCache<i32, String> = QueryCache::new(2);
    assert_eq!(cache.take(&1), None);
        

    // test_multiple_accesses

    let mut cache = QueryCache::new(3);

    cache.insert(1, "a".to_string());
    cache.insert(2, "b".to_string());
    cache.insert(3, "c".to_string());

    cache.get(&1);
    cache.get(&1);
    cache.get(&1);
    cache.get(&2);

    let evicted = cache.insert(4, "d".to_string());
    assert_eq!(evicted, Some("c".to_string()));
        
    println!("all tests passed");
}
`,
  loadSolution: () => Promise.resolve(getContestSolution('lifetime-safe-cache')!),
}


const requestCoalescer: Contest = {
  ...contestCalendarEntry('2026-02-05-coalescer'),
  supportedLanguages: ['rust'] as const,
  prompt: `You're building a request aggregation layer for a high-throughput analytics service. The system must batch requests while respecting strict deadlines and maintaining fairness across priority levels.

### Core Mechanics

**Time Model:**
- Time is discrete and advances only when \`tick()\` is called
- Requests are submitted at the current time (\`now\`)
- Each request has an **absolute deadline** (not relative)

**Batching Rules (applied in order during each tick):**

1. **Time advances:** \`now\` increments by 1
2. **Expiration:** Any request where \`deadline <= now\` immediately expires
   - Expired requests emit \`Event::RequestExpired\` (sorted by ID for determinism)
   - Expired requests are **removed** and never dispatched
3. **Full batch formation:** While \`pending_count >= capacity\`, form batches:
   - Take exactly \`capacity\` requests using **round-robin across priorities**
   - Sort batch by priority (lower number = higher priority), then by ID
   - Emit \`Event::BatchDispatched\`
4. **Partial batch trigger:** If ANY requests expired this tick AND pending requests remain:
   - Dispatch ALL remaining pending requests as one partial batch
   - Sort by priority, then ID
   - Emit \`Event::BatchDispatched\`

**Fairness Guarantee (Round-Robin):**
When forming batches:
- Iterate through priority levels in sorted order (Priority(1), Priority(2), ...)
- Take one request from each non-empty priority queue
- Repeat until batch reaches capacity
- This ensures no priority starves when multiple priorities have pending requests

**Statistics Tracking:**
- \`submitted\`: Total requests submitted for this priority
- \`dispatched\`: Requests successfully dispatched in batches
- \`expired\`: Requests that expired without being dispatched
- \`total_wait_time\`: Sum of \`(dispatch_time - arrival_time)\` for all dispatched requests

### Complexity Requirements

- \`submit()\`: O(log P) where P = number of distinct priorities
- \`tick()\`: O(B log B + E log P) where B = requests dispatched, E = requests expired, P = priorities
- Space: O(N + D) where N = pending requests, D = distinct deadlines

You may only edit the code below. Hit Run to compile and test against the judge, then Submit to verify.`,
  signature: "Coalescer::new / submit / tick - priority-aware batching",
  examples: [
    {
      input: `let mut coalescer = Coalescer::new(NonZeroUsize::new(2).unwrap());
coalescer.submit(1, Priority(1));
coalescer.submit(2, Priority(2));
coalescer.tick(Time(10))`,
      output: `Event::BatchDispatched(vec![1, 2])`,
      explanation:
        'Round-robin fairness pulls one request per priority before filling remainder.',
    },
  ],
  starterCode: `pub use std::num::NonZeroUsize;

/// Priority level, where lower values indicate higher priority.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct Priority(pub u8);

/// Absolute deadline in time units.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct Deadline(pub u64);

/// Unique identifier for a request.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct RequestId(pub u64);

/// A request to be coalesced.
#[derive(Debug, Clone)]
pub struct Request {
    pub id: RequestId,
    pub priority: Priority,
    pub deadline: Deadline,
    pub payload: Vec<u8>,
}

/// A dispatched batch of requests.
#[derive(Debug, Clone)]
pub struct Batch {
    pub requests: Vec<Request>,
    pub dispatched_at: u64,
}

/// Statistics for a specific priority level.
#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct PriorityStats {
    pub submitted: u64,
    pub dispatched: u64,
    pub expired: u64,
    pub total_wait_time: u64,
}

/// Events produced by the coalescer during a time step.
#[derive(Debug, Clone)]
pub enum Event {
    /// A batch was dispatched.
    BatchDispatched(Batch),
    /// A request expired without being dispatched.
    RequestExpired(Request),
}

/// Configuration for the coalescer.
#[derive(Debug, Clone)]
pub struct Config {
    pub batch_capacity: NonZeroUsize,
}

pub struct Coalescer;

impl Coalescer {
    /// Creates a new coalescer with the given configuration.
    /// Initial time is 0.
    pub fn new(config: Config) -> Self {
        todo!()
    }

    /// Submits a request to be coalesced.
    /// The request is timestamped with the current time.
    /// 
    /// Returns an error if the request ID is already pending.
    pub fn submit(&mut self, request: Request) -> Result<(), SubmitError> {
        todo!()
    }

    /// Advances time by one unit and processes pending requests.
    /// 
    /// Returns all events produced during this time step, ordered by:
    /// 1. All expirations (sorted by request ID)
    /// 2. All batch dispatches (in formation order)
    pub fn tick(&mut self) -> Vec<Event> {
        todo!()
    }

    /// Returns the current time.
    pub fn now(&self) -> u64 {
        todo!()
    }

    /// Returns statistics for a specific priority level.
    /// Returns None if no requests have ever been submitted for this priority.
    pub fn stats(&self, priority: Priority) -> Option<PriorityStats> {
        todo!()
    }

    /// Returns the number of requests currently pending (not yet dispatched or expired).
    pub fn pending_count(&self) -> usize {
        todo!()
    }

    /// Returns true if there are no pending requests.
    pub fn is_idle(&self) -> bool {
        todo!()
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum SubmitError {
    DuplicateId,
}
`,
  testHarness: `{{SOLUTION}}

fn config(capacity: usize) -> Config {
        Config {
            batch_capacity: NonZeroUsize::new(capacity).unwrap(),
        }
    }

fn request(id: u64, priority: u8, deadline: u64, payload_size: usize) -> Request {
        Request {
            id: RequestId(id),
            priority: Priority(priority),
            deadline: Deadline(deadline),
            payload: vec![0u8; payload_size],
        }
    }

fn main() {
    // test_basic_batch_formation

    let mut c = Coalescer::new(config(2));

    c.submit(request(1, 1, 10, 100)).unwrap();
    c.submit(request(2, 1, 10, 100)).unwrap();

    let events = c.tick();

    assert_eq!(events.len(), 1);
    match &events[0] {
        Event::BatchDispatched(batch) => {
            assert_eq!(batch.requests.len(), 2);
            assert_eq!(batch.dispatched_at, 1);
            assert_eq!(batch.requests[0].id.0, 1);
            assert_eq!(batch.requests[1].id.0, 2);
        }
        _ => panic!("expected batch dispatch"),
    }
    assert!(c.is_idle());
        

    // test_expiration_then_partial_batch

    let mut c = Coalescer::new(config(3));

    // Request 1 expires at time 1, request 2 has later deadline
    c.submit(request(1, 1, 1, 100)).unwrap();
    c.submit(request(2, 1, 5, 100)).unwrap();

    let events = c.tick(); // time advances to 1

    // No full batch possible (only 2 pending, need 3)
    // Request 1 expires (deadline 1 <= now 1)
    // Request 2 remains, dispatched in partial batch
    assert_eq!(events.len(), 2);
    assert!(matches!(&events[0], Event::RequestExpired(r) if r.id.0 == 1));
    assert!(matches!(&events[1], Event::BatchDispatched(batch) 
        if batch.requests.len() == 1 && batch.requests[0].id.0 == 2));

    assert_eq!(c.pending_count(), 0);
        

    // test_priority_ordering_in_batch

    let mut c = Coalescer::new(config(2));

    // Lower priority number = higher priority
    c.submit(request(1, 5, 10, 100)).unwrap();
    c.submit(request(2, 1, 10, 100)).unwrap();

    let events = c.tick();

    match &events[0] {
        Event::BatchDispatched(batch) => {
            // Priority(1) comes before Priority(5)
            assert_eq!(batch.requests[0].priority.0, 1);
            assert_eq!(batch.requests[0].id.0, 2);
            assert_eq!(batch.requests[1].priority.0, 5);
            assert_eq!(batch.requests[1].id.0, 1);
        }
        _ => panic!("expected batch dispatch"),
    }
        

    // test_duplicate_id_rejected

    let mut c = Coalescer::new(config(2));

    c.submit(request(1, 1, 10, 100)).unwrap();
    assert_eq!(
        c.submit(request(1, 2, 10, 100)),
        Err(SubmitError::DuplicateId)
    );
        

    // test_multiple_expirations_then_partial_batch

    let mut c = Coalescer::new(config(3));

    c.submit(request(1, 1, 1, 100)).unwrap();
    c.submit(request(2, 1, 1, 100)).unwrap();
    c.submit(request(3, 1, 5, 100)).unwrap();

    let events = c.tick(); // time advances to 1

    // Requests 1,2 expire (deadline 1 <= now 1)
    // Request 3 remains (deadline 5 > now 1)
    // Partial batch dispatches request 3
    assert_eq!(events.len(), 3);
    assert!(matches!(&events[0], Event::RequestExpired(r) if r.id.0 == 1));
    assert!(matches!(&events[1], Event::RequestExpired(r) if r.id.0 == 2));
    assert!(matches!(&events[2], Event::BatchDispatched(batch) 
        if batch.requests.len() == 1 && batch.requests[0].id.0 == 3));
        

    // test_stats_tracking

    let mut c = Coalescer::new(config(2));

    c.submit(request(1, 5, 10, 100)).unwrap();
    c.submit(request(2, 5, 1, 100)).unwrap();  // will expire
    c.submit(request(3, 5, 10, 100)).unwrap();

    c.tick(); // time 1: req 2 expires, reqs 1+3 dispatch as partial batch

    let stats = c.stats(Priority(5)).unwrap();
    assert_eq!(stats.submitted, 3);
    assert_eq!(stats.dispatched, 2);  // requests 1 and 3
    assert_eq!(stats.expired, 1);     // request 2
    assert_eq!(stats.total_wait_time, 2); // req 1: (1-0)=1, req 3: (1-0)=1
        

    // test_round_robin_fairness

    let mut c = Coalescer::new(config(2));

    // Submit 2 requests per priority level
    c.submit(request(1, 10, 10, 100)).unwrap();  // low priority
    c.submit(request(2, 10, 10, 100)).unwrap();  // low priority
    c.submit(request(3, 1, 10, 100)).unwrap();   // high priority
    c.submit(request(4, 1, 10, 100)).unwrap();   // high priority

    let events = c.tick();

    // Should form 2 batches via round-robin
    assert_eq!(events.len(), 2);

    // First batch: one from Priority(1), one from Priority(10)
    if let Event::BatchDispatched(batch) = &events[0] {
        assert_eq!(batch.requests.len(), 2);
        // After sorting: Priority(1) first, Priority(10) second
        assert_eq!(batch.requests[0].priority.0, 1);
        assert_eq!(batch.requests[1].priority.0, 10);
    }

    // Second batch: remaining from each priority
    if let Event::BatchDispatched(batch) = &events[1] {
        assert_eq!(batch.requests.len(), 2);
        assert_eq!(batch.requests[0].priority.0, 1);
        assert_eq!(batch.requests[1].priority.0, 10);
    }

    // Verify both priorities got dispatched
    let mut high_count = 0;
    let mut low_count = 0;
    for event in events {
        if let Event::BatchDispatched(batch) = event {
            for req in batch.requests {
                if req.priority.0 == 1 { high_count += 1; }
                if req.priority.0 == 10 { low_count += 1; }
            }
        }
    }
    assert_eq!(high_count, 2);
    assert_eq!(low_count, 2);
        

    // test_no_partial_batch_without_expiration

    let mut c = Coalescer::new(config(3));

    c.submit(request(1, 1, 10, 100)).unwrap();
    c.submit(request(2, 1, 10, 100)).unwrap();

    let events = c.tick();

    // No full batch (need 3, have 2)
    // No expirations (deadlines are 10, now is 1)
    // So no partial batch either
    assert_eq!(events.len(), 0);
    assert_eq!(c.pending_count(), 2);
        

    // test_all_requests_expire

    let mut c = Coalescer::new(config(2));

    c.submit(request(1, 1, 1, 100)).unwrap();
    c.submit(request(2, 1, 1, 100)).unwrap();

    let events = c.tick(); // time 1, both expire

    // Both requests expire, no partial batch (nothing left)
    assert_eq!(events.len(), 2);
    assert!(matches!(&events[0], Event::RequestExpired(r) if r.id.0 == 1));
    assert!(matches!(&events[1], Event::RequestExpired(r) if r.id.0 == 2));
    assert!(c.is_idle());
        

    // test_batch_capacity_one

    let mut c = Coalescer::new(config(1));

    c.submit(request(1, 1, 5, 100)).unwrap();
    c.submit(request(2, 1, 5, 100)).unwrap();

    let events = c.tick();

    // Each request forms its own batch
    assert_eq!(events.len(), 2);
    assert!(matches!(&events[0], Event::BatchDispatched(b) if b.requests.len() == 1));
    assert!(matches!(&events[1], Event::BatchDispatched(b) if b.requests.len() == 1));
        

    // test_interleaved_full_and_partial_batches

    let mut c = Coalescer::new(config(2));

    c.submit(request(1, 1, 2, 100)).unwrap();
    c.submit(request(2, 1, 2, 100)).unwrap();
    c.submit(request(3, 1, 1, 100)).unwrap(); // expires at time 1

    let events = c.tick(); // time 1

    // Order: expiration first, then full batch
    // Request 3 expires, then requests 1+2 form full batch
    assert_eq!(events.len(), 2);
    assert!(matches!(&events[0], Event::RequestExpired(r) if r.id.0 == 3));
    assert!(matches!(&events[1], Event::BatchDispatched(b) if b.requests.len() == 2));
        

    // test_three_priority_levels_round_robin

    let mut c = Coalescer::new(config(3));

    c.submit(request(1, 1, 10, 100)).unwrap();   // P1
    c.submit(request(2, 5, 10, 100)).unwrap();   // P5
    c.submit(request(3, 10, 10, 100)).unwrap();  // P10

    let events = c.tick();

    assert_eq!(events.len(), 1);
    if let Event::BatchDispatched(batch) = &events[0] {
        assert_eq!(batch.requests.len(), 3);
        // Round-robin takes 1 from each: P1, P5, P10
        // After sorting by priority: P1, P5, P10
        assert_eq!(batch.requests[0].priority.0, 1);
        assert_eq!(batch.requests[1].priority.0, 5);
        assert_eq!(batch.requests[2].priority.0, 10);
    }
        
    println!("all tests passed");
}
`,
  loadSolution: () => Promise.resolve(getContestSolution('request-coalescer')!),
}


const dagPathValue: Contest = {
  ...contestCalendarEntry('2026-02-12-dag-path'),
  supportedLanguages: ['rust'] as const,
  prompt: `You are given a directed acyclic graph (DAG) with \`n\` nodes numbered \`0\` to \`n-1\`. Each node has:
- A **color** (represented by a lowercase letter 'a'-'z')
- A **value** (a positive integer)

You need to find a path from any starting node to any ending node that maximizes the total value collected, subject to the constraint that **no color appears more than \`k\` times** along the path.

### Formal Definition

**Input:**
- \`n\`: number of nodes
- \`colors\`: string of length \`n\` where \`colors[i]\` is the color of node \`i\`
- \`values\`: array of length \`n\` where \`values[i]\` is the value of node \`i\`
- \`edges\`: list of directed edges \`[from, to]\`
- \`k\`: maximum allowed frequency of any single color

**Output:**
- The maximum total value of any valid path, or \`-1\` if no valid path exists

**Path Rules:**
- A path can start at any node and end at any node
- A path must follow directed edges
- A single-node path is valid (contains just one node)
- No color can appear more than \`k\` times in the path

### Constraints

- \`1 <= n <= 50_000\`
- \`1 <= edges.length <= 100_000\`
- \`1 <= values[i] <= 1_000\`
- \`1 <= k <= 26\`
- The graph is guaranteed to be acyclic
- Expected time complexity: **O(n * k^c + edges)** where c is the number of distinct colors (at most 26)
- Expected space complexity: **O(n * k^c)** or better

### Worked Examples

**Example 1**

Input:
\`\`\`
n = 4
colors = "abca"
values = [10, 5, 15, 8]
edges = [[0,1], [1,2], [0,3], [3,2]]
k = 1
\`\`\`

Output: \`30\`

Explanation: 
- Path \`0 -> 3 -> 2\` visits nodes with colors "a", "a", "c". Color 'a' appears twice, violating k=1.
- Path \`0 -> 1 -> 2\` visits "a", "b", "c" with values 10+5+15=30. Each color appears exactly once. ✓
- This is the maximum valid path.

**Example 2**

Input:
\`\`\`
n = 3
colors = "aaa"
values = [10, 20, 30]
edges = [[0,1], [1,2]]
k = 2
\`\`\`

Output: \`50\`

Explanation: 
- Path \`0 -> 1\` visits two 'a' nodes with values 10+20=30. Valid (k=2). 
- Path \`1 -> 2\` gives 20+30=50. Valid (k=2). ✓
- Path \`0 -> 1 -> 2\` has three 'a's, which exceeds k=2. Invalid.
- Single node path at node 2 gives value 30.
- Maximum is 50 from path \`1 -> 2\`.

**Example 3**

Input:
\`\`\`
n = 2
colors = "ab"
values = [100, 200]
edges = []
k = 1
\`\`\`

Output: \`200\`

Explanation: No edges exist, so only single-node paths are valid. Node 1 with value 200 is optimal.

**Example 4 (Diamond Graph)**

Input:
\`\`\`
n = 4
colors = "abcd"
values = [10, 20, 30, 40]
edges = [[0,1], [0,2], [1,3], [2,3]]
k = 1
\`\`\`

Output: \`80\`

Explanation:
- Path \`0 -> 1 -> 3\`: colors "a", "b", "d", values = 10+20+40 = 70
- Path \`0 -> 2 -> 3\`: colors "a", "c", "d", values = 10+30+40 = 80 ✓
- Maximum is 80.

You may only edit the code below. Hit Run to compile and test against the judge, then Submit to verify.`,
  signature: "fn max_path_value(n, colors, values, edges, k) -> i32",
  examples: [
    {
      input: `n = 4
colors = "abca"
values = [10, 5, 15, 8]
edges = [[0, 1], [1, 2], [0, 3], [3, 2]]
k = 1`,
      output: `30`,
      explanation:
        'Path 0 -> 1 -> 2 yields 10 + 5 + 15 = 30 with distinct colors.',
    },
    {
      input: `n = 3
colors = "aaa"
values = [10, 20, 30]
edges = [[0, 1], [1, 2]]
k = 2`,
      output: `50`,
      explanation:
        'Path 1 -> 2 yields 20 + 30 = 50 without exceeding k=2 for color "a".',
    },
  ],
  starterCode: `pub struct Solution;

impl Solution {
    pub fn max_path_value(
        n: usize,
        colors: String,
        values: Vec<i32>,
        edges: Vec<Vec<usize>>,
        k: usize,
    ) -> i32 {
        unimplemented!()
    }
}
`,
  testHarness: `{{SOLUTION}}

fn main() {
    // test_example_1

    let n = 4;
    let colors = "abca".to_string();
    let values = vec![10, 5, 15, 8];
    let edges = vec![vec![0, 1], vec![1, 2], vec![0, 3], vec![3, 2]];
    let k = 1;
    assert_eq!(Solution::max_path_value(n, colors, values, edges, k), 30);
        

    // test_example_2

    let n = 3;
    let colors = "aaa".to_string();
    let values = vec![10, 20, 30];
    let edges = vec![vec![0, 1], vec![1, 2]];
    let k = 2;
    assert_eq!(Solution::max_path_value(n, colors, values, edges, k), 50);
        

    // test_example_3

    let n = 2;
    let colors = "ab".to_string();
    let values = vec![100, 200];
    let edges = vec![];
    let k = 1;
    assert_eq!(Solution::max_path_value(n, colors, values, edges, k), 200);
        

    // test_single_node

    let n = 1;
    let colors = "a".to_string();
    let values = vec![50];
    let edges = vec![];
    let k = 1;
    assert_eq!(Solution::max_path_value(n, colors, values, edges, k), 50);
        

    // test_k_allows_full_path

    let n = 4;
    let colors = "aaaa".to_string();
    let values = vec![1, 2, 3, 4];
    let edges = vec![vec![0, 1], vec![1, 2], vec![2, 3]];
    let k = 4;
    assert_eq!(Solution::max_path_value(n, colors, values, edges, k), 10);
        

    // test_no_valid_long_path

    let n = 3;
    let colors = "aaa".to_string();
    let values = vec![100, 100, 100];
    let edges = vec![vec![0, 1], vec![1, 2]];
    let k = 1;
    assert_eq!(Solution::max_path_value(n, colors, values, edges, k), 100);
        

    // test_multiple_colors_complex

    let n = 5;
    let colors = "abcab".to_string();
    let values = vec![10, 20, 30, 40, 50];
    let edges = vec![vec![0, 1], vec![1, 2], vec![2, 3], vec![3, 4]];
    let k = 2;
    assert_eq!(Solution::max_path_value(n, colors, values, edges, k), 150);
        

    // test_diamond_graph

    let n = 4;
    let colors = "abcd".to_string();
    let values = vec![10, 20, 30, 40];
    let edges = vec![vec![0, 1], vec![0, 2], vec![1, 3], vec![2, 3]];
    let k = 1;
    assert_eq!(Solution::max_path_value(n, colors, values, edges, k), 80);
        
    println!("all tests passed");
}
`,
  loadSolution: () => Promise.resolve(getContestSolution('dag-path-value')!),
}


export const contests: Contest[] = [
  versionedKvStore,
  frameMultiplexer,
  alienLexicon,
  intervalTaskScheduler,
  dagPathValue,
  requestCoalescer,
  lifetimeSafeCache,
  ...practiceContests,
]

import { getInteractiveQuest } from './interactiveQuests'

export function getContest(id: string): Contest | undefined {
  return contests.find((c) => c.id === id) ?? getInteractiveQuest(id)
}


export function getCurrentContest(): Contest {
  const now = Date.now()
  return (
    contests.find((c) => {
      const open = Date.parse(c.opensAt)
      const close = Date.parse(c.closesAt)
      return now >= open && now < close
    }) ?? contests[0]
  )
}

export function withTests(contest: Contest, solution: string): string {
  return withSolutionHarness(contest.testHarness, solution)
}
