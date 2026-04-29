import { CATEGORY_META } from '../data/categories'
import { FEED_ARTICLES, type FeedArticle } from '../data/feed'
import { classifyArticle } from '../utils/classify'

export interface NewsService {
  getFeed: () => Promise<FeedArticle[]>
}

export class NewsServiceError extends Error {
  code: 'TIMEOUT' | 'UNAVAILABLE'

  constructor(message: string, code: 'TIMEOUT' | 'UNAVAILABLE') {
    super(message)
    this.name = 'NewsServiceError'
    this.code = code
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timeoutId: number | undefined
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = window.setTimeout(() => {
      reject(new NewsServiceError('Feed request timed out', 'TIMEOUT'))
    }, timeoutMs)
  })
  try {
    return await Promise.race([promise, timeoutPromise])
  } finally {
    if (timeoutId !== undefined) window.clearTimeout(timeoutId)
  }
}

function getSimulatedFailureRate(): number {
  try {
    const raw = localStorage.getItem('ai-pulse-simulated-failure-rate')
    const parsed = Number(raw)
    if (Number.isFinite(parsed) && parsed >= 0 && parsed <= 1) return parsed
    return 0
  } catch {
    return 0
  }
}

/** Runs the classifier and patches the category fields on a single article. */
function applyCategory(article: FeedArticle): FeedArticle {
  const categoryId = classifyArticle(article.title, article.excerpt)
  const meta = CATEGORY_META[categoryId]
  return {
    ...article,
    categoryId,
    categoryLabel: meta.label,
    categoryEmoji: meta.emoji,
    categoryColor: meta.color,
  }
}

class MockNewsService implements NewsService {
  async getFeed(): Promise<FeedArticle[]> {
    // Backend-ready seam:
    // replace with `fetch('/api/news')` and map response to FeedArticle.
    return withTimeout(
      (async () => {
        await delay(450 + Math.floor(Math.random() * 400))
        if (Math.random() < getSimulatedFailureRate()) {
          throw new NewsServiceError('Feed source is temporarily unavailable', 'UNAVAILABLE')
        }
        return FEED_ARTICLES.map(applyCategory)
      })(),
      8000,
    )
  }
}

export const newsService: NewsService = new MockNewsService()
