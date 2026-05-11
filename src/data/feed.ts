import type { CategoryId } from './categories'

export interface FeedArticle {
  id: string
  categoryId: Exclude<CategoryId, 'all'>
  categoryLabel: string
  categoryEmoji: string
  categoryColor: string
  timeAgo: string
  imageUrl: string
  title: string
  excerpt: string
  source: string
  readMinutes: number
  featured?: boolean
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
  /* -- 1 . FEATURED -- Models ---------------------------- */
  {
    id: '1',
    categoryId: 'models',
    categoryLabel: 'MODELS',
    categoryEmoji: '🤖',
    categoryColor: 'var(--category-models)',
    timeAgo: '1h ago',
    featured: true,
    imageUrl:
      'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=800&h=500&q=85',
    title: 'OpenAI Ships GPT-5 with Native Voice and Vision in One Model',
    excerpt:
      'GPT-5 arrives as a unified model handling text, images, audio, and real-time reasoning in a single inference pass - no modality switching required.',
    source: 'OpenAI Blog',
    readMinutes: 5,
    details: {
      summary:
        'GPT-5 is OpenAI's first truly unified multimodal model, combining language, vision, audio understanding, and extended reasoning under one architecture.',
      whatsNew:
        'The model introduces native real-time audio I/O, structured output improvements, and a new 256k context window for pro tiers.',
      keyPoints: [
        'Single model handles text, image, audio, and video inputs natively.',
        '256k context window available on ChatGPT Pro and API.',
        'Reasoning mode activates automatically on complex queries.',
        'Significant benchmark gains on MMLU, HumanEval, and MATH.',
      ],
      pricing: [
        'ChatGPT Free gets limited GPT-5 access with daily caps.',
        'ChatGPT Plus: $20/month with expanded message limits.',
        'API: $2.50 / 1M input tokens, $10 / 1M output tokens.',
      ],
      screenshots: [
        'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&h=700&q=85',
        'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=1200&h=700&q=85',
      ],
    },
    relevanceCount: 0,
  },

  /* -- 2 . Agents ---------------------------------------- */
  {
    id: '2',
    categoryId: 'agents',
    categoryLabel: 'AGENTS',
    categoryEmoji: '🕹️',
    categoryColor: 'var(--category-agents)',
    timeAgo: '2h ago',
    imageUrl:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&h=500&q=85',
    title: 'Anthropic Releases Claude Computer Use API for Enterprise Agents',
    excerpt:
      'Claude can now control browsers, run terminal commands, and manage files autonomously - giving enterprise teams a production-ready agentic foundation.',
    source: 'Anthropic',
    readMinutes: 4,
    details: {
      summary:
        'Anthropic's computer use capability exits beta, letting Claude agents operate real desktop environments for multi-step automation tasks.',
      whatsNew:
        'The GA release adds audit logs, sandboxed execution environments, and a new tool-use SDK for safer enterprise deployments.',
      keyPoints: [
        'Browse the web, fill forms, and click UI elements autonomously.',
        'Sandboxed execution prevents unintended system access.',
        'Audit trail for every action taken by the agent.',
        'Integrates with existing Claude API keys and billing.',
      ],
      pricing: [
        'Computer use is billed per API token - no separate add-on.',
        'Enterprise tier includes extended rate limits and SLA.',
      ],
      screenshots: [
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&h=700&q=85',
        'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=1200&h=700&q=85',
      ],
    },
    relevanceCount: 0,
  },

