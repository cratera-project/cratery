import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  ComponentType,
  ButtonStyle,
  TextInputStyle,
  type DiscordInteractionResponse,
  type DiscordActionRow,
  type DiscordEmbed,
  type DiscordInteraction,
} from './types'
import { verifyDiscordRequest } from './verify'
import { getRandomQuiz, getDailyQuiz, getQuizById, type DiscordQuizItem } from './questions'
import {
  getDiscordUserApiKey,
  setDiscordUserApiKey,
  removeDiscordUserApiKey,
  recordDiscordScore,
  getUnifiedUserStats,
  syncDiscordProgressToCratery,
  getCrateryLeaderboard,
  resolveCrateryUserFromApiKey,
} from './db'
import { rankForXp } from '../../../src/lib/ranks'
import { consumeRateLimit } from '../rateLimit'
import { executeDiscordCode } from './cratera'
import { syncDiscordCommands } from './commands'
import { createSupabaseClient, type Env } from '../supabase'

function jsonResponse(data: DiscordInteractionResponse, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

async function updateDiscordDeferredMessage(
  applicationId: string | undefined,
  token: string | undefined,
  payload: {
    content?: string
    embeds?: DiscordEmbed[]
    components?: DiscordActionRow[]
  }
) {
  if (!applicationId || !token) return
  const url = `https://discord.com/api/v10/webhooks/${applicationId}/${token}/messages/@original`
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    console.error('[discord-webhook] Failed to update original message:', res.status, text)
  }
}

function getSupabaseClient(env: Env) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return null
  try {
    return createSupabaseClient(env)
  } catch (err) {
    console.error('[discord] Failed to create Supabase client:', err)
    return null
  }
}

