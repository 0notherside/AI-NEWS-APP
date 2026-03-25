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
    <article className="article-details">
      <button type="button" className="article-details__back" onClick={onBack}>
        <ArrowLeft size={18} strokeWidth={2.2} />
        Back to feed
      </button>

      <p className="article-details__meta">
        <span aria-hidden>{article.categoryEmoji}</span>
        {article.categoryLabel}
        <span aria-hidden> · </span>
        {article.timeAgo}
      </p>

      <h1 className="article-details__title">{article.title}</h1>

      <img
        className="article-details__hero"
        src={article.imageUrl}
        alt=""
        loading="lazy"
        decoding="async"
      />

      <section className="article-details__card">
        <h2 className="article-details__heading">Overview</h2>
        <p className="article-details__text">{article.details.summary}</p>
      </section>

      <section className="article-details__card">
        <h2 className="article-details__heading">What is new</h2>
        <p className="article-details__text">{article.details.whatsNew}</p>
      </section>

      <section className="article-details__card">
        <h2 className="article-details__heading">Key information</h2>
        <ul className="article-details__list">
          {article.details.keyPoints.map((point, index) => (
            <li key={`${article.id}-point-${index}`}>{point}</li>
          ))}
        </ul>
      </section>

      <section className="article-details__card">
        <h2 className="article-details__heading">Pricing</h2>
        <ul className="article-details__list">
          {article.details.pricing.map((point, index) => (
            <li key={`${article.id}-pricing-${index}`}>{point}</li>
          ))}
        </ul>
      </section>

      <section className="article-details__card">
        <h2 className="article-details__heading">Screenshots</h2>
        <div className="article-details__shots">
          {article.details.screenshots.map((url, index) => (
            <img
              key={`${article.id}-shot-${index}`}
              className="article-details__shot"
              src={url}
              alt=""
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
      </section>

      <p className="article-details__source">
        Source: {article.source}
        <ExternalLink size={16} strokeWidth={2} />
      </p>
    </article>
  )
}
