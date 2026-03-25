import { useMemo, useState } from 'react'
import { BottomNav } from '../../components/BottomNav/BottomNav'
import { CategoryChips } from '../../components/CategoryChips/CategoryChips'
import { Header } from '../../components/Header/Header'
import { NewsCard } from '../../components/NewsCard/NewsCard'
import type { CategoryId } from '../../data/categories'
import { FEED_ARTICLES } from '../../data/feed'
import './FeedScreen.css'

export function FeedScreen() {
  const [category, setCategory] = useState<CategoryId>('all')

  const articles = useMemo(() => {
    if (category === 'all') return FEED_ARTICLES
    return FEED_ARTICLES.filter((a) => a.categoryId === category)
  }, [category])

  return (
    <div className="app-shell">
      <Header />
      <CategoryChips active={category} onChange={setCategory} />
      <main className="app-scroll">
        {articles.length === 0 ? (
          <p className="feed-empty">No stories in this category yet.</p>
        ) : (
          articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))
        )}
      </main>
      <BottomNav />
    </div>
  )
}
