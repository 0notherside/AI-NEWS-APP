import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { BottomNav } from '../../components/BottomNav/BottomNav'
import { CategoryChips } from '../../components/CategoryChips/CategoryChips'
import { Header } from '../../components/Header/Header'
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
import { trackEvent } from '../../lib/telemetry'
import { NewsServiceError, newsService } from '../../services/newsService'
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
const BREAKING_PEEK_PX = 14
const BREAKING_GAP_PX = 8
const DEFAULT_BREAKING_VIEWPORT_PX = 360

type CommunityRenderItem = {
  article: FeedArticle
  phase: 'enter' | 'stable' | 'exit'
}

export function FeedScreen() {
  const [tab, setTab] = useState<NavTabId>('feed')
  const [communityCategory, setCommunityCategory] = useState<CategoryId>('all')
  const [feedCategory, setFeedCategory] = useState<CategoryId>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<FeedArticle | null>(null)
  const [reminderArticle, setReminderArticle] = useState<FeedArticle | null>(null)
  const [reminderReturnTab, setReminderReturnTab] = useState<NavTabId>('feed')
  const [breakingIndex, setBreakingIndex] = useState(0)
  const [breakingStepPx, setBreakingStepPx] = useState(() => {
    const viewportGuess =
      typeof window !== 'undefined'
        ? Math.min(window.innerWidth, 430) - 32
        : DEFAULT_BREAKING_VIEWPORT_PX
    return Math.max(viewportGuess - BREAKING_PEEK_PX * 2 + BREAKING_GAP_PX, 240)
  })
  const [feed, setFeed] = useState<FeedArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [lastLoadedAt, setLastLoadedAt] = useState<number | null>(null)
  const [manualReloadToken, setManualReloadToken] = useState(0)
  const [communityRender, setCommunityRender] = useState<CommunityRenderItem[]>(
    [],
  )
  const communityBatchTimerRef = useRef<number | null>(null)
  const communityFinalizeTimerRef = useRef<number | null>(null)
  const breakingViewportRef = useRef<HTMLDivElement | null>(null)
  const loadRequestIdRef = useRef(0)

  const { settings, setSavedRetentionDays, setRefreshIntervalMinutes } =
    useNewsSettings()
  const { lastOpenedById, markOpened } = useArticleOpens()
  const { theme, setTheme } = useTheme()
  const { profile, updateName, updateAvatar } = useProfile()
  const { savedIds, savedArticles, isSaved, toggleSaved } = useSavedNews(
    feed,
    settings.savedRetentionDays,
  )
  const { getRelevance, boostRelevance, hasReacted, topRated, reactionsRemaining } = useRelevance(feed)
  const { reminders, addReminder, removeReminder, hasArticleReminder } =
    useReminders(lastOpenedById)

  /* Backend-ready: feed is loaded through a service abstraction. */
  useEffect(() => {
    let mounted = true
    const loadFeed = async (showLoading: boolean, reason: string) => {
      const requestId = ++loadRequestIdRef.current
      const startedAt = performance.now()
      if (showLoading) setLoading(true)
      else setIsRefreshing(true)

      try {
        const items = await newsService.getFeed()
        if (!mounted || requestId !== loadRequestIdRef.current) return
        setFeed(items)
        setLoadError(null)
        setLastLoadedAt(Date.now())
        trackEvent('feed.load.success', 'info', {
          reason,
          durationMs: Math.round(performance.now() - startedAt),
          itemCount: items.length,
        })
      } catch (error) {
        if (!mounted || requestId !== loadRequestIdRef.current) return
        const message =
          error instanceof NewsServiceError
            ? error.code === 'TIMEOUT'
              ? 'Feed request timed out. Please try again.'
              : 'Feed is temporarily unavailable. Please retry.'
            : 'Unable to refresh feed right now.'
        setLoadError(message)
        trackEvent('feed.load.error', 'warn', {
          reason,
          durationMs: Math.round(performance.now() - startedAt),
          message: error instanceof Error ? error.message : String(error),
        })
      } finally {
        if (mounted && requestId === loadRequestIdRef.current) {
          if (showLoading) setLoading(false)
          else setIsRefreshing(false)
        }
      }
    }

    void loadFeed(true, 'initial')

    const refreshMs = settings.refreshIntervalMinutes * 60 * 1000
    const interval = window.setInterval(() => {
      void loadFeed(false, 'interval')
    }, refreshMs)

    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        void loadFeed(false, 'visibility')
      }
    }
    const onFocus = () => {
      void loadFeed(false, 'focus')
    }
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', onFocus)

    return () => {
      mounted = false
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', onFocus)
    }
  }, [manualReloadToken, settings.refreshIntervalMinutes])

  /* Featured article is only surfaced in the All feed */
  const featuredArticle = useMemo(
    () => feed.find((a) => a.featured) ?? null,
    [feed],
  )

  /* Feed list: search filter → exclude featured when shown in breaking section */
  const articles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    const base = feed
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
  }, [featuredArticle, feed, searchQuery])

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

  const breakingNews = useMemo(() => {
    const withFeatured =
      featuredArticle && !searchQuery
        ? [featuredArticle, ...articles]
        : articles
    return withFeatured.slice(0, 5)
  }, [articles, featuredArticle, searchQuery])
  const activeBreakingIndex = useMemo(() => {
    if (breakingNews.length === 0) return 0
    return Math.min(breakingIndex, breakingNews.length - 1)
  }, [breakingIndex, breakingNews.length])

  const recommendationArticles = useMemo(() => {
    const breakingIds = new Set(breakingNews.map((article) => article.id))
    const withFeatured =
      featuredArticle && !searchQuery
        ? [featuredArticle, ...articles]
        : articles
    const base = withFeatured.filter((article) => !breakingIds.has(article.id))
    return feedCategory === 'all'
      ? base
      : base.filter((article) => article.categoryId === feedCategory)
  }, [articles, breakingNews, featuredArticle, feedCategory, searchQuery])

  useEffect(() => {
    const viewport = breakingViewportRef.current
    if (!viewport) return

    const updateStep = () => {
      const width = viewport.clientWidth
      const step = Math.max(width - BREAKING_PEEK_PX * 2 + BREAKING_GAP_PX, 240)
      setBreakingStepPx(step)
    }

    updateStep()
    window.requestAnimationFrame(updateStep)

    let ro: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(updateStep)
      ro.observe(viewport)
    } else {
      window.addEventListener('resize', updateStep)
    }

    return () => {
      ro?.disconnect()
      window.removeEventListener('resize', updateStep)
    }
  }, [tab, breakingNews.length])

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

  const isArticleOpen =
    (tab === 'feed' || tab === 'community') && selectedArticle !== null

  const openReminderComposer = (article: FeedArticle) => {
    setReminderReturnTab(tab)
    setReminderArticle(article)
    setSelectedArticle(null)
    setTab('reminders')
  }

  return (
    <div className="app-shell">
      {/* Skip-to-main — visible on focus (WCAG 2.4.1) */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {(tab === 'feed' || tab === 'community') && !isArticleOpen && (
        <>
          <Header
            onProfileClick={() => setTab('profile')}
            userName={profile.name}
            avatarDataUrl={profile.avatarDataUrl}
            searchActive={searchOpen}
            onSearchClick={() => {
              setSearchOpen((o) => {
                if (o) setSearchQuery('')
                return !o
              })
            }}
          />
          {tab === 'feed' && searchOpen && (
            <div className="feed-search-bar">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>
          )}
          {tab === 'feed' && (
            <div
              className="pull-to-refresh"
              role="status"
              aria-label="Pull to refresh"
              aria-live="polite"
            />
          )}
          {tab === 'community' && (
            <CategoryChips
              active={communityCategory}
              onChange={(id) => {
                setCommunityCategory(id)
                setSelectedArticle(null)
              }}
            />
          )}

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
              : isRefreshing
                ? 'Refreshing stories…'
                : loadError
                  ? `Feed issue: ${loadError}`
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
              isSaved={isSaved(selectedArticle.id)}
              onToggleSave={(a) => toggleSaved(a)}
              isReminded={hasArticleReminder(selectedArticle.id)}
              onSetReminder={openReminderComposer}
            />
          ) : tab === 'community' ? (
            loading ? (
              <div className="community-wrap">
                <div className="community-header">
                  <h2 className="community-header__title">Top Stories</h2>
                  <span className="community-header__sub">Ranked by reactions</span>
                </div>
                {Array.from({ length: SKELETON_COUNT }, (_, i) => (
                  <NewsCard key={`sk-community-${i}`} skeleton />
                ))}
              </div>
            ) : communityArticles.length === 0 && communityRender.length === 0 ? (
              <div className="community-wrap">
                <div className="community-header">
                  <h2 className="community-header__title">Top Stories</h2>
                  <span className="community-header__sub">Ranked by reactions</span>
                </div>
                <section className="community-empty" aria-label="Community threshold info">
                  <span className="community-empty__icon">🔥</span>
                  <h3 className="community-empty__title">No top stories yet</h3>
                  <p className="community-empty__text">
                    React to articles in the feed — stories with{' '}
                    <strong>{COMMUNITY_MIN_RELEVANCE}+ reactions</strong> appear here.
                  </p>
                </section>
              </div>
            ) : (
              <div className="community-wrap">
                <div className="community-header">
                  <h2 className="community-header__title">Top Stories</h2>
                  <span className="community-header__sub">Ranked by reactions</span>
                </div>
                <div className="community-list">
                  {communityRender.map((item, index) => (
                    <div
                      key={`community-${item.article.id}`}
                      className={`community-list__item community-list__item--${item.phase}`}
                    >
                      <div className="community-rank">
                        <span className="community-rank__number">#{index + 1}</span>
                      </div>
                      <NewsCard
                        article={item.article}
                        onOpen={(a) => {
                          markOpened(a.id)
                          setSelectedArticle(a)
                        }}
                        isSaved={isSaved(item.article.id)}
                        onToggleSave={(a) => toggleSaved(a)}
                        relevance={getRelevance(item.article.id)}
                        userHasReacted={hasReacted(item.article.id)}
                        reactionsRemaining={reactionsRemaining}
                        onBoostRelevance={(a) => boostRelevance(a.id)}
                        isReminded={hasArticleReminder(item.article.id)}
                        onSetReminder={openReminderComposer}
                      />
                    </div>
                  ))}
                </div>
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
              {loadError && articles.length > 0 && (
                <section className="feed-alert" role="status" aria-live="polite">
                  <p className="feed-alert__text">{loadError}</p>
                  <button
                    type="button"
                    className="feed-alert__retry"
                    onClick={() => setManualReloadToken((prev) => prev + 1)}
                  >
                    Retry now
                  </button>
                </section>
              )}
              {articles.length === 0 ? (
                loadError ? (
                  <section className="feed-empty feed-empty--error" role="alert">
                    <p className="feed-empty__title">Could not load stories</p>
                    <p className="feed-empty__text">{loadError}</p>
                    <button
                      type="button"
                      className="feed-empty__retry"
                      onClick={() => setManualReloadToken((prev) => prev + 1)}
                    >
                      Retry feed
                    </button>
                  </section>
                ) : (
                  <p className="feed-empty">
                    {searchQuery
                      ? `No stories matching "${searchQuery}".`
                      : 'No stories in this category yet.'}
                  </p>
                )
              ) : (
                <>
                  {breakingNews.length > 0 && (
                    <section className="feed-section">
                      <div className="feed-section__header">
                        <h2 className="feed-section__title">Breaking News!</h2>
                      </div>

                      <div
                        className="breaking-carousel"
                        aria-label="Breaking stories"
                        style={
                          {
                            '--peek': `${BREAKING_PEEK_PX}px`,
                            '--gap': `${BREAKING_GAP_PX}px`,
                            '--slide-width': `${Math.max(breakingStepPx - BREAKING_GAP_PX, 0)}px`,
                          } as CSSProperties
                        }
                      >
                        {breakingNews.length > 1 && (
                          <button
                            type="button"
                            className="breaking-carousel__nav breaking-carousel__nav--prev"
                            aria-label="Previous breaking story"
                            onClick={() =>
                              setBreakingIndex((prev) =>
                                prev === 0 ? breakingNews.length - 1 : prev - 1,
                              )
                            }
                          >
                            &#8249;
                          </button>
                        )}

                        <div ref={breakingViewportRef} className="breaking-carousel__viewport">
                          <div
                            className="breaking-carousel__track"
                            style={{ transform: `translateX(-${activeBreakingIndex * breakingStepPx}px)` }}
                          >
                            {breakingNews.map((article) => (
                              <article
                                key={`breaking-${article.id}`}
                                className="breaking-card"
                                role="button"
                                tabIndex={0}
                                onClick={() => {
                                  markOpened(article.id)
                                  setSelectedArticle(article)
                                }}
                                onKeyDown={(event) => {
                                  if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault()
                                    markOpened(article.id)
                                    setSelectedArticle(article)
                                  }
                                }}
                              >
                                <img
                                  className="breaking-card__image"
                                  src={article.imageUrl}
                                  alt=""
                                  loading="lazy"
                                  decoding="async"
                                />
                                <div className="breaking-card__overlay" aria-hidden />
                                <div className="breaking-card__content">
                                  <span className="breaking-card__tag">{article.categoryLabel}</span>
                                  <p className="breaking-card__meta">
                                    {article.source}
                                    <span aria-hidden> · </span>
                                    {article.timeAgo}
                                  </p>
                                  <h3 className="breaking-card__title">{article.title}</h3>
                                </div>
                              </article>
                            ))}
                          </div>
                        </div>

                        {breakingNews.length > 1 && (
                          <button
                            type="button"
                            className="breaking-carousel__nav breaking-carousel__nav--next"
                            aria-label="Next breaking story"
                            onClick={() =>
                              setBreakingIndex((prev) =>
                                prev === breakingNews.length - 1 ? 0 : prev + 1,
                              )
                            }
                          >
                            &#8250;
                          </button>
                        )}
                      </div>

                      {breakingNews.length > 1 && (
                        <div className="breaking-carousel__dots" aria-hidden>
                          {breakingNews.map((article, index) => (
                            <button
                              key={`dot-${article.id}`}
                              type="button"
                              className={`breaking-carousel__dot${index === breakingIndex ? ' breaking-carousel__dot--active' : ''}`}
                              aria-label={`Show breaking story ${index + 1}`}
                              aria-pressed={index === activeBreakingIndex}
                              onClick={() => setBreakingIndex(index)}
                            />
                          ))}
                        </div>
                      )}
                    </section>
                  )}

                  {recommendationArticles.length > 0 && (
                    <section className="feed-section">
                      <div className="feed-section__header">
                        <h2 className="feed-section__title">Trending Now</h2>
                      </div>
                      <CategoryChips
                        active={feedCategory}
                        onChange={setFeedCategory}
                      />
                      {recommendationArticles.map((article) => (
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
                          userHasReacted={hasReacted(article.id)}
                          reactionsRemaining={reactionsRemaining}
                          onBoostRelevance={(a) => boostRelevance(a.id)}
                          isReminded={hasArticleReminder(article.id)}
                          onSetReminder={openReminderComposer}
                        />
                      ))}
                    </section>
                  )}
                </>
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
            key={`reminders-${reminderArticle?.id ?? 'none'}`}
            feed={feed}
            prefillArticle={reminderArticle}
            onPrefillConsumed={() => setReminderArticle(null)}
            onCancelPrefill={() => {
              setReminderArticle(null)
              setTab(reminderReturnTab === 'reminders' ? 'feed' : reminderReturnTab)
            }}
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

      {!isArticleOpen && (
        <BottomNav
          active={tab}
          onChange={(id) => {
            setTab(id)
            setSelectedArticle(null)
          }}
        />
      )}
      {tab === 'feed' && lastLoadedAt && (
        <p className="feed-last-updated" aria-live="polite">
          Updated {new Date(lastLoadedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      )}
    </div>
  )
}
