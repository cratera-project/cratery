# Changelog

Recorded release and platform updates for Cratery. Newest first.

Each entry is a `## YYYY-MM-DD — Title` heading followed by bullet items. The app
changelog page is generated from this file by `scripts/generate-changelog.mjs`.

## 2026-09-02 — Cratery v1.0.0 — First Stable Release

- Cratery is officially out of beta: 682 quests across 10 topic tracks, 15 weekly contests, and a 13-chapter interactive Learn curriculum.
- Interactive notebooks with live Rust execution in hardware-isolated Firecracker microVMs, plus an in-browser Firecracker judge for advanced forge challenges.
- Official Discord bot with multiplayer lobbies, XP sync, and code execution from any Discord message.
- Community quests, notes, comments, leaderboards, and profiles — with guest participation, email verification, and Turnstile-protected auth.
- This site now ships as versioned releases; follow the repository for future updates.

## 2026-09-01 — Guest Solution Rates & Community Stats Update

- Synced the database for missing guest solution rates and solve counts to global stats so guest contributions are accurately included in total quests answered.
- Fixed the homepage rustacean count to use registered accounts (custom_users) instead of verified profiles, which had stalled at 203.

## 2026-08-28 — Quest Solution Explanations & Cloudflare Turnstile Fixes

- Resolved a Cloudflare Turnstile challenge bug that could cause quest submission buttons to get stuck or fail verification.
- Fixed quest solution explanations across all 632 built-in and community quizzes to ensure explanations are fully accessible upon answer reveal.
- Added in-depth solution and walkthrough toggles for interactive coding challenges.
- Fixed note template forking in Cratery Notes.

## 2026-08-27 — Interactive Notes (Google Colab for Rust) & Live MicroVM Notebooks

- Create, organize, and publish Google Colab-style notebooks combining rich Markdown explanations with live runnable Rust code cells.
- Run any code cell directly inside isolated Firecracker microVMs with microsecond latency, live terminal output, stdout/stderr, and RSS memory accounting.
- Keep personal research and drafts private, or publish publicly to the community gallery with tag filtering and search.
- 1-click social sharing intents (X/Twitter, LinkedIn, Reddit), Discord markdown links, and HTML iframe embed codes for blogs and documentation.
- Clone community notebooks directly into your personal workspace to experiment, modify, and build upon existing Rust code.
- Pre-built interactive notebooks covering Ownership & Moves, Fearless Concurrency, Zero-Cost Iterators, Smart Pointers, Error Handling, C FFI, and Dynamic Polymorphism.
- Real-time code execution counters (runs_count), view tracking, and fork metrics that scale smoothly with community activity.

## 2026-08-24 — Interactive Learn Documentation & Step-by-Step Rust Curriculum

- Released the comprehensive Learn curriculum (/learn): 14 structured chapters covering core to advanced Rust mechanics from basic syntax to unsafe internals.
- In-Line Executable Code Snippets: Edit and execute any tutorial code snippet in-place with instant microVM feedback without leaving the chapter.
- Chapter Navigation & Shortcuts: Quick-jump table of contents, responsive mobile chapter drawer, and keyboard navigation between lesson sections.
- Deep Dive Topic Coverage: Dedicated chapters for Ownership & Borrowing, Non-Lexical Lifetimes, Concurrency Primitives, Trait Architecture, Macro Metaprogramming, and C FFI Interop.

## 2026-08-21 — 150 New Deep-Dive Quests, Discord Bot & Live Web Sync

- Added 150 new Rust mastery quests across all 9 core tracks: advanced lifetimes, concurrency patterns, raw pointers, trait dispatch, zero-cost iterators, and macro hygiene.
- Expanded the Daily Challenge rotation pool with all 150 new free questions for daily streak progression.
- Released the official Cratery Discord Bot (/panel, /race, /quiz, /daily, /forge, /run) with instant 1-click multiplayer game lobbies.
- Zero-friction Message Context Menu: Right click any Rust code snippet in Discord to execute in isolated hardware microVMs.
- End-to-end real-time XP and question progress sync between Discord and your official Cratery profile.

## 2026-08-20 — Cratera SDK, Rate Limits & MicroVM Multiplexer Contest

- Released the official cratera client SDK on npm (npm install cratera) with zero runtime dependencies and dual ESM/CJS support.
- New Weekly Contest: The MicroVM Frame Multiplexer — reassemble interleaved, out-of-order Firecracker vsock byte streams with microsecond telemetry.
- Upgraded Developer API quotas: Free tier increased to 250 req/day (15 req/min burst limit), Supporter tier to 10,000 req/day (60 req/min burst limit).
- Expanded microVM execution engine with multi-language compiler runtimes across 9 languages (Rust 2024, Python 3.12, TypeScript, Node.js 24, Go, C++, C, Java, and C# Mono).

## 2026-08-19 — Advanced Quests & Firecracker Judge

- In-browser code execution for Advanced Quests powered by a hardware-isolated Firecracker microVM judge.
- 5 hands-on challenges: Byte Arena Allocator, Lock-Free Broadcast Queue, Prefix Trie Map, ChunkBy Iterator Adapter, and Type-Safe AnyMap Container.
- Run quick sample tests or submit for full validation with microsecond runtime accounting and anonymous RSS memory tracking.
- View personal best percentiles vs other solvers, and browse full history of runs and submissions with 1-click code restore.

## 2026-08-17 — Full mobile support and navigation

- Redesigned mobile navigation with a pixel drawer menu for quick access to all quest types, supporter perks, ranks, and contests.
- Code blocks now scale properly on phones with smooth touch scrolling and responsive font sizing.
- Added safe area support for modern phone notches and bottom bars.
- Improved touch targets, button wrapping, and layout stability across every page.

## 2026-08-14 — Cards, rivals, creator XP

- Public profiles unfurl as a generated card: pfp, rank title, XP, and direct profile link. Share profile cards anywhere.
- Quest authors earn 25 XP on publish and 5 XP each time a signed-in rustacean first-solves a quest. Creators have a dedicated leaderboard tab.
- Challenge a teammate: two logged-in players, the same 1–5 quizzes, 24 hours, W–L on the profile card.
- Rank-up moment and +XP after a correct answer. Profile XP now matches the public rank (including author XP).
- Phone nav uses a menu instead of clipped chips. Weekly contest stacks on small screens.
