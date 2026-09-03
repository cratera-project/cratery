---
id: 2026-09-03-generational-arena
title: "The Generational Slot Arena"
weekLabel: "Thu Sep 3 → Thu Sep 10, 2026"
difficulty: 2
opensAt: "2026-09-03T00:00:00.000Z"
closesAt: "2026-09-10T00:00:00.000Z"
solutionUnlocksAt: "2026-09-04T12:00:00.000Z"
signature: "impl<T> Arena<T> { pub fn insert(&mut self, value: T) -> u64; ... }"
supportedLanguages: [rust]
---

# Description
Entity-component systems, memory allocators, and object pools all face the same hazard: slots are freed and reused while old handles to those slots are still in circulation. Without protection, a stale handle silently reads the *new* occupant of a slot — the classic ABA bug. The standard fix is a **generational arena**: every handle carries a generation counter that the arena invalidates on slot reuse, so stale handles are detected instead of misresolved.

Implement the in-memory `Arena<T>` supporting packed generational handles, LIFO slot reuse, safe iteration, and bulk reclamation:

**Handle layout.** A handle is a single `u64`: the **low 32 bits** are the slot index, the **high 32 bits** are the slot's generation. Packing is `(generation as u64) << 32 | slot_index as u64`. A freshly appended slot has generation `0`.

**Slot lifecycle.**
- `insert` reuses a freed slot when one is available, taking the **most recently freed** slot index (LIFO free list); otherwise it appends a new slot at the end with generation `0`. A reused slot keeps its already-incremented generation.
- A successful `remove` extracts the value, increments that slot's generation by exactly 1 (wrapping arithmetic), and pushes the slot index onto the free list. A *failed* removal (stale handle, unknown index, or vacant slot) must leave the arena completely unchanged.

Methods to implement on `Arena<T>`:
1. `new() -> Self`: Create an empty arena.
2. `insert(&mut self, value: T) -> u64`: Store `value` and return its packed handle.
3. `get(&self, key: u64) -> Option<&T>`: Return a reference only when the slot index is in bounds, the generation matches, and the slot is currently occupied.
4. `get_mut(&mut self, key: u64) -> Option<&mut T>`: Same validity rules, mutable access.
5. `remove(&mut self, key: u64) -> Option<T>`: Remove and return the value under the same validity rules.
6. `contains(&self, key: u64) -> bool`: Handle validity check.
7. `len(&self) -> usize` and `is_empty(&self) -> bool`: Number of occupied slots.
8. `iter(&self) -> impl Iterator<Item = (u64, &T)>`: Visit every occupied slot in **ascending slot-index order**, yielding its packed handle and a reference to the value. Vacant slots are skipped.
9. `retain<F: FnMut(u64, &mut T) -> bool>(&mut self, f: F)`: Visit occupied slots in ascending slot-index order, invoking `f` with the slot's packed handle and a mutable reference to its value. Every slot for which `f` returns `false` is dropped with exactly the same bookkeeping as `remove` (generation increment + free-list push).

Constraints:
- Standard library only. No external crates. No `unsafe`.
- Up to 100,000 live slots and 1,000,000 total operations; generations must be stored as `u32` with wrapping increments.
- `T` has no bounds: values are moved in and out, never cloned.

Beat other rustaceans on guest execution time (microseconds) and memory RSS. Official solution write-up unlocks in 12 hours.

# Examples

### Example 1
**Input:**
```rust
let mut arena = Arena::new();
let a = arena.insert("orb");   // slot 0, generation 0 -> handle 0
let b = arena.insert("gem");   // slot 1, generation 0 -> handle 1
arena.remove(a);               // slot 0 freed, its generation becomes 1
arena.get(a);
arena.get(b);
arena.len();
```
**Output:**
```
None
Some("gem")
1
```
**Explanation:** `a` is stale after removal — its embedded generation no longer matches the slot — so it must resolve to `None` instead of leaking the arena's internals.

### Example 2
**Input:**
```rust
let mut arena = Arena::new();
let k0 = arena.insert(10);
let k1 = arena.insert(20);
let k2 = arena.insert(30);
arena.remove(k1);              // free list: [1]
arena.remove(k2);              // free list: [1, 2]
let x = arena.insert(40);      // LIFO reuse: slot 2, generation 1
let y = arena.insert(50);      // LIFO reuse: slot 1, generation 1
(x, y, arena.get(k1))
```
**Output:**
```
(4294967298, 4294967297, None)
```
**Explanation:** The most recently freed slot is reused first, and each reuse advances the generation: `4294967298 == (1 << 32) | 2`. Old handles such as `k1` never resolve to the slot's new occupant.

