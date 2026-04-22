import { useEffect, useMemo, useState } from 'react'
import type { FeedArticle } from '../data/feed'

const STORAGE_KEY = 'ai-pulse-saved-news-v2'

interface SavedNewsItem {
  article: FeedArticle
  savedAt: number
}

function readSavedItems(): SavedNewsItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((item) => {
        if (typeof item !== 'object' || item === null) return null
        const o = item as Record<string, unknown>
        if (
          typeof o.savedAt !== 'number' ||
          !o.article ||
          typeof o.article !== 'object'
        ) {
          return null
        }
        return {
          article: o.article as FeedArticle,
          savedAt: o.savedAt,
        } satisfies SavedNewsItem
      })
      .filter((item): item is SavedNewsItem => Boolean(item))
  } catch {
    return []
  }
}

function isExpired(savedAt: number, retentionDays: number): boolean {
  const retentionMs = retentionDays * 24 * 60 * 60 * 1000
  return Date.now() - savedAt > retentionMs
}

export function useSavedNews(feed: FeedArticle[], retentionDays: number) {
  const [savedItems, setSavedItems] = useState<SavedNewsItem[]>(readSavedItems)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedItems))
  }, [savedItems])

  useEffect(() => {
    // Apply expiration window whenever retention changes.
    setSavedItems((prev) =>
      prev.filter((item) => !isExpired(item.savedAt, retentionDays)),
    )
  }, [retentionDays])

  useEffect(() => {
    // Keep saved article details fresh if the same id appears in the latest feed.
    if (feed.length === 0) return
    const byId = new Map(feed.map((article) => [article.id, article]))
    setSavedItems((prev) =>
      prev.map((item) => {
        const live = byId.get(item.article.id)
        return live ? { ...item, article: live } : item
      }),
    )
  }, [feed])

  const savedIds = useMemo(
    () => savedItems.map((item) => item.article.id),
    [savedItems],
  )
  const savedSet = useMemo(() => new Set(savedIds), [savedIds])

  const savedArticles = useMemo(
    () => savedItems.map((item) => item.article),
    [savedItems],
  )

  const isSaved = (id: string) => savedSet.has(id)

  const toggleSaved = (article: FeedArticle) => {
    setSavedItems((prev) =>
      prev.some((item) => item.article.id === article.id)
        ? prev.filter((item) => item.article.id !== article.id)
        : [{ article, savedAt: Date.now() }, ...prev],
    )
  }

  return { savedIds, savedArticles, isSaved, toggleSaved }
}