export async function handleDiscordInteraction(
  request: Request,
  env: Env,
  _ctx?: ExecutionContext
): Promise<Response> {
  const publicKey = env.DISCORD_PUBLIC_KEY
  if (!publicKey) {
    return new Response('DISCORD_PUBLIC_KEY not configured', { status: 500 })
  }

  const signature = request.headers.get('X-Signature-Ed25519')
  const timestamp = request.headers.get('X-Signature-Timestamp')
  const rawBody = await request.text()

  const isValid = await verifyDiscordRequest(rawBody, signature, timestamp, publicKey)
  if (!isValid) {
    return new Response('Invalid request signature', { status: 401 })
  }

  let body: DiscordInteraction
  try {
    const parsed: unknown = JSON.parse(rawBody)
    if (!parsed || typeof parsed !== 'object' || !('type' in parsed)) {
      return new Response('Bad request', { status: 400 })
    }
    body = parsed as DiscordInteraction
  } catch {
    return new Response('Bad request', { status: 400 })
  }

  
  if (body.type === InteractionType.PING) {
    if (env.DISCORD_TOKEN && env.DISCORD_CLIENT_ID && _ctx?.waitUntil) {
      _ctx.waitUntil(syncDiscordCommands(env.DISCORD_TOKEN, env.DISCORD_CLIENT_ID))
    }
    return jsonResponse({ type: InteractionResponseType.PONG })
  }

  try {
    const supabase = getSupabaseClient(env)
    const user = body.member?.user || body.user
    const userId = user?.id || 'unknown'
    const username = user?.global_name || user?.username || 'Rustacean'

    
    if (body.type === InteractionType.APPLICATION_COMMAND) {
      const cmdName = body.data?.name
      const options = body.data?.options || []
      const getOpt = (name: string): string | undefined => {
        const v = options.find((o) => o.name === name)?.value
        return typeof v === 'string' ? v : undefined
      }

      
      if (body.data?.type === 3 && (cmdName === 'Run in Cratera' || body.data?.name === 'Run in Cratera')) {
        const targetId = body.data?.target_id
        const targetMsg = targetId ? body.data?.resolved?.messages?.[targetId] : undefined
        const rawContent = targetMsg?.content || ''
        const codeMatch = rawContent.match(/```(?:rust|rs)?\s*([\s\S]*?)```/i)
        const code = (codeMatch && codeMatch[1]?.trim()) ? codeMatch[1].trim() : rawContent.trim()

        if (!code) {
          return jsonResponse({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: '❌ No Rust code found in that message.',
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          })
        }

        const apiKey = await getDiscordUserApiKey(supabase, userId)
        if (!apiKey) {
          return jsonResponse({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              embeds: [
                {
                  color: 0xef4444,
                  title: '🔑 API Key Required to Execute Code',
                  description:
                    'Running code in isolated microVMs requires a free Cratera API key.\n\n' +
                    '1. Get your free key at **[cratery.cratera.org/developer](https://cratery.cratera.org/developer)**\n' +
                    '2. Type `/key set <your_key>`\n' +
                    '3. Right click any message with Rust code → Apps → **Run in Cratera**!',
                  footer: { text: 'Cratera microVM Engine · cratery.cratera.org' },
                },
              ],
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          })
        }

        const crateryUser = await resolveCrateryUserFromApiKey(supabase, apiKey)
        const dailyLimit = 250
        const burstLimit = 15
        const userBucket = crateryUser?.userId || userId

        const underDaily = await consumeRateLimit(env, `dev:day:${userBucket}`, dailyLimit, 86400)
        const underBurst = await consumeRateLimit(env, `dev:min:${userBucket}`, burstLimit, 60)

        if (!underDaily || !underBurst) {
          return jsonResponse({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              embeds: [
                {
                  color: 0xef4444,
                  title: '⏳ Rate Limit Exceeded',
                  description:
                    'You have reached your execution rate limit (250 runs/day).\n\n' +
                    'Please wait a moment before running more code.',
                  footer: { text: 'Cratera microVM · cratery.cratera.org' },
                },
              ],
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          })
        }

        const appId = body.application_id || env.DISCORD_CLIENT_ID
        const token = body.token

        const runContextExecution = async () => {
          try {
            const startTime = Date.now()
            const result = await executeDiscordCode(env, code)
            const elapsed = Date.now() - startTime

            if (result.error) {
              await updateDiscordDeferredMessage(appId, token, {
                embeds: [
                  {
                    color: 0xef4444,
                    title: '❌ Execution Error',
                    description: result.error,
                    footer: { text: `microVM error · ${elapsed}ms · cratery.cratera.org` },
                  },
                ],
              })
              return
            }

            if (result.compilationError) {
              await updateDiscordDeferredMessage(appId, token, {
                embeds: [
                  {
                    color: 0xef4444,
                    title: '💥 Rust Compiler Error',
                    description: `\`\`\`text\n${result.compilationError.slice(0, 3900)}\n\`\`\``,
                    footer: { text: `rustc compilation failed in ${elapsed}ms · cratery.cratera.org` },
                  },
                ],
              })
              return
            }

            const stdout = result.stdout ? `\`\`\`text\n${result.stdout.slice(0, 1500)}\n\`\`\`` : '*No output*'
            const stderr = result.stderr ? `\n**Stderr**:\n\`\`\`text\n${result.stderr.slice(0, 1500)}\n\`\`\`` : ''

            await updateDiscordDeferredMessage(appId, token, {
              embeds: [
                {
                  color: 0x22c55e,
                  title: '⚡ Cratera microVM Output',
                  description: `**Executed Code**:\n\`\`\`rust\n${code.slice(0, 600)}\n\`\`\`\n**Output**:\n${stdout}${stderr}\n\n⏱️ **Execution**: \`${result.executionTimeMs ?? elapsed}ms\` · 🛡️ Hardware microVM`,
                  footer: { text: `Triggered by ${username} · cratery.cratera.org` },
                },
              ],
            })
          } catch (err: unknown) {
            console.error('[discord-context-run] Execution error:', err)
            await updateDiscordDeferredMessage(appId, token, {
              embeds: [
                {
                  color: 0xef4444,
                  title: '❌ Execution Failed',
                  description:
                    err instanceof Error
                      ? err.message
                      : 'An error occurred while communicating with the judge.',
                  footer: { text: 'Cratera microVM · cratery.cratera.org' },
                },
              ],
            })
          }
        }

        if (_ctx?.waitUntil) {
          _ctx.waitUntil(runContextExecution())
          return jsonResponse({
            type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
          })
        } else {
          await runContextExecution()
          return jsonResponse({
            type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
          })
        }
      }

      
      if (cmdName === 'help') {
        return jsonResponse(formatHelpResponse())
      }

      
      if (cmdName === 'panel') {
        return jsonResponse(formatArcadePanelResponse())
      }

      
      if (cmdName === 'daily') {
        const quiz = getDailyQuiz()
        if (!quiz) {
          return jsonResponse({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: '❌ No daily quiz question available right now.',
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          })
        }
        return jsonResponse(formatDailyQuizResponse(quiz))
      }

      
      if (cmdName === 'race') {
        const category = getOpt('category') || 'all'
        const quiz = getRandomQuiz({
          categorySlug: category === 'all' ? undefined : category,
          kind: 'mcq',
        })

        if (!quiz) {
          return jsonResponse({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: '❌ No quiz found for that category. Try a different topic.',
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          })
        }

        return jsonResponse(formatMcqQuizResponse(quiz, 'race'))
      }

      
      if (cmdName === 'quiz') {
        const mode = (getOpt('mode') || 'race') as 'race' | 'coop'
        const category = getOpt('category') || 'all'

        const quiz = getRandomQuiz({
          categorySlug: category === 'all' ? undefined : category,
          kind: 'mcq',
        })

        if (!quiz) {
          return jsonResponse({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: '❌ No quiz found for those filters. Try a different category.',
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          })
        }

        return jsonResponse(formatMcqQuizResponse(quiz, mode))
      }

      
      if (cmdName === 'forge') {
        const trial = getRandomQuiz({ kind: 'coding' })

        if (!trial) {
          return jsonResponse({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: '❌ No Forge Trials available right now.',
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          })
        }

        return jsonResponse(formatCodingQuizResponse(trial))
      }

      
      if (cmdName === 'run') {
        let code = ((getOpt('code') as string) || '').trim()

        
        if (!code) {
          return jsonResponse({
            type: InteractionResponseType.MODAL,
            data: {
              custom_id: 'run_modal_submit',
              title: '⚡ Cratera Rust Code Editor',
              components: [
                {
                  type: ComponentType.ACTION_ROW,
                  components: [
                    {
                      type: ComponentType.TEXT_INPUT,
                      custom_id: 'code_input',
                      style: TextInputStyle.PARAGRAPH,
                      label: 'Rust Code to Execute',
                      placeholder: 'fn main() {\n    println!("Hello from Cratera microVM!");\n}',
                      required: true,
                    },
                  ],
                },
              ],
            },
          })
        }

        const apiKey = await getDiscordUserApiKey(supabase, userId)

        if (!apiKey) {
          return jsonResponse({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              embeds: [
                {
                  color: 0xef4444,
                  title: '🔑 API Key Required to Execute Code',
                  description:
                    'Running code in isolated microVMs requires a free Cratera API key.\n\n' +
                    '1. Get your free key at **[cratery.cratera.org/developer](https://cratery.cratera.org/developer)** (250 free runs/day)\n' +
                    '2. Type `/key set <your_key>` in this server or DM\n' +
                    '3. Execute Rust code instantly with `/run`!',
                  footer: { text: 'Cratera microVM Execution Engine · cratery.cratera.org' },
                },
              ],
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          })
        }

        const crateryUser = await resolveCrateryUserFromApiKey(supabase, apiKey)
        const dailyLimit = 250
        const burstLimit = 15
        const userBucket = crateryUser?.userId || userId

        const underDaily = await consumeRateLimit(env, `dev:day:${userBucket}`, dailyLimit, 86400)
        const underBurst = await consumeRateLimit(env, `dev:min:${userBucket}`, burstLimit, 60)

        if (!underDaily || !underBurst) {
          return jsonResponse({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              embeds: [
                {
                  color: 0xef4444,
                  title: '⏳ Rate Limit Exceeded',
                  description:
                    'You have reached your execution rate limit (250 runs/day).\n\n' +
                    'Please wait a moment before running more code.',
                  footer: { text: 'Cratera microVM · cratery.cratera.org' },
                },
              ],
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          })
        }

        if (code.startsWith('```rust')) code = code.slice(7).trim()
        else if (code.startsWith('```')) code = code.slice(3).trim()
        if (code.endsWith('```')) code = code.slice(0, -3).trim()

        const appId = body.application_id || env.DISCORD_CLIENT_ID
        const token = body.token

        const runExecution = async () => {
          try {
            const startTime = Date.now()
            const result = await executeDiscordCode(env, code)
            const elapsed = Date.now() - startTime

            if (result.error) {
              await updateDiscordDeferredMessage(appId, token, {
                embeds: [
                  {
                    color: 0xef4444,
                    title: '❌ Execution Error',
                    description: result.error,
                    footer: { text: `microVM error · ${elapsed}ms · cratery.cratera.org` },
                  },
                ],
              })
              return
            }

            if (result.compilationError) {
              await updateDiscordDeferredMessage(appId, token, {
                embeds: [
                  {
                    color: 0xef4444,
                    title: '💥 Rust Compiler Error',
                    description: `\`\`\`text\n${result.compilationError.slice(0, 3900)}\n\`\`\``,
                    footer: { text: `rustc compilation failed in ${elapsed}ms · cratery.cratera.org` },
                  },
                ],
              })
              return
            }

            const stdout = result.stdout ? `\`\`\`text\n${result.stdout.slice(0, 1500)}\n\`\`\`` : '*No output*'
            const stderr = result.stderr ? `\n**Stderr**:\n\`\`\`text\n${result.stderr.slice(0, 1500)}\n\`\`\`` : ''

            await updateDiscordDeferredMessage(appId, token, {
              embeds: [
                {
                  color: 0x22c55e,
                  title: '⚡ MicroVM Execution Complete',
                  description: `**Output**:\n${stdout}${stderr}\n\n⏱️ **Execution**: \`${result.executionTimeMs ?? elapsed}ms\` · 🛡️ **Isolation**: Hardware microVM`,
                  footer: { text: 'Cratera Engine · cratery.cratera.org' },
                },
              ],
            })
          } catch (err: unknown) {
            console.error('[discord-run] Execution error:', err)
            await updateDiscordDeferredMessage(appId, token, {
              embeds: [
                {
                  color: 0xef4444,
                  title: '❌ Execution Failed',
                  description:
                    err instanceof Error
                      ? err.message
                      : 'An error occurred while communicating with the judge.',
                  footer: { text: 'Cratera microVM · cratery.cratera.org' },
                },
              ],
            })
          }
        }

        if (_ctx?.waitUntil) {
          _ctx.waitUntil(runExecution())
          return jsonResponse({
            type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
          })
        } else {
          await runExecution()
          return jsonResponse({
            type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
          })
        }
      }

    
    if (cmdName === 'key') {
      const sub = options[0]?.name
      const subOpts = options[0]?.options || []

      if (sub === 'set') {
        const rawKey = subOpts.find((o) => o.name === 'api_key')?.value
        const key = (typeof rawKey === 'string' ? rawKey : '').trim()
        if (key.length < 10) {
          return jsonResponse({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: '❌ That API key looks too short. Provide a valid Cratera key from cratery.cratera.org/developer.',
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          })
        }

        const res = await setDiscordUserApiKey(supabase, userId, key)
        if (!res.success) {
          return jsonResponse({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `❌ ${res.error || 'Failed to save API key.'}`,
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          })
        }

        const masked = key.slice(0, 7) + '...' + key.slice(-4)

        return jsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            embeds: [
              {
                color: 0x22c55e,
                title: '🔑 Cratery API Key Linked Successfully!',
                description:
                  `Linked to Cratery web account **@${res.username}**!\n\n` +
                  `• **Private & Isolated**: Only you (<@${userId}>) can run code with this key.\n` +
                  '• **Automatic Progress Sync**: All quiz solves, daily challenges, and Forge Trials on Discord will sync official XP and streaks directly to your Cratery profile!\n' +
                  '• **MicroVM Execution**: Enabled for `/run` and Forge Trials.',
                footer: { text: `Active key: ${masked} · cratery.cratera.org/@${res.username}` },
              },
            ],
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        })
      }

      if (sub === 'status') {
        const key = await getDiscordUserApiKey(supabase, userId)
        if (!key) {
          return jsonResponse({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              embeds: [
                {
                  color: 0xef4444,
                  title: '🔑 No API Key Set',
                  description:
                    'You don\'t have a Cratera API key configured yet.\n\n' +
                    'Get a free key at **[cratery.cratera.org/developer](https://cratery.cratera.org/developer)** and run `/key set <key>`.',
                  footer: { text: 'Cratery Developer Platform · cratery.cratera.org' },
                },
              ],
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          })
        }

        const masked = key.slice(0, 7) + '...' + key.slice(-4)
        return jsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            embeds: [
              {
                color: 0x22c55e,
                title: '🔑 API Key Configured & Active',
                description: `Active key: \`${masked}\`\n• Only accessible by your Discord account (<@${userId}>)\n• Ready to execute code and solve Forge Trials!`,
                footer: { text: 'Cratery Developer Platform · cratery.cratera.org' },
              },
            ],
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        })
      }

      if (sub === 'remove') {
        await removeDiscordUserApiKey(supabase, userId)
        return jsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: '🗑️ Your Cratera API key has been unlinked.',
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        })
      }
    }

    
    if (cmdName === 'leaderboard') {
      const entries = await getCrateryLeaderboard(supabase, 10)
      if (entries.length === 0) {
        return jsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: '🌱 No scores recorded yet on Cratery. Practice at **[cratery.cratera.org](https://cratery.cratera.org)** to join the leaderboard!',
          },
        })
      }

      const medals = ['🥇', '🥈', '🥉']
      const lines = entries.map((u, i) => {
        const medal = medals[i] || `\`#${i + 1}\``
        const rank = rankForXp(u.total_xp).name
        return `${medal} [**@${u.username}**](https://cratery.cratera.org/${u.username}) — **${u.total_xp} Official XP** (${rank}) · 📝 ${u.correct_count ?? 0} Solved`
      })

      return jsonResponse({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [
            {
              color: 0xf59e0b,
              title: '🏆 Official Cratery Global Leaderboard',
              description:
                'Top Rustaceans on **[cratery.cratera.org/leaderboard](https://cratery.cratera.org/leaderboard)**:\n\n' +
                lines.join('\n\n') +
                '\n\n*Tip: Link your Cratery account with `/key set <key>` to sync your Discord solves and climb the global ranks!*',
              footer: { text: 'Cratery Rust Platform · cratery.cratera.org' },
            },
          ],
        },
      })
    }

    
    if (cmdName === 'stats') {
      const targetUser = options[0]?.user || user
      const unified = await getUnifiedUserStats(supabase, targetUser?.id || userId)

      if (!unified.discordStats && !unified.crateryUser) {
        return jsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content:
              (targetUser?.id || userId) === userId
                ? "You haven't solved any quizzes yet. Use `/race`, `/quiz`, or `/daily` to earn XP!\n\n*Tip: Link your Cratery account with `/key set <key>` to sync stats across web and Discord.*"
                : `${targetUser?.username || 'That user'} hasn't participated in any quizzes yet.`,
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        })
      }

      const discordXp = unified.discordStats?.xp ?? 0
      const discordLevel = Math.floor(Math.sqrt(discordXp / 10)) + 1
      const fields: Array<{ name: string; value: string; inline?: boolean }> = []

      if (unified.crateryUser) {
        const u = unified.crateryUser
        fields.push({
          name: '🌐 Official Cratery Web Account',
          value: `[**@${u.username}**](https://cratery.cratera.org/${u.username}) · Rank: **${u.rank}**\n**${u.totalXp} Official XP** · **${u.solvedCount}** Quests Solved`,
          inline: false,
        })
      }

      fields.push(
        { name: '✨ Discord XP', value: `**${discordXp} XP** (Lvl ${discordLevel})`, inline: true },
        { name: '🏎️ Race Wins', value: `**${unified.discordStats?.race_wins ?? 0}**`, inline: true },
        { name: '📝 MCQ Solves', value: `**${unified.discordStats?.mcq_solves ?? 0}**`, inline: true },
        { name: '⌨️ Forge Trials', value: `**${unified.discordStats?.coding_solves ?? 0}**`, inline: true }
      )

      if (!unified.crateryUser && targetUser?.id === userId) {
        fields.push({
          name: '🔗 Link Web Account',
          value: 'Run `/key set <key>` to sync your solves, earn official web XP, and boost your streak on **[cratery.cratera.org](https://cratery.cratera.org)**!',
          inline: false,
        })
      }

      return jsonResponse({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [
            {
              color: 0xd85820,
              title: `📊 Rust Quiz & Cratery Stats for ${targetUser?.username || 'Rustacean'}`,
              fields,
              footer: { text: 'Cratery Rust Platform · cratery.cratera.org' },
            },
          ],
        },
      })
    }
  }

  
  if (body.type === InteractionType.MESSAGE_COMPONENT) {
    const customId = body.data?.custom_id || ''

    
    if (customId === 'quiz_next_race' || customId === 'quiz_next_coop') {
      const mode = customId === 'quiz_next_race' ? 'race' : 'coop'
      const quiz = getRandomQuiz({ kind: 'mcq' })
      if (!quiz) {
        return jsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: { content: '❌ No quizzes found.', flags: InteractionResponseFlags.EPHEMERAL },
        })
      }
      return jsonResponse(formatMcqQuizResponse(quiz, mode))
    }

    
    if (customId === 'panel_race') {
      const quiz = getRandomQuiz({ kind: 'mcq' })
      if (!quiz) return jsonResponse({ type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, data: { content: '❌ No quizzes found.', flags: InteractionResponseFlags.EPHEMERAL } })
      return jsonResponse(formatMcqQuizResponse(quiz, 'race'))
    }

    if (customId === 'panel_coop') {
      const quiz = getRandomQuiz({ kind: 'mcq' })
      if (!quiz) return jsonResponse({ type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, data: { content: '❌ No quizzes found.', flags: InteractionResponseFlags.EPHEMERAL } })
      return jsonResponse(formatMcqQuizResponse(quiz, 'coop'))
    }

    if (customId === 'panel_daily') {
      const daily = getDailyQuiz()
      if (!daily) return jsonResponse({ type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, data: { content: '❌ No daily quiz found.', flags: InteractionResponseFlags.EPHEMERAL } })
      return jsonResponse(formatDailyQuizResponse(daily))
    }

    if (customId === 'panel_forge') {
      const trial = getRandomQuiz({ kind: 'coding' })
      if (!trial) return jsonResponse({ type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, data: { content: '❌ No Forge Trials found.', flags: InteractionResponseFlags.EPHEMERAL } })
      return jsonResponse(formatCodingQuizResponse(trial))
    }

    if (customId === 'panel_stats') {
      const unified = await getUnifiedUserStats(supabase, userId)
      const discordXp = unified.discordStats?.xp ?? 0
      const discordLevel = Math.floor(Math.sqrt(discordXp / 10)) + 1
      const fields: Array<{ name: string; value: string; inline?: boolean }> = []

      if (unified.crateryUser) {
        const u = unified.crateryUser
        fields.push({
          name: '🌐 Official Cratery Web Account',
          value: `[**@${u.username}**](https://cratery.cratera.org/${u.username}) · Rank: **${u.rank}**\n**${u.totalXp} Official XP** · **${u.solvedCount}** Quests Solved`,
          inline: false,
        })
      }

      fields.push(
        { name: '✨ Discord XP', value: `**${discordXp} XP** (Lvl ${discordLevel})`, inline: true },
        { name: '🏎️ Race Wins', value: `**${unified.discordStats?.race_wins ?? 0}**`, inline: true },
        { name: '📝 MCQ Solves', value: `**${unified.discordStats?.mcq_solves ?? 0}**`, inline: true },
        { name: '⌨️ Forge Trials', value: `**${unified.discordStats?.coding_solves ?? 0}**`, inline: true }
      )

      if (!unified.crateryUser) {
        fields.push({
          name: '🔗 Link Web Account',
          value: 'Run `/key set <key>` to sync your solves, earn official web XP, and boost your streak on **[cratery.cratera.org](https://cratery.cratera.org)**!',
          inline: false,
        })
      }

      return jsonResponse({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [
            {
              color: 0xd85820,
              title: `📊 Rust Quiz & Cratery Stats for ${username}`,
              fields,
              footer: { text: 'Cratery Rust Platform · cratery.cratera.org' },
            },
          ],
          flags: InteractionResponseFlags.EPHEMERAL,
        },
      })
    }

    if (customId === 'panel_leaderboard') {
      const entries = await getCrateryLeaderboard(supabase, 10)
      if (entries.length === 0) {
        return jsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: '🌱 No scores recorded yet on Cratery. Practice at **[cratery.cratera.org](https://cratery.cratera.org)** to join the leaderboard!',
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        })
      }
      const medals = ['🥇', '🥈', '🥉']
      const lines = entries.map((u, i) => {
        const medal = medals[i] || `\`#${i + 1}\``
        const rank = rankForXp(u.total_xp).name
        return `${medal} [**@${u.username}**](https://cratery.cratera.org/${u.username}) — **${u.total_xp} Official XP** (${rank}) · 📝 ${u.correct_count ?? 0} Solved`
      })
      return jsonResponse({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [
            {
              color: 0xf59e0b,
              title: '🏆 Official Cratery Global Leaderboard',
              description:
                'Top Rustaceans on **[cratery.cratera.org/leaderboard](https://cratery.cratera.org/leaderboard)**:\n\n' +
                lines.join('\n\n'),
              footer: { text: 'Cratery Rust Platform · cratery.cratera.org' },
            },
          ],
          flags: InteractionResponseFlags.EPHEMERAL,
        },
      })
    }

    if (customId === 'panel_key') {
      const key = await getDiscordUserApiKey(supabase, userId)
      if (!key) {
        return jsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            embeds: [
              {
                color: 0xef4444,
                title: '🔑 No API Key Set',
                description:
                  'You don\'t have a Cratera API key configured yet.\n\n' +
                  'Get a free key at **[cratery.cratera.org/developer](https://cratery.cratera.org/developer)** and run `/key set <key>`.',
                footer: { text: 'Cratery Developer Platform · cratery.cratera.org' },
              },
            ],
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        })
      }
      const masked = key.slice(0, 7) + '...' + key.slice(-4)
      return jsonResponse({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [
            {
              color: 0x22c55e,
              title: '🔑 API Key Configured & Active',
              description: `Active key: \`${masked}\`\n• Only accessible by your Discord account (<@${userId}>)\n• Ready to execute code and solve Forge Trials!`,
              footer: { text: 'Cratery Developer Platform · cratery.cratera.org' },
            },
          ],
          flags: InteractionResponseFlags.EPHEMERAL,
        },
      })
    }

    if (customId === 'panel_help') {
      return jsonResponse(formatHelpResponse())
    }

    
    if (customId.startsWith('quiz_')) {
      if (!(await consumeRateLimit(env, `discord:answer:${userId}`, 30, 60))) {
        return jsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: '⏳ Please slow down! You are submitting answers too quickly.',
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        })
      }

      const parts = customId.split('_')
      const quizId = parts[1]
      const selectedIdx = Number(parts[2])
      const mode = parts[3] as 'race' | 'coop' | 'daily'

      const quiz = getQuizById(quizId)
      if (!quiz) {
        return jsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: { content: '❌ Quiz expired or not found.', flags: InteractionResponseFlags.EPHEMERAL },
        })
      }

      const isCorrect = selectedIdx === quiz.correctIndex
      const optLabel = ['A', 'B', 'C', 'D'][selectedIdx] || `${selectedIdx + 1}`

      if (mode === 'daily') {
        if (isCorrect) {
          await recordDiscordScore(supabase, userId, username, { xp: 20, mcqSolve: true })
          if (_ctx?.waitUntil) {
            _ctx.waitUntil(syncDiscordProgressToCratery(supabase, userId, quiz.id, quiz.categorySlug, true, 20, selectedIdx))
          } else {
            await syncDiscordProgressToCratery(supabase, userId, quiz.id, quiz.categorySlug, true, 20, selectedIdx)
          }

          return jsonResponse({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content:
                `🎉 **Correct! Option ${optLabel} is right.** (+20 Daily XP awarded!)\n\n` +
                `📖 **Explanation**:\n${quiz.explanation}\n\n` +
                '*✨ XP & daily streak progress automatically synced to your linked Cratery web account.*',
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          })
        } else {
          return jsonResponse({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `❌ **Option ${optLabel} is not correct.** Review the question and try again tomorrow!`,
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          })
        }
      }

      if (mode === 'race') {
        if (isCorrect) {
          
          await recordDiscordScore(supabase, userId, username, { xp: 15, mcqSolve: true, raceWin: true })
          if (_ctx?.waitUntil) {
            _ctx.waitUntil(syncDiscordProgressToCratery(supabase, userId, quiz.id, quiz.categorySlug, true, 15, selectedIdx))
          } else {
            await syncDiscordProgressToCratery(supabase, userId, quiz.id, quiz.categorySlug, true, 15, selectedIdx)
          }

          const correctText = quiz.options ? quiz.options[quiz.correctIndex ?? 0]?.text : ''
          const nextRow: DiscordActionRow = {
            type: ComponentType.ACTION_ROW,
            components: [
              {
                type: ComponentType.BUTTON,
                style: ButtonStyle.PRIMARY,
                label: '🏎️ Next Race',
                custom_id: 'quiz_next_race',
              },
              {
                type: ComponentType.BUTTON,
                style: ButtonStyle.SECONDARY,
                label: '📝 Practice Quiz',
                custom_id: 'quiz_next_coop',
              },
              {
                type: ComponentType.BUTTON,
                style: ButtonStyle.SUCCESS,
                label: '📅 Daily Quest',
                custom_id: 'panel_daily',
              },
              {
                type: ComponentType.BUTTON,
                style: ButtonStyle.SECONDARY,
                label: '📊 My Stats',
                custom_id: 'panel_stats',
              },
            ],
          }

          return jsonResponse({
            type: InteractionResponseType.UPDATE_MESSAGE,
            data: {
              embeds: [
                {
                  color: 0x22c55e,
                  title: `🏁 [RACE WON] ${quiz.title}`,
                  description:
                    `🏆 **Winner**: <@${userId}> (${username})! (+15 XP awarded)\n\n` +
                    `✅ **Correct Answer**: **${optLabel}** — ${correctText}\n\n` +
                    `📖 **Explanation**:\n${quiz.explanation}`,
                  footer: { text: 'Cratery Rust Quiz · cratery.cratera.org' },
                },
              ],
              components: [nextRow],
            },
          })
        } else {
          return jsonResponse({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `❌ **Option ${optLabel} is incorrect!** The race is still on!`,
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          })
        }
      }

      
      if (isCorrect) {
        await recordDiscordScore(supabase, userId, username, { xp: 10, mcqSolve: true })
        if (_ctx?.waitUntil) {
          _ctx.waitUntil(syncDiscordProgressToCratery(supabase, userId, quiz.id, quiz.categorySlug, true, 10, selectedIdx))
        } else {
          await syncDiscordProgressToCratery(supabase, userId, quiz.id, quiz.categorySlug, true, 10, selectedIdx)
        }

        return jsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `🎉 **Correct! Option ${optLabel} is right.** (+10 XP)\n\n*Explanation*: ${quiz.explanation}`,
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        })
      } else {
        return jsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `❌ **Option ${optLabel} is not correct.** Keep practicing with \`/quiz\` or \`/race\`!`,
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        })
      }
    }

    
    if (customId.startsWith('forge_submit_')) {
      const trialId = customId.replace('forge_submit_', '')
      const trial = getQuizById(trialId)

      if (!trial) {
        return jsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: { content: '❌ Trial not found.', flags: InteractionResponseFlags.EPHEMERAL },
        })
      }

      if (!(await consumeRateLimit(env, `discord:forge:${userId}`, 10, 60))) {
        return jsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: '⏳ Please slow down! You are opening submissions too quickly.',
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        })
      }

      
      return jsonResponse({
        type: InteractionResponseType.MODAL,
        data: {
          title: `Submit: ${trial.title.slice(0, 35)}`,
          custom_id: `forge_modal_${trial.id}`,
          components: [
            {
              type: ComponentType.ACTION_ROW,
              components: [
                {
                  type: ComponentType.TEXT_INPUT,
                  custom_id: 'code_input',
                  style: TextInputStyle.PARAGRAPH,
                  label: 'Your Rust Solution',
                  value: trial.starterCode || trial.code || '// Write your solution here',
                  required: true,
                },
              ],
            },
          ],
        },
      })
    }
  }

  
  if (body.type === InteractionType.MODAL_SUBMIT) {
    const customId = body.data?.custom_id || ''
    if (customId.startsWith('forge_modal_')) {
      if (!(await consumeRateLimit(env, `discord:forge:${userId}`, 10, 60))) {
        return jsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: '⏳ Please wait a moment before submitting another solution.',
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        })
      }
      const trialId = customId.replace('forge_modal_', '')
      const trial = getQuizById(trialId)

      if (!trial) {
        return jsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: { content: '❌ Trial expired or not found.', flags: InteractionResponseFlags.EPHEMERAL },
        })
      }

      const code = body.data?.components?.[0]?.components?.[0]?.value || ''
      const appId = body.application_id || env.DISCORD_CLIENT_ID
      const token = body.token

      const runGrading = async () => {
        try {
          const startTime = Date.now()
          const result = await executeDiscordCode(env, code, trial.testHarness)
          const elapsed = Date.now() - startTime

          if (result.error) {
            await updateDiscordDeferredMessage(appId, token, {
              embeds: [
                {
                  color: 0xef4444,
                  title: '❌ Judge Error',
                  description: result.error,
                  footer: { text: 'Cratera microVM · cratery.cratera.org' },
                },
              ],
            })
            return
          }

          if (result.compilationError) {
            await updateDiscordDeferredMessage(appId, token, {
              embeds: [
                {
                  color: 0xef4444,
                  title: `💥 Compilation Error · ${trial.title}`,
                  description: `\`\`\`text\n${result.compilationError.slice(0, 3900)}\n\`\`\``,
                  footer: { text: `microVM build failed in ${elapsed}ms · cratery.cratera.org` },
                },
              ],
            })
            return
          }

          if (result.passed) {
            await recordDiscordScore(supabase, userId, username, { xp: 55, codingSolve: true })
            const syncResult = await syncDiscordProgressToCratery(supabase, userId, trial.id, trial.categorySlug, true, 55)

            const syncNote = syncResult.synced
              ? `\n✨ **Cratery Sync**: Recorded on [cratery.cratera.org/@${syncResult.crateryUsername}](https://cratery.cratera.org/${syncResult.crateryUsername}) (Official XP: **${syncResult.totalXp} XP**)`
              : ''

            await updateDiscordDeferredMessage(appId, token, {
              embeds: [
                {
                  color: 0x22c55e,
                  title: `🎉 Accepted! All Tests Passed · ${trial.title}`,
                  description:
                    `**Author**: <@${userId}>\n` +
                    '✨ **Reward**: **+55 XP** (Includes interactive trial bonus)\n' +
                    `⏱️ **Execution**: \`${result.executionTimeMs ?? elapsed}ms\` in hardware microVM${syncNote}\n\n` +
                    `\`\`\`rust\n${code.slice(0, 1500)}\n\`\`\``,
                  footer: { text: 'Cratery Forge Trial Solved · cratery.cratera.org' },
                },
              ],
            })
            return
          }

          const failureMsg = result.stderr || result.stdout || 'One or more test assertions failed.'
          await updateDiscordDeferredMessage(appId, token, {
            embeds: [
              {
                color: 0xef4444,
                title: `✗ Tests Failed · ${trial.title}`,
                description: `\`\`\`text\n${failureMsg.slice(0, 3900)}\n\`\`\``,
                footer: { text: `Executed in ${elapsed}ms · cratery.cratera.org` },
              },
            ],
          })
        } catch (err: unknown) {
          console.error('[discord-modal] Grading error:', err)
          await updateDiscordDeferredMessage(appId, token, {
            embeds: [
              {
                color: 0xef4444,
                title: '❌ Grading Failed',
                description:
                  err instanceof Error ? err.message : 'An error occurred while grading your submission.',
                footer: { text: 'Cratera microVM · cratery.cratera.org' },
              },
            ],
          })
        }
      }

      if (_ctx?.waitUntil) {
        _ctx.waitUntil(runGrading())
        return jsonResponse({
          type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
        })
      } else {
        await runGrading()
        return jsonResponse({
          type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
        })
      }
    }

    if (customId === 'run_modal_submit') {
      let code = body.data?.components?.[0]?.components?.[0]?.value || ''
      const apiKey = await getDiscordUserApiKey(supabase, userId)

      if (!apiKey) {
        return jsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            embeds: [
              {
                color: 0xef4444,
                title: '🔑 API Key Required to Execute Code',
                description:
                  'Running code in isolated microVMs requires a free Cratera API key.\n\n' +
                  '1. Get your free key at **[cratery.cratera.org/developer](https://cratery.cratera.org/developer)**\n' +
                  '2. Type `/key set <your_key>`\n' +
                  '3. Execute Rust code instantly with `/run`!',
                footer: { text: 'Cratera microVM Execution Engine · cratery.cratera.org' },
              },
            ],
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        })
      }

      const crateryUser = await resolveCrateryUserFromApiKey(supabase, apiKey)
      const dailyLimit = 250
      const burstLimit = 15
      const userBucket = crateryUser?.userId || userId

      const underDaily = await consumeRateLimit(env, `dev:day:${userBucket}`, dailyLimit, 86400)
      const underBurst = await consumeRateLimit(env, `dev:min:${userBucket}`, burstLimit, 60)

      if (!underDaily || !underBurst) {
        return jsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            embeds: [
              {
                color: 0xef4444,
                title: '⏳ Rate Limit Exceeded',
                description:
                  'You have reached your execution rate limit (250 runs/day).\n\n' +
                  'Please wait a moment before running more code.',
                footer: { text: 'Cratera microVM · cratery.cratera.org' },
              },
            ],
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        })
      }

      if (code.startsWith('```rust')) code = code.slice(7).trim()
      else if (code.startsWith('```')) code = code.slice(3).trim()
      if (code.endsWith('```')) code = code.slice(0, -3).trim()

      const appId = body.application_id || env.DISCORD_CLIENT_ID
      const token = body.token

      const runExecution = async () => {
        try {
          const startTime = Date.now()
          const result = await executeDiscordCode(env, code)
          const elapsed = Date.now() - startTime

          if (result.error) {
            await updateDiscordDeferredMessage(appId, token, {
              embeds: [
                {
                  color: 0xef4444,
                  title: '❌ Execution Error',
                  description: result.error,
                  footer: { text: `microVM error · ${elapsed}ms · cratery.cratera.org` },
                },
              ],
            })
            return
          }

          if (result.compilationError) {
            await updateDiscordDeferredMessage(appId, token, {
              embeds: [
                {
                  color: 0xef4444,
                  title: '💥 Rust Compiler Error',
                  description: `\`\`\`text\n${result.compilationError.slice(0, 3900)}\n\`\`\``,
                  footer: { text: `rustc compilation failed in ${elapsed}ms · cratery.cratera.org` },
                },
              ],
            })
            return
          }

          const stdout = result.stdout ? `\`\`\`text\n${result.stdout.slice(0, 1500)}\n\`\`\`` : '*No output*'
          const stderr = result.stderr ? `\n**Stderr**:\n\`\`\`text\n${result.stderr.slice(0, 1500)}\n\`\`\`` : ''

          await updateDiscordDeferredMessage(appId, token, {
            embeds: [
              {
                color: 0x22c55e,
                title: '⚡ MicroVM Execution Complete',
                description: `**Author**: <@${userId}>\n\n**Output**:\n${stdout}${stderr}\n\n⏱️ **Execution**: \`${result.executionTimeMs ?? elapsed}ms\` · 🛡️ Hardware microVM`,
                footer: { text: 'Cratera Engine · cratery.cratera.org' },
              },
            ],
          })
        } catch (err: unknown) {
          console.error('[discord-modal-run] Execution error:', err)
          await updateDiscordDeferredMessage(appId, token, {
            embeds: [
              {
                color: 0xef4444,
                title: '❌ Execution Failed',
                description:
                  err instanceof Error
                    ? err.message
                    : 'An error occurred while communicating with the judge.',
                footer: { text: 'Cratera microVM · cratery.cratera.org' },
              },
            ],
          })
        }
      }

      if (_ctx?.waitUntil) {
        _ctx.waitUntil(runExecution())
        return jsonResponse({
          type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
        })
      } else {
        await runExecution()
        return jsonResponse({
          type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
        })
      }
    }
  }

  return jsonResponse({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: { content: 'Unhandled interaction' },
  })
  } catch (err: unknown) {
    console.error('[discord-interaction] Unhandled error:', err)
    return jsonResponse({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: '⚠️ An unexpected error occurred while processing this interaction.',
        flags: InteractionResponseFlags.EPHEMERAL,
      },
    })
  }
}

