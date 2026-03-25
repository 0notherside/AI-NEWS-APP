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

      <div className="profile__hero">
        <div className="profile__avatar" aria-hidden>
          AI
        </div>
        <h2 className="profile__name">Alex Chen</h2>
        <p className="profile__email">alex.chen@email.com</p>
      </div>

      <div className="profile__stats" aria-label="Your stats">
        <div className="profile__stat">
          <span className="profile__stat-value">24</span>
          <span className="profile__stat-label">Saved</span>
        </div>
        <div className="profile__stat">
          <span className="profile__stat-value">7</span>
          <span className="profile__stat-label">Reminders</span>
        </div>
        <div className="profile__stat">
          <span className="profile__stat-value">12</span>
          <span className="profile__stat-label">Day streak</span>
        </div>
      </div>

      <p className="profile__section-label">Your interests</p>
      <div className="profile__card">
        <div className="profile__chips">
          {INTERESTS.map((item) => (
            <span
              key={item.label}
              className={`profile__chip ${item.variant}`}
            >
              <span aria-hidden>{item.emoji}</span>
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <p className="profile__section-label">Account</p>
      <div className="profile__card" role="list">
        <button type="button" className="profile__row" role="listitem">
          <span className="profile__row-icon">
            <UserRound size={18} strokeWidth={2} />
          </span>
          <span className="profile__row-label">Edit profile</span>
          <ChevronRight className="profile__row-chevron" size={20} />
        </button>
        <button type="button" className="profile__row" role="listitem">
          <span className="profile__row-icon">
            <Mail size={18} strokeWidth={2} />
          </span>
          <span className="profile__row-label">Email &amp; login</span>
          <ChevronRight className="profile__row-chevron" size={20} />
        </button>
        <button type="button" className="profile__row" role="listitem">
          <span className="profile__row-icon">
            <Bell size={18} strokeWidth={2} />
          </span>
          <span className="profile__row-label">Notifications</span>
          <span className="profile__row-meta">On</span>
          <ChevronRight className="profile__row-chevron" size={20} />
        </button>
        <button type="button" className="profile__row" role="listitem">
          <span className="profile__row-icon profile__row-icon--violet">
            <Palette size={18} strokeWidth={2} />
          </span>
          <span className="profile__row-label">Appearance</span>
          <span className="profile__row-meta">Dark</span>
          <ChevronRight className="profile__row-chevron" size={20} />
        </button>
        <button type="button" className="profile__row" role="listitem">
          <span className="profile__row-icon profile__row-icon--muted">
            <Shield size={18} strokeWidth={2} />
          </span>
          <span className="profile__row-label">Privacy &amp; data</span>
          <ChevronRight className="profile__row-chevron" size={20} />
        </button>
      </div>

      <p className="profile__section-label">Support</p>
      <div className="profile__card" role="list">
        <button type="button" className="profile__row" role="listitem">
          <span className="profile__row-icon">
            <HelpCircle size={18} strokeWidth={2} />
          </span>
          <span className="profile__row-label">Help center</span>
          <ChevronRight className="profile__row-chevron" size={20} />
        </button>
        <button type="button" className="profile__row" role="listitem">
          <span className="profile__row-icon profile__row-icon--muted">
            <Sparkles size={18} strokeWidth={2} />
          </span>
          <span className="profile__row-label">Send feedback</span>
          <ChevronRight className="profile__row-chevron" size={20} />
        </button>
      </div>

      <button type="button" className="profile__signout">
        <LogOut size={18} strokeWidth={2} aria-hidden />
        Sign out
      </button>

      <p className="profile__version">AI Pulse · v0.1.0</p>
    </div>
  )
}
