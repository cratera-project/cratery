import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDailyQuestion, getDailyQuestionHref } from '../lib/daily'
import { SEO } from '../components/SEO'

export function DailyPage() {
  const navigate = useNavigate()
  const daily = getDailyQuestion()

  useEffect(() => {
    if (daily) {
      navigate(getDailyQuestionHref(), { replace: true })
    } else {
      navigate('/quests', { replace: true })
    }
  }, [daily, navigate])

  return (
    <div className="py-16 text-center">
      <SEO
        title="Today's Rust Daily — Cratery"
        description="Solve today's featured Rust quest, earn +20 XP, and keep your daily streak alive."
      />
      <div className="font-pixel text-sm uppercase text-rust-orange">Loading Today's Daily…</div>
    </div>
  )
}
