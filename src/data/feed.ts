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
  /** When true, rendered as a full-width hero card at the top of the All feed */
  featured?: boolean
  /** Initial community relevance before user interactions */
  relevanceCount?: number
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
    featured: true,
    imageUrl:
      'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=640&h=400&q=80',
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
        'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=1200&h=700&q=80',
        'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&h=700&q=80',
      ],
    },
    relevanceCount: 0,
  },
  {
    id: '2',
    categoryId: 'music',
    categoryLabel: 'MUSIC',
    categoryEmoji: '🎵',
    categoryColor: 'var(--category-music)',
    timeAgo: '3h ago',
    imageUrl:
      'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?auto=format&fit=crop&w=640&h=400&q=80',
    title: 'OpenAI Announces Sora Is Closing for Public Preview Access',
    excerpt:
      'OpenAI says it will sunset the current public Sora preview, guiding creators to export projects and follow upcoming details on the next release phase...',
    source: 'The Verge',
    readMinutes: 5,
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
        'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=1200&h=700&q=80',
        'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&h=700&q=80',
      ],
    },
    relevanceCount: 0,
  },
  {
    id: '3',
    categoryId: 'voice',
    categoryLabel: 'VOICE',
    categoryEmoji: '🎙️',
    categoryColor: 'var(--category-voice)',
    timeAgo: '5h ago',
    imageUrl:
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=640&h=400&q=80',
    title: 'OpenAI Announces Sora Is Closing for Public Preview Access',
    excerpt:
      'OpenAI says it will sunset the current public Sora preview, guiding creators to export projects and follow upcoming details on the next release phase...',
    source: 'Bloomberg',
    readMinutes: 3,
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
        'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=1200&h=700&q=80',
        'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&h=700&q=80',
      ],
    },
    relevanceCount: 0,
  },
  {
    id: '4',
    categoryId: 'editing',
    categoryLabel: 'EDITING',
    categoryEmoji: '✂️',
    categoryColor: 'var(--category-editing)',
    timeAgo: '8h ago',
    imageUrl:
      'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=640&h=400&q=80',
    title: 'OpenAI Announces Sora Is Closing for Public Preview Access',
    excerpt:
      'OpenAI says it will sunset the current public Sora preview, guiding creators to export projects and follow upcoming details on the next release phase...',
    source: 'TechCrunch',
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
        'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=1200&h=700&q=80',
        'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&h=700&q=80',
      ],
    },
    relevanceCount: 0,
  },
  {
    id: '5',
    categoryId: 'editing',
    categoryLabel: 'EDITING',
    categoryEmoji: '✂️',
    categoryColor: 'var(--category-editing)',
    timeAgo: '11h ago',
    imageUrl:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=640&h=400&q=80',
    title: 'OpenAI Announces Sora Is Closing for Public Preview Access',
    excerpt:
      'OpenAI says it will sunset the current public Sora preview, guiding creators to export projects and follow upcoming details on the next release phase...',
    source: 'MIT Technology Review',
    readMinutes: 6,
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
        'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=1200&h=700&q=80',
        'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&h=700&q=80',
      ],
    },
    relevanceCount: 0,
  },
  {
    id: '6',
    categoryId: 'editing',
    categoryLabel: 'EDITING',
    categoryEmoji: '✂️',
    categoryColor: 'var(--category-editing)',
    timeAgo: '1d ago',
    imageUrl:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=640&h=400&q=80',
    title: 'OpenAI Announces Sora Is Closing for Public Preview Access',
    excerpt:
      'OpenAI says it will sunset the current public Sora preview, guiding creators to export projects and follow upcoming details on the next release phase...',
    source: 'Engadget',
    readMinutes: 3,
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
        'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=1200&h=700&q=80',
        'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&h=700&q=80',
      ],
    },
    relevanceCount: 0,
  },
  {
    id: '7',
    categoryId: 'music',
    categoryLabel: 'MUSIC',
    categoryEmoji: '🎵',
    categoryColor: 'var(--category-music)',
    timeAgo: '1d ago',
    imageUrl:
      'https://images.unsplash.com/photo-1461784180009-21121b2f2040?auto=format&fit=crop&w=640&h=400&q=80',
    title: 'Anthropic Debuts Claude 4.5 for Real-Time Music Prompt Workflows',
    excerpt:
      'Anthropic has introduced a new Claude release focused on faster multimodal prompting, giving creators a tighter loop for melody, lyrics, and arrangement experiments...',
    source: 'MusicTech',
    readMinutes: 4,
    details: {
      summary:
        'Claude 4.5 expands real-time conversational control for music ideation and production guidance with lower latency.',
      whatsNew:
        'The update improves continuity over longer sessions and adds better instruction memory for creative iterations.',
      keyPoints: [
        'Lower response latency for iterative composition.',
        'Improved context retention across long prompts.',
        'Better alignment for stylistic constraints.',
      ],
      pricing: [
        'API pricing follows token-based usage tiers.',
        'Higher plans include larger context windows.',
      ],
      screenshots: [
        'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&h=700&q=80',
        'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&h=700&q=80',
      ],
    },
    relevanceCount: 0,
  },
  {
    id: '8',
    categoryId: 'voice',
    categoryLabel: 'VOICE',
    categoryEmoji: '🎙️',
    categoryColor: 'var(--category-voice)',
    timeAgo: '2d ago',
    imageUrl:
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=640&h=400&q=80',
    title: 'Google Adds Low-Latency Voice Agents to Gemini Live APIs',
    excerpt:
      'Google is rolling out upgraded live voice endpoints for Gemini, enabling faster turn-taking and smoother multilingual conversations for assistant-style apps...',
    source: 'The Information',
    readMinutes: 5,
    details: {
      summary:
        'Gemini Live APIs now target more natural speech interaction with lower latency and improved multilingual handling.',
      whatsNew:
        'Developers get better interruption handling and clearer endpoint ergonomics for real-time voice experiences.',
      keyPoints: [
        'Lower latency on streaming voice sessions.',
        'Improved barge-in and interruption support.',
        'Expanded multilingual coverage.',
      ],
      pricing: [
        'Usage-based billing for audio streaming minutes.',
        'Enterprise pricing available for high-volume agents.',
      ],
      screenshots: [
        'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&h=700&q=80',
        'https://images.unsplash.com/photo-1580894908361-967195033215?auto=format&fit=crop&w=1200&h=700&q=80',
      ],
    },
    relevanceCount: 0,
  },
  {
    id: '9',
    categoryId: 'editing',
    categoryLabel: 'EDITING',
    categoryEmoji: '✂️',
    categoryColor: 'var(--category-editing)',
    timeAgo: '2d ago',
    imageUrl:
      'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=640&h=400&q=80',
    title: 'Canva Launches AI Scene Replace for One-Tap Visual Editing',
    excerpt:
      'Canva introduced a scene-aware replacement tool that can swap backgrounds and objects with style-preserving edits for rapid social and campaign production...',
    source: 'Fast Company',
    readMinutes: 4,
    details: {
      summary:
        'AI Scene Replace makes contextual visual changes easier for non-designers while preserving original composition intent.',
      whatsNew:
        'The tool adds controllable presets for lighting, depth, and palette matching in a single workflow.',
      keyPoints: [
        'Context-aware background/object replacement.',
        'One-tap style and palette harmonization.',
        'Built for quick social marketing assets.',
      ],
      pricing: [
        'Included in Canva Pro plans with usage limits.',
        'Team tiers increase generation allowances.',
      ],
      screenshots: [
        'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&h=700&q=80',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&h=700&q=80',
      ],
    },
    relevanceCount: 0,
  },
  {
    id: '10',
    categoryId: 'editing',
    categoryLabel: 'EDITING',
    categoryEmoji: '✂️',
    categoryColor: 'var(--category-editing)',
    timeAgo: '3d ago',
    imageUrl:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=640&h=400&q=80',
    title: 'Figma Adds AI Auto-Layout Suggestions for Product Teams',
    excerpt:
      'Figma previewed AI layout recommendations that suggest spacing, hierarchy, and component grouping changes to speed up early design iterations...',
    source: 'Product Hunt Daily',
    readMinutes: 6,
    details: {
      summary:
        'Figma is layering AI assistance into layout workflows to reduce manual alignment and improve consistency.',
      whatsNew:
        'Suggestions appear inline and can be applied selectively, preserving manual control over final composition.',
      keyPoints: [
        'Inline AI layout recommendations.',
        'Component grouping and hierarchy suggestions.',
        'Selective apply keeps designer control.',
      ],
      pricing: [
        'Beta included in paid workspace tiers.',
        'Advanced AI packs expected in enterprise plans.',
      ],
      screenshots: [
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&h=700&q=80',
        'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=1200&h=700&q=80',
      ],
    },
    relevanceCount: 0,
  },
]