function formatArcadePanelResponse(): DiscordInteractionResponse {
  const embed: DiscordEmbed = {
    color: 0xd85820,
    title: '🦀 Cratery Rust Arcade & Developer Hub',
    description:
      'Multiplayer Rust trivia sprints, daily streak challenges, and hands-on coding trials evaluated in isolated Firecracker microVMs.\n\n' +
      '**Select an action below to launch instantly:**',
    fields: [
      {
        name: '🎮 Play & Compete',
        value:
          '• **🏎️ Fast Race**: Multiplayer sprint — first correct answer claims the round.\n' +
          '• **📝 Practice Quiz**: Explore deep-dive questions with detailed explanations.\n' +
          '• **📅 Daily Quest**: Complete today\'s challenge to advance your streak.\n' +
          '• **⚒️ Forge Trial**: Implement idiomatic Rust functions judged in microVMs.',
        inline: false,
      },
      {
        name: '📊 Profiles & Rankings',
        value:
          '• **📊 My Stats**: View official Cratery XP, rank tier, and solve count.\n' +
          '• **🏆 Leaderboard**: Global leaderboard rankings and top rustaceans.\n' +
          '• **🔑 API Key**: Link your developer key for private microVM execution.',
        inline: false,
      },
    ],
    footer: { text: 'Cratery Rust Platform · cratery.cratera.org' },
  }

  const row1: DiscordActionRow = {
    type: ComponentType.ACTION_ROW,
    components: [
      {
        type: ComponentType.BUTTON,
        style: ButtonStyle.PRIMARY,
        label: '🏎️ Fast Race',
        custom_id: 'panel_race',
      },
      {
        type: ComponentType.BUTTON,
        style: ButtonStyle.SECONDARY,
        label: '📝 Practice Quiz',
        custom_id: 'panel_coop',
      },
      {
        type: ComponentType.BUTTON,
        style: ButtonStyle.SUCCESS,
        label: '📅 Daily Quest',
        custom_id: 'panel_daily',
      },
      {
        type: ComponentType.BUTTON,
        style: ButtonStyle.PRIMARY,
        label: '⚒️ Forge Trial',
        custom_id: 'panel_forge',
      },
    ],
  }

  const row2: DiscordActionRow = {
    type: ComponentType.ACTION_ROW,
    components: [
      {
        type: ComponentType.BUTTON,
        style: ButtonStyle.SECONDARY,
        label: '📊 My Stats',
        custom_id: 'panel_stats',
      },
      {
        type: ComponentType.BUTTON,
        style: ButtonStyle.SECONDARY,
        label: '🏆 Leaderboard',
        custom_id: 'panel_leaderboard',
      },
      {
        type: ComponentType.BUTTON,
        style: ButtonStyle.SECONDARY,
        label: '🔑 API Key',
        custom_id: 'panel_key',
      },
      {
        type: ComponentType.BUTTON,
        style: ButtonStyle.LINK,
        label: '🌐 Open Cratery',
        url: 'https://cratery.cratera.org',
      },
    ],
  }

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      embeds: [embed],
      components: [row1, row2],
    },
  }
}

