import { useCallback, useEffect, useState } from 'react'
import type { Reminder } from '../types/reminder'

const STORAGE_KEY = 'ai-pulse-reminders'

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
    dateKey: o.dateKey,
    time: o.time,
    link: asString(o.link),
    topic: asString(o.topic),
    description: asString(o.description),
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

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>(load)

  useEffect(() => {
    persist(reminders)
  }, [reminders])

  const addReminder = useCallback(
    (input: Omit<Reminder, 'id'>) => {
      setReminders((prev) => [
        ...prev,
        { ...input, id: crypto.randomUUID() },
      ])
    },
    [],
  )

  const removeReminder = useCallback((id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id))
  }, [])

  return { reminders, addReminder, removeReminder }
}
