import { Bell, Bookmark, Home, User, Users } from 'lucide-react'
import type { NavTabId } from '../../types/nav'
import './BottomNav.css'

const ITEMS: { id: NavTabId; label: string; Icon: typeof Home }[] = [
  { id: 'feed', label: 'Feed', Icon: Home },
  { id: 'community', label: 'Community', Icon: Users },
  { id: 'saved', label: 'Saved', Icon: Bookmark },
  { id: 'reminders', label: 'Reminders', Icon: Bell },
  { id: 'profile', label: 'Profile', Icon: User },
]

interface BottomNavProps {
  active: NavTabId
  onChange: (id: NavTabId) => void
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Main">
      {ITEMS.map(({ id, label, Icon }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            type="button"
            className={
              'bottom-nav__item' +
              (isActive ? ' bottom-nav__item--active' : '')
            }
            aria-current={isActive ? 'page' : undefined}
            aria-label={label}
            onClick={() => onChange(id)}
          >
            <span className="bottom-nav__icon-slot">
              <Icon size={22} strokeWidth={1.8} />
            </span>
            <span className="sr-only">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
