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
  return (
    <header className="header">
      <h1 className="header__title">AI Pulse</h1>
      <div className="header__actions">
        {typeof searchValue === 'string' && onSearchChange && (
          <SearchBar value={searchValue} onChange={onSearchChange} variant="inline" />
        )}
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
      </div>
    </header>
  )
}
