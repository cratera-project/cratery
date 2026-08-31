---
id: 2026-01-01-config-errors
title: "Result-Based Config Errors"
weekLabel: "Practice · Errors"
difficulty: 2
opensAt: "2026-01-01T00:00:00.000Z"
closesAt: "2026-01-08T00:00:00.000Z"
signature: "parse_config / Config / ConfigError"
supportedLanguages: [rust]
---

# Description
Implement a simple file processing system that demonstrates proper error handling using Result types. The system should parse a configuration file, validate its contents, and apply the configuration, with comprehensive error reporting at each stage.

Your implementation should:
1. Define custom error types for different failure scenarios
2. Parse key-value pairs from a string
3. Validate configuration values
4. Use the `?` operator for error propagation
5. Provide informative error messages
6. Convert between different error types

This problem tests understanding of Result, custom error types, and Rust's error handling patterns.

Constraints:
- Use only the Rust standard library (no external crates)
- No `unsafe` code allowed
- Must use `Result<T, E>` for all fallible operations
- Error types must implement Display and Debug
- Use the `?` operator where appropriate
- All parsing errors should be descriptive

You may only edit the code below. Hit Run to compile and test against the judge, then Submit to verify.

# Examples

### Example 1
**Input:**
```rust
port=8080\nhost=localhost\nmax_connections=100
```
**Output:**
```
Ok(Config { port: 8080, host: "localhost", max_connections: 100 })
```
**Explanation:** Valid key=value lines parse into Config.

### Example 2
**Input:**
```rust
port=8080\nhost=localhost
```
**Output:**
```
Err(MissingKey("max_connections"))
```
**Explanation:** All three keys are required.

# Starter Code
```rust
use std::fmt;
use std::num::ParseIntError;

#[derive(Debug, PartialEq)]
pub enum ConfigError {
    MissingKey(String),
    InvalidFormat(String),
    ParseError(String),
    ValidationError(String),
}

impl fmt::Display for ConfigError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{self:?}")
    }
}

impl From<ParseIntError> for ConfigError {
    fn from(err: ParseIntError) -> Self {
        unimplemented!()
    }
}

#[derive(Debug, PartialEq)]
pub struct Config {
    pub port: u16,
    pub host: String,
    pub max_connections: usize,
}

impl Config {
    /// Create a new Config after validation.
    pub fn new(port: u16, host: String, max_connections: usize) -> Result<Self, ConfigError> {
        let _ = (port, &host, max_connections);
        Err(ConfigError::ValidationError("not implemented".into()))
    }

    /// Validate port is in valid range.
    fn validate_port(port: u16) -> Result<(), ConfigError> {
        Ok(())
    }

    /// Validate host is not empty.
    fn validate_host(host: &str) -> Result<(), ConfigError> {
        Ok(())
    }

    /// Validate max_connections is reasonable.
    fn validate_max_connections(max_connections: usize) -> Result<(), ConfigError> {
        Ok(())
    }
}

/// Parse configuration from a string with format "key=value" per line.
pub fn parse_config(input: &str) -> Result<Config, ConfigError> {
    let _ = input;
    Err(ConfigError::MissingKey("port".into()))
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    // test_valid_config
    {
        let input = "port=8080\nhost=localhost\nmax_connections=100";
        let result = parse_config(input);

        assert!(result.is_ok());
        let config = result.unwrap();
        assert_eq!(config.port, 8080);
        assert_eq!(config.host, "localhost");
        assert_eq!(config.max_connections, 100);
    }

    // test_missing_key
    {
        let input = "port=8080\nhost=localhost";
        let result = parse_config(input);

        assert!(result.is_err());
        match result {
            Err(ConfigError::MissingKey(key)) => assert_eq!(key, "max_connections"),
            _ => panic!("Expected MissingKey error"),
        }
    }

    // test_invalid_format
    {
        let input = "port=8080\ninvalid_line\nmax_connections=100";
        let result = parse_config(input);

        assert!(result.is_err());
        match result {
            Err(ConfigError::InvalidFormat(_)) => {},
            _ => panic!("Expected InvalidFormat error"),
        }
    }

    // test_parse_error
    {
        let input = "port=not_a_number\nhost=localhost\nmax_connections=100";
        let result = parse_config(input);

        assert!(result.is_err());
        match result {
            Err(ConfigError::ParseError(_)) => {},
            _ => panic!("Expected ParseError"),
        }
    }

    // test_port_validation
    {
        let input1 = "port=0\nhost=localhost\nmax_connections=100";
        let result1 = parse_config(input1);
        assert!(matches!(result1, Err(ConfigError::ValidationError(_))));

        let input2 = "port=80\nhost=localhost\nmax_connections=100";
        let result2 = parse_config(input2);
        assert!(result2.is_ok());
    }

    // test_host_validation
    {
        let input = "port=8080\nhost=\nmax_connections=100";
        let result = parse_config(input);

        assert!(result.is_err());
        match result {
            Err(ConfigError::ValidationError(msg)) => {
                assert!(msg.contains("host"));
            },
            _ => panic!("Expected ValidationError for empty host"),
        }
    }

    // test_max_connections_validation
    {
        let input1 = "port=8080\nhost=localhost\nmax_connections=0";
        let result1 = parse_config(input1);
        assert!(matches!(result1, Err(ConfigError::ValidationError(_))));

        let input2 = "port=8080\nhost=localhost\nmax_connections=10001";
        let result2 = parse_config(input2);
        assert!(matches!(result2, Err(ConfigError::ValidationError(_))));
    }

    // test_error_display
    {
        let err1 = ConfigError::MissingKey("port".to_string());
        assert!(err1.to_string().contains("port"));

        let err2 = ConfigError::ValidationError("Invalid value".to_string());
        assert!(err2.to_string().contains("Invalid value"));
    }

    println!("all tests passed");
}
```
