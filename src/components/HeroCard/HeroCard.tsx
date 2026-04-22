import type { CSSProperties } from 'react'
import { Bell, Bookmark, Flame, Share2 } from 'lucide-react'
import type { FeedArticle } from '../../data/feed'
import { shareArticle } from '../../lib/shareArticle'
import './HeroCard.css'

interface HeroCardProps {
  article: FeedArticle
  onOpen?: (article: FeedArticle) => void
  isSaved?: boolean
  onToggleSave?: (article: FeedArticle) => void
  isReminded?: boolean
  onSetReminder?: (article: FeedArticle) => void
  relevance?: number
  onBoostRelevance?: (article: FeedArticle) => void
}

export function HeroCard({
  article,
  onOpen,
  isSaved,
  onToggleSave,
  isReminded,
  onSetReminder,
  relevance = 0,
  onBoostRelevance,
}: HeroCardProps) {
  const style = { '--tag-color': article.categoryColor } as CSSProperties

  return (
    <article
      className="hero-card"
      style={style}
      aria-label={`Featured: ${article.title}`}
    >
      <img
        className="hero-card__image"
        src={article.imageUrl}
        alt=""
        loading="eager"
        decoding="async"
      />
      {/* gradient overlay — purely decorative */}
      <div className="hero-card__overlay" aria-hidden />

      <div className="hero-card__content">
        <span className="hero-card__tag">{article.categoryLabel}</span>
        <h2 className="hero-card__title">
          {onOpen ? (
            <button
              type="button"
              className="hero-card__title-btn"
              onClick={() => onOpen(article)}
            >
              {article.title}
            </button>
          ) : (
            article.title
          )}
        </h2>
        <div className="hero-card__footer">
          <p className="hero-card__meta">
            {article.source}
            <span aria-hidden> · </span>
            {article.readMinutes} min read
          </p>
          <div className="hero-card__actions" role="group" aria-label="Article actions">
            <button
              type="button"
              className="hero-card__relevance-btn"
              aria-label="Increase relevance level"
              onClick={(e) => {
                e.stopPropagation()
                onBoostRelevance?.(article)
              }}
            >
              <Flame size={15} strokeWidth={2} aria-hidden />
              {relevance}
            </button>
            <button
              type="button"
              className={`hero-card__icon-btn${isReminded ? ' hero-card__icon-btn--active' : ''}`}
              aria-label={isReminded ? 'Reminder set' : 'Set reminder for this article'}
              aria-pressed={isReminded}
              onClick={(e) => {
                e.stopPropagation()
                onSetReminder?.(article)
              }}
            >
              <Bell size={20} strokeWidth={1.5} aria-hidden />
            </button>
            <button
              type="button"
              className={`hero-card__icon-btn${isSaved ? ' hero-card__icon-btn--active' : ''}`}
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
              className="hero-card__icon-btn"
              aria-label="Share article"
              onClick={(e) => {
                e.stopPropagation()
                void shareArticle(article)
              }}
            >
              <Share2 size={20} strokeWidth={1.5} aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
