import { X } from 'lucide-react'
import './SearchBar.css'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  variant?: 'default' | 'inline'
  autoFocus?: boolean
  onInactive?: () => void
}

export function SearchBar({
  value,
  onChange,
  variant = 'default',
  autoFocus,
  onInactive,
}: SearchBarProps) {
  return (
    <div
      className={`search-bar${variant === 'inline' ? ' search-bar--inline' : ''}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget) && value.trim() === '') {
          onInactive?.()
        }
      }}
    >
      <input
        className="search-bar__input"
        type="search"
        placeholder="Search for news"
        aria-label="Search stories"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
      />
      {value.length > 0 ? (
        <button
          type="button"
          className="search-bar__clear"
          aria-label="Clear search"
          onClick={() => onChange('')}
        >
          <X size={14} strokeWidth={2.5} aria-hidden />
        </button>
      ) : (
        <span className="search-bar__icon" aria-hidden>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
      )}
    </div>
  )
}