function formatHelpResponse(): DiscordInteractionResponse {
  const embed: DiscordEmbed = {
    color: 0xd85820,
    title: '🦀 Cratery Discord Bot — Commands & Reference',
    description:
      'Test your Rust mastery, compete in multiplayer speed sprints, and execute code inside isolated hardware microVMs.\n\n' +
      '### 🎮 Commands\n' +
      '• **`/panel`** — Open the interactive 1-click Arcade launcher\n' +
      '• **`/race`** — Launch an instant multiplayer race (first correct submission wins)\n' +
      '• **`/quiz`** — Start a quiz round with topic category & competition mode filters\n' +
      '• **`/daily`** — Solve today\'s official Rust Daily Challenge (+20 XP, streak bonus)\n' +
      '• **`/forge`** — Solve an interactive Rust coding challenge judged against test suites\n' +
      '• **`/run`** — Compile & execute Rust snippets in a microVM (or right-click message → Apps → Run in Cratera)\n' +
      '• **`/leaderboard`** — Global Cratery rankings and top rustaceans\n' +
      '• **`/stats`** — View verified XP, rank tier, and solve analytics\n' +
      '• **`/key set <key>`** — Link your developer API key for private microVM execution\n\n' +
      '🌐 **Web App**: [cratery.cratera.org](https://cratery.cratera.org) · **API Keys**: [cratery.cratera.org/developer](https://cratery.cratera.org/developer)',
    footer: { text: 'Cratery Rust Platform · cratery.cratera.org' },
  }

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      embeds: [embed],
    },
  }
}

