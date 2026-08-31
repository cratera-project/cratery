---
id: ptr-write-bytes-zeroing-1
categorySlug: pointers
title: "ptr::write_bytes (memset)"
difficulty: 2
tags: [pointers, memset, write-bytes]
---

# Prompt
What is the behavior of `std::ptr::write_bytes(dst, byte, count)`?

# Options
- [x] A) It sets count * size_of::<T>() bytes without dropping
- [ ] B) It executes drop_in_place on every overwritten element
- [ ] C) It allocates fresh zero-filled pages from OS virtual mem
- [ ] D) It only works on pointers to unsigned integer primitives

# Hint
write_bytes is Rust's equivalent of memset and does not drop overwritten values.

# Explanation
`write_bytes` sets `count * size_of::<T>()` contiguous bytes to the given byte value (like `memset`), without invoking `Drop` on existing contents.
