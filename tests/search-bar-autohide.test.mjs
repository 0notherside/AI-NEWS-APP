import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const feedScreen = readFileSync('src/screens/FeedScreen/FeedScreen.tsx', 'utf8')
const searchBar = readFileSync('src/components/SearchBar/SearchBar.tsx', 'utf8')

assert.ok(
  feedScreen.includes('closeSearch') &&
    feedScreen.includes('setSearchOpen(false)') &&
    feedScreen.includes("setSearchQuery('')"),
  'feed screen should have a helper that hides and clears search',
)

assert.ok(
  feedScreen.includes('onScroll={handleFeedScroll}'),
  'feed scrolling should hide the open search bar',
)

assert.ok(
  feedScreen.includes("window.addEventListener('scroll', handleWindowScroll") &&
    feedScreen.includes("window.removeEventListener('scroll', handleWindowScroll"),
  'window scrolling should also hide the open search bar',
)

assert.ok(
  searchBar.includes('autoFocus?: boolean') &&
    searchBar.includes('onInactive?: () => void') &&
    searchBar.includes('autoFocus={autoFocus}'),
  'search bar should support autofocus and an inactive callback',
)
