---
id: trait-code-default-derive
categorySlug: traits
title: "Custom Default Implementation"
difficulty: 1
tags: [traits, coding]
kind: coding
---

# Prompt
Implement `Default` for `struct ServerConfig { pub host: String, pub port: u16, pub max_conns: usize }` setting host to `"127.0.0.1"`, port to `8080`, and max_conns to `1000`.

# Code
```rust
#[derive(Debug, PartialEq)]
pub struct ServerConfig {
    pub host: String,
    pub port: u16,
    pub max_conns: usize,
}

impl Default for ServerConfig {
    fn default() -> Self {
        Self {
            host: String::from("127.0.0.1"),
            port: 8080,
            max_conns: 1000,
        }
    }
}
```

# Solution
```rust
#[derive(Debug, PartialEq)]
pub struct ServerConfig {
    pub host: String,
    pub port: u16,
    pub max_conns: usize,
}

impl Default for ServerConfig {
    fn default() -> Self {
        Self {
            host: String::from("127.0.0.1"),
            port: 8080,
            max_conns: 1000,
        }
    }
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    let cfg = ServerConfig::default();
    assert_eq!(cfg.host, "127.0.0.1");
    assert_eq!(cfg.port, 8080);
    assert_eq!(cfg.max_conns, 1000);
    println!("test passed");
}
```

# Explanation
Implement `Default` for `struct ServerConfig { pub host: String, pub port: u16, pub max_conns: usize }` setting host to `"127.0.0.1"`, port to `8080`, and max_conns to `1000`. Review the test cases to verify all assertions.
