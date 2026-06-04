import { useRef, useState } from 'react'
import { Bookmark, ChevronDown, ChevronUp, Image, Pencil } from 'lucide-react'
import type { FeedArticle } from '../../data/feed'
import type { SavedBoardView } from '../../hooks/useSavedNews'
import './SavedBoardsScreen.css'

interface SavedBoardsScreenProps {
  boards: SavedBoardView[]
}

/* ── Per-folder customisation stored in localStorage ─── */
type FolderCustom = {
  name?: string       // user-renamed label
  coverId?: string    // article ID to use as cover
}
type AllCustom = Record<string, FolderCustom>

const CUSTOM_KEY = 'ai-pulse-folder-custom'
const ORDER_KEY  = 'ai-pulse-folder-order'

function readCustom(): AllCustom {
  try { return JSON.parse(localStorage.getItem(CUSTOM_KEY) ?? '{}') } catch { return {} }
}
function saveCustom(c: AllCustom) {
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(c))
}
function readOrder(): string[] {
  try {
    const arr = JSON.parse(localStorage.getItem(ORDER_KEY) ?? '[]')
    return Array.isArray(arr) ? arr : []
  } catch { return [] }
}
function saveOrder(o: string[]) {
  localStorage.setItem(ORDER_KEY, JSON.stringify(o))
}

/* ── Long-press duration ────────────────────────────── */
const LONG_PRESS_MS = 480

