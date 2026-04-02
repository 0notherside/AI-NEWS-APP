import { FEED_ARTICLES, type FeedArticle } from '../data/feed'

export interface NewsService {
  getFeed: () => Promise<FeedArticle[]>
}

class MockNewsService implements NewsService {
  async getFeed(): Promise<FeedArticle[]> {
    // Backend-ready seam:
    // replace with `fetch('/api/news')` and map response to FeedArticle.
    await new Promise((resolve) => setTimeout(resolve, 700))
    return FEED_ARTICLES
  }
}

export const newsService: NewsService = new MockNewsService()