function formatDailyQuizResponse(quiz: DiscordQuizItem): DiscordInteractionResponse {
  const todayStr = new Date().toISOString().slice(0, 10)
  const embed: DiscordEmbed = {
    color: 0xf59e0b,
    title: `📅 [DAILY CHALLENGE] ${todayStr} — ${quiz.title}`,
    description:
      `**Topic**: ${quiz.categoryName} · **Difficulty**: Level ${quiz.difficulty} · **Reward**: +20 XP\n\n` +
      `### Question\n${quiz.prompt}\n` +
      (quiz.code ? `\n\`\`\`rust\n${quiz.code}\n\`\`\`\n` : '\n') +
      'Select the correct option below to submit your answer and build your streak:',
    footer: { text: 'Cratery Daily Challenge · One submission per account per day' },
  }

  const buttons = (quiz.options || []).map((opt, idx) => ({
    type: ComponentType.BUTTON as const,
    style: ButtonStyle.SECONDARY,
    label: `${opt.label}: ${opt.text.slice(0, 70)}`,
    custom_id: `quiz_${quiz.id}_${idx}_daily_0`,
  }))

  const rows: DiscordActionRow[] = []
  if (buttons.length <= 5) {
    rows.push({ type: ComponentType.ACTION_ROW, components: buttons })
  } else {
    rows.push({ type: ComponentType.ACTION_ROW, components: buttons.slice(0, 5) })
    rows.push({ type: ComponentType.ACTION_ROW, components: buttons.slice(5) })
  }

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      embeds: [embed],
      components: rows,
    },
  }
}

