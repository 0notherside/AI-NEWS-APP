import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FeedArticle } from '../data/feed'

const STORAGE_KEY = 'ai-pulse-saved-boards-v1'
const LEGACY_STORAGE_KEY = 'ai-pulse-saved-news-v2'
const DEFAULT_BOARD_NAME = 'Read Later'

export interface SavedBoard {
  id: string
  name: string
  createdAt: number
  updatedAt: number
}

interface SavedBoardItem {
  boardId: string
  article: FeedArticle
  savedAt: number
}

interface SavedBoardsStore {
  boards: SavedBoard[]
  items: SavedBoardItem[]
}

export interface SavedBoardView extends SavedBoard {
  articles: FeedArticle[]
  savedCount: number
}

function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `board-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function createDefaultBoard(now = Date.now()): SavedBoard {
  return {
    id: 'read-later',
    name: DEFAULT_BOARD_NAME,
    createdAt: now,
    updatedAt: now,
  }
}

function isExpired(savedAt: number, retentionDays: number): boolean {
  const retentionMs = retentionDays * 24 * 60 * 60 * 1000
  return Date.now() - savedAt > retentionMs
}

function readLegacyStore(): SavedBoardsStore | null {
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return null

    const board = createDefaultBoard()
    const items = parsed
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
          boardId: board.id,
          article: o.article as FeedArticle,
          savedAt: o.savedAt,
        } satisfies SavedBoardItem
      })
      .filter((item): item is SavedBoardItem => Boolean(item))

    return { boards: [board], items }
  } catch {
    return null
  }
}

function readStore(): SavedBoardsStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return readLegacyStore() ?? { boards: [createDefaultBoard()], items: [] }
    const parsed = JSON.parse(raw) as unknown
    if (typeof parsed !== 'object' || parsed === null) {
      return { boards: [createDefaultBoard()], items: [] }
    }

    const o = parsed as Record<string, unknown>
    const boards = Array.isArray(o.boards)
      ? o.boards
          .map((board) => {
            if (typeof board !== 'object' || board === null) return null
            const b = board as Record<string, unknown>
            if (typeof b.id !== 'string' || typeof b.name !== 'string') return null
            return {
              id: b.id,
              name: b.name.trim() || DEFAULT_BOARD_NAME,
              createdAt: typeof b.createdAt === 'number' ? b.createdAt : Date.now(),
              updatedAt: typeof b.updatedAt === 'number' ? b.updatedAt : Date.now(),
            } satisfies SavedBoard
          })
          .filter((board): board is SavedBoard => Boolean(board))
      : []

    const boardIds = new Set(boards.map((board) => board.id))
    const items = Array.isArray(o.items)
      ? o.items
          .map((item) => {
            if (typeof item !== 'object' || item === null) return null
            const i = item as Record<string, unknown>
            if (
              typeof i.boardId !== 'string' ||
              typeof i.savedAt !== 'number' ||
              !i.article ||
              typeof i.article !== 'object' ||
              !boardIds.has(i.boardId)
            ) {
              return null
            }
            return {
              boardId: i.boardId,
              article: i.article as FeedArticle,
              savedAt: i.savedAt,
            } satisfies SavedBoardItem
          })
          .filter((item): item is SavedBoardItem => Boolean(item))
      : []

    return { boards: boards.length ? boards : [createDefaultBoard()], items }
  } catch {
    return { boards: [createDefaultBoard()], items: [] }
  }
}

function normalizeStore(
  store: SavedBoardsStore,
  retentionDays: number,
  liveById: Map<string, FeedArticle>,
): SavedBoardsStore {
  const boards = store.boards.length ? store.boards : [createDefaultBoard()]
  const boardIds = new Set(boards.map((board) => board.id))
  const seen = new Set<string>()
  const items = store.items
    .filter((item) => boardIds.has(item.boardId))
    .filter((item) => !isExpired(item.savedAt, retentionDays))
    .map((item) => {
      const live = liveById.get(item.article.id)
      return live ? { ...item, article: live } : item
    })
    .filter((item) => {
      const key = `${item.boardId}:${item.article.id}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

  return { boards, items }
}

