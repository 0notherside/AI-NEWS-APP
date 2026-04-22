import type { FeedArticle } from '../data/feed'

function buildArticleShareUrl(article: FeedArticle): string {
  const url = new URL(window.location.href)
  url.hash = `article-${article.id}`
  return url.toString()
}

function openSocialShareHub(url: string, title: string): void {
  const shareHub = `https://www.addtoany.com/share#url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
  window.open(shareHub, '_blank', 'noopener,noreferrer')
}

export async function shareArticle(article: FeedArticle): Promise<void> {
  const url = buildArticleShareUrl(article)
  const title = article.title
  const text = `${article.title} — ${article.source}`

  if (navigator.share) {
    try {
      await navigator.share({ title, text, url })
      return
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
    }
  }

  try {
    await navigator.clipboard.writeText(url)
  } catch {
    // Clipboard may be blocked in some contexts; continue to social share hub.
  }

  openSocialShareHub(url, title)
}
