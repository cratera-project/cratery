---
id: 2026-08-27-versioned-kv
title: "The Multi-Version Key-Value Store"
weekLabel: "Thu Aug 27 → Thu Sep 3, 2026"
difficulty: 2
opensAt: "2026-08-27T00:00:00.000Z"
closesAt: "2026-09-03T00:00:00.000Z"
solutionUnlocksAt: "2026-08-28T12:00:00.000Z"
signature: "impl VersionedKvStore { pub fn new() -> Self; ... }"
supportedLanguages: [rust]
---

# Description
In distributed databases and transaction engines, multi-version concurrency control (MVCC) maintains historical states of keys to provide point-in-time snapshot isolation and time-travel reads.

Implement the in-memory `VersionedKvStore` supporting point-in-time queries, tombstone deletions, alphabetical snapshots, and historical compaction:

Methods to implement on `VersionedKvStore`:
1. `new() -> Self`: Initialize an empty store.
2. `set(&mut self, key: &str, value: &str, timestamp: u64)`: Insert or overwrite a key at a given `timestamp`. If a version already exists at the exact same timestamp, update its value.
3. `get(&self, key: &str, timestamp: u64) -> Option<&str>`: Return the value of `key` as of `timestamp` (i.e. the most recent version with `ver_timestamp <= timestamp`). If the key did not exist or was deleted at/before `timestamp` without a subsequent `set`, return `None`.
4. `delete(&mut self, key: &str, timestamp: u64)`: Write a tombstone deletion marker at `timestamp`. Subsequent `get` queries with `query_ts >= timestamp` return `None` until a newer `set` is recorded.
5. `snapshot(&self, timestamp: u64) -> Vec<(String, String)>`: Return all active (non-deleted) key-value pairs visible at `timestamp`, sorted alphabetically by `key` in ascending order.
6. `compact(&mut self, before_timestamp: u64) -> usize`: Prune obsolete historical versions. For every key, remove all historical versions with `ts <= before_timestamp` *except* the newest one <= `before_timestamp` (so point-in-time queries at `before_timestamp` remain valid). Returns the total count of pruned historical records.

Constraints:
- 0 <= key.len(), value.len() <= 128
- 0 <= timestamp <= 1_000_000_000
- Standard library only. No external crates.

Beat other rustaceans on guest execution time (microseconds) and memory RSS. Official solution write-up unlocks in 12 hours.

# Examples

### Example 1
**Input:**
```rust
let mut store = VersionedKvStore::new();
store.set("user:101", "Alice", 10);
store.set("user:101", "Alice Smith", 20);
store.get("user:101", 5);
store.get("user:101", 15);
store.get("user:101", 20);
```
**Output:**
```
None
Some("Alice")
Some("Alice Smith")
```
**Explanation:** Point-in-time lookups return the latest version visible at or before the queried timestamp.

### Example 2
**Input:**
```rust
store.delete("user:101", 25);
store.get("user:101", 20);
store.get("user:101", 25);
store.set("user:101", "Alice Revived", 30);
store.get("user:101", 30);
```
**Output:**
```
Some("Alice Smith")
None
Some("Alice Revived")
```
**Explanation:** Tombstones hide keys for queries after the deletion timestamp, but allow newer versions to be set later.

### Example 3
**Input:**
```rust
// user:101 has versions at ts=10, ts=20
let pruned = store.compact(20);
store.get("user:101", 15);
store.get("user:101", 20);
```
**Output:**
```
pruned = 1
None
Some("Alice Smith")
```
**Explanation:** Compaction removes ts=10 (superseded by ts=20) while preserving the active state at ts=20.

# Starter Code
```rust
use std::collections::{BTreeMap, HashMap};

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
}
```

# Test Harness
```rust
{{SOLUTION}}

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
```
