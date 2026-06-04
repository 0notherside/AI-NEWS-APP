import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const source = readFileSync('src/screens/FeedScreen/FeedScreen.tsx', 'utf8')
const categoryChipsCss = readFileSync('src/components/CategoryChips/CategoryChips.css', 'utf8')
const articleDetailsCss = readFileSync('src/screens/ArticleDetailsScreen/ArticleDetailsScreen.css', 'utf8')
const feedCss = readFileSync('src/screens/FeedScreen/FeedScreen.css', 'utf8')

assert.ok(
  !source.includes('{recommendationArticles.length > 0 && (\n                    <section className="feed-section">'),
  'feed category chips should not be hidden when a selected category has no posts',
)

assert.match(
  categoryChipsCss,
  /\.category-chips__chip\s*\{[\s\S]*min-width:\s*64px;/,
  'top category tabs should keep a rectangular pill shape instead of collapsing into squares',
)

assert.match(
  categoryChipsCss,
  /\.category-chips__chip\s*\{[\s\S]*background:\s*color-mix\(in srgb,\s*var\(--chip-color\)\s*18%,\s*var\(--color-chip-filled\)\);/,
  'top category tabs should use the same category colors as post labels',
)

assert.ok(
  categoryChipsCss.includes('var(--chip-color)'),
  'category chip styles should be driven by the per-category color variable',
)

assert.match(
  articleDetailsCss,
  /\.ad__tag\s*\{[\s\S]*min-width:\s*56px;/,
  'article detail top tags should keep a rectangular pill shape instead of collapsing into squares',
)

assert.ok(
  !source.includes('BREAKING_PEEK_PX'),
  'breaking carousel should show one full news post, not a peeking neighboring post',
)

assert.match(
  feedCss,
  /\.breaking-card\s*\{[\s\S]*flex:\s*0 0 100%;/,
  'breaking cards should occupy the full carousel viewport',
)

assert.ok(
  source.includes('BREAKING_GAP_PX') &&
    source.includes('width + BREAKING_GAP_PX') &&
    source.includes("'--gap': `${BREAKING_GAP_PX}px`"),
  'breaking carousel should keep spacing between full-width slides without showing a neighboring card',
)

assert.match(
  feedCss,
  /\.breaking-carousel__track\s*\{[\s\S]*gap:\s*var\(--gap\);/,
  'breaking carousel track should separate full-width slides with a real gap',
)

assert.ok(
  source.includes('BREAKING_ROTATE_MS = 5000') &&
    source.includes('window.setInterval') &&
    source.includes('window.clearInterval'),
  'breaking carousel should auto-rotate every 5 seconds and clean up its timer',
)

assert.ok(
  feedCss.includes('background: var(--accent);') &&
    feedCss.includes('animation: breaking-dot-flow 5000ms linear both'),
  'breaking carousel active dot should be orange and flow with the 5-second rotation',
)
