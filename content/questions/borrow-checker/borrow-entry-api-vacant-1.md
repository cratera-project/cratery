---
id: borrow-entry-api-vacant-1
categorySlug: borrow-checker
title: "HashMap Entry API Pattern"
difficulty: 1
tags: [borrow-checker, hashmap, entry]
---

# Prompt
What borrow checker advantage does `HashMap::entry` provide?

# Options
- [ ] A) It requires two separate hash lookups internally
- [ ] B) It returns an immutable copy of the found value
- [x] C) It provides in-place vacant or occupied mutation
- [ ] D) It clones the key into a secondary thread cache

# Hint
The Entry API avoids multiple lookups and conflicting borrows.

# Explanation
The `Entry` API borrows the map once to locate the key slot and allows direct conditional insertion or in-place mutation without borrow conflicts.
