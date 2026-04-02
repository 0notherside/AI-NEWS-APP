import { useRef, useState } from 'react'
import {
  Bell,
  Camera,
  Check,
  ChevronRight,
  HelpCircle,
  LogOut,
  Mail,
  Palette,
  Pencil,
  Shield,
  Sparkles,
  X,
} from 'lucide-react'
import type { Profile } from '../../hooks/useProfile'
import { getInitials } from '../../hooks/useProfile'
import './ProfileScreen.css'

const INTERESTS: { label: string; emoji: string; variant: string }[] = [
  { label: 'Editing', emoji: '✂️', variant: 'profile__chip--editing' },
  { label: 'Music', emoji: '🎵', variant: 'profile__chip--music' },
  { label: 'Voice', emoji: '🎙️', variant: 'profile__chip--voice' },
  { label: 'Code', emoji: '💻', variant: 'profile__chip--code' },
]

interface ProfileScreenProps {
  profile: Profile
  onUpdateName: (name: string) => void
  onUpdateAvatar: (dataUrl: string | null) => void
  savedCount?: number
  reminderCount?: number
}

export function ProfileScreen({
  profile,
  onUpdateName,
  onUpdateAvatar,
  savedCount = 0,
  reminderCount = 0,
}: ProfileScreenProps) {
  const [editingName, setEditingName] = useState(false)
  const [draftName, setDraftName] = useState(profile.name)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      <div className="profile__card">
        <ul className="profile__chips" role="list" aria-label="Your interest topics">
          {INTERESTS.map((item) => (
            <li key={item.label} className={`profile__chip ${item.variant}`}>
              <span className="profile__chip-emoji" aria-hidden>{item.emoji}</span>
              {item.label}
            </li>
          ))}
        </ul>
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
        <button type="button" className="profile__row">
          <span className="profile__row-icon profile__row-icon--violet" aria-hidden>
            <Palette size={18} strokeWidth={2} />
          </span>
          <span className="profile__row-label">Appearance</span>
          <span className="profile__row-meta" aria-label="Currently: Dark">Dark</span>
          <ChevronRight className="profile__row-chevron" size={20} aria-hidden />
        </button>
        <button type="button" className="profile__row">
          <span className="profile__row-icon profile__row-icon--muted" aria-hidden>
            <Shield size={18} strokeWidth={2} />
          </span>
          <span className="profile__row-label">Privacy &amp; data</span>
          <ChevronRight className="profile__row-chevron" size={20} aria-hidden />
        </button>
      </nav>

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
