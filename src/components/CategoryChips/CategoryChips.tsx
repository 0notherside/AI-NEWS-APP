import type { CSSProperties } from 'react'
import {
  CATEGORY_CHIPS,
  CATEGORY_META,
  type ArticleCategoryId,
  type CategoryId,
} from '../../data/categories'
import './CategoryChips.css'

interface CategoryChipsProps {
  active: CategoryId
  onChange: (id: CategoryId) => void
}

export function CategoryChips({ active, onChange }: CategoryChipsProps) {
  return (
    <div className="category-chips" role="tablist" aria-label="News categories">
      {CATEGORY_CHIPS.map((chip) => {
        const isActive = active === chip.id
        const chipColor =
          chip.id === 'all'
            ? 'var(--accent)'
            : CATEGORY_META[chip.id as ArticleCategoryId].color
        return (
          <button
            key={chip.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`category-chips__chip${isActive ? ' category-chips__chip--active' : ''}`}
            style={{ '--chip-color': chipColor } as CSSProperties}
            onClick={() => onChange(chip.id)}
          >
            {chip.id === 'all' && (
              <span className="category-chips__fire" aria-hidden>🔥</span>
            )}
            {chip.label}
          </button>
        )
      })}
    </div>
  )
}
