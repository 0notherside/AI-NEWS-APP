import { Settings } from 'lucide-react'
import { getInitials } from '../../hooks/useProfile'
import { SearchBar } from '../SearchBar/SearchBar'
import './Header.css'

interface HeaderProps {
  onProfileClick?: () => void
  userName?: string
  avatarDataUrl?: string | null
  searchValue?: string
  onSearchChange?: (value: string) => void
}

export function Header({
  onProfileClick,
  userName = 'AI Pulse',
  avatarDataUrl,
  searchValue,
  onSearchChange,
}: HeaderProps) {
  const firstName = userName.trim().split(/\s+/)[0]
  const hasSearch = typeof searchValue === 'string' && onSearchChange

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

        {/* Right: search bar + gear icon */}
        <div className="header__actions">
          {hasSearch && (
            <SearchBar value={searchValue} onChange={onSearchChange} variant="inline" />
          )}
          <button
            type="button"
            className="header__icon-btn"
            aria-label="Open profile settings"
            onClick={onProfileClick}
          >
            <Settings size={18} strokeWidth={1.8} aria-hidden />
          </button>
        </div>
      </div>
    </header>
  )
}
