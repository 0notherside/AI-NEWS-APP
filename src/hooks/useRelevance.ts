import { useEffect, useMemo, useState } from 'react'
import type { FeedArticle } from '../data/feed'

const STORAGE_KEY = 'ai-pulse-relevance'
const RESET_META_KEY = 'ai-pulse-relevance-last-reset'
const WEEKLY_CHECK_MS = 60 * 1000

type RelevanceMap = Record<string, number>

function readStored(): RelevanceMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return {}
    const out: RelevanceMap = {}
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof v === 'number' && Number.isFinite(v) && v >= 0) {
        out[k] = Math.floor(v)
      }
    }
    return out
  } catch {
    return {}
  }
}

function readLastResetAt(): number {
  try {
    const raw = localStorage.getItem(RESET_META_KEY)
    if (!raw) return 0
    const n = Number(raw)
    return Number.isFinite(n) && n > 0 ? n : 0
  } catch {
    return 0
  }
}

/** Most recent Sunday 23:59 local time before/at `now`. */
function latestWeeklyBoundary(now = new Date()): number {
  const boundary = new Date(now)
  boundary.setDate(now.getDate() - now.getDay())
  boundary.setHours(23, 59, 0, 0)
  if (now.getTime() < boundary.getTime()) {
    boundary.setDate(boundary.getDate() - 7)
  }
  return boundary.getTime()
}

export function useRelevance(feed: FeedArticle[]) {
  const [relevanceById, setRelevanceById] = useState<RelevanceMap>(readStored)
  const [lastResetAt, setLastResetAt] = useState<number>(readLastResetAt)

  useEffect(() => {
    if (feed.length === 0) return
    setRelevanceById((prev) => {
      const next = { ...prev }
      for (const article of feed) {
        if (typeof next[article.id] !== 'number') {
          next[article.id] = article.relevanceCount ?? 0
        }
      }
      return next
    })
  }, [feed])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(relevanceById))
  }, [relevanceById])

  useEffect(() => {
    localStorage.setItem(RESET_META_KEY, String(lastResetAt))
  }, [lastResetAt])

  useEffect(() => {
    const checkAndReset = () => {
      const boundary = latestWeeklyBoundary()
      if (boundary > lastResetAt) {
        setRelevanceById({})
        setLastResetAt(boundary)
      }
    }

    checkAndReset()
    const timer = window.setInterval(checkAndReset, WEEKLY_CHECK_MS)
    window.addEventListener('focus', checkAndReset)
    document.addEventListener('visibilitychange', checkAndReset)

    return () => {
      window.clearInterval(timer)
      window.removeEventListener('focus', checkAndReset)
      document.removeEventListener('visibilitychange', checkAndReset)
    }
  }, [lastResetAt])

  const boostRelevance = (id: string) => {
    setRelevanceById((prev) => ({
      ...prev,
      [id]: (prev[id] ?? 0) + 1,
    }))
  }

  const getRelevance = (id: string) => relevanceById[id] ?? 0

  const topRated = useMemo(() => {
    return feed
      .filter((article) => (relevanceById[article.id] ?? 0) > 0)
      .sort((a, b) => (relevanceById[b.id] ?? 0) - (relevanceById[a.id] ?? 0))
  }, [feed, relevanceById])

  return { relevanceById, getRelevance, boostRelevance, topRated }
}