  /* -- 3 . Video ----------------------------------------- */
  {
    id: '3',
    categoryId: 'video',
    categoryLabel: 'VIDEO',
    categoryEmoji: '🎬',
    categoryColor: 'var(--category-video)',
    timeAgo: '3h ago',
    imageUrl:
      'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&h=500&q=85',
    title: 'Runway Gen-4 Produces Cinematic 4K Video from a Single Prompt',
    excerpt:
      'Runway's latest generation model generates consistent characters and environments across scenes, closing the gap between prompt and production-quality footage.',
    source: 'Runway',
    readMinutes: 4,
    details: {
      summary:
        'Gen-4 introduces persistent character identity across cuts and cinematic camera control, making AI video viable for short-form production.',
      whatsNew:
        'Scene-level consistency and a new Director Mode let creators define shot type, lighting, and pacing without writing complex prompts.',
      keyPoints: [
        'Character identity stays consistent across multiple generated clips.',
        'Director Mode exposes camera angle, depth, and motion controls.',
        'Outputs up to 4K at 24fps for paid tiers.',
        'Integrated with Adobe Premiere via plugin.',
      ],
      pricing: [
        'Standard: 625 credits/month at $15.',
        'Pro: 2,250 credits/month at $35.',
        '4K output requires Pro or higher.',
      ],
      screenshots: [
        'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&h=700&q=85',
        'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&h=700&q=85',
      ],
    },
    relevanceCount: 0,
  },

  /* -- 4 . Image ----------------------------------------- */
  {
    id: '4',
    categoryId: 'image',
    categoryLabel: 'IMAGE',
    categoryEmoji: '🖼️',
    categoryColor: 'var(--category-image)',
    timeAgo: '5h ago',
    imageUrl:
      'https://images.unsplash.com/photo-1547954575-855750c57bd3?auto=format&fit=crop&w=800&h=500&q=85',
    title: 'Midjourney V7 Launches with Photorealistic Portraits and Style Lock',
    excerpt:
      'V7 sets a new bar for facial realism and introduces Style Lock - letting creators pin a visual aesthetic and iterate without prompt drift.',
    source: 'Midjourney',
    readMinutes: 3,
    details: {
      summary:
        'Midjourney V7 is the most photorealistic release yet, with dramatically improved faces, hands, and a new Style Lock feature for consistent creative sessions.',
      whatsNew:
        'Style Lock saves a seed aesthetic so every variation stays visually on-brand without re-engineering the prompt from scratch.',
      keyPoints: [
        'Faces and hands render with near-photographic accuracy.',
        'Style Lock preserves your aesthetic across all variations.',
        'New --quality 3 flag for ultra-high resolution outputs.',
        'Faster inference - images generate in under 20 seconds.',
      ],
      pricing: [
        'Basic: $10/month - ~200 images.',
        'Standard: $30/month - 15 hrs fast generation.',
        'Pro: $60/month - 30 hrs + stealth mode.',
      ],
      screenshots: [
        'https://images.unsplash.com/photo-1547954575-855750c57bd3?auto=format&fit=crop&w=1200&h=700&q=85',
        'https://images.unsplash.com/photo-1561736778-92e52a7769ef?auto=format&fit=crop&w=1200&h=700&q=85',
      ],
    },
    relevanceCount: 0,
  },

  /* -- 5 . Code ------------------------------------------ */
  {
    id: '5',
    categoryId: 'code',
    categoryLabel: 'CODE',
    categoryEmoji: '💻',
    categoryColor: 'var(--category-code)',
    timeAgo: '6h ago',
    imageUrl:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&h=500&q=85',
    title: 'GitHub Copilot Gets Multi-File Edits and Terminal Command Awareness',
    excerpt:
      'The latest Copilot update spans entire codebases across files, understands shell context, and can auto-fix failing CI runs directly inside VS Code.',
    source: 'GitHub Blog',
    readMinutes: 5,
    details: {
      summary:
        'GitHub Copilot moves beyond autocomplete with agent-style edits across multiple files and deep integration with terminal and CI workflows.',
      whatsNew:
        'Multi-file editing mode opens a diff view showing all proposed changes before commit. Terminal awareness lets Copilot read command output and suggest fixes.',
      keyPoints: [
        'Edit across 10+ files simultaneously with unified diff preview.',
        'Terminal context lets Copilot read errors and fix them inline.',
        'CI failure summaries with suggested patch PRs.',
        'Supports all major languages and frameworks.',
      ],
      pricing: [
        'Copilot Individual: $10/month.',
        'Copilot Business: $19/month per seat.',
        'Multi-file edits require Copilot Business or higher.',
      ],
      screenshots: [
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&h=700&q=85',
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&h=700&q=85',
      ],
    },
    relevanceCount: 0,
  },

