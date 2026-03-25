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
  details: {
    summary: string
    whatsNew: string
    keyPoints: string[]
    pricing: string[]
    screenshots: string[]
  }
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
    title: 'OpenAI Announces Sora Is Closing for Public Preview Access',
    excerpt:
      'OpenAI says it will sunset the current public Sora preview, guiding creators to export projects and follow upcoming details on the next release phase...',
    source: 'OpenAI Newsroom',
    readMinutes: 4,
    details: {
      summary:
        'OpenAI announced the current public preview for Sora is closing while the team prepares a broader next phase for video generation products.',
      whatsNew:
        'Creators are being asked to export and archive projects before the preview window ends, with migration guidance expected in follow-up updates.',
      keyPoints: [
        'Preview access is being sunset for the current Sora experience.',
        'OpenAI says upcoming rollout details will focus on reliability and scaling.',
        'Users should back up prompt workflows and generated clips now.',
      ],
      pricing: [
        'Current preview pricing is not guaranteed after relaunch.',
        'No final tiers announced yet for the next Sora release.',
      ],
      screenshots: [
        'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&h=700&q=80',
        'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&h=700&q=80',
      ],
    },
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
    details: {
      summary:
        'Suno v5 pushes higher-quality vocal and instrumentation synthesis with improved consistency for longer music sessions.',
      whatsNew:
        'The update introduces better genre steering and tighter song structure controls directly from mobile-first workflows.',
      keyPoints: [
        'Long-form generation keeps timbre and style stable across sections.',
        'Prompt controls now expose arrangement and vibe presets.',
        'Export options are optimized for creator and social formats.',
      ],
      pricing: [
        'Free plan remains available with limited monthly generations.',
        'Pro tiers expand generation quotas and commercial licensing options.',
      ],
      screenshots: [
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&h=700&q=80',
        'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&h=700&q=80',
      ],
    },
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
    details: {
      summary:
        'ElevenLabs introduced near real-time multilingual voice translation designed for streams, live calls, and interactive broadcasts.',
      whatsNew:
        'The system now preserves emotional tone during translation, which helps content feel natural across languages.',
      keyPoints: [
        'Sub-100ms latency target for selected languages and voices.',
        'Supports voice profile consistency during long sessions.',
        'API includes moderation and voice-safety controls.',
      ],
      pricing: [
        'Developer pricing follows usage-based API billing.',
        'Higher plans include expanded real-time minute limits.',
      ],
      screenshots: [
        'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&h=700&q=80',
        'https://images.unsplash.com/photo-1580894908361-967195033215?auto=format&fit=crop&w=1200&h=700&q=80',
      ],
    },
  },
]
