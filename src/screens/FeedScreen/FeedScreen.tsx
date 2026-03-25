import { useMemo, useState } from 'react'
import { Bookmark } from 'lucide-react'
import { BottomNav } from '../../components/BottomNav/BottomNav'
import { CategoryChips } from '../../components/CategoryChips/CategoryChips'
import { Header } from '../../components/Header/Header'
import { NewsCard } from '../../components/NewsCard/NewsCard'
import type { CategoryId } from '../../data/categories'
import { FEED_ARTICLES } from '../../data/feed'
import type { NavTabId } from '../../types/nav'
import { PlaceholderScreen } from '../PlaceholderScreen/PlaceholderScreen'
import { ProfileScreen } from '../ProfileScreen/ProfileScreen'
import { RemindersScreen } from '../RemindersScreen/RemindersScreen'
import './FeedScreen.css'

export function FeedScreen() {
  const [tab, setTab] = useState<NavTabId>('feed')
  const [category, setCategory] = useState<CategoryId>('all')

  const articles = useMemo(() => {
    if (category === 'all') return FEED_ARTICLES
    return FEED_ARTICLES.filter((a) => a.categoryId === category)
  }, [category])

  return (
    <div className="app-shell">
      {tab === 'feed' && (
        <>
          <Header onProfileClick={() => setTab('profile')} />
          <CategoryChips active={category} onChange={setCategory} />
        </>
      )}
      <main className="app-scroll">
        {tab === 'feed' &&
          (articles.length === 0 ? (
            <p className="feed-empty">No stories in this category yet.</p>
          ) : (
            articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))
          ))}
        {tab === 'saved' && (
          <PlaceholderScreen
            title="Saved"
            description="Articles you bookmark from the feed will live here."
            Icon={Bookmark}
          />
        )}
        {tab === 'reminders' && <RemindersScreen />}
        {tab === 'profile' && <ProfileScreen />}
      </main>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}
