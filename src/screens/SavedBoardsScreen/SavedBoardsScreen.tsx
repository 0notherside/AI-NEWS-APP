import { useState } from 'react'
import type { FormEvent } from 'react'
import { Plus } from 'lucide-react'
import './SavedBoardsScreen.css'

interface Board {
  id: string
  name: string
  count: number
  updated: string
  covers: string[]
}

const INITIAL_BOARDS: Board[] = [
  {
    id: 'b1',
    name: 'AI Video',
    count: 28,
    updated: 'Updated today',
    covers: [
      'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=700&h=900&q=80',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=700&h=900&q=80',
      'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=700&h=900&q=80',
    ],
  },
  {
    id: 'b2',
    name: 'Music AI',
    count: 16,
    updated: 'Updated yesterday',
    covers: [
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=700&h=900&q=80',
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=700&h=900&q=80',
      'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?auto=format&fit=crop&w=700&h=900&q=80',
    ],
  },
  {
    id: 'b3',
    name: 'Voice Tools',
    count: 9,
    updated: 'Updated 2 days ago',
    covers: [
      'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=700&h=900&q=80',
      'https://images.unsplash.com/photo-1580894908361-967195033215?auto=format&fit=crop&w=700&h=900&q=80',
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=700&h=900&q=80',
    ],
  },
]

function boardId() {
  return `board-${Math.random().toString(36).slice(2, 10)}`
}

export function SavedBoardsScreen() {
  const [boards, setBoards] = useState<Board[]>(INITIAL_BOARDS)
  const [newBoard, setNewBoard] = useState('')

  const onCreate = (e: FormEvent) => {
    e.preventDefault()
    const name = newBoard.trim()
    if (!name) return
    setBoards((prev) => [
      {
        id: boardId(),
        name,
        count: 0,
        updated: 'Just created',
        covers: [],
      },
      ...prev,
    ])
    setNewBoard('')
  }

  return (
    <section className="saved-boards" aria-label="Saved boards">
      <header className="saved-boards__header">
        <h1 className="saved-boards__title">Saved boards</h1>
        <p className="saved-boards__subtitle">
          Organise AI news like Pinterest collections.
        </p>
      </header>

      {/* Create board form */}
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

      {/* Boards grid */}
      <div
        className="saved-boards__grid"
        role="list"
        aria-label="Your boards"
        aria-live="polite"
        aria-atomic="false"
      >
        {boards.map((board) => (
          <article
            key={board.id}
            className="saved-boards__card"
            role="listitem"
            aria-label={`${board.name} board, ${board.count} saves`}
          >
            <div className="saved-boards__mosaic" aria-hidden>
              {board.covers.length === 0 ? (
                <div className="saved-boards__empty-cover">No pins yet</div>
              ) : (
                <>
                  {/* PERF FLAG: cover images missing width/height attrs */}
                  <img
                    src={board.covers[0]}
                    alt=""
                    className="saved-boards__cover-main"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="saved-boards__cover-stack">
                    {board.covers.slice(1, 3).map((cover, i) => (
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
              {/* TODO: make board name a link/button once board detail view exists */}
              <h2 className="saved-boards__name">{board.name}</h2>
              <p className="saved-boards__info">
                {board.count} saves · {board.updated}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
