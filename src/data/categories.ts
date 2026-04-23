export type CategoryId =
  | 'all'
  | 'models'
  | 'agents'
  | 'image'
  | 'video'
  | 'code'
  | 'voice'
  | 'music'
  | 'editing'
  | 'robotics'
  | 'research'
  | 'business'
  | 'safety'

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
  { id: 'all',      label: 'All',       emoji: '🔥' },
  { id: 'models',   label: 'Models',    emoji: '🤖' },
  { id: 'agents',   label: 'Agents',    emoji: '🕹️' },
  { id: 'image',    label: 'Image',     emoji: '🖼️' },
  { id: 'video',    label: 'Video',     emoji: '🎬' },
  { id: 'code',     label: 'Code',      emoji: '💻' },
  { id: 'voice',    label: 'Voice',     emoji: '🎙️' },
  { id: 'music',    label: 'Music',     emoji: '🎵' },
  { id: 'editing',  label: 'Editing',   emoji: '✂️' },
  { id: 'robotics', label: 'Robotics',  emoji: '🦾' },
  { id: 'research', label: 'Research',  emoji: '🔬' },
  { id: 'business', label: 'Business',  emoji: '💼' },
  { id: 'safety',   label: 'Safety',    emoji: '🛡️' },
]

export const CATEGORY_META: Record<ArticleCategoryId, CategoryMeta> = {
  models:   { label: 'MODELS',   emoji: '🤖', color: 'var(--category-models)'   },
  agents:   { label: 'AGENTS',   emoji: '🕹️', color: 'var(--category-agents)'   },
  image:    { label: 'IMAGE',    emoji: '🖼️', color: 'var(--category-image)'    },
  video:    { label: 'VIDEO',    emoji: '🎬', color: 'var(--category-video)'    },
  code:     { label: 'CODE',     emoji: '💻', color: 'var(--category-code)'     },
  voice:    { label: 'VOICE',    emoji: '🎙️', color: 'var(--category-voice)'    },
  music:    { label: 'MUSIC',    emoji: '🎵', color: 'var(--category-music)'    },
  editing:  { label: 'EDITING',  emoji: '✂️', color: 'var(--category-editing)'  },
  robotics: { label: 'ROBOTICS', emoji: '🦾', color: 'var(--category-robotics)' },
  research: { label: 'RESEARCH', emoji: '🔬', color: 'var(--category-research)' },
  business: { label: 'BUSINESS', emoji: '💼', color: 'var(--category-business)' },
  safety:   { label: 'SAFETY',   emoji: '🛡️', color: 'var(--category-safety)'   },
}
