export type CategoryId = 'all' | 'editing' | 'music' | 'voice' | 'code'

export interface CategoryChip {
  id: CategoryId
  label: string
  emoji: string
}

export const CATEGORY_CHIPS: CategoryChip[] = [
  { id: 'all', label: 'All', emoji: '🔥' },
  { id: 'editing', label: 'Editing', emoji: '✂️' },
  { id: 'music', label: 'Music', emoji: '🎵' },
  { id: 'voice', label: 'Voice', emoji: '🎙️' },
  { id: 'code', label: 'Code', emoji: '💻' },
]
