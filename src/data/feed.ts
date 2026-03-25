import type { CategoryId } from './categories'

export interface FeedArticle {
  id: string
  categoryId: Exclude<CategoryId, 'all'>
  categoryLabel: string
  categoryEmoji: string
  categoryColor: string
  timeAgo: string
  /** Thumbnail for the card (remote URL) */
  imageUrl: string
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
    imageUrl:
      'https://images.unsplash.com/photo-1516035069371-29a1b244ccff?auto=format&fit=crop&w=640&h=400&q=80',
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
    imageUrl:
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=320&h=200&fit=crop&q=80',
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
    imageUrl:
      'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=320&h=200&fit=crop&q=80',
    title: 'ElevenLabs Launches Real-Time Voice Translation with Emotion Preservation',
    excerpt:
      'Breaking language barriers while maintaining tonal nuance, the new API supports 29 languages with sub-100ms latency for live conversations...',
    source: 'Wired',
    readMinutes: 3,
  },
]
