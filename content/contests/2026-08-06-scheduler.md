---
id: 2026-08-06-scheduler
title: "Interval Task Scheduler"
weekLabel: "Thu Aug 6 → next Thu Aug 13"
difficulty: 3
opensAt: "2026-08-06T00:00:00.000Z"
closesAt: "2026-08-13T00:00:00.000Z"
signature: "fn max_profit(tasks: Vec<Vec<i64>>) -> i64"
supportedLanguages: [rust]
---

# Description
You are given n tasks. Each task is [start, end, profit]:
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

You may only edit the code below. Hit Run to compile and test against the judge, then Submit to verify.

# Examples

### Example 1
**Input:**
```rust
tasks = [
  [1, 3, 50],
  [2, 5, 20],
  [4, 6, 70],
  [6, 7, 60],
]
```
**Output:**
```
120
```
**Explanation:** Take [1,3,50] and [4,6,70] for total profit 120. (Tasks ending at 6 and starting at 6 overlap and cannot both be taken).

### Example 2
**Input:**
```rust
tasks = [
  [1, 4, 10],
  [2, 3, 40],
  [3, 5, 15],
  [6, 8, 30],
]
```
**Output:**
```
70
```
**Explanation:** Optimal non-overlapping selection is [2,3,40] + [6,8,30] = 70.

# Starter Code
```rust
pub struct Solution;

impl Solution {
    pub fn max_profit(tasks: Vec<Vec<i64>>) -> i64 {
        // TODO: O(n log n) weighted interval scheduling
        0
    }
}
```

# Test Harness
```rust
{{SOLUTION}}

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
```
