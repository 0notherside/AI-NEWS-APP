import { useRef, useState } from 'react'
import {
  Bell,
  Camera,
  Check,
  ChevronRight,
  HelpCircle,
  LogOut,
  Mail,
  Pencil,
  Shield,
  Sparkles,
  X,
} from 'lucide-react'
import type { Profile } from '../../hooks/useProfile'
import { getInitials } from '../../hooks/useProfile'
import type { Theme } from '../../hooks/useTheme'
import './ProfileScreen.css'

const INTERESTS = [
  { label: 'Editing',  emoji: '✂️',  desc: 'Video & image tools',  color: '#bf5af2', bg: 'rgba(191,90,242,0.10)' },
  { label: 'Music',    emoji: '🎵',  desc: 'AI audio generation',  color: '#ff375f', bg: 'rgba(255,55,95,0.10)'  },
  { label: 'Voice',    emoji: '🎙️', desc: 'TTS & translation',    color: '#30d158', bg: 'rgba(48,209,88,0.10)'  },
  { label: 'Code',     emoji: '💻',  desc: 'Dev tools & LLMs',     color: '#0a84ff', bg: 'rgba(10,132,255,0.10)' },
]

const INTERESTS_KEY = 'ai-pulse-interests'

function readInterests(): Set<string> {
  try {
    const arr = JSON.parse(localStorage.getItem(INTERESTS_KEY) ?? '[]')
    if (Array.isArray(arr)) return new Set(arr as string[])
  } catch {}
  return new Set(INTERESTS.map((i) => i.label))
}

interface ProfileScreenProps {
  profile: Profile
  onUpdateName: (name: string) => void
  onUpdateAvatar: (dataUrl: string | null) => void
  savedCount?: number
  reminderCount?: number
  theme?: Theme
  onSetTheme?: (t: Theme) => void
  savedRetentionDays?: number
  onSetSavedRetentionDays?: (days: number) => void
  refreshIntervalMinutes?: number
  onSetRefreshIntervalMinutes?: (minutes: number) => void
}

