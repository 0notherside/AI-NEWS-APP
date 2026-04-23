import { useState, type CSSProperties } from 'react'
import { Bell, Bookmark, Share2 } from 'lucide-react'
import type { FeedArticle } from '../../data/feed'
import { shareArticle } from '../../lib/shareArticle'
import './NewsCard.css'

interface NewsCardProps {
  article?: FeedArticle
  onOpen?: (article: FeedArticle) => void
  skeleton?: boolean
  isSaved?: boolean
  onToggleSave?: (article: FeedArticle) => void
  isReminded?: boolean
  onSetReminder?: (article: FeedArticle) => void
  relevance?: number
  onBoostRelevance?: (article: FeedArticle) => void
}

export function NewsCard({
  article,
  onOpen,
  skeleton,
  isSaved,
  onToggleSave,
  isReminded,
  onSetReminder,
}: NewsCardProps) {
  const [pressed, setPressed] = useState(false)

  if (skeleton) {
    return (
      <article className="news-card news-card--skeleton" aria-hidden>
        <div className="news-card__img-wrap news-card__img-wrap--sk" />
        <div className="news-card__body">
          <div className="news-card__sk-title" />
          <div className="news-card__sk-byline" />
        </div>
      </article>
    )
  }

  if (!article) return null

  const style = { '--tag-color': article.categoryColor } as CSSProperties

  return (
    <article
      className={`news-card${pressed ? ' news-card--pressed' : ''}`}
      style={style}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
    >
      {/* ── Image with overlaid chip + actions ─────── */}
      <div className="news-card__img-wrap">
        <img
          className="news-card__img"
          src={article.imageUrl}
          alt=""
          loading="lazy"
          decoding="async"
        />

        {/* Bottom overlay bar: chip left, actions right */}
        <div className="news-card__img-overlay" aria-hidden={false}>
          {/* Category chip — bottom-left, solid filled */}
          <span className="news-card__chip">{article.categoryLabel}</span>

          {/* Action buttons — bottom-right, frosted backdrop */}
          <div className="news-card__actions" role="group" aria-label="Article actions">
            <button
              type="button"
              className={`news-card__icon-btn${isReminded ? ' news-card__icon-btn--active' : ''}`}
              aria-label={isReminded ? 'Reminder set' : 'Set reminder'}
              aria-pressed={isReminded}
              onClick={(e) => { e.stopPropagation(); onSetReminder?.(article) }}
            >
              <Bell size={17} strokeWidth={1.8} aria-hidden />
            </button>
            <button
              type="button"
              className={`news-card__icon-btn${isSaved ? ' news-card__icon-btn--active' : ''}`}
              aria-label={isSaved ? 'Remove from saved' : 'Save article'}
              aria-pressed={isSaved}
              onClick={(e) => { e.stopPropagation(); onToggleSave?.(article) }}
            >
              <Bookmark size={17} strokeWidth={1.8} aria-hidden />
            </button>
            <button
              type="button"
              className="news-card__icon-btn"
              aria-label="Share article"
              onClick={(e) => { e.stopPropagation(); void shareArticle(article) }}
            >
              <Share2 size={17} strokeWidth={1.8} aria-hidden />
            </button>
          </div>
        </div>
      </div>

      {/* ── Text body: title + byline ───────────────── */}
      <div className="news-card__body">
        <h2 className="news-card__title">
          {onOpen ? (
            <button
              type="button"
              className="news-card__title-btn"
              onClick={() => onOpen(article)}
            >
              {article.title}
            </button>
          ) : (
            article.title
          )}
        </h2>

        <p className="news-card__byline">
          <span>by {article.source}</span>
          <span className="news-card__sep" aria-hidden>·</span>
          <span>{article.readMinutes} min read</span>
          <span className="news-card__sep" aria-hidden>·</span>
          <time>{article.timeAgo}</time>
        </p>
      </div>
    </article>
  )
}