### Example 3
**Input:**
```rust
// slots hold 1, 2, 3, 4 at indices 0..=3 (generation 0)
arena.retain(|_key, v| v % 2 == 0);
let k = arena.insert(5);
(k, arena.len())
```
**Output:**
```
(4294967298, 3)
```
**Explanation:** `retain` dropped values 1 and 3 (slots 0 and 2, now on the free list in that order); the next insert reuses the most recently freed slot 2 with generation 1.

# Starter Code
```rust
pub struct Arena<T> {
    // TODO: Define internal fields
}

impl<T> Arena<T> {
    pub fn new() -> Self {
        // TODO: Create an empty arena
        todo!()
    }

    pub fn insert(&mut self, value: T) -> u64 {
        // TODO: Store value, reuse the most recently freed slot when available
        todo!()
    }

    pub fn get(&self, key: u64) -> Option<&T> {
        // TODO: Resolve packed handle, reject stale generations
        todo!()
    }

    pub fn get_mut(&mut self, key: u64) -> Option<&mut T> {
        // TODO: Mutable variant of get
        todo!()
    }

    pub fn remove(&mut self, key: u64) -> Option<T> {
        // TODO: Extract value, bump generation, push slot to the free list
        todo!()
    }

    pub fn contains(&self, key: u64) -> bool {
        // TODO: Handle validity check
        todo!()
    }

    pub fn len(&self) -> usize {
        // TODO: Number of occupied slots
        todo!()
    }

    pub fn is_empty(&self) -> bool {
        // TODO: Whether no slots are occupied
        todo!()
    }

    pub fn iter(&self) -> impl Iterator<Item = (u64, &T)> {
        // TODO: Occupied slots in ascending slot-index order
        todo!()
    }

    pub fn retain<F>(&mut self, f: F)
    where
        F: FnMut(u64, &mut T) -> bool,
    {
        // TODO: Drop every slot for which f returns false, like remove()
        todo!()
    }
}
```

