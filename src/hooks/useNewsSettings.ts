import { useEffect, useState } from 'react'

export interface NewsSettings {
  savedRetentionDays: number
  refreshIntervalMinutes: number
}

const STORAGE_KEY = 'ai-pulse-news-settings'
const DEFAULT_SETTINGS: NewsSettings = {
  savedRetentionDays: 30,
  refreshIntervalMinutes: 5,
}

function load(): NewsSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_SETTINGS
    const parsed = JSON.parse(raw) as unknown
    if (typeof parsed !== 'object' || parsed === null) return DEFAULT_SETTINGS
    const o = parsed as Record<string, unknown>
    const savedRetentionDays =
      typeof o.savedRetentionDays === 'number' && o.savedRetentionDays >= 1
        ? Math.floor(o.savedRetentionDays)
        : DEFAULT_SETTINGS.savedRetentionDays
    const refreshIntervalMinutes =
      typeof o.refreshIntervalMinutes === 'number' && o.refreshIntervalMinutes >= 1
        ? Math.floor(o.refreshIntervalMinutes)
        : DEFAULT_SETTINGS.refreshIntervalMinutes
    return { savedRetentionDays, refreshIntervalMinutes }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function useNewsSettings() {
  const [settings, setSettings] = useState<NewsSettings>(load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  const setSavedRetentionDays = (days: number) => {
    setSettings((prev) => ({
      ...prev,
      savedRetentionDays: Math.max(1, Math.floor(days || 1)),
    }))
  }

  const setRefreshIntervalMinutes = (minutes: number) => {
    setSettings((prev) => ({
      ...prev,
      refreshIntervalMinutes: Math.max(1, Math.floor(minutes || 1)),
    }))
  }

  return { settings, setSavedRetentionDays, setRefreshIntervalMinutes }
}
