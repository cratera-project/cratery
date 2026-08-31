---
id: 2026-08-20-frame-multiplexer
title: "The MicroVM Frame Multiplexer"
weekLabel: "Thu Aug 20 → Thu Aug 27, 2026"
difficulty: 3
opensAt: "2026-08-20T00:00:00.000Z"
closesAt: "2026-08-27T00:00:00.000Z"
solutionUnlocksAt: "2026-08-21T03:00:00.000Z"
signature: "fn reassemble_streams(chunks: Vec<FrameChunk>) -> Vec<StreamResult>"
supportedLanguages: [rust]
---

# Description
Inside Cratera's Firecracker execution engine, guest microVMs communicate with the host coordinator through a zero-network virtual socket (vsock) channel. When guest threads stream stdout, stderr, and execution telemetry simultaneously, frame chunks arrive interleaved, in arbitrary order, and occasionally with overlapping byte slices.

Implement the stream multiplexer and frame reassembler:

Given a list of `FrameChunk`:
- `stream_id: u8`: Channel identifier (e.g. 1 = stdout, 2 = stderr, 3 = telemetry).
- `offset: u32`: 0-indexed byte offset where this slice begins in the stream.
- `payload: String`: UTF-8 payload data.
- `is_last: bool`: True if this chunk marks the final byte of the stream.

Return `Vec<StreamResult>`:
- `stream_id: u8`: Stream identifier.
- `data: String`: Reconstructed contiguous stream data starting from offset 0.
- `complete: bool`: `true` if the stream is contiguous from offset 0 to the end of the `is_last` frame without any gaps; `false` otherwise.

Rules:
1. Return streams sorted by `stream_id` ascending.
2. If chunks overlap on identical byte ranges, duplicate bytes must be seamlessly deduplicated.
3. If an offset gap occurs from offset 0 (e.g. bytes 0..5 received, then 8..12 received without 4..8), assemble contiguous data up to the first gap and mark `complete: false`.
4. If no `is_last` frame was received for a stream, `complete` is `false`.
5. Empty inputs return `vec![]`.

Constraints:
- 0 <= chunks.len() <= 5_000
- 0 <= offset <= 1_000_000
- Standard library only. No external crates.

Beat other solvers on guest execution time (microseconds) and memory RSS. Official solution write-up unlocks in 12 hours.

# Examples

### Example 1
**Input:**
```rust
chunks = [
  FrameChunk { stream_id: 1, offset: 0, payload: "Hello ", is_last: false },
  FrameChunk { stream_id: 1, offset: 6, payload: "World!", is_last: true },
]
```
**Output:**
```
[
  StreamResult { stream_id: 1, data: "Hello World!", complete: true },
]
```
**Explanation:** Two in-order chunks assembled into a complete contiguous stream.

### Example 2
**Input:**
```rust
chunks = [
  FrameChunk { stream_id: 1, offset: 5, payload: " World!", is_last: true },
  FrameChunk { stream_id: 1, offset: 0, payload: "Hello ",  is_last: false },
  FrameChunk { stream_id: 1, offset: 2, payload: "llo ",    is_last: false },
]
```
**Output:**
```
[
  StreamResult { stream_id: 1, data: "Hello World!", complete: true },
]
```
**Explanation:** Arrived out of order with overlapping duplicate slice [2..6]; deduplicated cleanly.

### Example 3
**Input:**
```rust
chunks = [
  FrameChunk { stream_id: 1, offset: 0,  payload: "part1", is_last: false },
  FrameChunk { stream_id: 1, offset: 10, payload: "part3", is_last: true },
]
```
**Output:**
```
[
  StreamResult { stream_id: 1, data: "part1", complete: false },
]
```
**Explanation:** Missing bytes 5..10 (offset gap); assembled contiguous data up to the gap with complete = false.

# Starter Code
```rust
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct FrameChunk {
    pub stream_id: u8,
    pub offset: u32,
    pub payload: String,
    pub is_last: bool,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct StreamResult {
    pub stream_id: u8,
    pub data: String,
    pub complete: bool,
}

pub struct Solution;

impl Solution {
    pub fn reassemble_streams(chunks: Vec<FrameChunk>) -> Vec<StreamResult> {
        // TODO: Assemble out-of-order and overlapping frame chunks
        Vec::new()
    }
}
```

# Test Harness
```rust
{{SOLUTION}}

fn chunk(stream_id: u8, offset: u32, payload: &str, is_last: bool) -> FrameChunk {
    FrameChunk {
        stream_id,
        offset,
        payload: payload.to_string(),
        is_last,
    }
}

fn res(stream_id: u8, data: &str, complete: bool) -> StreamResult {
    StreamResult {
        stream_id,
        data: data.to_string(),
        complete,
    }
}

fn main() {
    // 1. Basic in-order stream
    assert_eq!(
        Solution::reassemble_streams(vec![
            chunk(1, 0, "Hello ", false),
            chunk(1, 6, "World!", true),
        ]),
        vec![res(1, "Hello World!", true)]
    );

    // 2. Out of order with overlapping duplicate slice
    assert_eq!(
        Solution::reassemble_streams(vec![
            chunk(1, 5, " World!", true),
            chunk(1, 0, "Hello ", false),
            chunk(1, 2, "llo ", false),
        ]),
        vec![res(1, "Hello World!", true)]
    );

    // 3. Multiple interleaved streams
    assert_eq!(
        Solution::reassemble_streams(vec![
            chunk(2, 0, "ERROR: connection lost", true),
            chunk(1, 0, "stdout line 1\n", false),
            chunk(3, 0, "cpu_us=120", false),
            chunk(1, 14, "stdout line 2\n", true),
            chunk(3, 10, ",rss_kb=2048", true),
        ]),
        vec![
            res(1, "stdout line 1\nstdout line 2\n", true),
            res(2, "ERROR: connection lost", true),
            res(3, "cpu_us=120,rss_kb=2048", true),
        ]
    );

    // 4. Missing chunk / gap in stream
    assert_eq!(
        Solution::reassemble_streams(vec![
            chunk(1, 0, "part1", false),
            chunk(1, 10, "part3", true),
        ]),
        vec![res(1, "part1", false)]
    );

    // 5. Missing offset 0 entirely
    assert_eq!(
        Solution::reassemble_streams(vec![
            chunk(1, 5, "middle", true),
        ]),
        vec![res(1, "", false)]
    );

    // 6. No is_last flag received
    assert_eq!(
        Solution::reassemble_streams(vec![
            chunk(1, 0, "running forever...", false),
        ]),
        vec![res(1, "running forever...", false)]
    );

    // 7. Empty input
    assert_eq!(Solution::reassemble_streams(vec![]), vec![]);

    // 8. Stress test with 3000 interleaved frames
    let mut stress = Vec::with_capacity(3000);
    for i in (0..1000).rev() {
        stress.push(chunk(1, i * 4, "data", i == 999));
        stress.push(chunk(2, i * 2, "ok", i == 999));
        stress.push(chunk(3, i * 1, "x", i == 999));
    }
    let out = Solution::reassemble_streams(stress);
    assert_eq!(out.len(), 3);
    assert!(out[0].complete);
    assert!(out[1].complete);
    assert!(out[2].complete);
    assert_eq!(out[0].data.len(), 4000);
    assert_eq!(out[1].data.len(), 2000);
    assert_eq!(out[2].data.len(), 1000);

    println!("all tests passed");
}
```
