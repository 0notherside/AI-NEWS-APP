import { Search, Settings } from 'lucide-react'
import { getInitials } from '../../hooks/useProfile'
import './Header.css'

interface HeaderProps {
  onProfileClick?: () => void
  userName?: string
  avatarDataUrl?: string | null
  onSearchClick?: () => void
  searchActive?: boolean
}

export function Header({
  onProfileClick,
  userName = 'AI Pulse',
  avatarDataUrl,
  onSearchClick,
  searchActive,
}: HeaderProps) {
  const firstName = userName.trim().split(/\s+/)[0]

  return (
    <header className="header">
      <div className="header__bar">
        {/* Left: avatar + greeting */}
        <div className="header__identity">
          <button
            type="button"
            className="header__avatar"
            aria-label="Open profile"
            onClick={onProfileClick}
          >
            {avatarDataUrl ? (
              <img className="header__avatar-img" src={avatarDataUrl} alt={userName} />
            ) : (
              getInitials(userName)
            )}
          </button>
          <div className="header__greet">
            <span className="header__greet-label">Welcome back,</span>
            <span className="header__greet-name">{firstName}</span>
          </div>
        </div>

        {/* Right: search icon + gear icon */}
        <div className="header__actions">
          <button
            type="button"
            className={`header__icon-btn${searchActive ? ' header__icon-btn--active' : ''}`}
            aria-label="Search news"
            aria-pressed={searchActive}
            onClick={onSearchClick}
          >
            <Search size={17} strokeWidth={2} aria-hidden />
          </button>
          <button
            type="button"
            className="header__icon-btn"
            aria-label="Open profile settings"
            onClick={onProfileClick}
          >
            <Settings size={17} strokeWidth={1.8} aria-hidden />
          </button>
        </div>
      </div>
    </header>
  )
}