export function useSavedNews(feed: FeedArticle[], retentionDays: number) {
  const [store, setStore] = useState<SavedBoardsStore>(readStore)
  const liveById = useMemo(
    () => new Map(feed.map((article) => [article.id, article])),
    [feed],
  )
  const normalizedStore = useMemo(
    () => normalizeStore(store, retentionDays, liveById),
    [liveById, retentionDays, store],
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedStore))
  }, [normalizedStore])

  const savedArticles = useMemo(() => {
    const byId = new Map<string, FeedArticle>()
    for (const item of normalizedStore.items) byId.set(item.article.id, item.article)
    return [...byId.values()]
  }, [normalizedStore.items])

  const savedIds = useMemo(
    () => savedArticles.map((article) => article.id),
    [savedArticles],
  )
  const savedSet = useMemo(() => new Set(savedIds), [savedIds])

  const boards = useMemo<SavedBoardView[]>(
    () =>
      normalizedStore.boards.map((board) => {
        const articles = normalizedStore.items
          .filter((item) => item.boardId === board.id)
          .sort((a, b) => b.savedAt - a.savedAt)
          .map((item) => item.article)
        return { ...board, articles, savedCount: articles.length }
      }),
    [normalizedStore.boards, normalizedStore.items],
  )

  const isSaved = useCallback((id: string) => savedSet.has(id), [savedSet])

  const isSavedToBoard = useCallback(
    (articleId: string, boardId: string) =>
      normalizedStore.items.some(
        (item) => item.article.id === articleId && item.boardId === boardId,
      ),
    [normalizedStore.items],
  )

  const saveToBoard = useCallback((article: FeedArticle, boardId: string) => {
    setStore((prev) => {
      const current = normalizeStore(prev, retentionDays, liveById)
      if (!current.boards.some((board) => board.id === boardId)) return current
      const now = Date.now()
      const exists = current.items.some(
        (item) => item.boardId === boardId && item.article.id === article.id,
      )
      const items = exists
        ? current.items.map((item) =>
            item.boardId === boardId && item.article.id === article.id
              ? { ...item, article, savedAt: now }
              : item,
          )
        : [{ boardId, article, savedAt: now }, ...current.items]
      const boards = current.boards.map((board) =>
        board.id === boardId ? { ...board, updatedAt: now } : board,
      )
      return { boards, items }
    })
  }, [liveById, retentionDays])

  const removeFromAll = useCallback((articleId: string) => {
    setStore((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.article.id !== articleId),
    }))
  }, [])

  const removeFromBoard = useCallback((articleId: string, boardId: string) => {
    setStore((prev) => ({
      ...prev,
      items: prev.items.filter(
        (item) => item.article.id !== articleId || item.boardId !== boardId,
      ),
    }))
  }, [])

  const createBoard = useCallback((name: string, article?: FeedArticle) => {
    const trimmed = name.trim()
    const now = Date.now()
    const board: SavedBoard = {
      id: makeId(),
      name: trimmed || 'Untitled board',
      createdAt: now,
      updatedAt: now,
    }
    setStore((prev) => {
      const current = normalizeStore(prev, retentionDays, liveById)
      return {
        boards: [board, ...current.boards],
        items: article
          ? [{ boardId: board.id, article, savedAt: now }, ...current.items]
          : current.items,
      }
    })
    return board.id
  }, [liveById, retentionDays])

  const toggleSaved = useCallback(
    (article: FeedArticle) => {
      if (isSaved(article.id)) removeFromAll(article.id)
      else saveToBoard(article, normalizedStore.boards[0]?.id ?? createBoard(DEFAULT_BOARD_NAME))
    },
    [createBoard, isSaved, normalizedStore.boards, removeFromAll, saveToBoard],
  )

  return {
    boards,
    savedIds,
    savedArticles,
    isSaved,
    isSavedToBoard,
    saveToBoard,
    removeFromAll,
    removeFromBoard,
    createBoard,
    toggleSaved,
  }
}
