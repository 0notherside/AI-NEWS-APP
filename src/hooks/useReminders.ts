import { useCallback, useEffect, useState } from 'react'
import type { Reminder } from '../types/reminder'
import type { LastOpenedMap } from './useArticleOpens'

const STORAGE_KEY = 'ai-pulse-reminders'
const STALE_REMINDER_MS = 60 * 24 * 60 * 60 * 1000

function asString(v: unknown): string {
  return typeof v === 'string' ? v : ''
}

function normalizeReminder(raw: unknown): Reminder | null {
  if (typeof raw !== 'object' || raw === null) return null
  const o = raw as Record<string, unknown>
  if (
    typeof o.id !== 'string' ||
    typeof o.dateKey !== 'string' ||
    typeof o.time !== 'string'
  ) {
    return null
  }
  return {
    id: o.id,
    createdAt: typeof o.createdAt === 'number' && Number.isFinite(o.createdAt)
      ? o.createdAt
      : Date.now(),
    dateKey: o.dateKey,
    time: o.time,
    link: asString(o.link),
    topic: asString(o.topic),
    description: asString(o.description),
    articleId: typeof o.articleId === 'string' ? o.articleId : undefined,
  }
}

function load(): Reminder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed
      .map(normalizeReminder)
      .filter((r): r is Reminder => r !== null)
  } catch {
    return []
  }
}

function persist(items: Reminder[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function useReminders(lastOpenedById: LastOpenedMap = {}) {
  const [reminders, setReminders] = useState<Reminder[]>(load)

  useEffect(() => {
    persist(reminders)
  }, [reminders])

  const addReminder = useCallback(
    (input: Omit<Reminder, 'id' | 'createdAt'>) => {
      setReminders((prev) => [
        ...prev,
        { ...input, id: crypto.randomUUID(), createdAt: Date.now() },
      ])
    },
    [],
  )

  const removeReminder = useCallback((id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const hasArticleReminder = useCallback(
    (articleId: string) => reminders.some((r) => r.articleId === articleId),
    [reminders],
  )

  useEffect(() => {
    const prune = () => {
      const now = Date.now()
      setReminders((prev) =>
        prev.filter((r) => {
          if (!r.articleId) return true
          const lastTouched = lastOpenedById[r.articleId] ?? r.createdAt
          return now - lastTouched <= STALE_REMINDER_MS
        }),
      )
    }
    prune()
    const timer = window.setInterval(prune, 60 * 60 * 1000)
    return () => window.clearInterval(timer)
  }, [lastOpenedById])

  return { reminders, addReminder, removeReminder, hasArticleReminder }
}
