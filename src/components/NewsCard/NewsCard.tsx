import type { CSSProperties } from 'react'
import { Bookmark, Bell, Clock } from 'lucide-react'
import type { FeedArticle } from '../../data/feed'
import './NewsCard.css'

interface NewsCardProps {
  article: FeedArticle
}

export function NewsCard({ article }: NewsCardProps) {
  const style = { '--tag-color': article.categoryColor } as CSSProperties

  return (
    <article className="news-card" style={style}>
      <div className="news-card__meta">
        <span className="news-card__tag">
          <span className="news-card__dot" aria-hidden />
          <span aria-hidden>{article.categoryEmoji}</span>
          {article.categoryLabel}
        </span>
        <span className="news-card__time">
          <Clock size={14} strokeWidth={2} aria-hidden />
          {article.timeAgo}
        </span>
      </div>
      <div className="news-card__main">
        <div className="news-card__image-wrap">
          <img
            className="news-card__image"
            src={article.imageUrl}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="news-card__copy">
          <h2 className="news-card__title">{article.title}</h2>
          <p className="news-card__excerpt">{article.excerpt}</p>
        </div>
      </div>
      <div className="news-card__footer">
        <p className="news-card__source">
          {article.source}
          <span aria-hidden> · </span>
          {article.readMinutes} min read
        </p>
        <div className="news-card__actions">
          <button
            type="button"
            className="news-card__icon-btn"
            aria-label="Remind me"
          >
            <Bell size={20} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            className="news-card__icon-btn"
            aria-label="Save article"
          >
            <Bookmark size={20} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </article>
  )
}
