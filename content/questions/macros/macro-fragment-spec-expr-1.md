---
id: macro-fragment-spec-expr-1
categorySlug: macros
title: "Matcher Follow-Set Restrictions"
difficulty: 3
tags: [macros, fragment-specifiers, follow-set]
---

# Prompt
What follow-set restriction applies to `$e:expr` matchers in `macro_rules!`?

# Options
- [x] A) It cannot be followed by arbitrary tokens like `+`
- [ ] B) It can match any arbitrary token tree without limit
- [ ] C) It evaluates the expression at macro expansion time
- [ ] D) It forces the matched token to be an integer literal

# Hint
Follow-set restrictions prevent ambiguities in macro parsing.

# Explanation
Because `$e:expr` can end with arbitrary expressions, macro matchers restrict following tokens to delimiters (like `,`, `;`, or `=>`) to eliminate ambiguity in the parser.
