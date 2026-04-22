import { ArrowLeft, BadgeCheck, Bell, Bookmark, Ellipsis } from 'lucide-react'
import type { FeedArticle } from '../../data/feed'
import './ArticleDetailsScreen.css'

interface ArticleDetailsScreenProps {
  article: FeedArticle
  onBack: () => void
  isSaved?: boolean
  onToggleSave?: (article: FeedArticle) => void
  isReminded?: boolean
  onSetReminder?: (article: FeedArticle) => void
}

export function ArticleDetailsScreen({
  article,
  onBack,
  isSaved,
  onToggleSave,
  isReminded,
  onSetReminder,
}: ArticleDetailsScreenProps) {
  return (
    <article className="article-details" aria-label={article.title}>
      <section className="article-details__hero-shell">
        <img
          className="article-details__hero"
          src={article.imageUrl}
          alt={`Hero image for: ${article.title}`}
          loading="lazy"
          decoding="async"
        />
        <div className="article-details__hero-overlay" aria-hidden />

        <div className="article-details__top-actions">
          <button
            type="button"
            className="article-details__circle-btn"
            aria-label="Back to feed"
            onClick={onBack}
          >
            <ArrowLeft size={20} strokeWidth={2} aria-hidden />
          </button>

          <div className="article-details__top-actions-right">
            <button
              type="button"
              className={`article-details__circle-btn${isReminded ? ' article-details__circle-btn--active' : ''}`}
              aria-label={isReminded ? 'Reminder set' : 'Set reminder'}
              aria-pressed={isReminded}
              onClick={() => onSetReminder?.(article)}
            >
              <Bell size={19} strokeWidth={2} aria-hidden />
            </button>
            <button
              type="button"
              className={`article-details__circle-btn${isSaved ? ' article-details__circle-btn--active' : ''}`}
              aria-label={isSaved ? 'Remove from saved' : 'Save article'}
              aria-pressed={isSaved}
              onClick={() => onToggleSave?.(article)}
            >
              <Bookmark size={19} strokeWidth={2} aria-hidden />
            </button>
            <button
              type="button"
              className="article-details__circle-btn"
              aria-label="More actions"
            >
              <Ellipsis size={20} strokeWidth={2} aria-hidden />
            </button>
          </div>
        </div>

        <div className="article-details__hero-copy">
          <span className="article-details__category-pill">{article.categoryLabel}</span>
          <h1 className="article-details__title">{article.title}</h1>
          <p className="article-details__meta">
            Trending
            <span aria-hidden> · </span>
            <time aria-label={`Published ${article.timeAgo}`}>{article.timeAgo}</time>
          </p>
        </div>
      </section>

      <section className="article-details__sheet" aria-label="Article details">
        <header className="article-details__publisher">
          <span className="article-details__publisher-logo" aria-hidden>
            {article.source.slice(0, 2).toUpperCase()}
          </span>
          <div className="article-details__publisher-copy">
            <p className="article-details__publisher-name">
              {article.source}
              <BadgeCheck size={14} strokeWidth={2.4} aria-hidden />
            </p>
          </div>
        </header>

        <p className="article-details__lead">{article.details.summary}</p>

        <section className="article-details__section" aria-label="What is new">
          <h2 className="article-details__heading">What&rsquo;s new</h2>
          <p className="article-details__text">{article.details.whatsNew}</p>
        </section>

        <section className="article-details__section" aria-label="Key information">
          <h2 className="article-details__heading">Key information</h2>
          <ul className="article-details__list">
            {article.details.keyPoints.map((point, index) => (
              <li key={`${article.id}-point-${index}`}>{point}</li>
            ))}
          </ul>
        </section>

        <section className="article-details__section" aria-label="Pricing">
          <h2 className="article-details__heading">Pricing</h2>
          <ul className="article-details__list">
            {article.details.pricing.map((point, index) => (
              <li key={`${article.id}-pricing-${index}`}>{point}</li>
            ))}
          </ul>
        </section>

        <section className="article-details__section" aria-label="Screenshots">
          <h2 className="article-details__heading">Screenshots</h2>
          <div className="article-details__shots">
            {article.details.screenshots.map((url, index) => (
              <img
                key={`${article.id}-shot-${index}`}
                className="article-details__shot"
                src={url}
                alt={`Screenshot ${index + 1} of ${article.title}`}
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
        </section>
      </section>
    </article>
  )
}
