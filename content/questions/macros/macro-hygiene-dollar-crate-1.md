---
id: macro-hygiene-dollar-crate-1
categorySlug: macros
title: "Macro Hygiene with $crate"
difficulty: 2
tags: [macros, hygiene, macro-export]
---

# Prompt
Why is `$crate::` essential in exported declarative macros (`#[macro_export]`)?

# Options
- [ ] A) It imports dependencies from crates.io at macro parse time
- [ ] B) It allocates an isolated namespace on the thread stack frame
- [x] C) It resolves paths to the defining crate across external users
- [ ] D) It generates a fresh random crate identifier during linking

# Hint
$crate expands to the crate where the macro was defined regardless of call site.

# Explanation
`$crate` ensures hygienic path resolution, expanding to the root path of the defining crate so helper items and dependencies resolve correctly in external crates.
