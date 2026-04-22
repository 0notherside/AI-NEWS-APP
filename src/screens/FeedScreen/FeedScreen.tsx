import { useEffect, useMemo, useRef, useState } from 'react'
import { BottomNav } from '../../components/BottomNav/BottomNav'
import { CategoryChips } from '../../components/CategoryChips/CategoryChips'
import { Header } from '../../components/Header/Header'
import { HeroCard } from '../../components/HeroCard/HeroCard'
import { NewsCard } from '../../components/NewsCard/NewsCard'
import { SearchBar } from '../../components/SearchBar/SearchBar'
import type { CategoryId } from '../../data/categories'
import type { FeedArticle } from '../../data/feed'
import { useNewsSettings } from '../../hooks/useNewsSettings'
import { useArticleOpens } from '../../hooks/useArticleOpens'
import { useProfile } from '../../hooks/useProfile'
import { useRelevance } from '../../hooks/useRelevance'
import { useReminders } from '../../hooks/useReminders'
import { useSavedNews } from '../../hooks/useSavedNews'
import { useTheme } from '../../hooks/useTheme'
import { newsService } from '../../services/newsService'
import type { NavTabId } from '../../types/nav'
import { ArticleDetailsScreen } from '../ArticleDetailsScreen/ArticleDetailsScreen'
import { ProfileScreen } from '../ProfileScreen/ProfileScreen'
import { RemindersScreen } from '../RemindersScreen/RemindersScreen'
import { SavedBoardsScreen } from '../SavedBoardsScreen/SavedBoardsScreen'
import './FeedScreen.css'

const SKELETON_COUNT = 3
const COMMUNITY_MIN_RELEVANCE = 10
const COMMUNITY_MAX_POSTS = 15
const COMMUNITY_REFRESH_BATCH_MS = 1400
const COMMUNITY_ANIM_MS = 280

type CommunityRenderItem = {
  article: FeedArticle
  phase: 'enter' | 'stable' | 'exit'
}

