import { useState } from 'react'
import { Bell, Bookmark, Compass, Home, User } from 'lucide-react'
import './BottomNav.css'

type NavId = 'feed' | 'explore' | 'saved' | 'reminders' | 'profile'

const ITEMS: { id: NavId; label: string; Icon: typeof Home }[] = [
  { id: 'feed', label: 'Feed', Icon: Home },
  { id: 'explore', label: 'Explore', Icon: Compass },
  { id: 'saved', label: 'Saved', Icon: Bookmark },
  { id: 'reminders', label: 'Reminders', Icon: Bell },
  { id: 'profile', label: 'Profile', Icon: User },
]

export function BottomNav() {
  const [active, setActive] = useState<NavId>('feed')

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
            onClick={() => setActive(id)}
          >
            <div className="bottom-nav__indicator-wrap" aria-hidden>
              <span className="bottom-nav__indicator" />
            </div>
            <span className="bottom-nav__icon-slot">
              <Icon size={22} strokeWidth={isActive ? 2.25 : 1.75} />
            </span>
            {label}
          </button>
        )
      })}
    </nav>
  )
}
