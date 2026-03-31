import type { CSSProperties } from 'react'
import type { FeedArticle } from '../../data/feed'
import './HeroCard.css'

interface HeroCardProps {
  article: FeedArticle
  onOpen?: (article: FeedArticle) => void
}

export function HeroCard({ article, onOpen }: HeroCardProps) {
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
        <p className="hero-card__meta">
          {article.source}
          <span aria-hidden> · </span>
          {article.readMinutes} min read
        </p>
      </div>
    </article>
  )
}
