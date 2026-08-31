
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
  '2026-08-27-versioned-kv': 'c8c38d614ae68cfb0b48487b5a94e2349c5d682f75b522b91dd937ef53b9a455',
  '2026-08-20-frame-multiplexer': '90805217f9876d7a07f26f818128a1861f16014749633a1a93a1aacde3bd61b0',
  '2026-08-13-lexicon': '6462c5be2f63fc05f1975c14b0d874ccd6b468e518e3866ab65de97c908fed5e',
  '2026-08-06-scheduler': 'da610f41b6229463683a2b73c976406c9fd181308a1b1aa51536c8daef3524d2',
  '2026-01-29-cache': '478dab3716598063207e321eba72289095d884cf7d3e798f16911f3b3151e9b2',
  '2026-02-05-coalescer': 'd416098f73bd641e701ef0e44869c83e7c4ddd064f4c9c49103d35c0e4cfd1ea',
  '2026-02-12-dag-path': '060eacd7cb9786b140df28a7fdb1f3f1a2779fcd730872b50ef217ac47a25295',
  '2025-12-04-lru-cache': 'af1be11e825993d6f4725eb288d38fbf82eb70b9fa9ee37e2eeb33248da54a95',
  '2025-12-11-string-interner': '4fe64ed788f51a13524439ea73e5389847791ad6a7724e0935577b42d0c9c5d5',
  '2025-12-18-bst': 'ac2750ff0ae5896030d4fbfdc6db7ed356260da40fabfc744422af310e887d7e',
  '2025-12-25-thread-counter': 'e2d63a2de65b7836eea20d36d9b0069e05cc333c260ef2eaf5b999fe11a2942a',
  '2026-01-01-config-errors': 'cdadb567e1867ff715160986cb25ed272d3e2a4c0432c3db3caab7876564293d',
  '2026-01-08-iterator-pipeline': '9793f2028df38ede20e79efb3571e7a4305404ec80e027ed233904caa3ab620f',
  '2026-01-15-lifetime-slices': '29081f24623e53873f0f12b99c096c7cc65c57d2cda51cc1a48c2d33d0510d81',
  '2026-01-22-ring-buffer': '1f91b0eedffb2774a74be16878d973008e5aeb7aecf4f370da23344e91f98555',
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
