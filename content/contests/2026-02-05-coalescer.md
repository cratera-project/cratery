---
id: 2026-02-05-coalescer
title: "Adaptive Request Coalescer"
weekLabel: "Thu Feb 5 → Thu Feb 12, 2026"
difficulty: 3
opensAt: "2026-02-05T00:00:00.000Z"
closesAt: "2026-02-12T00:00:00.000Z"
signature: "Coalescer::new / submit / tick - priority-aware batching"
supportedLanguages: [rust]
---

# Description
You're building a request aggregation layer for a high-throughput analytics service. The system must batch requests while respecting strict deadlines and maintaining fairness across priority levels.

### Core Mechanics

**Time Model:**
- Time is discrete and advances only when `tick()` is called
- Requests are submitted at the current time (`now`)
- Each request has an **absolute deadline** (not relative)

**Batching Rules (applied in order during each tick):**

1. **Time advances:** `now` increments by 1
2. **Expiration:** Any request where `deadline <= now` immediately expires
   - Expired requests emit `Event::RequestExpired` (sorted by ID for determinism)
   - Expired requests are **removed** and never dispatched
3. **Full batch formation:** While `pending_count >= capacity`, form batches:
   - Take exactly `capacity` requests using **round-robin across priorities**
   - Sort batch by priority (lower number = higher priority), then by ID
   - Emit `Event::BatchDispatched`
4. **Partial batch trigger:** If ANY requests expired this tick AND pending requests remain:
   - Dispatch ALL remaining pending requests as one partial batch
   - Sort by priority, then ID
   - Emit `Event::BatchDispatched`

**Fairness Guarantee (Round-Robin):**
When forming batches:
- Iterate through priority levels in sorted order (Priority(1), Priority(2), ...)
- Take one request from each non-empty priority queue
- Repeat until batch reaches capacity
- This ensures no priority starves when multiple priorities have pending requests

**Statistics Tracking:**
- `submitted`: Total requests submitted for this priority
- `dispatched`: Requests successfully dispatched in batches
- `expired`: Requests that expired without being dispatched
- `total_wait_time`: Sum of `(dispatch_time - arrival_time)` for all dispatched requests

### Complexity Requirements

- `submit()`: O(log P) where P = number of distinct priorities
- `tick()`: O(B log B + E log P) where B = requests dispatched, E = requests expired, P = priorities
- Space: O(N + D) where N = pending requests, D = distinct deadlines

You may only edit the code below. Hit Run to compile and test against the judge, then Submit to verify.

# Examples

### Example 1
**Input:**
```rust
let mut coalescer = Coalescer::new(NonZeroUsize::new(2).unwrap());
coalescer.submit(1, Priority(1));
coalescer.submit(2, Priority(2));
coalescer.tick(Time(10))
```
**Output:**
```
Event::BatchDispatched(vec![1, 2])
```
**Explanation:** Round-robin fairness pulls one request per priority before filling remainder.

# Starter Code
```rust
pub use std::num::NonZeroUsize;

/// Priority level, where lower values indicate higher priority.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct Priority(pub u8);

/// Absolute deadline in time units.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct Deadline(pub u64);

/// Unique identifier for a request.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct RequestId(pub u64);

/// A request to be coalesced.
#[derive(Debug, Clone)]
pub struct Request {
    pub id: RequestId,
    pub priority: Priority,
    pub deadline: Deadline,
    pub payload: Vec<u8>,
}

/// A dispatched batch of requests.
#[derive(Debug, Clone)]
pub struct Batch {
    pub requests: Vec<Request>,
    pub dispatched_at: u64,
}

/// Statistics for a specific priority level.
#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct PriorityStats {
    pub submitted: u64,
    pub dispatched: u64,
    pub expired: u64,
    pub total_wait_time: u64,
}

/// Events produced by the coalescer during a time step.
#[derive(Debug, Clone)]
pub enum Event {
    /// A batch was dispatched.
    BatchDispatched(Batch),
    /// A request expired without being dispatched.
    RequestExpired(Request),
}

/// Configuration for the coalescer.
#[derive(Debug, Clone)]
pub struct Config {
    pub batch_capacity: NonZeroUsize,
}

pub struct Coalescer;

impl Coalescer {
    /// Creates a new coalescer with the given configuration.
    /// Initial time is 0.
    pub fn new(config: Config) -> Self {
        todo!()
    }

    /// Submits a request to be coalesced.
    /// The request is timestamped with the current time.
    /// 
    /// Returns an error if the request ID is already pending.
    pub fn submit(&mut self, request: Request) -> Result<(), SubmitError> {
        todo!()
    }

    /// Advances time by one unit and processes pending requests.
    /// 
    /// Returns all events produced during this time step, ordered by:
    /// 1. All expirations (sorted by request ID)
    /// 2. All batch dispatches (in formation order)
    pub fn tick(&mut self) -> Vec<Event> {
        todo!()
    }

    /// Returns the current time.
    pub fn now(&self) -> u64 {
        todo!()
    }

    /// Returns statistics for a specific priority level.
    /// Returns None if no requests have ever been submitted for this priority.
    pub fn stats(&self, priority: Priority) -> Option<PriorityStats> {
        todo!()
    }

    /// Returns the number of requests currently pending (not yet dispatched or expired).
    pub fn pending_count(&self) -> usize {
        todo!()
    }

    /// Returns true if there are no pending requests.
    pub fn is_idle(&self) -> bool {
        todo!()
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum SubmitError {
    DuplicateId,
}
```

