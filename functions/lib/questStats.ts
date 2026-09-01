import { createSupabaseClient } from './supabase'

type Supabase = ReturnType<typeof createSupabaseClient>

export async function incrementQuestAnswerStats(
    supabase: Supabase,
    questionId: string,
    isCorrect: boolean
): Promise<void> {
    const id = questionId.trim()
    if (!id) return

    const { error: rpcError } = await supabase.rpc('increment_quest_answer_stats', {
        p_question_id: id,
        p_is_correct: isCorrect,
    })
    if (!rpcError) return

    if (rpcError.code === 'PGRST202') {
        console.warn(
            'increment_quest_answer_stats missing — apply supabase/schema.sql quest_answer_stats section'
        )
    } else {
        console.error('increment_quest_answer_stats RPC failed:', rpcError)
    }

    const { data: row, error: selError } = await supabase
        .from('quest_answer_stats')
        .select('solve_count, correct_count')
        .eq('question_id', id)
        .maybeSingle()

    if (selError) {
        console.error('quest stats fallback read failed:', selError)
        return
    }

    if (row) {
        const { error: updError } = await supabase
            .from('quest_answer_stats')
            .update({
                solve_count: Number(row.solve_count) + 1,
                correct_count: Number(row.correct_count) + (isCorrect ? 1 : 0),
                updated_at: new Date().toISOString(),
            })
            .eq('question_id', id)
        if (updError) console.error('quest stats fallback update failed:', updError)
        return
    }

    const { error: insError } = await supabase.from('quest_answer_stats').insert({
        question_id: id,
        solve_count: 1,
        correct_count: isCorrect ? 1 : 0,
    })
    if (insError) console.error('quest stats fallback insert failed:', insError)
}
