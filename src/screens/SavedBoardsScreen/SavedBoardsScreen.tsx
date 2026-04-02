import { useState } from 'react'
import type { FormEvent } from 'react'
import { Plus } from 'lucide-react'
import type { FeedArticle } from '../../data/feed'
import './SavedBoardsScreen.css'

interface Board {
  id: string
  name: string
  updated: string
  articleIds: string[]
}

interface SavedBoardsScreenProps {
  feed: FeedArticle[]
  savedArticleIds: string[]
}

const INITIAL_BOARDS: Board[] = [
  { id: 'b1', name: 'AI Video', updated: 'Updated today', articleIds: [] },
  { id: 'b2', name: 'Music AI', updated: 'Updated yesterday', articleIds: [] },
  { id: 'b3', name: 'Voice Tools', updated: 'Updated 2 days ago', articleIds: [] },
]

function boardId() {
  return `board-${Math.random().toString(36).slice(2, 10)}`
}

export function SavedBoardsScreen({ feed, savedArticleIds }: SavedBoardsScreenProps) {
  const [boards, setBoards] = useState<Board[]>(INITIAL_BOARDS)
  const [newBoard, setNewBoard] = useState('')

  const onCreate = (e: FormEvent) => {
    e.preventDefault()
    const name = newBoard.trim()
    if (!name) return
    setBoards((prev) => [
      { id: boardId(), name, updated: 'Just created', articleIds: [] },
      ...prev,
    ])
    setNewBoard('')
  }

  const feedById = new Map(feed.map((article) => [article.id, article]))
  const savedFeedArticles = savedArticleIds
    .map((id) => feedById.get(id))
    .filter((a): a is FeedArticle => Boolean(a))

  const combinedBoards: Board[] = [
    {
      id: 'all-saved',
      name: 'Main Feed Saves',
      updated:
        savedFeedArticles.length > 0 ? 'Updated just now' : 'No saved news yet',
      articleIds: savedFeedArticles.map((a) => a.id),
    },
    ...boards,
  ]

  return (
    <section className="saved-boards" aria-label="Saved boards">
      <header className="saved-boards__header">
        <h1 className="saved-boards__title">Saved boards</h1>
        <p className="saved-boards__subtitle">
          Organise AI news like Pinterest collections.
        </p>
      </header>

      <form
        className="saved-boards__create"
        onSubmit={onCreate}
        aria-label="Create a new board"
      >
        <label htmlFor="new-board-name" className="sr-only">
          Board name
        </label>
        <input
          id="new-board-name"
          className="saved-boards__input"
          type="text"
          value={newBoard}
          onChange={(e) => setNewBoard(e.target.value)}
          placeholder="Create a board (e.g. AI Agents)"
          aria-label="Board name"
        />
        <button
          type="submit"
          className="saved-boards__create-btn"
          aria-label="Create new board"
        >
          <Plus size={16} strokeWidth={2.5} aria-hidden />
          New
        </button>
      </form>

      <div
        className="saved-boards__grid"
        role="list"
        aria-label="Your boards"
        aria-live="polite"
        aria-atomic="false"
      >
        {combinedBoards.map((board) => {
          const boardArticles = board.articleIds
            .map((id) => feedById.get(id))
            .filter((a): a is FeedArticle => Boolean(a))
          const covers = boardArticles.slice(0, 3).map((a) => a.imageUrl)

          return (
            <article
              key={board.id}
              className="saved-boards__card"
              role="listitem"
              aria-label={`${board.name} board, ${boardArticles.length} saves`}
            >
              <div className="saved-boards__mosaic" aria-hidden>
                {covers.length === 0 ? (
                  <div className="saved-boards__empty-cover">No pins yet</div>
                ) : (
                  <>
                    <img
                      src={covers[0]}
                      alt=""
                      className="saved-boards__cover-main"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="saved-boards__cover-stack">
                      {covers.slice(1, 3).map((cover, i) => (
                        <img
                          key={`${board.id}-${i}`}
                          src={cover}
                          alt=""
                          className="saved-boards__cover-side"
                          loading="lazy"
                          decoding="async"
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="saved-boards__meta">
                <h2 className="saved-boards__name">{board.name}</h2>
                <p className="saved-boards__info">
                  {boardArticles.length} saves · {board.updated}
                </p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
