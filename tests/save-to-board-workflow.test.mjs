import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const savedHook = readFileSync('src/hooks/useSavedNews.ts', 'utf8')
const feedScreen = readFileSync('src/screens/FeedScreen/FeedScreen.tsx', 'utf8')
const saveSheet = readFileSync('src/components/SaveBoardSheet/SaveBoardSheet.tsx', 'utf8')

assert.match(
  savedHook,
  /STORAGE_KEY\s*=\s*'ai-pulse-saved-boards-v1'/,
  'saved articles should use the board-based local storage model',
)

for (const apiName of ['boards', 'saveToBoard', 'createBoard', 'removeFromAll']) {
  assert.ok(
    savedHook.includes(apiName),
    `useSavedNews should expose ${apiName} for Pinterest-style board saves`,
  )
}

assert.ok(
  feedScreen.includes('SaveBoardSheet'),
  'feed screen should render a Pinterest-style Save to board sheet',
)

assert.ok(
  saveSheet.includes('Create new board'),
  'save sheet should let users create a custom board from the save flow',
)
