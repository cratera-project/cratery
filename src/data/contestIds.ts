
export const CONTEST_IDS = [
  '2026-08-27-versioned-kv',
  '2026-08-20-frame-multiplexer',
  '2026-08-13-lexicon',
  '2026-08-06-scheduler',
  '2026-01-29-cache',
  '2026-02-05-coalescer',
  '2026-02-12-dag-path',
  '2025-12-04-lru-cache',
  '2025-12-11-string-interner',
  '2025-12-18-bst',
  '2025-12-25-thread-counter',
  '2026-01-01-config-errors',
  '2026-01-08-iterator-pipeline',
  '2026-01-15-lifetime-slices',
  '2026-01-22-ring-buffer',
] as const

export const CONTEST_HARNESS_SHA256: Record<(typeof CONTEST_IDS)[number], string> = {
  '2026-08-27-versioned-kv': '7652903798dea430efefa08a3fcee816db3930230f0fedf5cd6af5da282a8d9e',
  '2026-08-20-frame-multiplexer': '74cd1ec63f5031511590129935ed98cc4f55270653b8179453e40a6b6cedad80',
  '2026-08-13-lexicon': '571f54630d42480812e50d4634418c874e5484ecc0dc28faf8387402451d2e36',
  '2026-08-06-scheduler': '0551a4fa698e32f396a638c8b37e6809d9b17f567f7f4fc6eebe6c30854d16ae',
  '2026-01-29-cache': '77e2215750320c5705a229c4027d23e2394588ad5387b32fdba8aaab688be688',
  '2026-02-05-coalescer': 'c80d4b3ebdde2d30ed6dd3f61790a331959fb81163a6b3f50306f422c13245d9',
  '2026-02-12-dag-path': 'dda51fd2baefd106bbf81b71c7952d4fc09e7e4cc163df0f2f4013484aecec9d',
  '2025-12-04-lru-cache': '521e129acc8371d54326b182289d2a2d5e4e1c29dd2b439924ff8aa506e1377a',
  '2025-12-11-string-interner': 'ca17cd172636fb7c7f30f5242884b636bf764d6a8f4d5c0da0a9163542cf3d58',
  '2025-12-18-bst': '3a1594f1e1fb347097eede0ab59a793c321a96a3d67f41074a7784ae6b76d695',
  '2025-12-25-thread-counter': '73b7e49321f07ef68e102ed4eb19fdf48523acb61d2a5933e0a572ccef8709b1',
  '2026-01-01-config-errors': 'f83c655e262d7946fabf47b470ca4d3afc8d486d99b09f61e7d38324573274fb',
  '2026-01-08-iterator-pipeline': 'd87a8fb8d32b90b85e45e1f70e6b883c49aae6459f572305625ad85bc93f3fe3',
  '2026-01-15-lifetime-slices': '433de91a6c371a23e8e2479c395583727b87e4d8b243ae549e819a9ea24d37d8',
  '2026-01-22-ring-buffer': '04862438665c7c1eb05bbec667fe75452d35f4fe4173332e966683befa1a4678',
}

export const INTERACTIVE_QUEST_IDS = [
  'add-two-numbers',
  'make-mutable',
  'string-length',
  'clamp-value',
  'wrap-option',
  'safe-divide',
  'greet-rustacean',
  'count-vowels',
  'rectangle-area',
  'traffic-light-enum',
  'filter-evens',
  'parse-port-number',
  'impl-display-point',
  'find-first-duplicate',
  'chunk-by',
  'type-map',
  'trie-map',
  'byte-arena',
  'broadcast-queue',
] as const

export function isKnownContestId(id: string): boolean {
  return (
    (CONTEST_IDS as readonly string[]).includes(id) ||
    (INTERACTIVE_QUEST_IDS as readonly string[]).includes(id) ||
    id.startsWith('uq:')
  )
}

export function officialHarnessHash(contestId: string): string | undefined {
  if (!isKnownContestId(contestId)) return undefined
  return CONTEST_HARNESS_SHA256[contestId as (typeof CONTEST_IDS)[number]]
}