function formatMcqQuizResponse(quiz: DiscordQuizItem, mode: 'race' | 'coop'): DiscordInteractionResponse {
  const isRace = mode === 'race'
  const durationSec = isRace ? 30 : 45
  const expiresAt = Math.floor(Date.now() / 1000) + durationSec

  const embed: DiscordEmbed = {
    color: 0xd85820,
    title: `${isRace ? '🏎️ [RACE] ' : '👥 [PRACTICE] '}${quiz.title}`,
    description:
      `**Category**: ${quiz.categoryName} · **Difficulty**: Level ${quiz.difficulty}\n` +
      `**Rules**: ${isRace ? 'First correct answer wins +15 XP!' : 'Select your answer to check feedback (+10 XP)!'}\n` +
      `⏰ **Timeout**: <t:${expiresAt}:R>\n\n` +
      `${quiz.prompt}` +
      (quiz.code ? `\n\n\`\`\`rust\n${quiz.code}\n\`\`\`` : ''),
    footer: { text: 'Cratery Quiz · cratery.cratera.org' },
  }

  const buttons = (quiz.options || []).map((opt, idx) => ({
    type: ComponentType.BUTTON as const,
    style: ButtonStyle.SECONDARY,
    label: `${opt.label}: ${opt.text.slice(0, 70)}`,
    custom_id: `quiz_${quiz.id}_${idx}_${mode}_${expiresAt}`,
  }))

  const rows: DiscordActionRow[] = []
  if (buttons.length <= 5) {
    rows.push({ type: ComponentType.ACTION_ROW, components: buttons })
  } else {
    rows.push({ type: ComponentType.ACTION_ROW, components: buttons.slice(0, 5) })
    rows.push({ type: ComponentType.ACTION_ROW, components: buttons.slice(5) })
  }

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      embeds: [embed],
      components: rows,
    },
  }
}

