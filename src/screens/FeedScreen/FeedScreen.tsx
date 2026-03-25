import { useMemo, useState } from 'react'
import { BottomNav } from '../../components/BottomNav/BottomNav'
import { CategoryChips } from '../../components/CategoryChips/CategoryChips'
import { Header } from '../../components/Header/Header'
import { NewsCard } from '../../components/NewsCard/NewsCard'
import type { CategoryId } from '../../data/categories'
import { FEED_ARTICLES, type FeedArticle } from '../../data/feed'
import type { NavTabId } from '../../types/nav'
import { ArticleDetailsScreen } from '../ArticleDetailsScreen/ArticleDetailsScreen'
import { ProfileScreen } from '../ProfileScreen/ProfileScreen'
import { RemindersScreen } from '../RemindersScreen/RemindersScreen'
import { SavedBoardsScreen } from '../SavedBoardsScreen/SavedBoardsScreen'
import './FeedScreen.css'

export function FeedScreen() {
  const [tab, setTab] = useState<NavTabId>('feed')
  const [category, setCategory] = useState<CategoryId>('all')
  const [selectedArticle, setSelectedArticle] = useState<FeedArticle | null>(null)

  const articles = useMemo(() => {
    if (category === 'all') return FEED_ARTICLES
    return FEED_ARTICLES.filter((a) => a.categoryId === category)
  }, [category])

  return (
    <div className="app-shell">
      {tab === 'feed' && (
        <>
          <Header onProfileClick={() => setTab('profile')} />
          <CategoryChips
            active={category}
            onChange={(id) => {
              setCategory(id)
              setSelectedArticle(null)
            }}
          />
        </>
      )}
      <main className="app-scroll">
        {tab === 'feed' &&
          (selectedArticle ? (
            <ArticleDetailsScreen
              article={selectedArticle}
              onBack={() => setSelectedArticle(null)}
            />
          ) : articles.length === 0 ? (
            <p className="feed-empty">No stories in this category yet.</p>
          ) : (
            articles.map((article) => (
              <NewsCard
                key={article.id}
                article={article}
                onOpen={(a) => setSelectedArticle(a)}
              />
            ))
          ))}
        {tab === 'saved' && <SavedBoardsScreen />}
        {tab === 'reminders' && <RemindersScreen />}
        {tab === 'profile' && <ProfileScreen />}
      </main>
      <BottomNav
        active={tab}
        onChange={(id) => {
          setTab(id)
          if (id !== 'feed') setSelectedArticle(null)
        }}
      />
    </div>
  )
}
