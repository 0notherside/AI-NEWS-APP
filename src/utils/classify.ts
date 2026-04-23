import type { ArticleCategoryId } from '../data/categories'

const RULES: Array<{ category: ArticleCategoryId; keywords: string[] }> = [
  {
    category: 'models',
    keywords: [
      'gpt', 'gpt-4', 'gpt-5', 'claude', 'gemini', 'llama', 'mistral', 'grok',
      'phi', 'qwen', 'deepseek', 'model release', 'new model', 'language model',
      'foundation model', 'frontier model', 'weights', 'checkpoint',
      'benchmark', 'context window', 'multimodal', 'reasoning model',
      'o1', 'o3', 'sonnet', 'opus', 'haiku', 'flash', 'ultra',
    ],
  },
  {
    category: 'agents',
    keywords: [
      'agent', 'agentic', 'autonomous', 'multi-agent', 'tool use', 'tool call',
      'computer use', 'browser use', 'workflow automation', 'orchestration',
      'crew', 'autogpt', 'devin', 'swe-agent', 'open hands', 'assistant',
      'task automation', 'self-improving', 'planning', 'memory', 'rag',
      'function calling', 'code interpreter', 'mcp', 'a2a',
    ],
  },
  {
    category: 'image',
    keywords: [
      'image generation', 'image model', 'text-to-image', 'midjourney',
      'dall-e', 'stable diffusion', 'flux', 'imagen', 'firefly', 'ideogram',
      'inpainting', 'outpainting', 'upscal', 'diffusion', 'lora',
      'controlnet', 'style transfer', 'photorealistic', 'generative image',
      'image synthesis', 'visual generation', 'comfyui',
    ],
  },
  {
    category: 'video',
    keywords: [
      'video generation', 'text-to-video', 'sora', 'runway', 'pika', 'kling',
      'veo', 'lumiere', 'hailuo', 'video model', 'ai video', 'video synthesis',
      'video editing', 'clip generation', 'motion', 'animation', 'render',
      'frame interpolation', 'video diffusion', 'cinematic',
    ],
  },
  {
    category: 'robotics',
    keywords: [
      'robot', 'robotics', 'humanoid', 'embodied', 'physical ai',
      'figure', 'optimus', 'boston dynamics', '1x', 'sanctuary', 'agility',
      'manipulation', 'locomotion', 'dexterous', 'actuator', 'sensor',
      'sim-to-real', 'reinforcement learning robot', 'drone', 'autonomous vehicle',
      'self-driving', 'waymo', 'tesla fsd',
    ],
  },
  {
    category: 'research',
    keywords: [
      'paper', 'arxiv', 'research', 'study', 'published', 'breakthrough',
      'scientists', 'university', 'lab', 'experiment', 'findings',
      'evaluation', 'dataset', 'training data', 'scaling law', 'rlhf',
      'alignment research', 'interpretability', 'mechanistic', 'neuroscience',
      'cognitive', 'theory', 'proof', 'mathematics', 'reasoning',
    ],
  },
  {
    category: 'business',
    keywords: [
      'funding', 'investment', 'valuation', 'startup', 'acquisition',
      'merger', 'ipo', 'series a', 'series b', 'venture', 'billion',
      'revenue', 'profit', 'layoffs', 'hiring', 'ceo', 'partnership',
      'enterprise', 'b2b', 'saas', 'microsoft', 'google', 'meta', 'amazon',
      'apple', 'nvidia', 'anthropic', 'openai deal',
    ],
  },
  {
    category: 'safety',
    keywords: [
      'safety', 'alignment', 'regulation', 'policy', 'ethics', 'bias',
      'hallucination', 'misinformation', 'deepfake', 'copyright', 'privacy',
      'gdpr', 'ai act', 'executive order', 'governance', 'risk', 'harm',
      'responsible ai', 'guardrail', 'red team', 'jailbreak', 'misuse',
      'existential', 'agi safety', 'superalignment',
    ],
  },
  {
    category: 'code',
    keywords: [
      'code', 'coding', 'developer', 'development', 'api', 'sdk', 'github',
      'programming', 'software', 'framework', 'open-source', 'open source',
      'library', 'ide', 'cursor', 'copilot', 'deployment', 'inference',
      'python', 'javascript', 'typescript', 'llm', 'embedding', 'token',
      'fine-tun', 'devtools',
    ],
  },
  {
    category: 'voice',
    keywords: [
      'voice', 'speech', 'tts', 'text-to-speech', 'transcription',
      'elevenlabs', 'whisper', 'speaking', 'translation', 'multilingual',
      'pronunciation', 'accent', 'emotion', 'real-time voice', 'voice clone',
      'voice model', 'narrator', 'dubbing', 'podcast', 'asr',
    ],
  },
  {
    category: 'music',
    keywords: [
      'music', 'song', 'audio', 'sound', 'beat', 'melody', 'composition',
      'suno', 'udio', 'instrument', 'vocal', 'lyrics', 'studio', 'track',
      'mixing', 'mastering', 'chord', 'tempo', 'genre', 'playlist',
      'streaming', 'spotify', 'soundcloud',
    ],
  },
  {
    category: 'editing',
    keywords: [
      'edit', 'creative tool', 'photo edit', 'color grading', 'effects',
      'adobe', 'premiere', 'after effects', 'davinci', 'canva', 'figma',
      'design', 'ui generation', 'asset generation', 'texture', 'pixel',
      'filter', 'retouch', 'background removal',
    ],
  },
]

export function classifyArticle(title: string, excerpt: string): ArticleCategoryId {
  const text = `${title} ${excerpt}`.toLowerCase()

  let bestCategory: ArticleCategoryId = 'models'
  let bestScore = 0

  for (const { category, keywords } of RULES) {
    const score = keywords.reduce((n, kw) => n + (text.includes(kw) ? 1 : 0), 0)
    if (score > bestScore) {
      bestScore = score
      bestCategory = category
    }
  }

  return bestCategory
}
