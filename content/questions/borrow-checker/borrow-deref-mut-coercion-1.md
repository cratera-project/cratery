---
id: borrow-deref-mut-coercion-1
categorySlug: borrow-checker
title: "DerefMut Coercion Rules"
difficulty: 2
tags: [borrow-checker, deref-mut, coercion]
---

# Prompt
How does the compiler apply `DerefMut` coercion when calling methods expecting `&mut U`?

# Options
- [ ] A) DerefMut coercion automatically allocates heap memory
- [ ] B) DerefMut allows multiple active &mut references at once
- [ ] C) DerefMut is only evaluated when calling unsafe methods
- [x] D) DerefMut coerces &mut T to &mut U if T: DerefMut<Target=U>

# Hint
If T implements DerefMut<Target = U>, &mut T coerces seamlessly to &mut U.

# Explanation
Rust automatically coerces `&mut T` to `&mut U` if `T: DerefMut<Target = U>`, allowing methods on the inner target to be invoked directly on smart pointer wrappers.
