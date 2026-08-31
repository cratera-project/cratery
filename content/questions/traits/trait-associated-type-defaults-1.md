---
id: trait-associated-type-defaults-1
categorySlug: traits
title: "Associated Type Defaults"
difficulty: 2
tags: [traits, associated-types, defaults]
---

# Prompt
What capability do associated type defaults (`type Output = Self;`) provide in traits?

# Options
- [ ] A) Associated type defaults require an explicit const bound
- [x] B) Implementors can omit the associated type to use default
- [ ] C) Defaults convert associated types into dynamic trait dyn
- [ ] D) Associated type defaults are forbidden in standard traits

# Hint
Default associated types allow implementors to omit explicit type definitions when the default matches.

# Explanation
Associated type defaults allow trait definitions to specify a default type (e.g. `type Output = Self;` in `Add`), which implementors can omit unless customizing.
