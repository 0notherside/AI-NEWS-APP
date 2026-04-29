import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { FeedArticle } from '../data/feed'

const SCORES_KEY    = 'ai-pulse-relevance'
const REACTIONS_KEY = 'ai-pulse-user-reactions'
const BUDGET_KEY    = 'ai-pulse-daily-budget'
const DAILY_LIMIT   = 5

type ScoreMap    = Record<string, number>
type BudgetStore = { remaining: number; date: string }

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

function readScores(): ScoreMap {
  try {
    const raw = localStorage.getItem(SCORES_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, unknown>
    const out: ScoreMap = {}
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v === 'number' && Number.isFinite(v) && v >= 0) out[k] = Math.floor(v)
    }
    return out
  } catch { return {} }
}

function readReactions(): Set<string> {
  try {
    const arr = JSON.parse(localStorage.getItem(REACTIONS_KEY) ?? '[]')
    if (Array.isArray(arr)) return new Set(arr as string[])
  } catch {
    return new Set()
  }
  return new Set()
}

function readBudget(): BudgetStore {
  try {
    const parsed = JSON.parse(localStorage.getItem(BUDGET_KEY) ?? '') as BudgetStore
    if (parsed.date === todayISO()) return parsed
  } catch {
    return { remaining: DAILY_LIMIT, date: todayISO() }
  }
  return { remaining: DAILY_LIMIT, date: todayISO() }
}

export function useRelevance(feed: FeedArticle[]) {
  const [scores,    setScores]    = useState<ScoreMap>(readScores)
  const [reactions, setReactions] = useState<Set<string>>(readReactions)
  const [budget,    setBudget]    = useState<BudgetStore>(readBudget)

  // Refs so callbacks always read fresh values without stale closures
  const reactionsRef = useRef(reactions)
  const budgetRef    = useRef(budget)
  useEffect(() => { reactionsRef.current = reactions }, [reactions])
  useEffect(() => { budgetRef.current    = budget    }, [budget])

  // Persist
  useEffect(() => { localStorage.setItem(SCORES_KEY,    JSON.stringify(scores))          }, [scores])
  useEffect(() => { localStorage.setItem(REACTIONS_KEY, JSON.stringify([...reactions]))  }, [reactions])
  useEffect(() => { localStorage.setItem(BUDGET_KEY,    JSON.stringify(budget))          }, [budget])

  // Daily reset on tab focus / visibility
  useEffect(() => {
    const reset = () => {
      const today = todayISO()
      setBudget((prev) =>
        prev.date !== today ? { remaining: DAILY_LIMIT, date: today } : prev
      )
    }
    document.addEventListener('visibilitychange', reset)
    window.addEventListener('focus', reset)
    return () => {
      document.removeEventListener('visibilitychange', reset)
      window.removeEventListener('focus', reset)
    }
  }, [])

  /**
   * Toggle a reaction on an article:
   * - First press: costs 1 daily reaction (max 5/day), score +1
   * - Second press: refunds 1 daily reaction, score -1
   */
  const boostRelevance = useCallback((id: string) => {
    const today         = todayISO()
    const prevReactions = reactionsRef.current
    const prevBudget    = budgetRef.current
    const currentBudget = prevBudget.date === today
      ? prevBudget
      : { remaining: DAILY_LIMIT, date: today }

    const alreadyReacted = prevReactions.has(id)

    if (alreadyReacted) {
      // Un-react: refund budget, decrement score
      const next = new Set(prevReactions)
      next.delete(id)
      setReactions(next)
      setScores((s) => ({ ...s, [id]: Math.max(0, (s[id] ?? 1) - 1) }))
      setBudget({ remaining: Math.min(DAILY_LIMIT, currentBudget.remaining + 1), date: today })
    } else if (currentBudget.remaining > 0) {
      // React: spend 1 from budget, increment score
      const next = new Set(prevReactions)
      next.add(id)
      setReactions(next)
      setScores((s) => ({ ...s, [id]: (s[id] ?? 0) + 1 }))
      setBudget({ remaining: currentBudget.remaining - 1, date: today })
    }
    // else: budget exhausted — do nothing
  }, [])

  const getRelevance = useCallback((id: string) => scores[id] ?? 0, [scores])
  const hasReacted   = useCallback((id: string) => reactions.has(id), [reactions])

  const topRated = useMemo(() =>
    feed
      .filter((a) => (scores[a.id] ?? 0) > 0)
      .sort((a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0)),
    [feed, scores]
  )

  return {
    relevanceById: scores,
    getRelevance,
    hasReacted,
    boostRelevance,
    topRated,
    reactionsRemaining: budget.remaining,
  }
}
