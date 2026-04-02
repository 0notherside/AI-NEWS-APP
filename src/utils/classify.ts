import type { ArticleCategoryId } from '../data/categories'

/**
 * Keyword rules for each category.
 * Each match adds 1 point; the highest-scoring category wins.
 * Order matters only as a tiebreak (first rule wins on equal score).
 */
const RULES: Array<{ category: ArticleCategoryId; keywords: string[] }> = [
  {
    category: 'code',
    keywords: [
      'code', 'coding', 'developer', 'development', 'api', 'sdk', 'github',
      'programming', 'software', 'framework', 'open-source', 'open source',
      'library', 'ide', 'cursor', 'copilot', 'gpt', 'llama', 'claude',
      'deployment', 'inference', 'benchmark', 'dataset', 'model weights',
      'fine-tun', 'training', 'python', 'javascript', 'typescript', 'agent',
      'token', 'context window', 'multimodal', 'llm', 'rag', 'embedding',
    ],
  },
  {
    category: 'editing',
    keywords: [
      'edit', 'editing', 'video', 'image', 'photo', 'visual', 'footage',
      'clip', 'render', 'animation', 'effects', 'sora', 'runway', 'pika',
      'dall-e', 'midjourney', 'stable diffusion', 'comfyui', 'generative',
      'text-to-video', 'text-to-image', 'inpainting', 'upscal', 'filter',
      'color grading', 'frame', 'resolution', 'pixel',
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
    category: 'voice',
    keywords: [
      'voice', 'speech', 'tts', 'text-to-speech', 'transcription',
      'elevenlabs', 'whisper', 'speaking', 'translation', 'multilingual',
      'pronunciation', 'accent', 'emotion', 'real-time voice', 'voice clone',
      'voice model', 'narrator', 'dubbing', 'podcast',
    ],
  },
]

/**
 * Returns the best-matching category for the given article text.
 * Falls back to 'code' if no keywords match.
 */
export function classifyArticle(title: string, excerpt: string): ArticleCategoryId {
  const text = `${title} ${excerpt}`.toLowerCase()

  let bestCategory: ArticleCategoryId = 'code'
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
