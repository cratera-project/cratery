---
id: 2026-09-10-budget-streak
title: "The Longest Budget Streak"
weekLabel: "Thu Sep 10 → Thu Sep 17, 2026"
difficulty: 2
opensAt: "2026-09-10T00:00:00.000Z"
closesAt: "2026-09-17T00:00:00.000Z"
solutionUnlocksAt: "2026-09-10T12:00:00.000Z"
signature: "pub fn longest_budget_streak(costs: &[u32], budget: u64) -> Option<(usize, usize)>"
supportedLanguages: [rust]
---

# Description
You are planning a trip. Each entry in `costs` is the cost of one day, in chronological order. Choose the longest **non-empty consecutive run of days** whose total cost is at most `budget`.

Implement `longest_budget_streak(costs: &[u32], budget: u64) -> Option<(usize, usize)>`.

- Return `Some((start, end))` using zero-based indices, with `start` included and `end` excluded. The chosen days are `costs[start..end]`, and the length is `end - start`.
- If several affordable runs have the same maximum length, return the one with the **smallest start index**.
- Return `None` if no non-empty run is affordable, including when the input is empty.
- Costs may be zero. A run costing exactly the budget is affordable.
- Days must remain in their original order; you cannot skip days inside a run.

Constraints:
- `0 <= costs.len() <= 200_000`.
- Every cost can be any `u32` value, and `budget` can be any `u64` value. Accumulate costs using `u64`; the sum of all costs fits in `u64` under these constraints.
- Use the standard library only, with no `unsafe` or external crates.
- Target **O(n) time and O(1) extra space**, where `n` is the number of days.

This medium challenge practices slices, indices, and maintaining a running total. The official solution and correctness explanation unlock 12 hours after the contest opens.

# Examples

### Example 1
**Input:**
```rust
longest_budget_streak(&[3, 1, 2, 1, 4], 4)
```
**Output:**
```
Some((1, 4))
```
**Explanation:** Days at indices 1, 2, and 3 cost `1 + 2 + 1 = 4`. No four consecutive days fit the budget.

### Example 2
**Input:**
```rust
longest_budget_streak(&[2, 2, 9, 1, 3], 4)
```
**Output:**
```
Some((0, 2))
```
**Explanation:** Both `[2, 2]` and `[1, 3]` have length two and cost four. Choose the earlier run, even though another equally long run exists.

### Example 3
**Input:**
```rust
longest_budget_streak(&[0, 0, 5, 0], 0)
```
**Output:**
```
Some((0, 2))
```
**Explanation:** Zero-cost days count toward the length, even with a zero budget.

### Example 4
**Input:**
```rust
longest_budget_streak(&[5, 6], 4)
```
**Output:**
```
None
```
**Explanation:** Neither individual day is affordable, so no non-empty run qualifies.

# Starter Code
```rust
pub fn longest_budget_streak(costs: &[u32], budget: u64) -> Option<(usize, usize)> {
    // Return the longest affordable range, breaking ties by earliest start.
    todo!()
}
```

# Test Harness
```rust
{{SOLUTION}}

mod budget_streak_checks {
    // Independent oracle: enumerate every non-empty range, without a sliding window.
    fn brute_force(costs: &[u32], budget: u64) -> Option<(usize, usize)> {
        let mut candidates = Vec::new();
        for start in 0..costs.len() {
            for end in start + 1..=costs.len() {
                let total: u64 = costs[start..end].iter().map(|&v| u64::from(v)).sum();
                if total <= budget {
                    candidates.push((start, end));
                }
            }
        }
        candidates.sort_by_key(|&(start, end)| (std::cmp::Reverse(end - start), start));
        candidates.first().copied()
    }

    pub fn run() {
        use super::longest_budget_streak as solve;

        // Published examples, empty input, inclusive budget, and tie-breaking.
        assert_eq!(solve(&[3, 1, 2, 1, 4], 4), Some((1, 4)));
        assert_eq!(solve(&[2, 2, 9, 1, 3], 4), Some((0, 2)));
        assert_eq!(solve(&[0, 0, 5, 0], 0), Some((0, 2)));
        assert_eq!(solve(&[5, 6], 4), None);
        assert_eq!(solve(&[], 0), None);
        assert_eq!(solve(&[], u64::MAX), None);
        assert_eq!(solve(&[5], 5), Some((0, 1)));
        assert_eq!(solve(&[5], 4), None);
        assert_eq!(solve(&[0], 0), Some((0, 1)));
        assert_eq!(solve(&[0, 0, 0], 0), Some((0, 3)));
        assert_eq!(solve(&[1, 2, 3], 6), Some((0, 3)));
        assert_eq!(solve(&[9, 1, 1, 1], 3), Some((1, 4)));
        assert_eq!(solve(&[1, 1, 1, 9], 3), Some((0, 3)));
        assert_eq!(solve(&[1, 2, 3, 0, 0], 3), Some((2, 5)));
        assert_eq!(solve(&[2, 2, 8, 0, 1], 4), Some((0, 2)));

        // Sums must not overflow u32, and a maximal budget must not overflow.
        let max = u32::MAX;
        assert_eq!(solve(&[max, max, 1], u64::from(max) + 1), Some((1, 3)));
        assert_eq!(solve(&[max, max], u64::from(max)), Some((0, 1)));
        assert_eq!(solve(&[max, max, max], u64::MAX), Some((0, 3)));

        // Exhaust every array of length 0..=7 over costs 0..=3 and budgets 0..=8.
        // 21,845 arrays * 9 budgets = 196,605 comparisons.
        for len in 0..=7u32 {
            for mut code in 0..4usize.pow(len) {
                let mut costs = vec![0u32; len as usize];
                for cost in &mut costs {
                    *cost = (code % 4) as u32;
                    code /= 4;
                }
                for budget in 0..=8 {
                    assert_eq!(solve(&costs, budget), brute_force(&costs, budget),
                        "costs={costs:?}, budget={budget}");
                }
            }
        }

        // Deterministic wider-value cases, checked against the same independent oracle.
        let mut state = 0x243f_6a88_85a3_08d3u64;
        let mut next = || {
            state ^= state << 13;
            state ^= state >> 7;
            state ^= state << 17;
            state
        };
        for _ in 0..1_000 {
            let len = (next() % 20) as usize;
            let costs: Vec<u32> = (0..len).map(|_| next() as u32).collect();
            let budget = next() % (u64::from(u32::MAX) * 20 + 1);
            assert_eq!(solve(&costs, budget), brute_force(&costs, budget));
        }

        // Maximum-size inputs: long windows, repeated shrinking, and wide totals.
        let costs = vec![1; 200_000];
        assert_eq!(solve(&costs, 100_000), Some((0, 100_000)));
        assert_eq!(solve(&costs, 0), None);
        let costs = vec![0; 200_000];
        assert_eq!(solve(&costs, 0), Some((0, 200_000)));
        let costs = vec![u32::MAX; 200_000];
        assert_eq!(solve(&costs, u64::MAX), Some((0, 200_000)));
        assert_eq!(solve(&costs, u64::from(u32::MAX) * 100_000), Some((0, 100_000)));
    }
}

fn main() {
    budget_streak_checks::run();
    println!("all tests passed");
}
```
