import { getInitials } from '../../hooks/useProfile'
import './Header.css'

interface HeaderProps {
  onProfileClick?: () => void
  userName?: string
  avatarDataUrl?: string | null
}

export function Header({ onProfileClick, userName = 'AI Pulse', avatarDataUrl }: HeaderProps) {
  return (
    <header className="header">
      <h1 className="header__title">AI Pulse</h1>
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
    </header>
  )
}