export function ProfileScreen({
  profile,
  onUpdateName,
  onUpdateAvatar,
  savedCount = 0,
  reminderCount = 0,
  theme = 'dark',
  onSetTheme,
  savedRetentionDays = 30,
  onSetSavedRetentionDays,
  refreshIntervalMinutes = 5,
  onSetRefreshIntervalMinutes,
}: ProfileScreenProps) {
  const [editingName, setEditingName] = useState(false)
  const [draftName, setDraftName] = useState(profile.name)
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(readInterests)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const toggleInterest = (label: string) => {
    setSelectedInterests((prev) => {
      const next = new Set(prev)
      next.has(label) ? next.delete(label) : next.add(label)
      localStorage.setItem(INTERESTS_KEY, JSON.stringify([...next]))
      return next
    })
  }

  const handleAvatarClick = () => fileInputRef.current?.click()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result
      if (typeof result === 'string') onUpdateAvatar(result)
    }
    reader.readAsDataURL(file)
    // Reset so the same file can be re-selected
    e.target.value = ''
  }

  const startEditing = () => {
    setDraftName(profile.name)
    setEditingName(true)
  }

  const saveName = () => {
    const trimmed = draftName.trim()
    if (trimmed) onUpdateName(trimmed)
    setEditingName(false)
  }

  const cancelEditing = () => {
    setDraftName(profile.name)
    setEditingName(false)
  }

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveName()
    if (e.key === 'Escape') cancelEditing()
  }

  return (
    <div className="profile">
      <h1 className="profile__title">Profile</h1>

      {/* ── User hero ────────────────────────────────── */}
      <div className="profile__hero">
        {/* Avatar with camera overlay */}
        <div className="profile__avatar-wrap">
          <div className="profile__avatar" aria-hidden>
            {profile.avatarDataUrl ? (
              <img
                className="profile__avatar-img"
                src={profile.avatarDataUrl}
                alt={profile.name}
              />
            ) : (
              getInitials(profile.name)
            )}
          </div>
          <button
            type="button"
            className="profile__avatar-edit"
            aria-label="Change profile photo"
            onClick={handleAvatarClick}
          >
            <Camera size={15} strokeWidth={2} aria-hidden />
          </button>
          {/* Remove photo button — only shown when a photo is set */}
          {profile.avatarDataUrl && (
            <button
              type="button"
              className="profile__avatar-remove"
              aria-label="Remove profile photo"
              onClick={() => onUpdateAvatar(null)}
            >
              <X size={12} strokeWidth={2.5} aria-hidden />
            </button>
          )}
        </div>
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="profile__file-input"
          aria-hidden
          tabIndex={-1}
          onChange={handleFileChange}
        />

        {/* Editable name */}
        {editingName ? (
          <div className="profile__name-edit">
            <input
              className="profile__name-input"
              type="text"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onKeyDown={handleNameKeyDown}
              autoFocus
              maxLength={40}
              aria-label="Edit your name"
            />
            <button
              type="button"
              className="profile__name-btn profile__name-btn--save"
              aria-label="Save name"
              onClick={saveName}
            >
              <Check size={16} strokeWidth={2.5} aria-hidden />
            </button>
            <button
              type="button"
              className="profile__name-btn profile__name-btn--cancel"
              aria-label="Cancel editing"
              onClick={cancelEditing}
            >
              <X size={16} strokeWidth={2.5} aria-hidden />
            </button>
          </div>
        ) : (
          <div className="profile__name-row">
            <h2 className="profile__name">{profile.name}</h2>
            <button
              type="button"
              className="profile__name-pencil"
              aria-label="Edit name"
              onClick={startEditing}
            >
              <Pencil size={14} strokeWidth={2} aria-hidden />
            </button>
          </div>
        )}

        <p className="profile__email">alex.chen@email.com</p>
      </div>

      {/* ── Stats ────────────────────────────────────── */}
      <dl className="profile__stats" aria-label="Your stats">
        <div className="profile__stat">
          <dt className="profile__stat-label">Saved</dt>
          <dd className="profile__stat-value">{savedCount}</dd>
        </div>
        <div className="profile__stat">
          <dt className="profile__stat-label">Reminders</dt>
          <dd className="profile__stat-value">{reminderCount}</dd>
        </div>
        <div className="profile__stat">
          <dt className="profile__stat-label">Day streak</dt>
          <dd className="profile__stat-value">12</dd>
        </div>
      </dl>

      {/* ── Interests ────────────────────────────────── */}
      <h2 className="profile__section-label">Your interests</h2>
      <div className="interests-grid" role="group" aria-label="Your interest topics">
        {INTERESTS.map((item) => {
          const active = selectedInterests.has(item.label)
          return (
            <button
              key={item.label}
              type="button"
              className={`interest-card${active ? ' interest-card--active' : ''}`}
              style={{
                '--ic-color': item.color,
                '--ic-bg': active ? item.bg : 'transparent',
                '--ic-border': active ? item.color : 'var(--color-border-subtle)',
              } as React.CSSProperties}
              aria-pressed={active}
              onClick={() => toggleInterest(item.label)}
            >
              {active && (
                <span className="interest-card__check" aria-hidden>
                  <Check size={11} strokeWidth={3} />
                </span>
              )}
              <span className="interest-card__emoji" aria-hidden>{item.emoji}</span>
              <span className="interest-card__label">{item.label}</span>
              <span className="interest-card__desc">{item.desc}</span>
            </button>
          )
        })}
      </div>

      {/* ── Account settings ─────────────────────────── */}
      <h2 className="profile__section-label">Account</h2>
      <nav className="profile__card" aria-label="Account settings">
        <button type="button" className="profile__row" onClick={startEditing}>
          <span className="profile__row-icon" aria-hidden>
            <Pencil size={18} strokeWidth={2} />
          </span>
          <span className="profile__row-label">Edit name</span>
          <ChevronRight className="profile__row-chevron" size={20} aria-hidden />
        </button>
        <button type="button" className="profile__row" onClick={handleAvatarClick}>
          <span className="profile__row-icon" aria-hidden>
            <Camera size={18} strokeWidth={2} />
          </span>
          <span className="profile__row-label">Change photo</span>
          <ChevronRight className="profile__row-chevron" size={20} aria-hidden />
        </button>
        <button type="button" className="profile__row">
          <span className="profile__row-icon" aria-hidden>
            <Mail size={18} strokeWidth={2} />
          </span>
          <span className="profile__row-label">Email &amp; login</span>
          <ChevronRight className="profile__row-chevron" size={20} aria-hidden />
        </button>
        <button type="button" className="profile__row">
          <span className="profile__row-icon" aria-hidden>
            <Bell size={18} strokeWidth={2} />
          </span>
          <span className="profile__row-label">Notifications</span>
          <span className="profile__row-meta" aria-label="Currently: On">On</span>
          <ChevronRight className="profile__row-chevron" size={20} aria-hidden />
        </button>
        <div className="profile__row profile__row--appearance">
          <span className="profile__row-label">Appearance</span>
          <div className="profile__theme-toggle" role="group" aria-label="Choose appearance">
            <button
              type="button"
              className={`profile__theme-btn${theme === 'dark' ? ' profile__theme-btn--active' : ''}`}
              aria-pressed={theme === 'dark'}
              onClick={() => onSetTheme?.('dark')}
            >
              <span className="profile__theme-swatch profile__theme-swatch--dark" aria-hidden />
              Dark
              {theme === 'dark' && <Check size={12} strokeWidth={3} aria-hidden />}
            </button>
            <button
              type="button"
              className={`profile__theme-btn${theme === 'light' ? ' profile__theme-btn--active' : ''}`}
              aria-pressed={theme === 'light'}
              onClick={() => onSetTheme?.('light')}
            >
              <span className="profile__theme-swatch profile__theme-swatch--light" aria-hidden />
              Light
              {theme === 'light' && <Check size={12} strokeWidth={3} aria-hidden />}
            </button>
          </div>
        </div>
        <button type="button" className="profile__row">
          <span className="profile__row-icon profile__row-icon--muted" aria-hidden>
            <Shield size={18} strokeWidth={2} />
          </span>
          <span className="profile__row-label">Privacy &amp; data</span>
          <ChevronRight className="profile__row-chevron" size={20} aria-hidden />
        </button>
      </nav>

      <h2 className="profile__section-label">News settings</h2>
      <section className="profile__card" aria-label="News settings">
        <div className="profile__row profile__row--setting">
          <span className="profile__row-label">
            Saved retention (days)
          </span>
          <input
            type="number"
            min={1}
            max={365}
            className="profile__number-input"
            value={savedRetentionDays}
            onChange={(e) =>
              onSetSavedRetentionDays?.(Number(e.target.value || 30))
            }
            aria-label="Saved retention days"
          />
        </div>
        <div className="profile__row profile__row--setting">
          <span className="profile__row-label">
            Feed refresh (minutes)
          </span>
          <input
            type="number"
            min={1}
            max={60}
            className="profile__number-input"
            value={refreshIntervalMinutes}
            onChange={(e) =>
              onSetRefreshIntervalMinutes?.(Number(e.target.value || 5))
            }
            aria-label="Feed refresh interval"
          />
        </div>
      </section>

      {/* ── Support ──────────────────────────────────── */}
      <h2 className="profile__section-label">Support</h2>
      <nav className="profile__card" aria-label="Support options">
        <button type="button" className="profile__row">
          <span className="profile__row-icon" aria-hidden>
            <HelpCircle size={18} strokeWidth={2} />
          </span>
          <span className="profile__row-label">Help centre</span>
          <ChevronRight className="profile__row-chevron" size={20} aria-hidden />
        </button>
        <button type="button" className="profile__row">
          <span className="profile__row-icon profile__row-icon--muted" aria-hidden>
            <Sparkles size={18} strokeWidth={2} />
          </span>
          <span className="profile__row-label">Send feedback</span>
          <ChevronRight className="profile__row-chevron" size={20} aria-hidden />
        </button>
      </nav>

      {/* ── Sign out ──────────────────────────────────── */}
      <button type="button" className="profile__signout">
        <LogOut size={18} strokeWidth={2} aria-hidden />
        Sign out
      </button>

      <p className="profile__version" aria-label="App version">AI Pulse · v0.1.0</p>
    </div>
  )
}
