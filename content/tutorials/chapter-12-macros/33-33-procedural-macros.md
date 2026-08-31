---
id: 33-procedural-macros
chapterId: macros
chapterNumber: 12
lessonNumber: 33
title: "Procedural Macros & Custom Derives"
tagline: "Writing compiler plugins with `proc_macro`, `syn`, and `quote` for arbitrary code generation."
readTimeMinutes: 7
difficulty: advanced
tags: [macros, proc-macro, derive, compiler-plugins]
---

# Overview
Procedural macros accept a stream of Rust code tokens as input, execute arbitrary Rust code at compile-time, and output a new stream of tokens. They power `#[derive(...)]`, custom attributes, and function-like macros.

# Sections

## The Three Kinds of Procedural Macros
Procedural macros must live in a separate crate with `proc-macro = true` in `Cargo.toml`. There are three types:
1. **Custom Derive**: `#[derive(MyTrait)]` creates trait implementations automatically.
2. **Attribute-like**: `#[route(GET, "/")]` attaches custom logic to structs, functions, or modules.
3. **Function-like**: `sql!("SELECT * FROM users")` accepts arbitrary syntax inside macro calls.

> 💡 **Compiler Architecture Note**: Because procedural macros run arbitrary Rust code on the host machine during compilation, they must be compiled as separate shared libraries. For safety and isolation, single-file online runners and sandboxed judges (like Cratera) execute safe sandboxed code and disallow arbitrary host proc-macro definitions.

```rust caption="A custom derive procedural macro using syn and quote."
// In my_macro_crate/src/lib.rs (compiled with proc-macro = true):
use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, DeriveInput};

#[proc_macro_derive(Describe)]
pub fn describe_derive(input: TokenStream) -> TokenStream {
    let ast = parse_macro_input!(input as DeriveInput);
    let name = &ast.ident;

    let expanded = quote! {
        impl #name {
            pub fn type_name() -> &'static str {
                stringify!(#name)
            }
        }
    };

    TokenStream::from(expanded)
}
```

## The `syn` & `quote` Pipeline
In the Rust ecosystem:
- **`syn`**: Parses raw `TokenStream` into a strongly-typed Abstract Syntax Tree (AST).
- **`quote`**: Quasi-quoting library that converts Rust expressions back into a `TokenStream`.
- **`proc_macro2`**: Makes proc-macro types unit-testable outside compiler harness.

```rust caption="Zero boilerplate type introspection at compile-time."
// Consuming the derive macro in consumer code:
// #[derive(Describe)]
// struct User;
// assert_eq!(User::type_name(), "User");
```

# Common Mistakes

### Defining Proc Macro in the Same Crate
**Bad:**
```rust
// In main.rs or lib.rs of a regular crate (without proc-macro = true):
#[proc_macro_derive(Foo)]
pub fn foo(input: TokenStream) -> TokenStream { ... }
```
**Explanation:** Procedural macros cannot be defined in the same crate where they are used.

**Good:**
```rust
// In my_macro_crate/Cargo.toml:
// [lib]
// proc-macro = true
//
// In consumer Cargo.toml:
// [dependencies]
// my_macro_crate = { path = "../my_macro_crate" }
```
**Explanation:** Proc-macro crates are compiled as host shared libraries that the compiler loads during compilation.

# Key Takeaways
- Procedural macros run arbitrary Rust code at compile time, receiving and emitting TokenStreams.
- Custom derives (#[derive(...)]) generate implementations for user-defined structs and enums.
- syn and quote are the standard libraries for parsing and generating Rust ASTs.
