import { useEffect, useMemo, useState } from 'react'
import type { FeedArticle } from '../data/feed'

const STORAGE_KEY = 'ai-pulse-saved-news-ids'

function readSavedIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((v): v is string => typeof v === 'string')
  } catch {
    return []
  }
}

export function useSavedNews(feed: FeedArticle[]) {
  const [savedIds, setSavedIds] = useState<string[]>(readSavedIds)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds))
  }, [savedIds])

  const savedSet = useMemo(() => new Set(savedIds), [savedIds])

  const savedArticles = useMemo(
    () => feed.filter((article) => savedSet.has(article.id)),
    [feed, savedSet],
  )

  const isSaved = (id: string) => savedSet.has(id)

  const toggleSaved = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev],
    )
  }

  return { savedIds, savedArticles, isSaved, toggleSaved }
}
