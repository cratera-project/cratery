import { createSupabaseClient, type Env } from './supabase'


export function trackCodeExecution(
    env: Env,
    ctx?: ExecutionContext,
    count = 1
): void {
    const task = (async () => {
        try {
            if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return
            const supabase = createSupabaseClient(env)
            await supabase.rpc('increment_code_executions', {
                p_count: Math.max(1, count),
            })
        } catch (err) {
            
            console.error('trackCodeExecution failed:', err)
        }
    })()

    if (ctx && typeof ctx.waitUntil === 'function') {
        ctx.waitUntil(task)
    } else {
        void task
    }
}
