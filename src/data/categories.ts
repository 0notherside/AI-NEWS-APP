export type CategoryId = 'all' | 'editing' | 'music' | 'voice' | 'code'
export type ArticleCategoryId = Exclude<CategoryId, 'all'>

export interface CategoryChip {
  id: CategoryId
  label: string
  emoji: string
}

export interface CategoryMeta {
  label: string
  emoji: string
  color: string
}

export const CATEGORY_CHIPS: CategoryChip[] = [
  { id: 'all', label: 'All', emoji: '🔥' },
  { id: 'editing', label: 'Editing', emoji: '✂️' },
  { id: 'music', label: 'Music', emoji: '🎵' },
  { id: 'voice', label: 'Voice', emoji: '🎙️' },
  { id: 'code', label: 'Code', emoji: '💻' },
]

/** Display metadata for each non-'all' category — single source of truth. */
export const CATEGORY_META: Record<ArticleCategoryId, CategoryMeta> = {
  editing: { label: 'EDITING', emoji: '✂️', color: 'var(--category-editing)' },
  music:   { label: 'MUSIC',   emoji: '🎵', color: 'var(--category-music)'   },
  voice:   { label: 'VOICE',   emoji: '🎙️', color: 'var(--category-voice)'   },
  code:    { label: 'CODE',    emoji: '💻', color: 'var(--category-code)'    },
}
