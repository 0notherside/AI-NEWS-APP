import './Header.css'

export function Header() {
  return (
    <header className="header">
      <h1 className="header__title">AI Pulse</h1>
      <button type="button" className="header__avatar" aria-label="Profile">
        AI
      </button>
    </header>
  )
}
