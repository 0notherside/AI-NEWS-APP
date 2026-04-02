import { useEffect, useMemo, useState } from 'react'
import { BottomNav } from '../../components/BottomNav/BottomNav'
import { CategoryChips } from '../../components/CategoryChips/CategoryChips'
import { Header } from '../../components/Header/Header'
import { HeroCard } from '../../components/HeroCard/HeroCard'
import { NewsCard } from '../../components/NewsCard/NewsCard'
import type { CategoryId } from '../../data/categories'
import type { FeedArticle } from '../../data/feed'
import { useSavedNews } from '../../hooks/useSavedNews'
import { newsService } from '../../services/newsService'
import type { NavTabId } from '../../types/nav'
import { ArticleDetailsScreen } from '../ArticleDetailsScreen/ArticleDetailsScreen'
import { ProfileScreen } from '../ProfileScreen/ProfileScreen'
import { RemindersScreen } from '../RemindersScreen/RemindersScreen'
import { SavedBoardsScreen } from '../SavedBoardsScreen/SavedBoardsScreen'
import './FeedScreen.css'

const SKELETON_COUNT = 3

export function FeedScreen() {
  const [tab, setTab] = useState<NavTabId>('feed')
  const [category, setCategory] = useState<CategoryId>('all')
  const [selectedArticle, setSelectedArticle] = useState<FeedArticle | null>(null)
  const [feed, setFeed] = useState<FeedArticle[]>([])
  const [loading, setLoading] = useState(true)

  const { savedIds, isSaved, toggleSaved } = useSavedNews(feed)

  /* Backend-ready: feed is loaded through a service abstraction. */
  useEffect(() => {
    let mounted = true
    setLoading(true)
    newsService
      .getFeed()
      .then((items) => {
        if (!mounted) return
        setFeed(items)
      })
      .finally(() => {
        if (!mounted) return
        setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  /* Featured article is only surfaced in the All feed */
  const featuredArticle = useMemo(
    () => (category === 'all' ? (feed.find((a) => a.featured) ?? null) : null),
    [category, feed],
  )

  /* Regular card list excludes the featured article to avoid duplication */
  const articles = useMemo(() => {
    const base =
      category === 'all'
        ? feed
        : feed.filter((a) => a.categoryId === category)
    return featuredArticle ? base.filter((a) => a.id !== featuredArticle.id) : base
  }, [category, featuredArticle, feed])

  return (
    <div className="app-shell">
      {/* Skip-to-main — visible on focus (WCAG 2.4.1) */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {tab === 'feed' && (
        <>
          <Header onProfileClick={() => setTab('profile')} />
          {/* Pull-to-refresh affordance zone */}
          <div
            className="pull-to-refresh"
            role="status"
            aria-label="Pull to refresh"
            aria-live="polite"
          />
          <CategoryChips
            active={category}
            onChange={(id) => {
              setCategory(id)
              setSelectedArticle(null)
            }}
          />
        </>
      )}

      <main
        id="main-content"
        className="app-scroll"
        aria-label={
          tab === 'feed'
            ? selectedArticle
              ? 'Article details'
              : 'News feed'
            : undefined
        }
      >
        {/* aria-live region announces feed state to screen readers */}
        {tab === 'feed' && !selectedArticle && (
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          >
            {loading
              ? 'Loading stories…'
              : articles.length === 0
                ? 'No stories in this category.'
                : `${articles.length} ${articles.length === 1 ? 'story' : 'stories'} in feed.`}
          </div>
        )}

        {tab === 'feed' &&
          (selectedArticle ? (
            <ArticleDetailsScreen
              article={selectedArticle}
              onBack={() => setSelectedArticle(null)}
            />
          ) : loading ? (
            /* ── Skeleton loading state ───────────────── */
            Array.from({ length: SKELETON_COUNT }, (_, i) => (
              <NewsCard key={`sk-${i}`} skeleton />
            ))
          ) : (
            /* ── Live feed ────────────────────────────── */
            <>
              {featuredArticle && (
                <HeroCard
                  article={featuredArticle}
                  onOpen={(a) => setSelectedArticle(a)}
                  isSaved={isSaved(featuredArticle.id)}
                  onToggleSave={(a) => toggleSaved(a.id)}
                />
              )}
              {articles.length === 0 ? (
                <p className="feed-empty">No stories in this category yet.</p>
              ) : (
                articles.map((article) => (
                  <NewsCard
                    key={article.id}
                    article={article}
                    onOpen={(a) => setSelectedArticle(a)}
                    isSaved={isSaved(article.id)}
                    onToggleSave={(a) => toggleSaved(a.id)}
                  />
                ))
              )}
            </>
          ))}

        {tab === 'saved' && <SavedBoardsScreen feed={feed} savedArticleIds={savedIds} />}
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