  /* -- 6 . Music ----------------------------------------- */
  {
    id: '6',
    categoryId: 'music',
    categoryLabel: 'MUSIC',
    categoryEmoji: '🎵',
    categoryColor: 'var(--category-music)',
    timeAgo: '8h ago',
    imageUrl:
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&h=500&q=85',
    title: 'Suno v4 Hits Studio Quality with Vocal Clarity and Genre Steering',
    excerpt:
      'Suno's fourth major model version finally cracks the muddiness problem in AI music, delivering broadcast-ready tracks with precise genre and mood controls.',
    source: 'Suno',
    readMinutes: 4,
    details: {
      summary:
        'Suno v4 produces cleaner, more coherent music with improved vocal rendering and a new style tag system for precise genre targeting.',
      whatsNew:
        'The update adds a 4-minute generation limit, a remix mode for uploaded tracks, and stem-level exports for producers.',
      keyPoints: [
        'Broadcast-quality audio output at 320kbps.',
        'Vocal clarity dramatically improved over v3.',
        'Genre, mood, and tempo tags give fine-grained control.',
        'Stem exports: vocals, drums, bass, and instruments separately.',
      ],
      pricing: [
        'Free: 50 credits/day.',
        'Pro: $8/month - 2,500 credits, commercial license.',
        'Premier: $24/month - 10,000 credits.',
      ],
      screenshots: [
        'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&h=700&q=85',
        'https://images.unsplash.com/photo-1461784180009-21121b2f2040?auto=format&fit=crop&w=1200&h=700&q=85',
      ],
    },
    relevanceCount: 0,
  },

  /* -- 7 . Voice ----------------------------------------- */
  {
    id: '7',
    categoryId: 'voice',
    categoryLabel: 'VOICE',
    categoryEmoji: '🎙️',
    categoryColor: 'var(--category-voice)',
    timeAgo: '10h ago',
    imageUrl:
      'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&h=500&q=85',
    title: 'ElevenLabs Launches Dubbing Studio with 29-Language Emotion Match',
    excerpt:
      'ElevenLabs Dubbing Studio syncs lip movement, preserves original speaker emotion, and delivers localised audio in 29 languages at near real-time speed.',
    source: 'ElevenLabs',
    readMinutes: 4,
    details: {
      summary:
        'ElevenLabs' professional dubbing tool translates video content while preserving the original speaker's emotional tone and timing.',
      whatsNew:
        'Emotion Match technology analyses vocal inflection in the source language and mirrors it in the dubbed output, removing flat robotic translations.',
      keyPoints: [
        '29 languages with emotion-preserving translation.',
        'Lip-sync accuracy improved with new timing engine.',
        'Sub-60-second processing for clips under 5 minutes.',
        'API available for integration into content workflows.',
      ],
      pricing: [
        'Creator: $22/month - 100 dubbing minutes.',
        'Pro: $99/month - 500 minutes with commercial rights.',
        'Enterprise: custom pricing and SLA.',
      ],
      screenshots: [
        'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&h=700&q=85',
        'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&h=700&q=85',
      ],
    },
    relevanceCount: 0,
  },