# Test Harness
```rust
{{SOLUTION}}

fn config(capacity: usize) -> Config {
        Config {
            batch_capacity: NonZeroUsize::new(capacity).unwrap(),
        }
    }

fn request(id: u64, priority: u8, deadline: u64, payload_size: usize) -> Request {
        Request {
            id: RequestId(id),
            priority: Priority(priority),
            deadline: Deadline(deadline),
            payload: vec![0u8; payload_size],
        }
    }

fn main() {
    // test_basic_batch_formation

    let mut c = Coalescer::new(config(2));

    c.submit(request(1, 1, 10, 100)).unwrap();
    c.submit(request(2, 1, 10, 100)).unwrap();

    let events = c.tick();

    assert_eq!(events.len(), 1);
    match &events[0] {
        Event::BatchDispatched(batch) => {
            assert_eq!(batch.requests.len(), 2);
            assert_eq!(batch.dispatched_at, 1);
            assert_eq!(batch.requests[0].id.0, 1);
            assert_eq!(batch.requests[1].id.0, 2);
        }
        _ => panic!("expected batch dispatch"),
    }
    assert!(c.is_idle());
        

    // test_expiration_then_partial_batch

    let mut c = Coalescer::new(config(3));

    // Request 1 expires at time 1, request 2 has later deadline
    c.submit(request(1, 1, 1, 100)).unwrap();
    c.submit(request(2, 1, 5, 100)).unwrap();

    let events = c.tick(); // time advances to 1

    // No full batch possible (only 2 pending, need 3)
    // Request 1 expires (deadline 1 <= now 1)
    // Request 2 remains, dispatched in partial batch
    assert_eq!(events.len(), 2);
    assert!(matches!(&events[0], Event::RequestExpired(r) if r.id.0 == 1));
    assert!(matches!(&events[1], Event::BatchDispatched(batch) 
        if batch.requests.len() == 1 && batch.requests[0].id.0 == 2));

    assert_eq!(c.pending_count(), 0);
        

    // test_priority_ordering_in_batch

    let mut c = Coalescer::new(config(2));

    // Lower priority number = higher priority
    c.submit(request(1, 5, 10, 100)).unwrap();
    c.submit(request(2, 1, 10, 100)).unwrap();

    let events = c.tick();

    match &events[0] {
        Event::BatchDispatched(batch) => {
            // Priority(1) comes before Priority(5)
            assert_eq!(batch.requests[0].priority.0, 1);
            assert_eq!(batch.requests[0].id.0, 2);
            assert_eq!(batch.requests[1].priority.0, 5);
            assert_eq!(batch.requests[1].id.0, 1);
        }
        _ => panic!("expected batch dispatch"),
    }
        

    // test_duplicate_id_rejected

    let mut c = Coalescer::new(config(2));

    c.submit(request(1, 1, 10, 100)).unwrap();
    assert_eq!(
        c.submit(request(1, 2, 10, 100)),
        Err(SubmitError::DuplicateId)
    );
        

    // test_multiple_expirations_then_partial_batch

    let mut c = Coalescer::new(config(3));

    c.submit(request(1, 1, 1, 100)).unwrap();
    c.submit(request(2, 1, 1, 100)).unwrap();
    c.submit(request(3, 1, 5, 100)).unwrap();

    let events = c.tick(); // time advances to 1

    // Requests 1,2 expire (deadline 1 <= now 1)
    // Request 3 remains (deadline 5 > now 1)
    // Partial batch dispatches request 3
    assert_eq!(events.len(), 3);
    assert!(matches!(&events[0], Event::RequestExpired(r) if r.id.0 == 1));
    assert!(matches!(&events[1], Event::RequestExpired(r) if r.id.0 == 2));
    assert!(matches!(&events[2], Event::BatchDispatched(batch) 
        if batch.requests.len() == 1 && batch.requests[0].id.0 == 3));
        

    // test_stats_tracking

    let mut c = Coalescer::new(config(2));

    c.submit(request(1, 5, 10, 100)).unwrap();
    c.submit(request(2, 5, 1, 100)).unwrap();  // will expire
    c.submit(request(3, 5, 10, 100)).unwrap();

    c.tick(); // time 1: req 2 expires, reqs 1+3 dispatch as partial batch

    let stats = c.stats(Priority(5)).unwrap();
    assert_eq!(stats.submitted, 3);
    assert_eq!(stats.dispatched, 2);  // requests 1 and 3
    assert_eq!(stats.expired, 1);     // request 2
    assert_eq!(stats.total_wait_time, 2); // req 1: (1-0)=1, req 3: (1-0)=1
        

    // test_round_robin_fairness

    let mut c = Coalescer::new(config(2));

    // Submit 2 requests per priority level
    c.submit(request(1, 10, 10, 100)).unwrap();  // low priority
    c.submit(request(2, 10, 10, 100)).unwrap();  // low priority
    c.submit(request(3, 1, 10, 100)).unwrap();   // high priority
    c.submit(request(4, 1, 10, 100)).unwrap();   // high priority

    let events = c.tick();

    // Should form 2 batches via round-robin
    assert_eq!(events.len(), 2);

    // First batch: one from Priority(1), one from Priority(10)
    if let Event::BatchDispatched(batch) = &events[0] {
        assert_eq!(batch.requests.len(), 2);
        // After sorting: Priority(1) first, Priority(10) second
        assert_eq!(batch.requests[0].priority.0, 1);
        assert_eq!(batch.requests[1].priority.0, 10);
    }

    // Second batch: remaining from each priority
    if let Event::BatchDispatched(batch) = &events[1] {
        assert_eq!(batch.requests.len(), 2);
        assert_eq!(batch.requests[0].priority.0, 1);
        assert_eq!(batch.requests[1].priority.0, 10);
    }

    // Verify both priorities got dispatched
    let mut high_count = 0;
    let mut low_count = 0;
    for event in events {
        if let Event::BatchDispatched(batch) = event {
            for req in batch.requests {
                if req.priority.0 == 1 { high_count += 1; }
                if req.priority.0 == 10 { low_count += 1; }
            }
        }
    }
    assert_eq!(high_count, 2);
    assert_eq!(low_count, 2);
        

    // test_no_partial_batch_without_expiration

    let mut c = Coalescer::new(config(3));

    c.submit(request(1, 1, 10, 100)).unwrap();
    c.submit(request(2, 1, 10, 100)).unwrap();

    let events = c.tick();

    // No full batch (need 3, have 2)
    // No expirations (deadlines are 10, now is 1)
    // So no partial batch either
    assert_eq!(events.len(), 0);
    assert_eq!(c.pending_count(), 2);
        

    // test_all_requests_expire

    let mut c = Coalescer::new(config(2));

    c.submit(request(1, 1, 1, 100)).unwrap();
    c.submit(request(2, 1, 1, 100)).unwrap();

    let events = c.tick(); // time 1, both expire

    // Both requests expire, no partial batch (nothing left)
    assert_eq!(events.len(), 2);
    assert!(matches!(&events[0], Event::RequestExpired(r) if r.id.0 == 1));
    assert!(matches!(&events[1], Event::RequestExpired(r) if r.id.0 == 2));
    assert!(c.is_idle());
        

    // test_batch_capacity_one

    let mut c = Coalescer::new(config(1));

    c.submit(request(1, 1, 5, 100)).unwrap();
    c.submit(request(2, 1, 5, 100)).unwrap();

    let events = c.tick();

    // Each request forms its own batch
    assert_eq!(events.len(), 2);
    assert!(matches!(&events[0], Event::BatchDispatched(b) if b.requests.len() == 1));
    assert!(matches!(&events[1], Event::BatchDispatched(b) if b.requests.len() == 1));
        

    // test_interleaved_full_and_partial_batches

    let mut c = Coalescer::new(config(2));

    c.submit(request(1, 1, 2, 100)).unwrap();
    c.submit(request(2, 1, 2, 100)).unwrap();
    c.submit(request(3, 1, 1, 100)).unwrap(); // expires at time 1

    let events = c.tick(); // time 1

    // Order: expiration first, then full batch
    // Request 3 expires, then requests 1+2 form full batch
    assert_eq!(events.len(), 2);
    assert!(matches!(&events[0], Event::RequestExpired(r) if r.id.0 == 3));
    assert!(matches!(&events[1], Event::BatchDispatched(b) if b.requests.len() == 2));
        

    // test_three_priority_levels_round_robin

    let mut c = Coalescer::new(config(3));

    c.submit(request(1, 1, 10, 100)).unwrap();   // P1
    c.submit(request(2, 5, 10, 100)).unwrap();   // P5
    c.submit(request(3, 10, 10, 100)).unwrap();  // P10

    let events = c.tick();

    assert_eq!(events.len(), 1);
    if let Event::BatchDispatched(batch) = &events[0] {
        assert_eq!(batch.requests.len(), 3);
        // Round-robin takes 1 from each: P1, P5, P10
        // After sorting by priority: P1, P5, P10
        assert_eq!(batch.requests[0].priority.0, 1);
        assert_eq!(batch.requests[1].priority.0, 5);
        assert_eq!(batch.requests[2].priority.0, 10);
    }
        
    println!("all tests passed");
}
```
