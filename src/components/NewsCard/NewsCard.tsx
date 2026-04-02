import { useState, type CSSProperties } from 'react'
import { Bell, Bookmark, Clock, Share2 } from 'lucide-react'
import type { FeedArticle } from '../../data/feed'
import './NewsCard.css'

interface NewsCardProps {
  article?: FeedArticle
  onOpen?: (article: FeedArticle) => void
  skeleton?: boolean
  isSaved?: boolean
  onToggleSave?: (article: FeedArticle) => void
}

export function NewsCard({
  article,
  onOpen,
  skeleton,
  isSaved,
  onToggleSave,
}: NewsCardProps) {
  const [pressed, setPressed] = useState(false)

  /* ── Skeleton placeholder ──────────────────────── */
  if (skeleton) {
    return (
      <article className="news-card news-card--skeleton" aria-hidden>
        <div className="news-card__meta">
          <span className="news-card__tag">Category</span>
          <span className="news-card__time">0h ago</span>
        </div>
        <div className="news-card__main">
          <div className="news-card__image-wrap" />
          <div className="news-card__copy">
            <h2 className="news-card__title">Article headline placeholder loading text here</h2>
            <p className="news-card__excerpt">
              Excerpt placeholder text that spans a couple of lines in the card layout
            </p>
          </div>
        </div>
        <div className="news-card__footer">
          <p className="news-card__source">Source · 0 min read</p>
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
      {/* ── Category + time ──────────────────────────── */}
      <div className="news-card__meta">
        <span className="news-card__tag">
          <span className="news-card__dot" aria-hidden />
          <span className="news-card__tag-emoji" aria-hidden>{article.categoryEmoji}</span>
          {article.categoryLabel}
        </span>
        {/* TODO: replace timeAgo string with ISO datetime once data model adds it */}
        <time className="news-card__time" aria-label={`Published ${article.timeAgo}`}>
          <Clock size={14} strokeWidth={2} aria-hidden />
          {article.timeAgo}
        </time>
      </div>

      {/* ── Thumbnail + copy ─────────────────────────── */}
      <div className="news-card__main">
        <div className="news-card__image-wrap" aria-hidden>
          <img
            className="news-card__image"
            src={article.imageUrl}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="news-card__copy">
          {/*
            Stretched-link pattern: the <h2> button's ::after covers the full
            card. Action buttons sit above it via position:relative + z-index.
          */}
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
          <p className="news-card__excerpt">{article.excerpt}</p>
        </div>
      </div>

      {/* ── Footer: source + actions ─────────────────── */}
      <div className="news-card__footer">
        <p className="news-card__source">
          {article.source}
          <span aria-hidden> · </span>
          {article.readMinutes} min read
        </p>
        <div className="news-card__actions" role="group" aria-label="Article actions">
          <button
            type="button"
            className="news-card__icon-btn"
            aria-label="Set reminder for this article"
            onClick={(e) => e.stopPropagation()}
          >
            <Bell size={20} strokeWidth={1.5} aria-hidden />
          </button>
          <button
            type="button"
            className={`news-card__icon-btn${isSaved ? ' news-card__icon-btn--active' : ''}`}
            aria-label={isSaved ? 'Remove from saved' : 'Save article'}
            aria-pressed={isSaved}
            onClick={(e) => {
              e.stopPropagation()
              onToggleSave?.(article)
            }}
          >
            <Bookmark size={20} strokeWidth={1.5} aria-hidden />
          </button>
          <button
            type="button"
            className="news-card__icon-btn"
            aria-label="Share article"
            onClick={(e) => e.stopPropagation()}
          >
            <Share2 size={20} strokeWidth={1.5} aria-hidden />
          </button>
        </div>
      </div>
    </article>
  )
}
