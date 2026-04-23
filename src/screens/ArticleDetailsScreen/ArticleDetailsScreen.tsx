import { AlignJustify, ArrowLeft, Bell, Bookmark, Share2 } from 'lucide-react'
import type { FeedArticle } from '../../data/feed'
import { shareArticle } from '../../lib/shareArticle'
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
    <article className="ad" aria-label={article.title}>

      {/* ── Hero image ──────────────────────────────── */}
      <div className="ad__hero">
        <img
          className="ad__hero-img"
          src={article.imageUrl}
          alt=""
          loading="eager"
          decoding="async"
        />

        {/* Top navigation buttons */}
        <div className="ad__top-bar">
          <button
            type="button"
            className="ad__circle-btn"
            aria-label="Back"
            onClick={onBack}
          >
            <ArrowLeft size={18} strokeWidth={2.2} aria-hidden />
          </button>

          <div className="ad__top-right">
            <button
              type="button"
              className={`ad__circle-btn${isReminded ? ' ad__circle-btn--active' : ''}`}
              aria-label={isReminded ? 'Reminder set' : 'Set reminder'}
              aria-pressed={isReminded}
              onClick={() => onSetReminder?.(article)}
            >
              <Bell size={17} strokeWidth={2} aria-hidden />
            </button>
            <button
              type="button"
              className={`ad__circle-btn${isSaved ? ' ad__circle-btn--active' : ''}`}
              aria-label={isSaved ? 'Remove from saved' : 'Save'}
              aria-pressed={isSaved}
              onClick={() => onToggleSave?.(article)}
            >
              <Bookmark size={17} strokeWidth={2} aria-hidden />
            </button>
            <button
              type="button"
              className="ad__circle-btn"
              aria-label="More options"
            >
              <AlignJustify size={17} strokeWidth={2} aria-hidden />
            </button>
          </div>
        </div>
      </div>

      {/* ── Content sheet ───────────────────────────── */}
      <div className="ad__sheet">

        {/* Category tags */}
        <div className="ad__tags">
          <span className="ad__tag">{article.categoryLabel}</span>
          <span className="ad__tag">{article.source}</span>
        </div>

        {/* Title */}
        <h1 className="ad__title">{article.title}</h1>

        {/* Byline */}
        <p className="ad__byline">
          <span className="ad__byline-author">by {article.source}</span>
          <span className="ad__sep" aria-hidden>·</span>
          <span>{article.readMinutes} min read</span>
          <span className="ad__sep" aria-hidden>·</span>
          <time>{article.timeAgo}</time>
        </p>

        {/* Lead / summary */}
        <p className="ad__lead">{article.details.summary}</p>

        {/* What's new */}
        <section className="ad__section">
          <h2 className="ad__section-heading">What&rsquo;s new</h2>
          <p className="ad__text">{article.details.whatsNew}</p>
        </section>

        {/* Key points */}
        <section className="ad__section">
          <h2 className="ad__section-heading">Key points</h2>
          <ul className="ad__list">
            {article.details.keyPoints.map((point, i) => (
              <li key={`${article.id}-kp-${i}`}>{point}</li>
            ))}
          </ul>
        </section>

        {/* Pricing */}
        <section className="ad__section">
          <h2 className="ad__section-heading">Pricing</h2>
          <ul className="ad__list">
            {article.details.pricing.map((point, i) => (
              <li key={`${article.id}-pr-${i}`}>{point}</li>
            ))}
          </ul>
        </section>

        {/* Screenshots */}
        {article.details.screenshots.length > 0 && (
          <section className="ad__section">
            <h2 className="ad__section-heading">Screenshots</h2>
            <div className="ad__shots">
              {article.details.screenshots.map((url, i) => (
                <img
                  key={`${article.id}-shot-${i}`}
                  className="ad__shot"
                  src={url}
                  alt={`Screenshot ${i + 1}`}
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>
          </section>
        )}

        {/* Share row */}
        <div className="ad__share-row">
          <button
            type="button"
            className="ad__share-btn"
            aria-label="Share article"
            onClick={() => void shareArticle(article)}
          >
            <Share2 size={16} strokeWidth={2} aria-hidden />
            Share article
          </button>
        </div>

      </div>
    </article>
  )
}
