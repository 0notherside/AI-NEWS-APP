import { useState } from 'react'
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
  const [menuOpen, setMenuOpen] = useState(false)

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

        <div className="ad__top-bar">
          <button
            type="button"
            className="ad__circle-btn"
            aria-label="Back"
            onClick={onBack}
          >
            <ArrowLeft size={20} strokeWidth={2.2} aria-hidden />
          </button>

          <button
            type="button"
            className="ad__circle-btn"
            aria-label="Article actions"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <AlignJustify size={20} strokeWidth={2} aria-hidden />
          </button>
        </div>
      </div>

      {/* ── Content sheet ───────────────────────────── */}
      <div className="ad__sheet">
        <div className="ad__tags">
          <span className="ad__tag">{article.categoryLabel}</span>
          <span className="ad__tag">{article.source}</span>
        </div>

        <h1 className="ad__title">{article.title}</h1>

        <p className="ad__byline">
          <span className="ad__byline-author">by {article.source}</span>
          <span className="ad__sep" aria-hidden>·</span>
          <span>{article.readMinutes} min read</span>
          <span className="ad__sep" aria-hidden>·</span>
          <time>{article.timeAgo}</time>
        </p>

        <p className="ad__lead">{article.details.summary}</p>

        <section className="ad__section">
          <h2 className="ad__section-heading">What's new</h2>
          <p className="ad__text">{article.details.whatsNew}</p>
        </section>

        <section className="ad__section">
          <h2 className="ad__section-heading">Key points</h2>
          <ul className="ad__list">
            {article.details.keyPoints.map((point, i) => (
              <li key={`${article.id}-kp-${i}`}>{point}</li>
            ))}
          </ul>
        </section>

        <section className="ad__section">
          <h2 className="ad__section-heading">Pricing</h2>
          <ul className="ad__list">
            {article.details.pricing.map((point, i) => (
              <li key={`${article.id}-pr-${i}`}>{point}</li>
            ))}
          </ul>
        </section>

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
      </div>

      {/* ── Action sheet ────────────────────────────── */}
      {menuOpen && (
        <>
          <div
            className="ad__backdrop"
            aria-hidden
            onClick={() => setMenuOpen(false)}
          />
          <div className="ad__action-sheet" role="dialog" aria-label="Article actions">
            <div className="ad__action-sheet-handle" aria-hidden />

            <button
              type="button"
              className={`ad__action-item${isReminded ? ' ad__action-item--active' : ''}`}
              onClick={() => { onSetReminder?.(article); setMenuOpen(false) }}
            >
              <span className="ad__action-icon">
                <Bell size={20} strokeWidth={1.8} aria-hidden />
              </span>
              <span className="ad__action-label">
                {isReminded ? 'Remove reminder' : 'Set reminder'}
              </span>
            </button>

            <div className="ad__action-divider" />

            <button
              type="button"
              className={`ad__action-item${isSaved ? ' ad__action-item--active' : ''}`}
              onClick={() => { onToggleSave?.(article); setMenuOpen(false) }}
            >
              <span className="ad__action-icon">
                <Bookmark size={20} strokeWidth={1.8} aria-hidden />
              </span>
              <span className="ad__action-label">
                {isSaved ? 'Remove from saved' : 'Save article'}
              </span>
            </button>

            <div className="ad__action-divider" />

            <button
              type="button"
              className="ad__action-item"
              onClick={() => { void shareArticle(article); setMenuOpen(false) }}
            >
              <span className="ad__action-icon">
                <Share2 size={20} strokeWidth={1.8} aria-hidden />
              </span>
              <span className="ad__action-label">Share article</span>
            </button>

            <button
              type="button"
              className="ad__action-cancel"
              onClick={() => setMenuOpen(false)}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </article>
  )
}
