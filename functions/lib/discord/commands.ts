export const DISCORD_SLASH_COMMANDS = [
  {
    name: 'quiz',
    description: 'Launch a Rust technical quiz with live multiplayer scoring',
    options: [
      {
        name: 'category',
        description: 'Filter by Rust topic (Optional: Ownership, Lifetimes, Traits...)',
        type: 3, 
        required: false,
        choices: [
          { name: '🌐 All Categories (Random)', value: 'all' },
          { name: '🔒 Ownership & Borrowing', value: 'ownership' },
          { name: '⏳ Lifetimes', value: 'lifetimes' },
          { name: '💎 Traits & Generics', value: 'traits' },
          { name: '⚔️ Concurrency & Async', value: 'concurrency' },
          { name: '📦 Smart Pointers (Rc, Arc, RefCell)', value: 'pointers' },
          { name: '✨ Macros & Metaprogramming', value: 'macros' },
          { name: '⚠️ Error Handling (Result, Option)', value: 'error-handling' },
          { name: '🔁 Iterators & Closures', value: 'iterators-closures' },
          { name: '🛡️ Borrow Checker & Memory Safety', value: 'borrow-checker' },
        ],
      },
      {
        name: 'mode',
        description: 'Competition mode (Optional: Race is first-to-answer, Group is practice)',
        type: 3, 
        required: false,
        choices: [
          { name: '🏎️ Race (First to answer claims round)', value: 'race' },
          { name: '👥 Group (Everyone answers independently)', value: 'coop' },
        ],
      },
    ],
  },
  {
    name: 'race',
    description: 'Multiplayer sprint — first member to submit the correct answer claims the round',
    options: [
      {
        name: 'category',
        description: 'Filter by specific Rust topic category (Optional)',
        type: 3, 
        required: false,
        choices: [
          { name: '🌐 All Categories (Random)', value: 'all' },
          { name: '🔒 Ownership & Borrowing', value: 'ownership' },
          { name: '⏳ Lifetimes', value: 'lifetimes' },
          { name: '💎 Traits & Generics', value: 'traits' },
          { name: '⚔️ Concurrency & Async', value: 'concurrency' },
          { name: '📦 Smart Pointers', value: 'pointers' },
          { name: '✨ Macros', value: 'macros' },
          { name: '⚠️ Error Handling', value: 'error-handling' },
          { name: '🔁 Iterators & Closures', value: 'iterators-closures' },
          { name: '🛡️ Borrow Checker', value: 'borrow-checker' },
        ],
      },
    ],
  },
  {
    name: 'daily',
    description: "Solve today's official Rust Daily Challenge and progress your streak",
  },
  {
    name: 'forge',
    description: 'Interactive Rust coding challenge evaluated against test suites in microVMs',
  },
  {
    name: 'panel',
    description: 'Interactive arcade launcher for quizzes, races, coding trials, and rankings',
  },
  {
    name: 'run',
    description: 'Compile and run Rust code with microsecond execution telemetry in microVMs',
    options: [
      {
        name: 'code',
        description: 'Rust code to compile and execute (leave blank to open multiline modal editor)',
        type: 3, 
        required: false,
      },
    ],
  },
  {
    name: 'leaderboard',
    description: 'Display global Cratery rankings, top rustaceans, and XP leaderboards',
  },
  {
    name: 'stats',
    description: 'Display verified Rust mastery metrics, solved count, rank tier, and XP',
    options: [
      {
        name: 'user',
        description: 'View stats for another server member (optional)',
        type: 6, 
        required: false,
      },
    ],
  },
  {
    name: 'key',
    description: 'Configure your Cratera Developer API key for private code execution',
    options: [
      {
        name: 'set',
        description: 'Store your Cratera API key (private to your Discord account)',
        type: 1, 
        options: [
          {
            name: 'api_key',
            description: 'Your developer API key from cratery.cratera.org/developer',
            type: 3, 
            required: true,
          },
        ],
      },
      {
        name: 'status',
        description: 'Verify current API key status and linked Cratery account',
        type: 1, // SUB_COMMAND
      },
      {
        name: 'remove',
        description: 'Unlink and remove your stored API key',
        type: 1, // SUB_COMMAND
      },
    ],
  },
  {
    name: 'help',
    description: 'Explore available commands, competition modes, and account synchronization',
  },
  {
    name: 'Run in Cratera',
    type: 3, // MESSAGE context menu command
  },
]

export async function syncDiscordCommands(
  token: string,
  clientId: string
): Promise<{ ok: boolean; count?: number; error?: string }> {
  try {
    const res = await fetch(`https://discord.com/api/v10/applications/${clientId}/commands`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bot ${token}`,
      },
      body: JSON.stringify(DISCORD_SLASH_COMMANDS),
    })

    if (!res.ok) {
      const err = await res.text().catch(() => '')
      console.error('[discord-sync] Failed to auto-sync commands:', res.status, err)
      return { ok: false, error: `${res.status}: ${err}` }
    }

    const data = (await res.json()) as any[]
    console.log(`[discord-sync] Successfully registered ${data.length} global commands`)
    return { ok: true, count: data.length }
  } catch (err: any) {
    console.error('[discord-sync] Sync error:', err)
    return { ok: false, error: err.message || String(err) }
  }
}
