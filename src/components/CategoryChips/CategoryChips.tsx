import { CATEGORY_CHIPS, type CategoryId } from '../../data/categories'
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
        return (
          <button
            key={chip.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`category-chips__chip${isActive ? ' category-chips__chip--active' : ''}`}
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
