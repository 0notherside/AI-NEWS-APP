import { BookmarkX, Check, Plus, X } from 'lucide-react'
import { useState } from 'react'
import type { SavedBoardView } from '../../hooks/useSavedNews'
import type { FeedArticle } from '../../data/feed'
import './SaveBoardSheet.css'

interface SaveBoardSheetProps {
  article: FeedArticle
  boards: SavedBoardView[]
  isSavedToBoard: (articleId: string, boardId: string) => boolean
  onSaveToBoard: (article: FeedArticle, boardId: string) => void
  onRemoveFromBoard: (articleId: string, boardId: string) => void
  onRemoveFromAll: (articleId: string) => void
  onCreateBoard: (name: string, article: FeedArticle) => void
  onClose: () => void
}

export function SaveBoardSheet({
  article,
  boards,
  isSavedToBoard,
  onSaveToBoard,
  onRemoveFromBoard,
  onRemoveFromAll,
  onCreateBoard,
  onClose,
}: SaveBoardSheetProps) {
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const savedBoards = boards.filter((board) => isSavedToBoard(article.id, board.id))

  const create = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    onCreateBoard(trimmed, article)
    onClose()
  }

  return (
    <>
      <div className="save-sheet__backdrop" aria-hidden onClick={onClose} />
      <section className="save-sheet" role="dialog" aria-modal="true" aria-label="Save to board">
        <div className="save-sheet__handle" aria-hidden />

        <header className="save-sheet__header">
          <div>
            <p className="save-sheet__eyebrow">Save to board</p>
            <h2 className="save-sheet__title">{article.title}</h2>
          </div>
          <button type="button" className="save-sheet__close" aria-label="Close" onClick={onClose}>
            <X size={20} strokeWidth={2} aria-hidden />
          </button>
        </header>

        <div className="save-sheet__boards" role="list">
          {boards.map((board) => {
            const selected = isSavedToBoard(article.id, board.id)
            const cover = board.articles[0]
            return (
              <button
                key={board.id}
                type="button"
                className={`save-sheet__board${selected ? ' save-sheet__board--selected' : ''}`}
                onClick={() => {
                  if (selected) {
                    onRemoveFromBoard(article.id, board.id)
                  } else {
                    onSaveToBoard(article, board.id)
                    onClose()
                  }
                }}
              >
                <span className="save-sheet__thumb" aria-hidden>
                  {cover ? <img src={cover.imageUrl} alt="" /> : <BookmarkX size={18} />}
                </span>
                <span className="save-sheet__board-text">
                  <span className="save-sheet__board-name">{board.name}</span>
                  <span className="save-sheet__board-count">
                    {board.savedCount} saved
                  </span>
                </span>
                {selected && (
                  <span className="save-sheet__check" aria-label="Saved here">
                    <Check size={18} strokeWidth={2.2} aria-hidden />
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {creating ? (
          <div className="save-sheet__create">
            <input
              className="save-sheet__input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') create()
                if (event.key === 'Escape') setCreating(false)
              }}
              placeholder="Board name"
              maxLength={36}
              autoFocus
            />
            <button
              type="button"
              className="save-sheet__create-btn"
              disabled={!name.trim()}
              onClick={create}
            >
              Create
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="save-sheet__new"
            onClick={() => setCreating(true)}
          >
            <span className="save-sheet__new-icon" aria-hidden>
              <Plus size={18} strokeWidth={2.2} />
            </span>
            <span>Create new board</span>
          </button>
        )}

        {savedBoards.length > 0 && (
          <button
            type="button"
            className="save-sheet__remove"
            onClick={() => {
              onRemoveFromAll(article.id)
              onClose()
            }}
          >
            Remove from all boards
          </button>
        )}
      </section>
    </>
  )
}