function formatCodingQuizResponse(trial: DiscordQuizItem): DiscordInteractionResponse {
  const embed: DiscordEmbed = {
    color: 0x38bdf8,
    title: `⚒️ [FORGE TRIAL] ${trial.title}`,
    description:
      `**Category**: ${trial.categoryName} · **Difficulty**: Level ${trial.difficulty}\n\n` +
      `### Specification\n${trial.prompt}\n\n` +
      `### Starter Template\n\`\`\`rust\n${trial.starterCode || trial.code || '// Write solution'}\n\`\`\`\n` +
      'Click **Submit Solution** to evaluate against automated test suites in Firecracker microVMs.',
    footer: { text: 'Cratery Forge Trial · Automatic progress sync to cratery.cratera.org' },
  }

  const webUrl =
    trial.categorySlug === 'interactive'
      ? `https://cratery.cratera.org/contest/${trial.id}`
      : `https://cratery.cratera.org/category/${trial.categorySlug}/question/${trial.id}`

  const row: DiscordActionRow = {
    type: ComponentType.ACTION_ROW,
    components: [
      {
        type: ComponentType.BUTTON,
        style: ButtonStyle.PRIMARY,
        label: '⌨️ Submit Solution',
        custom_id: `forge_submit_${trial.id}`,
      },
      {
        type: ComponentType.BUTTON,
        style: ButtonStyle.LINK,
        label: '🌐 Open on Web',
        url: webUrl,
      },
    ],
  }

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      embeds: [embed],
      components: [row],
    },
  }
}

export async function handleDiscordSync(request: Request, env: Env): Promise<Response> {
  const token = env.DISCORD_TOKEN
  const clientId = env.DISCORD_CLIENT_ID

  if (!token || !clientId) {
    return new Response(
      JSON.stringify({
        error: 'DISCORD_TOKEN and DISCORD_CLIENT_ID must be set in Cloudflare Worker secrets',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const result = await syncDiscordCommands(token, clientId)
  return new Response(JSON.stringify(result), {
    status: result.ok ? 200 : 500,
    headers: { 'Content-Type': 'application/json' },
  })
}
