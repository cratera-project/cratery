---
id: err-io-error-custom-payload-1
categorySlug: error-handling
title: "Custom Payloads in std::io::Error"
difficulty: 1
tags: [error-handling, io-error, custom-payload]
---

# Prompt
What does `std::io::Error::other(err)` or `io::Error::new(kind, custom_err)` do?

# Options
- [x] A) It packages arbitrary errors into an io::Error instance
- [ ] B) It ignores custom errors and returns Ok(()) on failure
- [ ] C) It converts IO errors into asynchronous future results
- [ ] D) It limits error sizes to primitive eight-byte integers

# Hint
io::Error::other wraps arbitrary Box<dyn Error + Send + Sync> payloads.

# Explanation
`io::Error::other` and `io::Error::new` allow developers to package any arbitrary error type into standard `std::io::Error` envelopes with custom error kinds.