export function FeedScreen() {
  const [tab, setTab] = useState<NavTabId>('feed')
  const [category, setCategory] = useState<CategoryId>('all')
  const [communityCategory, setCommunityCategory] = useState<CategoryId>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedArticle, setSelectedArticle] = useState<FeedArticle | null>(null)
  const [reminderArticle, setReminderArticle] = useState<FeedArticle | null>(null)
  const [feed, setFeed] = useState<FeedArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [communityRender, setCommunityRender] = useState<CommunityRenderItem[]>(
    [],
  )
  const communityBatchTimerRef = useRef<number | null>(null)
  const communityFinalizeTimerRef = useRef<number | null>(null)

  const { settings, setSavedRetentionDays, setRefreshIntervalMinutes } =
    useNewsSettings()
  const { lastOpenedById, markOpened } = useArticleOpens()
  const { theme, setTheme } = useTheme()
  const { profile, updateName, updateAvatar } = useProfile()
  const { savedIds, savedArticles, isSaved, toggleSaved } = useSavedNews(
    feed,
    settings.savedRetentionDays,
  )
  const { getRelevance, boostRelevance, topRated } = useRelevance(feed)
  const { reminders, addReminder, removeReminder, hasArticleReminder } =
    useReminders(lastOpenedById)

  /* Backend-ready: feed is loaded through a service abstraction. */
  useEffect(() => {
    let mounted = true
    const loadFeed = async (showLoading: boolean) => {
      if (showLoading) setLoading(true)
      const items = await newsService.getFeed()
      if (!mounted) return
      setFeed(items)
      if (showLoading) setLoading(false)
    }

    loadFeed(true)

    const refreshMs = settings.refreshIntervalMinutes * 60 * 1000
    const interval = window.setInterval(() => {
      loadFeed(false)
    }, refreshMs)

    const onVisible = () => {
      if (document.visibilityState === 'visible') loadFeed(false)
    }
    const onFocus = () => loadFeed(false)
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', onFocus)

    return () => {
      mounted = false
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', onFocus)
    }
  }, [settings.refreshIntervalMinutes])

  /* Featured article is only surfaced in the All feed */
  const featuredArticle = useMemo(
    () => (category === 'all' ? (feed.find((a) => a.featured) ?? null) : null),
    [category, feed],
  )

  /* Regular card list: category filter → search filter → exclude featured */
  const articles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    const base =
      category === 'all'
        ? feed
        : feed.filter((a) => a.categoryId === category)
    const searched = query
      ? base.filter(
          (a) =>
            a.title.toLowerCase().includes(query) ||
            a.excerpt.toLowerCase().includes(query) ||
            a.source.toLowerCase().includes(query),
        )
      : base
    return featuredArticle && !query
      ? searched.filter((a) => a.id !== featuredArticle.id)
      : searched
  }, [category, featuredArticle, feed, searchQuery])

  const communityArticles = useMemo(() => {
    const qualified = topRated.filter(
      (article) => getRelevance(article.id) >= COMMUNITY_MIN_RELEVANCE,
    )
    const filtered =
      communityCategory === 'all'
        ? qualified
        : qualified.filter((article) => article.categoryId === communityCategory)
    return filtered.slice(0, COMMUNITY_MAX_POSTS)
  }, [communityCategory, getRelevance, topRated])

  useEffect(() => {
    if (communityBatchTimerRef.current !== null) {
      window.clearTimeout(communityBatchTimerRef.current)
    }

    communityBatchTimerRef.current = window.setTimeout(() => {
      setCommunityRender((prev) => {
        const targetIds = new Set(communityArticles.map((article) => article.id))
        const prevById = new Map(prev.map((item) => [item.article.id, item]))

        const nextActive: CommunityRenderItem[] = communityArticles.map((article) => {
          const existing = prevById.get(article.id)
          if (!existing || existing.phase === 'exit') {
            return { article, phase: 'enter' }
          }
          return { article, phase: 'stable' }
        })

        const exiting: CommunityRenderItem[] = prev
          .filter((item) => !targetIds.has(item.article.id))
          .map((item) => ({ ...item, phase: 'exit' }))

        return [...nextActive, ...exiting]
      })

      if (communityFinalizeTimerRef.current !== null) {
        window.clearTimeout(communityFinalizeTimerRef.current)
      }
      communityFinalizeTimerRef.current = window.setTimeout(() => {
        setCommunityRender((prev) =>
          prev
            .filter((item) => item.phase !== 'exit')
            .map((item) =>
              item.phase === 'enter' ? { ...item, phase: 'stable' } : item,
            ),
        )
      }, COMMUNITY_ANIM_MS)
    }, COMMUNITY_REFRESH_BATCH_MS)

    return () => {
      if (communityBatchTimerRef.current !== null) {
        window.clearTimeout(communityBatchTimerRef.current)
      }
    }
  }, [communityArticles])

  useEffect(() => {
    return () => {
      if (communityBatchTimerRef.current !== null) {
        window.clearTimeout(communityBatchTimerRef.current)
      }
      if (communityFinalizeTimerRef.current !== null) {
        window.clearTimeout(communityFinalizeTimerRef.current)
      }
    }
  }, [])

  return (
    <div className="app-shell">
      {/* Skip-to-main — visible on focus (WCAG 2.4.1) */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {(tab === 'feed' || tab === 'community') && (
        <>
          <Header
            onProfileClick={() => setTab('profile')}
            userName={profile.name}
            avatarDataUrl={profile.avatarDataUrl}
          />
          {tab === 'feed' && (
            <div
              className="pull-to-refresh"
              role="status"
              aria-label="Pull to refresh"
              aria-live="polite"
            />
          )}
          <CategoryChips
            active={tab === 'feed' ? category : communityCategory}
            onChange={(id) => {
              if (tab === 'feed') {
                setCategory(id)
                setSearchQuery('')
              } else {
                setCommunityCategory(id)
              }
              setSelectedArticle(null)
            }}
          />
          {tab === 'feed' && <SearchBar value={searchQuery} onChange={setSearchQuery} />}
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

        {(tab === 'feed' || tab === 'community') &&
          (selectedArticle ? (
            <ArticleDetailsScreen
              article={selectedArticle}
              onBack={() => setSelectedArticle(null)}
            />
          ) : tab === 'community' ? (
            loading ? (
              Array.from({ length: SKELETON_COUNT }, (_, i) => (
                <NewsCard key={`sk-community-${i}`} skeleton />
              ))
            ) : communityArticles.length === 0 && communityRender.length === 0 ? (
              <section className="community-empty" aria-label="Community threshold info">
                <p className="community-empty__eyebrow">Community Top Stories</p>
                <h2 className="community-empty__title">Not enough reactions yet</h2>
                <p className="community-empty__text">
                  Stories appear here after reaching at least{' '}
                  <strong>{COMMUNITY_MIN_RELEVANCE} reactions</strong>.
                </p>
              </section>
            ) : (
              <div className="community-list">
                {communityRender.map((item) => (
                  <div
                    key={`community-${item.article.id}`}
                    className={`community-list__item community-list__item--${item.phase}`}
                  >
                    <NewsCard
                      article={item.article}
                      onOpen={(a) => {
                        markOpened(a.id)
                        setSelectedArticle(a)
                      }}
                      isSaved={isSaved(item.article.id)}
                      onToggleSave={(a) => toggleSaved(a)}
                      relevance={getRelevance(item.article.id)}
                      onBoostRelevance={(a) => boostRelevance(a.id)}
                      isReminded={hasArticleReminder(item.article.id)}
                      onSetReminder={(a) => {
                        setReminderArticle(a)
                        setTab('reminders')
                      }}
                    />
                  </div>
                ))}
              </div>
            )
          ) : loading ? (
            /* ── Skeleton loading state ───────────────── */
            Array.from({ length: SKELETON_COUNT }, (_, i) => (
              <NewsCard key={`sk-${i}`} skeleton />
            ))
          ) : (
            /* ── Live feed ────────────────────────────── */
            <>
              {featuredArticle && !searchQuery && (
                <HeroCard
                  article={featuredArticle}
                  onOpen={(a) => {
                    markOpened(a.id)
                    setSelectedArticle(a)
                  }}
                  isSaved={isSaved(featuredArticle.id)}
                  onToggleSave={(a) => toggleSaved(a)}
                  relevance={getRelevance(featuredArticle.id)}
                  onBoostRelevance={(a) => boostRelevance(a.id)}
                  isReminded={hasArticleReminder(featuredArticle.id)}
                  onSetReminder={(a) => { setReminderArticle(a); setTab('reminders') }}
                />
              )}
              {articles.length === 0 ? (
                <p className="feed-empty">
                  {searchQuery
                    ? `No stories matching "${searchQuery}".`
                    : 'No stories in this category yet.'}
                </p>
              ) : (
                articles.map((article) => (
                  <NewsCard
                    key={article.id}
                    article={article}
                    onOpen={(a) => {
                      markOpened(a.id)
                      setSelectedArticle(a)
                    }}
                    isSaved={isSaved(article.id)}
                    onToggleSave={(a) => toggleSaved(a)}
                    relevance={getRelevance(article.id)}
                    onBoostRelevance={(a) => boostRelevance(a.id)}
                    isReminded={hasArticleReminder(article.id)}
                    onSetReminder={(a) => { setReminderArticle(a); setTab('reminders') }}
                  />
                ))
              )}
            </>
          ))}

        {tab === 'saved' && (
          <SavedBoardsScreen
            feed={savedArticles}
            savedArticleIds={savedIds}
          />
        )}
        {tab === 'reminders' && (
          <RemindersScreen
            feed={feed}
            prefillArticle={reminderArticle}
            onPrefillConsumed={() => setReminderArticle(null)}
            reminders={reminders}
            addReminder={addReminder}
            removeReminder={removeReminder}
          />
        )}
        {tab === 'profile' && (
          <ProfileScreen
            profile={profile}
            onUpdateName={updateName}
            onUpdateAvatar={updateAvatar}
            savedCount={savedIds.length}
            reminderCount={reminders.length}
            theme={theme}
            onSetTheme={setTheme}
            savedRetentionDays={settings.savedRetentionDays}
            onSetSavedRetentionDays={setSavedRetentionDays}
            refreshIntervalMinutes={settings.refreshIntervalMinutes}
            onSetRefreshIntervalMinutes={setRefreshIntervalMinutes}
          />
        )}
      </main>

      <BottomNav
        active={tab}
        onChange={(id) => {
          setTab(id)
          setSelectedArticle(null)
        }}
      />
    </div>
  )
}
