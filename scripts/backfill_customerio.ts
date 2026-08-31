/**
 * Backfill verified users to Customer.io with full progress/rank traits.
 *
 *   export $(grep -E '^(SUPABASE_URL|SUPABASE_SERVICE_ROLE_KEY|CUSTOMERIO_WRITE_KEY|APP_URL)=' .dev.vars | xargs)
 *   npm run backfill:customerio
 */

import { createClient } from '@supabase/supabase-js'
import { buildCustomerioTraits } from '../functions/lib/customerio-sync'
import { identifyUser } from '../functions/lib/customerio'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const CUSTOMERIO_WRITE_KEY = process.env.CUSTOMERIO_WRITE_KEY
const APP_URL = process.env.APP_URL ?? 'https://cratery.cratera.org'

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !CUSTOMERIO_WRITE_KEY) {
  console.error('Missing: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, CUSTOMERIO_WRITE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
const env = { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, CUSTOMERIO_WRITE_KEY, APP_URL } as const

async function main() {
  let offset = 0
  const PAGE = 100
  let total = 0
  let errors = 0

  console.log('Customer.io backfill (full traits)...')

  while (true) {
    const { data: users, error } = await supabase
      .from('custom_users')
      .select('id, email, username, display_name, created_at, last_login, newsletter_opt_in')
      .eq('email_verified', true)
      .eq('newsletter_opt_in', true)
      .order('created_at', { ascending: true })
      .range(offset, offset + PAGE - 1)

    if (error) {
      console.error('Supabase error:', error.message)
      process.exit(1)
    }
    if (!users?.length) break

    for (const user of users) {
      try {
        const traits = await buildCustomerioTraits(env, supabase, user)
        await identifyUser(CUSTOMERIO_WRITE_KEY, user.id, traits)
        total++
        if (total % 25 === 0) console.log(`  synced ${total}...`)
      } catch (err) {
        errors++
        console.error(`  failed ${user.email}:`, err instanceof Error ? err.message : err)
      }
    }

    if (users.length < PAGE) break
    offset += PAGE
  }

  console.log(`Done. Synced: ${total}, errors: ${errors}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
