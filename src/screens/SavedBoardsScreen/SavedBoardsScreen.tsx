import { Bookmark } from 'lucide-react'
import type { FeedArticle } from '../../data/feed'
import { CATEGORY_META } from '../../data/categories'
import type { ArticleCategoryId } from '../../data/categories'
import './SavedBoardsScreen.css'

interface SavedBoardsScreenProps {
  feed: FeedArticle[]
  savedArticleIds: string[]
}

export function SavedBoardsScreen({ feed, savedArticleIds }: SavedBoardsScreenProps) {
  const feedById = new Map(feed.map((a) => [a.id, a]))

  // All saved articles in order saved (most recent first)
  const savedArticles = savedArticleIds
    .map((id) => feedById.get(id))
    .filter((a): a is FeedArticle => Boolean(a))
    .reverse()

  // Group by category — only categories that actually have saved articles appear
  const byCategory = new Map<ArticleCategoryId, FeedArticle[]>()
  for (const article of savedArticles) {
    const cat = article.categoryId as ArticleCategoryId
    if (!byCategory.has(cat)) byCategory.set(cat, [])
    byCategory.get(cat)!.push(article)
  }

  const categoryFolders = [...byCategory.entries()]

  return (
    <section className="saved-boards" aria-label="Saved articles">
      {/* ── Header ─────────────────────────────────── */}
      <header className="saved-boards__header">
        <h1 className="saved-boards__title">Saved</h1>
        <p className="saved-boards__subtitle">
          {savedArticles.length > 0
            ? `${savedArticles.length} article${savedArticles.length !== 1 ? 's' : ''} · folders appear as you save`
            : 'Folders appear automatically as you save articles'}
        </p>
      </header>

      {savedArticles.length === 0 ? (
        /* ── Empty state ─────────────────────────── */
        <div className="saved-boards__empty">
          <div className="saved-boards__empty-icon">
            <Bookmark size={28} strokeWidth={1.5} aria-hidden />
          </div>
          <h2 className="saved-boards__empty-title">Nothing saved yet</h2>
          <p className="saved-boards__empty-text">
            Tap the bookmark on any article. It will automatically appear in the
            matching category folder here.
          </p>
        </div>
      ) : (
        <div className="saved-boards__grid" role="list" aria-label="Category folders">

          {/* ── All saved — always first ─────────── */}
          <article
            className="saved-boards__card"
            role="listitem"
            aria-label={`All saved, ${savedArticles.length} articles`}
          >
            <div className="saved-boards__mosaic" aria-hidden>
              <CoverMosaic articles={savedArticles} fallbackEmoji="🔖" />
            </div>
            <div className="saved-boards__meta">
              <div className="saved-boards__name-row">
                <span className="saved-boards__folder-emoji" aria-hidden>🔖</span>
                <h2 className="saved-boards__name">All Saved</h2>
              </div>
              <p className="saved-boards__info">
                {savedArticles.length} article{savedArticles.length !== 1 ? 's' : ''}
              </p>
            </div>
          </article>

          {/* ── Per-category folders ─────────────── */}
          {categoryFolders.map(([catId, articles]) => {
            const meta = CATEGORY_META[catId]
            if (!meta) return null
            return (
              <article
                key={catId}
                className="saved-boards__card"
                role="listitem"
                aria-label={`${meta.label} folder, ${articles.length} articles`}
              >
                <div className="saved-boards__mosaic" aria-hidden>
                  <CoverMosaic articles={articles} fallbackEmoji={meta.emoji} />
                </div>
                <div className="saved-boards__meta">
                  <div className="saved-boards__name-row">
                    <span className="saved-boards__folder-emoji" aria-hidden>
                      {meta.emoji}
                    </span>
                    <h2 className="saved-boards__name">
                      {meta.label.charAt(0) + meta.label.slice(1).toLowerCase()}
                    </h2>
                  </div>
                  <p className="saved-boards__info">
                    {articles.length} article{articles.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

/* ── Cover mosaic helper ───────────────────────────── */
function CoverMosaic({
  articles,
  fallbackEmoji,
}: {
  articles: FeedArticle[]
  fallbackEmoji: string
}) {
  const covers = articles.slice(0, 3).map((a) => a.imageUrl)

  if (covers.length === 0) {
    return (
      <div className="saved-boards__empty-cover">
        <span>{fallbackEmoji}</span>
      </div>
    )
  }

  return (
    <>
      <img src={covers[0]} alt="" className="saved-boards__cover-main" loading="lazy" decoding="async" />
      {covers.length > 1 && (
        <div className="saved-boards__cover-stack">
          {covers.slice(1, 3).map((url, i) => (
            <img key={i} src={url} alt="" className="saved-boards__cover-side" loading="lazy" decoding="async" />
          ))}
        </div>
      )}
    </>
  )
}
