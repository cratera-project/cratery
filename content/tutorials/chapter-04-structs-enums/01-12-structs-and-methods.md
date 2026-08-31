---
id: 12-structs-and-methods
chapterId: structs-enums
chapterNumber: 4
lessonNumber: 1
title: "Structs & Method Implementation (`impl`)"
tagline: "Encapsulating state and behavior with structs and associated methods."
readTimeMinutes: 8
difficulty: beginner
tags: [struct, impl, methods, self]
---

# Overview
Structs allow you to create custom data types by grouping named fields. Methods are defined within `impl` blocks and take `self`, `&self`, or `&mut self` as their first parameter.

# Sections

## Defining & Instantiating Structs
To define a struct, use the `struct` keyword and name the fields. Rust also provides field init shorthand and struct update syntax:

```rust caption="Defining and instantiating custom structs."
struct User {
    username: String,
    email: String,
    active: bool,
    sign_in_count: u64,
}

fn build_user(email: String, username: String) -> User {
    User {
        email,    // field init shorthand
        username,
        active: true,
        sign_in_count: 1,
    }
}
```

## Methods and Associated Functions
Methods are functions associated with a struct, defined inside an `impl` block:
- **`&self`**: Borrows the instance immutably for reading.
- **`&mut self`**: Borrows the instance mutably to alter its state.
- **`self`**: Consumes and takes ownership of the instance.
- **Associated functions** (like `Rectangle::new`) do not take `self` and act as constructors.

```rust caption="Implementing constructors and methods on Rectangle."
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    // Constructor (associated function)
    fn new(width: u32, height: u32) -> Self {
        Self { width, height }
    }

    // Method taking immutable borrow
    fn area(&self) -> u32 {
        self.width * self.height
    }

    // Method taking mutable borrow
    fn scale(&mut self, factor: u32) {
        self.width *= factor;
        self.height *= factor;
    }
}
```

# Common Mistakes

### Forgetting `&` on `self` in methods
**Bad:**
```rust
impl Rectangle {
    fn area(self) -> u32 { // Consumes ownership of self!
        self.width * self.height
    }
}
let rect = Rectangle::new(10, 20);
rect.area();
rect.area(); // Error: use of moved value `rect`
```
**Explanation:** Using `self` by value moves ownership into the method, destroying the instance after the first call.

**Good:**
```rust
impl Rectangle {
    fn area(&self) -> u32 { // Borrows immutably
        self.width * self.height
    }
}
```
**Explanation:** Always use `&self` unless you explicitly want to consume the object.

# Key Takeaways
- Use `struct` to model custom composite domain types.
- `&self` borrows the struct, `&mut self` mutates it, and `self` consumes ownership.
- Associated functions without a `self` parameter are called with `Type::function()`.

# Quests

## Quest: tut-12-bank-account
**Type:** coding
**Title:** Bank Account Balance Tracker
**Prompt:** Create a struct `BankAccount` with private field `balance: i64`. Implement methods: `new(initial: i64) -> BankAccount`, `deposit(&mut self, amount: i64)`, `withdraw(&mut self, amount: i64) -> bool` (returns `true` if successful, or `false` without modifying balance if `amount > balance`), and `balance(&self) -> i64`.
**Signature:** `pub struct BankAccount ... impl BankAccount ...`

### Starter Code
```rust
pub struct BankAccount {
    balance: i64,
}

impl BankAccount {
    pub fn new(initial: i64) -> Self {
        todo!()
    }

    pub fn deposit(&mut self, amount: i64) {
        todo!()
    }

    pub fn withdraw(&mut self, amount: i64) -> bool {
        todo!()
    }

    pub fn balance(&self) -> i64 {
        todo!()
    }
}
```

### Test Harness
```rust
{{SOLUTION}}

fn main() {
    let mut acc = BankAccount::new(100);
    assert_eq!(acc.balance(), 100);

    acc.deposit(50);
    assert_eq!(acc.balance(), 150);

    assert!(acc.withdraw(80));
    assert_eq!(acc.balance(), 70);

    assert!(!acc.withdraw(100)); // Insufficient funds
    assert_eq!(acc.balance(), 70);
    println!("all tests passed");
}
```

### Solution
```rust
pub struct BankAccount {
    balance: i64,
}

impl BankAccount {
    pub fn new(initial: i64) -> Self {
        Self { balance: initial }
    }

    pub fn deposit(&mut self, amount: i64) {
        self.balance += amount;
    }

    pub fn withdraw(&mut self, amount: i64) -> bool {
        if amount > self.balance {
            false
        } else {
            self.balance -= amount;
            true
        }
    }

    pub fn balance(&self) -> i64 {
        self.balance
    }
}
```

### Walkthrough
We construct `BankAccount` with `Self { balance: initial }`, mutate state via `&mut self` in `deposit` and `withdraw`, and inspect state via `&self` in `balance()`.

### Hints
- In `withdraw`, check `if amount > self.balance { false } else { self.balance -= amount; true }`.

## Quest: tut-12-quiz-method-self
**Type:** quiz
**Title:** Concept Check: Method `self` Signatures
**Prompt:** Which method signature should you use if a method needs to read struct fields without modifying or consuming the instance?

### Options
- [ ] A) `fn get_id(self) -> u32`
- [x] B) `fn get_id(&self) -> u32`
- [ ] C) `fn get_id(&mut self) -> u32`
- [ ] D) `fn get_id(mut self) -> u32`

**Hint:** Look for the immutable reference to self.

**Explanation:** `&self` borrows the instance immutably. This allows any number of readers to call the method without consuming or modifying the struct.
