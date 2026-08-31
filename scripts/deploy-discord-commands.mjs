/**
 * Register Slash Commands with Discord REST API v10
 * Usage:
 *   DISCORD_TOKEN=... DISCORD_CLIENT_ID=... [DISCORD_GUILD_ID=...] node scripts/deploy-discord-commands.mjs
 */

const token = process.env.DISCORD_TOKEN
const clientId = process.env.DISCORD_CLIENT_ID
const guildId = process.env.DISCORD_GUILD_ID

if (!token || !clientId) {
  console.error('Error: DISCORD_TOKEN and DISCORD_CLIENT_ID are required.')
  console.error('Usage: DISCORD_TOKEN=... DISCORD_CLIENT_ID=... node scripts/deploy-discord-commands.mjs')
  process.exit(1)
}

const CATEGORIES = [
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
]

const commands = [
  {
    name: 'quiz',
    description: 'Launch a Rust technical quiz with live multiplayer scoring',
    options: [
      {
        name: 'category',
        description: 'Filter by Rust topic (Optional: Ownership, Lifetimes, Traits...)',
        type: 3, // STRING
        required: false,
        choices: CATEGORIES,
      },
      {
        name: 'mode',
        description: 'Competition mode (Optional: Race is first-to-answer, Group is practice)',
        type: 3, // STRING
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
        type: 3, // STRING
        required: false,
        choices: CATEGORIES,
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
        type: 3, // STRING
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
        type: 6, // USER
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
        type: 1, // SUB_COMMAND
        options: [
          {
            name: 'api_key',
            description: 'Your developer API key from cratery.cratera.org/developer',
            type: 3, // STRING
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

const url = guildId
  ? `https://discord.com/api/v10/applications/${clientId}/guilds/${guildId}/commands`
  : `https://discord.com/api/v10/applications/${clientId}/commands`

console.log(`Deploying ${commands.length} slash commands to Discord... (${guildId ? `Guild: ${guildId}` : 'Global'})`)

const res = await fetch(url, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bot ${token}`,
  },
  body: JSON.stringify(commands),
})

if (!res.ok) {
  const errText = await res.text()
  console.error(`Failed to deploy commands (${res.status}):`, errText)
  process.exit(1)
}

const data = await res.json()
console.log(`✓ Successfully registered ${data.length} commands with Discord!`)
