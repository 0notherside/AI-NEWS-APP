import { useEffect, useState } from 'react'

const STORAGE_KEY = 'ai-pulse-article-last-opened'

export type LastOpenedMap = Record<string, number>

function load(): LastOpenedMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return {}
    const out: LastOpenedMap = {}
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof v === 'number' && Number.isFinite(v) && v > 0) {
        out[k] = v
      }
    }
    return out
  } catch {
    return {}
  }
}

export function useArticleOpens() {
  const [lastOpenedById, setLastOpenedById] = useState<LastOpenedMap>(load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lastOpenedById))
  }, [lastOpenedById])

  const markOpened = (articleId: string) => {
    setLastOpenedById((prev) => ({ ...prev, [articleId]: Date.now() }))
  }

  return { lastOpenedById, markOpened }
}