# Test Harness
```rust
{{SOLUTION}}

use std::collections::HashMap;

const fn expected_handle(index: u32, generation: u32) -> u64 {
    ((generation as u64) << 32) | (index as u64)
}

fn main() {
    // 1. Empty arena
    let mut empty: Arena<i64> = Arena::new();
    assert!(empty.is_empty());
    assert_eq!(empty.len(), 0);
    assert_eq!(empty.get(0), None);
    assert_eq!(empty.get(expected_handle(0, 0)), None);
    assert_eq!(empty.remove(expected_handle(0, 0)), None);
    assert_eq!(empty.iter().count(), 0);

    // 2. Basic insert / get / get_mut / contains
    let mut arena = Arena::new();
    let k0 = arena.insert(10);
    let k1 = arena.insert(20);
    let k2 = arena.insert(30);
    assert_eq!(k0, expected_handle(0, 0));
    assert_eq!(k1, expected_handle(1, 0));
    assert_eq!(k2, expected_handle(2, 0));
    assert_eq!(arena.len(), 3);
    assert_eq!(arena.get(k0), Some(&10));
    assert_eq!(arena.get(k1), Some(&20));
    assert!(arena.contains(k2));
    assert!(!arena.contains(expected_handle(3, 0)));

    *arena.get_mut(k1).unwrap() = 25;
    assert_eq!(arena.get(k1), Some(&25));
    assert_eq!(arena.get_mut(expected_handle(1, 5)), None); // wrong generation

    // 3. Removal semantics
    assert_eq!(arena.remove(k1), Some(25));
    assert_eq!(arena.get(k1), None);
    assert!(!arena.contains(k1));
    assert_eq!(arena.len(), 2);
    assert_eq!(arena.remove(k1), None); // double remove is a no-op
    assert_eq!(arena.len(), 2);
    assert_eq!(arena.get(k0), Some(&10)); // untouched slot still resolves

    // 4. LIFO slot reuse + generation bumps
    let mut arena = Arena::new();
    let k0 = arena.insert(10);
    let k1 = arena.insert(20);
    let k2 = arena.insert(30);
    arena.remove(k1); // free list: [1]
    arena.remove(k2); // free list: [1, 2]
    assert_eq!(arena.len(), 1);
    assert_eq!(arena.get(k0), Some(&10)); // untouched slot still resolves

    let x = arena.insert(40); // reuses slot 2, generation 1
    assert_eq!(x, expected_handle(2, 1));
    let y = arena.insert(50); // reuses slot 1, generation 1
    assert_eq!(y, expected_handle(1, 1));
    let z = arena.insert(60); // free list drained, appends slot 3
    assert_eq!(z, expected_handle(3, 0));

    // Old handles must never resolve to the new occupants
    assert_eq!(arena.get(k1), None);
    assert_eq!(arena.get(k2), None);
    assert_eq!(arena.get(x), Some(&40));
    assert_eq!(arena.get(y), Some(&50));

    // Generations keep advancing across repeated reuse of the same slot
    assert_eq!(arena.remove(x), Some(40));
    let x2 = arena.insert(45);
    assert_eq!(x2, expected_handle(2, 2));
    assert_eq!(arena.get(x), None); // generation-1 handle is now stale

    // 5. Invalid handles: vacant, future-generation, out-of-bounds
    let mut arena = Arena::new();
    let k = arena.insert(7); // slot 0, generation 0
    arena.remove(k); // slot 0 is vacant with generation 1
    assert_eq!(arena.get(expected_handle(0, 1)), None); // current generation, but vacant
    assert_eq!(arena.remove(expected_handle(0, 1)), None);
    let alive = arena.insert(8); // slot 0, generation 1
    assert_eq!(arena.get(expected_handle(0, 2)), None); // future generation
    assert_eq!(arena.get_mut(expected_handle(0, 99)), None);
    assert_eq!(arena.get(expected_handle(1_000_000, 0)), None); // out of bounds
    assert_eq!(arena.remove(expected_handle(1_000_000, 0)), None);
    assert_eq!(arena.get(alive), Some(&8));
    assert_eq!(arena.len(), 1);

    // 6. Iteration: ascending slot order, vacant slots skipped
    let mut arena = Arena::new();
    let k0 = arena.insert(100);
    let k1 = arena.insert(200);
    let k2 = arena.insert(300);
    arena.remove(k1);
    let k3 = arena.insert(400); // slot 1, generation 1
    let got: Vec<(u64, i64)> = arena.iter().map(|(key, v)| (key, *v)).collect();
    assert_eq!(got, vec![(k0, 100), (k3, 400), (k2, 300)]);
    let mut seen = 0;
    for (key, _v) in arena.iter() {
        assert!(arena.contains(key));
        seen += 1;
    }
    assert_eq!(seen, 3);

    // 7. retain: visit order, drops, and freed-slot reuse
    let mut arena = Arena::new();
    let k0 = arena.insert(1);
    let k1 = arena.insert(2);
    let k2 = arena.insert(3);
    let k3 = arena.insert(4);

    let mut visited: Vec<u64> = Vec::new();
    arena.retain(|key, v| {
        visited.push(key);
        *v % 2 == 0
    });
    assert_eq!(visited, vec![k0, k1, k2, k3]); // every occupied slot exactly once
    assert_eq!(arena.len(), 2);
    assert_eq!(arena.get(k0), None);
    assert_eq!(arena.get(k1), Some(&2));
    assert_eq!(arena.get(k2), None);
    assert_eq!(arena.get(k3), Some(&4));

    // Slots 2 and 0 were freed (in that order); LIFO reuse applies
    let r = arena.insert(5);
    assert_eq!(r, expected_handle(2, 1));
    let s = arena.insert(6);
    assert_eq!(s, expected_handle(0, 1));

    // 8. Non-Copy values move in and out
    let mut arena = Arena::new();
    let a = arena.insert(String::from("alpha"));
    let b = arena.insert(String::from("beta"));
    if let Some(v) = arena.get_mut(b) {
        v.push_str("_v2");
    }
    assert_eq!(arena.get(b).map(String::as_str), Some("beta_v2"));
    assert_eq!(arena.remove(a), Some(String::from("alpha")));
    let c = arena.insert(String::from("gamma")); // reuses slot 0
    assert_eq!(c, expected_handle(0, 1));
    assert_eq!(arena.get(c).map(String::as_str), Some("gamma"));

    // 9. retain can empty the arena; capacity of handles survives
    let mut arena = Arena::new();
    for i in 0..8 {
        arena.insert(i);
    }
    arena.retain(|_, _| false);
    assert!(arena.is_empty());
    assert_eq!(arena.iter().count(), 0);
    let k = arena.insert(99); // slot 7 was freed last, gen 1
    assert_eq!(k, expected_handle(7, 1));

    // 10. Stress test: 20,000 operations against an independent model
    struct Model {
        gens: Vec<u32>,
        free: Vec<u32>,
        live: HashMap<u64, i64>,
    }

    impl Model {
        fn new() -> Self {
            Model {
                gens: Vec::new(),
                free: Vec::new(),
                live: HashMap::new(),
            }
        }
        fn insert(&mut self, v: i64) -> u64 {
            let (index, generation) = if let Some(i) = self.free.pop() {
                (i, self.gens[i as usize])
            } else {
                self.gens.push(0);
                ((self.gens.len() - 1) as u32, 0)
            };
            let key = expected_handle(index, generation);
            self.live.insert(key, v);
            key
        }
        fn contains(&self, key: u64) -> bool {
            self.live.contains_key(&key)
        }
        fn get(&self, key: u64) -> Option<i64> {
            self.live.get(&key).copied()
        }
        fn remove(&mut self, key: u64) -> Option<i64> {
            let out = self.live.remove(&key)?;
            let i = (key & 0xFFFF_FFFF) as usize;
            self.gens[i] = self.gens[i].wrapping_add(1);
            self.free.push(i as u32);
            Some(out)
        }
        fn len(&self) -> usize {
            self.live.len()
        }
        fn retain(&mut self, mut f: impl FnMut(u64, i64) -> bool) {
            let mut dead: Vec<u64> = self
                .live
                .iter()
                .filter(|(k, v)| !f(**k, **v))
                .map(|(k, _)| *k)
                .collect();
            // Match the arena: retain visits slots in ascending index order
            dead.sort_by_key(|k| (*k & 0xFFFF_FFFF) as u32);
            for k in dead {
                self.remove(k);
            }
        }
        fn sorted_entries(&self) -> Vec<(u64, i64)> {
            let mut v: Vec<(u64, i64)> = self.live.iter().map(|(k, val)| (*k, *val)).collect();
            v.sort_by_key(|(k, _)| (*k & 0xFFFF_FFFF) as u32);
            v
        }
    }

    let mut arena = Arena::new();
    let mut model = Model::new();
    let mut issued: Vec<u64> = Vec::new(); // handles that should be live
    let mut stale: Vec<u64> = Vec::new(); // handles known to be dead

    let mut state: u64 = 0x243F_6A88_85A3_08D3;
    let mut next = move || -> u64 {
        state ^= state << 13;
        state ^= state >> 7;
        state ^= state << 17;
        state
    };

    for step in 0..20_000u64 {
        let r = next() % 100;
        if r < 40 {
            let v = (next() % 1000) as i64;
            let key = arena.insert(v);
            let expected = model.insert(v);
            assert_eq!(key, expected, "step {step}: insert returned the wrong handle");
            issued.push(key);
        } else if r < 70 {
            let key = if !issued.is_empty() && next() % 5 < 4 {
                let i = (next() as usize) % issued.len();
                issued.swap_remove(i)
            } else if !stale.is_empty() && next() % 2 == 0 {
                stale[(next() as usize) % stale.len()]
            } else {
                expected_handle(next() as u32, (next() % 8) as u32) // random probe
            };
            let expected = model.remove(key);
            let got = arena.remove(key);
            assert_eq!(got, expected, "step {step}: remove mismatch for handle {key}");
            if expected.is_some() {
                stale.push(key);
            }
        } else if r < 85 {
            let key = if !issued.is_empty() {
                issued[(next() as usize) % issued.len()]
            } else {
                expected_handle(0, 0)
            };
            assert_eq!(arena.contains(key), model.contains(key), "step {step}");
            assert_eq!(arena.get(key).copied(), model.get(key), "step {step}");
        } else if r < 92 {
            arena.retain(|k, v| v.wrapping_add(k as i64) % 3 != 0);
            model.retain(|k, v| v.wrapping_add(k as i64) % 3 != 0);
            issued.retain(|k| model.contains(*k));
        } else {
            let got: Vec<(u64, i64)> = arena.iter().map(|(k, v)| (k, *v)).collect();
            assert_eq!(got, model.sorted_entries(), "step {step}: iteration mismatch");
        }
        assert_eq!(arena.len(), model.len(), "step {step}: length mismatch");
    }

    println!("all tests passed");
}
```
