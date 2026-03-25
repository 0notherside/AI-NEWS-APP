import type { LucideIcon } from 'lucide-react'
import './PlaceholderScreen.css'

interface PlaceholderScreenProps {
  title: string
  description: string
  Icon: LucideIcon
}

export function PlaceholderScreen({
  title,
  description,
  Icon,
}: PlaceholderScreenProps) {
  return (
    <div className="placeholder">
      <h1 className="placeholder__title">{title}</h1>
      <p className="placeholder__text">{description}</p>
      <div className="placeholder__card">
        <div className="placeholder__icon" aria-hidden>
          <Icon size={28} strokeWidth={1.75} />
        </div>
        <p className="placeholder__text">
          This section is ready for your next feature—saved articles, topics,
          or reminder schedules.
        </p>
      </div>
    </div>
  )
}
