import { useCallback, useEffect, useState } from 'react'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'ai-pulse-theme'
const DEFAULT: Theme = 'light'

function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'dark' || stored === 'light') return stored
  } catch { /* ignore */ }
  return DEFAULT
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    const t = readTheme()
    // Apply immediately during init so there is no flash on first render
    document.documentElement.setAttribute('data-theme', t)
    return t
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const setTheme = useCallback((t: Theme) => setThemeState(t), [])

  return { theme, setTheme }
}