export function SavedBoardsScreen({ boards }: SavedBoardsScreenProps) {
  const [custom, setCustom]         = useState<AllCustom>(readCustom)
  const [folderOrder, setFolderOrder] = useState<string[]>(readOrder)
  const [menuFolderId, setMenuFolderId] = useState<string | null>(null)
  const [renaming, setRenaming]       = useState<string | null>(null)
  const [renameDraft, setRenameDraft] = useState('')
  const [coverPicker, setCoverPicker] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const suppressTap = useRef(false)

  const boardById = new Map(boards.map((board) => [board.id, board]))
  const savedArticles = Array.from(
    new Map(
      boards.flatMap((board) =>
        board.articles.map((article) => [article.id, article] as const),
      ),
    ).values(),
  )

  const boardIds = boards.map((board) => board.id)
  const ordered = [
    ...folderOrder.filter((id) => boardIds.includes(id)),
    ...boardIds.filter((id) => !folderOrder.includes(id)),
  ]

  /* ── Helpers ─────────────────────────────────────── */
  const getLabel = (id: string, fallback: string) => custom[id]?.name ?? fallback
  const getCover = (id: string, articles: FeedArticle[]) => {
    const pinned = custom[id]?.coverId
      ? savedArticles.find((article) => article.id === custom[id].coverId)
      : undefined
    return pinned ?? articles[0] ?? null
  }

  const updateCustom = (id: string, patch: Partial<FolderCustom>) => {
    const next = { ...custom, [id]: { ...custom[id], ...patch } }
    setCustom(next)
    saveCustom(next)
  }

  const moveFolder = (id: string, dir: -1 | 1) => {
    const base = [...ordered]
    const idx  = base.indexOf(id)
    if (idx < 0) return
    const swapIdx = idx + dir
    if (swapIdx < 0 || swapIdx >= base.length) return
    ;[base[idx], base[swapIdx]] = [base[swapIdx], base[idx]]
    setFolderOrder(base)
    saveOrder(base)
    setMenuFolderId(null)
  }

  /* ── Long-press detection ─────────────────────────── */
  const onPointerDown = (id: string) => {
    suppressTap.current = false
    timerRef.current = setTimeout(() => {
      suppressTap.current = true
      setMenuFolderId(id)
    }, LONG_PRESS_MS)
  }
  const cancelPress = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  /* ── Rename flow ──────────────────────────────────── */
  const startRename = (id: string, current: string) => {
    setMenuFolderId(null)
    setRenameDraft(current)
    setRenaming(id)
  }
  const commitRename = () => {
    if (renaming && renameDraft.trim()) {
      updateCustom(renaming, { name: renameDraft.trim() })
    }
    setRenaming(null)
  }

  if (savedArticles.length === 0) {
    return (
      <section className="saved-boards" aria-label="Saved articles">
        <header className="saved-boards__header">
          <h1 className="saved-boards__title">Saved</h1>
          <p className="saved-boards__subtitle">Create boards from the bookmark menu</p>
        </header>
        <div className="saved-boards__empty">
          <div className="saved-boards__empty-icon">
            <Bookmark size={28} strokeWidth={1.5} aria-hidden />
          </div>
          <h2 className="saved-boards__empty-title">Nothing saved yet</h2>
          <p className="saved-boards__empty-text">
            Tap the bookmark on any article and choose or create a board.
          </p>
        </div>
      </section>
    )
  }

  /* ── All-Saved folder data ────────────────────────── */
  const allLabel  = getLabel('all-saved', 'All Saved')
  const allCover  = getCover('all-saved', savedArticles)
  const allIdx    = -1 // always first

  return (
    <section className="saved-boards" aria-label="Saved articles">

      {/* ── Header ─────────────────────────────────── */}
      <header className="saved-boards__header">
        <h1 className="saved-boards__title">Saved</h1>
        <p className="saved-boards__subtitle">
          {savedArticles.length} article{savedArticles.length !== 1 ? 's' : ''} · hold a board to customise
        </p>
      </header>

      <div className="saved-boards__grid" role="list">

        {/* ── All Saved ─────────────────────────────── */}
        <PinterestCard
          id="all-saved"
          label={allLabel}
          emoji="🔖"
          count={savedArticles.length}
          articles={savedArticles}
          coverArticle={allCover}
          isFirst={true}
          isLast={allIdx === ordered.length - 1}
          onPointerDown={onPointerDown}
          cancelPress={cancelPress}
        />

        {/* ── User boards ─────────────────────────── */}
        {ordered.map((boardId, idx) => {
          const board = boardById.get(boardId)
          if (!board) return null
          const articles = board.articles
          const label = getLabel(boardId, board.name)
          const coverArticle = getCover(boardId, articles)
          return (
            <PinterestCard
              key={boardId}
              id={boardId}
              label={label}
              emoji="📌"
              count={articles.length}
              articles={articles}
              coverArticle={coverArticle}
              isFirst={idx === 0}
              isLast={idx === ordered.length - 1}
              onPointerDown={onPointerDown}
              cancelPress={cancelPress}
            />
          )
        })}
      </div>

      {/* ── Long-press context menu ───────────────── */}
      {menuFolderId && (
        <>
          <div className="sb-backdrop" onClick={() => setMenuFolderId(null)} aria-hidden />
          <div className="sb-menu" role="dialog" aria-label="Folder options">
            <div className="sb-menu__handle" aria-hidden />

            <button
              className="sb-menu__item"
              onClick={() => {
                const curr = menuFolderId === 'all-saved'
                  ? getLabel('all-saved', 'All Saved')
                  : getLabel(menuFolderId, boardById.get(menuFolderId)?.name ?? menuFolderId)
                startRename(menuFolderId, curr)
              }}
            >
              <span className="sb-menu__icon"><Pencil size={18} strokeWidth={1.8} /></span>
              <span>Rename folder</span>
            </button>

            <div className="sb-menu__divider" />

            <button
              className="sb-menu__item"
              onClick={() => { setCoverPicker(menuFolderId); setMenuFolderId(null) }}
            >
              <span className="sb-menu__icon"><Image size={18} strokeWidth={1.8} /></span>
              <span>Change cover</span>
            </button>

            {menuFolderId !== 'all-saved' && (
              <>
                <div className="sb-menu__divider" />
                <button
                  className="sb-menu__item"
                  disabled={ordered.indexOf(menuFolderId) === 0}
                  onClick={() => moveFolder(menuFolderId, -1)}
                >
                  <span className="sb-menu__icon"><ChevronUp size={18} strokeWidth={1.8} /></span>
                  <span>Move up</span>
                </button>
                <div className="sb-menu__divider" />
                <button
                  className="sb-menu__item"
                  disabled={ordered.indexOf(menuFolderId) === ordered.length - 1}
                  onClick={() => moveFolder(menuFolderId, 1)}
                >
                  <span className="sb-menu__icon"><ChevronDown size={18} strokeWidth={1.8} /></span>
                  <span>Move down</span>
                </button>
              </>
            )}
          </div>
        </>
      )}

      {/* ── Rename sheet ─────────────────────────── */}
      {renaming && (
        <>
          <div className="sb-backdrop" onClick={() => setRenaming(null)} aria-hidden />
          <div className="sb-rename" role="dialog" aria-label="Rename folder">
            <div className="sb-menu__handle" aria-hidden />
            <p className="sb-rename__label">Folder name</p>
            <input
              className="sb-rename__input"
              value={renameDraft}
              onChange={(e) => setRenameDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') commitRename() }}
              autoFocus
              maxLength={32}
            />
            <div className="sb-rename__actions">
              <button className="sb-rename__btn sb-rename__btn--cancel" onClick={() => setRenaming(null)}>
                Cancel
              </button>
              <button className="sb-rename__btn sb-rename__btn--save" onClick={commitRename}>
                Save
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Cover picker sheet ───────────────────── */}
      {coverPicker && (
        <>
          <div className="sb-backdrop" onClick={() => setCoverPicker(null)} aria-hidden />
          <div className="sb-cover-picker" role="dialog" aria-label="Choose cover image">
            <div className="sb-menu__handle" aria-hidden />
            <p className="sb-rename__label">Choose cover</p>
            <div className="sb-cover-picker__grid">
              {(coverPicker === 'all-saved' ? savedArticles : boardById.get(coverPicker)?.articles ?? [])
                .slice(0, 6)
                .map((article) => (
                  <button
                    key={article.id}
                    className={`sb-cover-picker__thumb${custom[coverPicker!]?.coverId === article.id ? ' sb-cover-picker__thumb--active' : ''}`}
                    onClick={() => { updateCustom(coverPicker!, { coverId: article.id }); setCoverPicker(null) }}
                  >
                    <img src={article.imageUrl} alt="" />
                  </button>
                ))}
            </div>
          </div>
        </>
      )}
    </section>
  )
}

/* ── Pinterest-style card ───────────────────────────── */
function PinterestCard({
  id, label, emoji, count, articles, coverArticle,
  onPointerDown, cancelPress,
}: {
  id: string
  label: string
  emoji: string
  count: number
  articles: FeedArticle[]
  coverArticle: FeedArticle | null
  isFirst: boolean
  isLast: boolean
  onPointerDown: (id: string) => void
  cancelPress: () => void
}) {
  const side = articles.slice(1, 3)

  return (
    <article
      className="sb-card"
      role="listitem"
      aria-label={`${label}, ${count} articles`}
      onPointerDown={() => onPointerDown(id)}
      onPointerUp={cancelPress}
      onPointerLeave={cancelPress}
      onPointerCancel={cancelPress}
    >
      {/* Pinterest mosaic cover */}
      <div className="sb-card__cover">
        {coverArticle ? (
          <div className="sb-card__mosaic">
            <img
              className="sb-card__main-img"
              src={coverArticle.imageUrl}
              alt=""
              loading="lazy"
              decoding="async"
            />
            {side.length > 0 && (
              <div className="sb-card__side">
                {side.map((a, i) => (
                  <img
                    key={i}
                    className="sb-card__side-img"
                    src={a.imageUrl}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="sb-card__empty-cover">
            <span>{emoji}</span>
          </div>
        )}
      </div>

      {/* Label row */}
      <div className="sb-card__meta">
        <div className="sb-card__name-row">
          <span className="sb-card__emoji" aria-hidden>{emoji}</span>
          <span className="sb-card__name">{label}</span>
        </div>
        <span className="sb-card__count">{count} saved</span>
      </div>
    </article>
  )
}
