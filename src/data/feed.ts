import type { CategoryId } from './categories'

export interface FeedArticle {
  id: string
  categoryId: Exclude<CategoryId, 'all'>
  categoryLabel: string
  categoryEmoji: string
  categoryColor: string
  timeAgo: string
  title: string
  excerpt: string
  source: string
  readMinutes: number
}

export const FEED_ARTICLES: FeedArticle[] = [
  {
    id: '1',
    categoryId: 'editing',
    categoryLabel: 'EDITING',
    categoryEmoji: '✂️',
    categoryColor: 'var(--category-editing)',
    timeAgo: '2h ago',
    title: 'Adobe Firefly 4 Revolutionizes Photo Editing with Neural Brushes',
    excerpt:
      "Adobe's latest Firefly update introduces neural brush technology that understands context and lighting, allowing photographers to make...",
    source: 'The Verge',
    readMinutes: 4,
  },
  {
    id: '2',
    categoryId: 'music',
    categoryLabel: 'MUSIC',
    categoryEmoji: '🎵',
    categoryColor: 'var(--category-music)',
    timeAgo: '4h ago',
    title: 'Suno v5 Brings Studio-Quality AI Music Generation to Mobile',
    excerpt:
      'The popular AI music platform now runs completely on-device for iOS users, enabling offline creation with unprecedented audio fidelity...',
    source: 'TechCrunch',
    readMinutes: 5,
  },
  {
    id: '3',
    categoryId: 'voice',
    categoryLabel: 'VOICE',
    categoryEmoji: '🎙️',
    categoryColor: 'var(--category-voice)',
    timeAgo: '6h ago',
    title: 'ElevenLabs Launches Real-Time Voice Translation with Emotion Preservation',
    excerpt:
      'Breaking language barriers while maintaining tonal nuance, the new API supports 29 languages with sub-100ms latency for live conversations...',
    source: 'Wired',
    readMinutes: 3,
  },
]
