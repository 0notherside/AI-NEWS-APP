import { ArrowLeft, ExternalLink } from 'lucide-react'
import type { FeedArticle } from '../../data/feed'
import './ArticleDetailsScreen.css'

interface ArticleDetailsScreenProps {
  article: FeedArticle
  onBack: () => void
}

export function ArticleDetailsScreen({
  article,
  onBack,
}: ArticleDetailsScreenProps) {
  return (
    <article className="article-details" aria-label={article.title}>
      {/* ── Back navigation ───────────────────────────── */}
      <button
        type="button"
        className="article-details__back"
        aria-label="Back to feed"
        onClick={onBack}
      >
        <ArrowLeft size={18} strokeWidth={2.2} aria-hidden />
        Back to feed
      </button>

      {/* ── Article meta ──────────────────────────────── */}
      <p className="article-details__meta">
        <span className="article-details__meta-emoji" aria-hidden>{article.categoryEmoji}</span>
        {article.categoryLabel}
        <span aria-hidden> · </span>
        {/* TODO: add ISO dateTime to FeedArticle for datetime attr */}
        <time aria-label={`Published ${article.timeAgo}`}>{article.timeAgo}</time>
      </p>

      <h1 className="article-details__title">{article.title}</h1>

      {/* Editorial hero — meaningful alt text describes the image subject */}
      {/* PERF FLAG: missing explicit width/height — may cause CLS */}
      <img
        className="article-details__hero"
        src={article.imageUrl}
        alt={`Hero image for: ${article.title}`}
        loading="lazy"
        decoding="async"
      />

      <section className="article-details__card" aria-label="Overview">
        <h2 className="article-details__heading">Overview</h2>
        <p className="article-details__text">{article.details.summary}</p>
      </section>

      <section className="article-details__card" aria-label="What is new">
        <h2 className="article-details__heading">What&rsquo;s new</h2>
        <p className="article-details__text">{article.details.whatsNew}</p>
      </section>

      <section className="article-details__card" aria-label="Key information">
        <h2 className="article-details__heading">Key information</h2>
        <ul className="article-details__list">
          {article.details.keyPoints.map((point, index) => (
            <li key={`${article.id}-point-${index}`}>{point}</li>
          ))}
        </ul>
      </section>

      <section className="article-details__card" aria-label="Pricing">
        <h2 className="article-details__heading">Pricing</h2>
        <ul className="article-details__list">
          {article.details.pricing.map((point, index) => (
            <li key={`${article.id}-pricing-${index}`}>{point}</li>
          ))}
        </ul>
      </section>

      <section className="article-details__card" aria-label="Screenshots">
        <h2 className="article-details__heading">Screenshots</h2>
        <div className="article-details__shots">
          {article.details.screenshots.map((url, index) => (
            /* PERF FLAG: screenshots missing width/height — potential CLS */
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

      {/*
        Source attribution — no URL in data model yet.
        TODO: add sourceUrl to FeedArticle so this can be a proper <a> link.
      */}
      <p className="article-details__source">
        <ExternalLink size={16} strokeWidth={2} aria-hidden />
        Source: {article.source}
      </p>
    </article>
  )
}