  /* -- 8 . Robotics -------------------------------------- */
  {
    id: '8',
    categoryId: 'robotics',
    categoryLabel: 'ROBOTICS',
    categoryEmoji: '🦾',
    categoryColor: 'var(--category-robotics)',
    timeAgo: '12h ago',
    imageUrl:
      'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=800&h=500&q=85',
    title: 'Figure 02 Robot Completes Full BMW Factory Shift Without Supervision',
    excerpt:
      'Figure's humanoid robot ran an uninterrupted 8-hour shift on a BMW assembly line, handling parts sorting, torque checks, and surface inspection autonomously.',
    source: 'Figure AI',
    readMinutes: 5,
    details: {
      summary:
        'Figure 02 completes its first fully autonomous industrial shift at BMW's Spartanburg plant, marking a milestone for general-purpose humanoid robotics.',
      whatsNew:
        'The robot used a combination of on-board vision models and edge-deployed LLMs to make real-time decisions without remote operator input.',
      keyPoints: [
        '8-hour autonomous shift with zero human intervention.',
        'Tasks included sorting, quality inspection, and assembly assist.',
        'On-device AI decision-making at under 100ms latency.',
        'Figure plans 100-unit fleet deployment by end of year.',
      ],
      pricing: [
        'Figure 02 units are not for retail sale.',
        'Enterprise partnerships currently evaluated case-by-case.',
      ],
      screenshots: [
        'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1200&h=700&q=85',
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&h=700&q=85',
      ],
    },
    relevanceCount: 0,
  },

  /* -- 9 . Research -------------------------------------- */
  {
    id: '9',
    categoryId: 'research',
    categoryLabel: 'RESEARCH',
    categoryEmoji: '🔬',
    categoryColor: 'var(--category-research)',
    timeAgo: '1d ago',
    imageUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&h=500&q=85',
    title: 'DeepMind Paper Solves Protein Folding for Entire Human Proteome',
    excerpt:
      'AlphaFold 3 maps every protein structure in the human body with sub-angstrom accuracy, opening a new chapter for drug discovery and synthetic biology.',
    source: 'Nature',
    readMinutes: 7,
    details: {
      summary:
        'DeepMind's AlphaFold 3 achieves complete human proteome mapping, enabling researchers to model how drugs bind to previously unmapped protein targets.',
      whatsNew:
        'The model extends beyond proteins to predict interactions with DNA, RNA, and small molecules - making it a full molecular modelling platform.',
      keyPoints: [
        'Sub-angstrom accuracy across 200,000+ human proteins.',
        'Models protein-DNA, protein-RNA, and drug-binding interactions.',
        'Open database updated with all new predictions.',
        'Reduces wet-lab validation cycles by up to 70%.',
      ],
      pricing: [
        'AlphaFold database is free for academic and non-commercial use.',
        'Commercial API licensing available for pharmaceutical companies.',
      ],
      screenshots: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&h=700&q=85',
        'https://images.unsplash.com/photo-1617791160536-598cf32026fb?auto=format&fit=crop&w=1200&h=700&q=85',
      ],
    },
    relevanceCount: 0,
  },

  /* -- 10 . Business ------------------------------------- */
  {
    id: '10',
    categoryId: 'business',
    categoryLabel: 'BUSINESS',
    categoryEmoji: '💼',
    categoryColor: 'var(--category-business)',
    timeAgo: '1d ago',
    imageUrl:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&h=500&q=85',
    title: 'xAI Raises $6B Series C at $50B Valuation to Scale Grok Infrastructure',
    excerpt:
      'Musk AI company secures one of the largest funding rounds in AI history to expand Grok training cluster and accelerate enterprise API rollout.',
    source: 'Bloomberg',
    readMinutes: 4,
    details: {
      summary:
        'The $6 billion raise will fund a 100,000-GPU training cluster and an aggressive enterprise sales push for the Grok API.',
      whatsNew:
        'The round was led by Andreessen Horowitz and includes strategic commitments from sovereign wealth funds.',
      keyPoints: [
        '$6B raise values xAI at $50B, one of the largest AI funding rounds ever.',
        'Funds will build a 100,000-GPU Colossus 2 training cluster.',
        'Grok Enterprise API launches Q3 with dedicated rate limits.',
        'X Premium integration to include Grok Pro by default.',
      ],
      pricing: [
        'Grok API pricing not yet announced for enterprise tier.',
        'X Premium subscribers get Grok access included at no extra cost.',
      ],
      screenshots: [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&h=700&q=85',
        'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&h=700&q=85',
      ],
    },
    relevanceCount: 0,
  },
]
