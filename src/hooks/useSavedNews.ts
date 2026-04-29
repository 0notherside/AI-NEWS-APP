import { useEffect, useMemo, useState } from 'react'
import type { FeedArticle } from '../data/feed'

const STORAGE_KEY = 'ai-pulse-saved-news-v2'

interface SavedNewsItem {
  article: FeedArticle
  savedAt: number
}

function normalizeSavedItems(
  items: SavedNewsItem[],
  retentionDays: number,
  liveById: Map<string, FeedArticle>,
): SavedNewsItem[] {
  return items
    .filter((item) => !isExpired(item.savedAt, retentionDays))
    .map((item) => {
      const live = liveById.get(item.article.id)
      return live ? { ...item, article: live } : item
    })
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
  const liveById = useMemo(
    () => new Map(feed.map((article) => [article.id, article])),
    [feed],
  )
  const normalizedSavedItems = useMemo(
    () => normalizeSavedItems(savedItems, retentionDays, liveById),
    [liveById, retentionDays, savedItems],
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedSavedItems))
  }, [normalizedSavedItems])

  const savedIds = useMemo(
    () => normalizedSavedItems.map((item) => item.article.id),
    [normalizedSavedItems],
  )
  const savedSet = useMemo(() => new Set(savedIds), [savedIds])

  const savedArticles = useMemo(
    () => normalizedSavedItems.map((item) => item.article),
    [normalizedSavedItems],
  )

  const isSaved = (id: string) => savedSet.has(id)

  const toggleSaved = (article: FeedArticle) => {
    setSavedItems((prev) =>
      normalizeSavedItems(prev, retentionDays, liveById).some(
        (item) => item.article.id === article.id,
      )
        ? prev.filter((item) => item.article.id !== article.id)
        : [{ article, savedAt: Date.now() }, ...prev],
    )
  }

  return { savedIds, savedArticles, isSaved, toggleSaved }
}
