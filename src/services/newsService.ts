import { CATEGORY_META } from '../data/categories'
import { FEED_ARTICLES, type FeedArticle } from '../data/feed'
import { classifyArticle } from '../utils/classify'

export interface NewsService {
  getFeed: () => Promise<FeedArticle[]>
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
    await new Promise((resolve) => setTimeout(resolve, 700))
    return FEED_ARTICLES.map(applyCategory)
  }
}

export const newsService: NewsService = new MockNewsService()
