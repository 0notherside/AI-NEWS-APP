import './Header.css'

interface HeaderProps {
  onProfileClick?: () => void
}

export function Header({ onProfileClick }: HeaderProps) {
  return (
    <header className="header">
      <h1 className="header__title">AI Pulse</h1>
      <button
        type="button"
        className="header__avatar"
        aria-label="Open profile"
        onClick={onProfileClick}
      >
        AI
      </button>
    </header>
  )
}
