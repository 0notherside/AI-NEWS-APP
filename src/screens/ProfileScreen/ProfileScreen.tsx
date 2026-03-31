import {
  Bell,
  ChevronRight,
  HelpCircle,
  LogOut,
  Mail,
  Palette,
  Shield,
  Sparkles,
  UserRound,
} from 'lucide-react'
import './ProfileScreen.css'

const INTERESTS: { label: string; emoji: string; variant: string }[] = [
  { label: 'Editing', emoji: '✂️', variant: 'profile__chip--editing' },
  { label: 'Music', emoji: '🎵', variant: 'profile__chip--music' },
  { label: 'Voice', emoji: '🎙️', variant: 'profile__chip--voice' },
  { label: 'Code', emoji: '💻', variant: 'profile__chip--code' },
]

export function ProfileScreen() {
  return (
    <div className="profile">
      <h1 className="profile__title">Profile</h1>

      {/* ── User hero ────────────────────────────────── */}
      <div className="profile__hero">
        {/* Avatar initials — decorative, name is provided by h2 below */}
        <div className="profile__avatar" aria-hidden>
          AI
        </div>
        <h2 className="profile__name">Alex Chen</h2>
        <p className="profile__email">alex.chen@email.com</p>
      </div>

      {/* ── Stats ────────────────────────────────────── */}
      <dl className="profile__stats" aria-label="Your stats">
        <div className="profile__stat">
          <dt className="profile__stat-label">Saved</dt>
          <dd className="profile__stat-value">24</dd>
        </div>
        <div className="profile__stat">
          <dt className="profile__stat-label">Reminders</dt>
          <dd className="profile__stat-value">7</dd>
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
            <li
              key={item.label}
              className={`profile__chip ${item.variant}`}
            >
              <span className="profile__chip-emoji" aria-hidden>{item.emoji}</span>
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Account settings ─────────────────────────── */}
      <h2 className="profile__section-label">Account</h2>
      <nav className="profile__card" aria-label="Account settings">
        <button type="button" className="profile__row">
          <span className="profile__row-icon" aria-hidden>
            <UserRound size={18} strokeWidth={2} />
          </span>
          <span className="profile__row-label">Edit profile</span>
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
