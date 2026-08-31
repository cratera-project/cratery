---
id: 2026-01-08-iterator-pipeline
title: "Iterator Chain Processing"
weekLabel: "Practice · Iterators"
difficulty: 2
opensAt: "2026-01-08T00:00:00.000Z"
closesAt: "2026-01-15T00:00:00.000Z"
signature: "Transaction::parse / calculate_net / large_expenses / category_total"
supportedLanguages: [rust]
---

# Description
Implement a data processing pipeline using Rust's iterator combinators. You'll process a collection of transaction records, applying various filters and transformations without collecting intermediate results until the end.

Your implementation should:
1. Parse transaction strings into structured data
2. Filter transactions based on multiple criteria
3. Transform transaction amounts
4. Aggregate results efficiently
5. Use iterator combinators instead of explicit loops
6. Handle errors in the pipeline

This problem tests understanding of iterators, closures, and functional programming patterns in Rust.

Constraints:
- Use only the Rust standard library (no external crates)
- No `unsafe` code allowed
- Must use iterator combinators (no explicit for loops in processing)
- All intermediate processing should be lazy (no intermediate collections)
- Error handling must be integrated into the iterator chain

You may only edit the code below. Hit Run to compile and test against the judge, then Submit to verify.

# Examples

### Example 1
**Input:**
```rust
parse("income,1500.50,salary")
```
**Output:**
```
Some(Transaction { Income, 1500.50, "salary" })
```
**Explanation:** TYPE,AMOUNT,CATEGORY format.

### Example 2
**Input:**
```rust
calculate_net([income 5000, expense 1200, expense 300, income 500])
```
**Output:**
```
4000.0
```
**Explanation:** Net is total income minus total expenses.

# Starter Code
```rust
#[derive(Debug, Clone, PartialEq)]
pub enum TransactionType {
    Income,
    Expense,
}

#[derive(Debug, Clone, PartialEq)]
pub struct Transaction {
    pub trans_type: TransactionType,
    pub amount: f64,
    pub category: String,
}

impl Transaction {
    /// Parse a transaction from a string.
    /// Returns None if the format is invalid.
    pub fn parse(input: &str) -> Option<Self> {
        None
    }
}

/// Calculate net income (total income - total expenses).
pub fn calculate_net(transactions: &[&str]) -> f64 {
    0.0
}

/// Get all expense transactions over a certain amount.
pub fn large_expenses(transactions: &[&str], threshold: f64) -> Vec<Transaction> {
    Vec::new()
}

/// Calculate total for a specific category.
pub fn category_total(transactions: &[&str], category: &str) -> f64 {
    0.0
}

/// Get the top N largest transactions by amount.
pub fn top_transactions(transactions: &[&str], n: usize) -> Vec<Transaction> {
    Vec::new()
}

/// Group transactions by category and sum amounts.
/// Returns a vector of (category, total) tuples sorted by total descending.
pub fn category_summary(transactions: &[&str]) -> Vec<(String, f64)> {
    Vec::new()
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    // test_parse_transaction
    {
        let trans = Transaction::parse("income,1500.50,salary");
        assert!(trans.is_some());

        let t = trans.unwrap();
        assert_eq!(t.trans_type, TransactionType::Income);
        assert_eq!(t.amount, 1500.50);
        assert_eq!(t.category, "salary");
    }

    // test_parse_invalid
    {
        assert!(Transaction::parse("invalid,1000,food").is_none());
        assert!(Transaction::parse("income,not_a_number,food").is_none());
        assert!(Transaction::parse("income,1000").is_none());
        assert!(Transaction::parse("").is_none());
    }

    // test_calculate_net
    {
        let transactions = vec![
            "income,5000,salary",
            "expense,1200,rent",
            "expense,300,food",
            "income,500,freelance",
        ];

        let net = calculate_net(&transactions);
        assert_eq!(net, 4000.0); // 5500 - 1500
    }

    // test_large_expenses
    {
        let transactions = vec![
            "expense,1200,rent",
            "expense,50,coffee",
            "expense,800,utilities",
            "income,5000,salary",
        ];

        let large = large_expenses(&transactions, 500.0);
        assert_eq!(large.len(), 2);
        assert!(large.iter().all(|t| t.amount > 500.0));
        assert!(large.iter().all(|t| t.trans_type == TransactionType::Expense));
    }

    // test_category_total
    {
        let transactions = vec![
            "expense,100,food",
            "expense,200,food",
            "expense,150,food",
            "expense,500,rent",
            "income,1000,salary",
        ];

        assert_eq!(category_total(&transactions, "food"), 450.0);
        assert_eq!(category_total(&transactions, "rent"), 500.0);
        assert_eq!(category_total(&transactions, "nonexistent"), 0.0);
    }

    // test_top_transactions
    {
        let transactions = vec![
            "income,5000,salary",
            "expense,1200,rent",
            "expense,50,coffee",
            "income,200,gift",
            "expense,800,utilities",
        ];

        let top = top_transactions(&transactions, 3);
        assert_eq!(top.len(), 3);
        assert_eq!(top[0].amount, 5000.0);
        assert_eq!(top[1].amount, 1200.0);
        assert_eq!(top[2].amount, 800.0);
    }

    // test_category_summary
    {
        let transactions = vec![
            "expense,100,food",
            "expense,200,food",
            "expense,1200,rent",
            "income,5000,salary",
            "income,500,salary",
            "expense,50,coffee",
        ];

        let summary = category_summary(&transactions);

        // Should be sorted by total descending
        assert_eq!(summary[0].0, "salary");
        assert_eq!(summary[0].1, 5500.0);
        assert_eq!(summary[1].0, "rent");
        assert_eq!(summary[1].1, 1200.0);
        assert_eq!(summary[2].0, "food");
        assert_eq!(summary[2].1, 300.0);
    }

    // test_empty_transactions
    {
        let transactions: Vec<&str> = vec![];

        assert_eq!(calculate_net(&transactions), 0.0);
        assert_eq!(large_expenses(&transactions, 100.0).len(), 0);
        assert_eq!(category_total(&transactions, "any"), 0.0);
        assert_eq!(top_transactions(&transactions, 5).len(), 0);
        assert_eq!(category_summary(&transactions).len(), 0);
    }

    // test_mixed_valid_invalid
    {
        let transactions = vec![
            "income,1000,salary",
            "invalid,500,error",
            "expense,200,food",
            "bad_format",
        ];

        let net = calculate_net(&transactions);
        assert_eq!(net, 800.0); // Only valid transactions counted
    }

    println!("all tests passed");
}
```
