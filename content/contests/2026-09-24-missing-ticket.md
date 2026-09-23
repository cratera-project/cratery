---
id: 2026-09-24-missing-ticket
title: "The Missing Ticket"
weekLabel: "Thu Sep 24 → Thu Oct 1, 2026"
difficulty: 1
opensAt: "2026-09-24T00:00:00.000Z"
closesAt: "2026-10-01T00:00:00.000Z"
solutionUnlocksAt: "2026-09-24T12:00:00.000Z"
signature: "pub fn missing_ticket(tickets: &[usize]) -> usize"
supportedLanguages: [rust]
---

# Description
The check-in desk printed tickets numbered from `0` through `n`, but one ticket is missing. You receive the other `n` ticket numbers in any order.

Write `missing_ticket(tickets: &[usize]) -> usize` to return the missing number. Here, `n` is `tickets.len()`.

- Every number in `tickets` is between `0` and `n`, inclusive.
- The numbers in `tickets` are distinct, so exactly one number is missing.
- The slice may be empty. In that case, return `0`.
- Do not change the input.

There may be up to 200,000 tickets. Aim for **O(n) time** using only the standard library. An O(n) space solution is fine. No external crates or `unsafe` are needed.

Suggested time: about 40 minutes for beginners, 20 minutes for intermediate solvers, and 10–15 minutes for experienced solvers. The official solution unlocks 12 hours after opening.

# Examples

### Example 1
**Input:**
```rust
missing_ticket(&[3, 0, 1])
```
**Output:**
```
2
```
**Explanation:** The expected numbers are 0, 1, 2, and 3. Only 2 is absent.

### Example 2
**Input:**
```rust
missing_ticket(&[1, 2, 3])
```
**Output:**
```
0
```
**Explanation:** The smallest possible ticket number is missing.

### Example 3
**Input:**
```rust
missing_ticket(&[])
```
**Output:**
```
0
```
**Explanation:** With no tickets received, the only expected number is 0.

# Starter Code
```rust
pub fn missing_ticket(tickets: &[usize]) -> usize {
    // Find the one number from 0..=tickets.len() that is absent.
    todo!()
}
```

# Test Harness
```rust
{{SOLUTION}}

fn slow_answer(tickets: &[usize]) -> usize {
    (0..=tickets.len())
        .find(|candidate| !tickets.contains(candidate))
        .unwrap()
}

fn check_all_orders(values: &mut [usize], start: usize, expected: usize) {
    if start == values.len() {
        assert_eq!(missing_ticket(values), expected, "{values:?}");
        assert_eq!(missing_ticket(values), slow_answer(values), "{values:?}");
        return;
    }
    for next in start..values.len() {
        values.swap(start, next);
        check_all_orders(values, start + 1, expected);
        values.swap(start, next);
    }
}

fn main() {
    assert_eq!(missing_ticket(&[3, 0, 1]), 2);
    assert_eq!(missing_ticket(&[1, 2, 3]), 0);
    assert_eq!(missing_ticket(&[]), 0);
    assert_eq!(missing_ticket(&[0]), 1);
    assert_eq!(missing_ticket(&[1]), 0);
    assert_eq!(missing_ticket(&[4, 2, 0, 3]), 1);

    // Every permutation of each short input, for every possible missing ID.
    for n in 0..=6 {
        for missing in 0..=n {
            let mut tickets: Vec<usize> = (0..=n).filter(|&id| id != missing).collect();
            check_all_orders(&mut tickets, 0, missing);
        }
    }

    // Larger unordered inputs and each boundary of the allowed range.
    let mut tickets: Vec<usize> = (0..=200_000).filter(|&id| id != 87_654).collect();
    tickets.reverse();
    assert_eq!(missing_ticket(&tickets), 87_654);
    tickets[0] = 87_654; // Now 200_000 is absent.
    assert_eq!(missing_ticket(&tickets), 200_000);

    println!("all tests passed");
}
```
