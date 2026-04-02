import { useCallback, useEffect, useState } from 'react'

export interface Profile {
  name: string
  avatarDataUrl: string | null
}

const STORAGE_KEY = 'ai-pulse-profile'

const DEFAULT_PROFILE: Profile = { name: 'Alex Chen', avatarDataUrl: null }

function load(): Profile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_PROFILE
    const parsed = JSON.parse(raw) as unknown
    if (typeof parsed !== 'object' || parsed === null) return DEFAULT_PROFILE
    const o = parsed as Record<string, unknown>
    return {
      name: typeof o.name === 'string' && o.name.trim() ? o.name : DEFAULT_PROFILE.name,
      avatarDataUrl: typeof o.avatarDataUrl === 'string' ? o.avatarDataUrl : null,
    }
  } catch {
    return DEFAULT_PROFILE
  }
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase() || 'AI'
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  }, [profile])

  const updateName = useCallback((name: string) => {
    setProfile((p) => ({ ...p, name: name.trim() || DEFAULT_PROFILE.name }))
  }, [])

  const updateAvatar = useCallback((dataUrl: string | null) => {
    setProfile((p) => ({ ...p, avatarDataUrl: dataUrl }))
  }, [])

  return { profile, updateName, updateAvatar }
}
