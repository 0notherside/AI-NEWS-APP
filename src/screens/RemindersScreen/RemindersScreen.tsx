import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { FeedArticle } from '../../data/feed'
import type { Reminder } from '../../types/reminder'
import {
  formatMonthYear,
  localDateKey,
  localDateKeyFromParts,
  parseDateKey,
} from '../../lib/dateKey'
import './RemindersScreen.css'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

function buildMonthCells(year: number, monthIndex: number): (number | null)[] {
  const firstDow = new Date(year, monthIndex, 1).getDay()
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  return cells
}

function formatSelectedLabel(dateKey: string): string {
  const p = parseDateKey(dateKey)
  if (!p) return dateKey
  const d = new Date(p.year, p.monthIndex, p.day)
  return d.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function sortByTime(a: string, b: string): number {
  return a.localeCompare(b)
}

function linkHref(raw: string): string {
  const t = raw.trim()
  if (!t) return '#'
  if (/^https?:\/\//i.test(t)) return t
  return `https://${t}`
}

interface RemindersScreenProps {
  feed?: FeedArticle[]
  prefillArticle?: FeedArticle | null
  onPrefillConsumed?: () => void
  reminders: Reminder[]
  addReminder: (input: Omit<Reminder, 'id'>) => void
  removeReminder?: (id: string) => void
}

export function RemindersScreen({
  feed = [],
  prefillArticle,
  onPrefillConsumed,
  reminders,
  addReminder,
  removeReminder,
}: RemindersScreenProps) {
  const today = new Date()
  const [cursorYear, setCursorYear] = useState(today.getFullYear())
  const [cursorMonth, setCursorMonth] = useState(today.getMonth())
  const [selectedKey, setSelectedKey] = useState(() => localDateKey(today))
  const [time, setTime] = useState('09:00')
  const [link, setLink] = useState('')
  const [topic, setTopic] = useState('')
  const [description, setDescription] = useState('')
  const [pendingArticleId, setPendingArticleId] = useState<string | null>(null)

  const formRef = useRef<HTMLFormElement>(null)

  const feedById = useMemo(() => new Map(feed.map((a) => [a.id, a])), [feed])

  /* Pre-fill form when arriving from a Bell button tap */
  useEffect(() => {
    if (!prefillArticle) return
    setTopic(prefillArticle.title)
    setLink('')
    setDescription('')
    setPendingArticleId(prefillArticle.id)
    // Scroll form into view after render
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
  }, [prefillArticle])

  const cells = useMemo(
    () => buildMonthCells(cursorYear, cursorMonth),
    [cursorYear, cursorMonth],
  )

  const todayKey = localDateKey(today)

  /** Map of dateKey → reminder count for that day (capped display at 3) */
  const reminderCountByDate = useMemo(() => {
    const m = new Map<string, number>()
    for (const r of reminders) m.set(r.dateKey, (m.get(r.dateKey) ?? 0) + 1)
    return m
  }, [reminders])

  const dayReminders = useMemo(() => {
    return reminders
      .filter((r) => r.dateKey === selectedKey)
      .sort((x, y) => sortByTime(x.time, y.time))
  }, [reminders, selectedKey])

  const goMonth = (delta: number) => {
    const d = new Date(cursorYear, cursorMonth + delta, 1)
    setCursorYear(d.getFullYear())
    setCursorMonth(d.getMonth())
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    addReminder({
      dateKey: selectedKey,
      time,
      link: link.trim(),
      topic: topic.trim(),
      description: description.trim(),
      articleId: pendingArticleId ?? undefined,
    })
    setLink('')
    setTopic('')
    setDescription('')
    setPendingArticleId(null)
    onPrefillConsumed?.()
  }

  const selectedLabel = formatSelectedLabel(selectedKey)

  return (
    <div className="reminders">
      <h1 className="reminders__title">Reminders</h1>

      {/* ── Month navigation ──────────────────────────── */}
      <div className="reminders__month" role="group" aria-label="Navigate months">
        <button
          type="button"
          className="reminders__nav-btn"
          aria-label="Previous month"
          onClick={() => goMonth(-1)}
        >
          <ChevronLeft size={20} strokeWidth={2} aria-hidden />
        </button>
        <span className="reminders__month-label" aria-live="polite" aria-atomic="true">
          {formatMonthYear(cursorYear, cursorMonth)}
        </span>
        <button
          type="button"
          className="reminders__nav-btn"
          aria-label="Next month"
          onClick={() => goMonth(1)}
        >
          <ChevronRight size={20} strokeWidth={2} aria-hidden />
        </button>
      </div>

      {/* ── Weekday headers ───────────────────────────── */}
      <div className="reminders__weekdays" aria-hidden>
        {WEEKDAYS.map((w, i) => (
          <div key={i} className="reminders__weekday">
            {w}
          </div>
        ))}
      </div>

      {/* ── Calendar grid ─────────────────────────────── */}
      <div
        className="reminders__grid"
        role="grid"
        aria-label={`Calendar for ${formatMonthYear(cursorYear, cursorMonth)}`}
      >
        {cells.map((day, i) => {
          if (day === null) {
            return (
              <div
                key={`empty-${i}`}
                className="reminders__day reminders__day--muted"
                aria-hidden
              />
            )
          }
          const dateKey = localDateKeyFromParts(cursorYear, cursorMonth, day)
          const isToday = dateKey === todayKey
          const isSelected = dateKey === selectedKey
          const dotCount = reminderCountByDate.get(dateKey) ?? 0
          return (
            <button
              key={dateKey}
              type="button"
              role="gridcell"
              aria-selected={isSelected}
              aria-label={`${day}${isToday ? ', today' : ''}${dotCount > 0 ? `, ${dotCount} reminder${dotCount > 1 ? 's' : ''}` : ''}`}
              className={
                'reminders__day' +
                (isToday ? ' reminders__day--today' : '') +
                (isSelected ? ' reminders__day--selected' : '')
              }
              onClick={() => setSelectedKey(dateKey)}
            >
              <span aria-hidden>{day}</span>
              <span className="reminders__day-dots" aria-hidden>
                {dotCount > 0
                  ? Array.from({ length: Math.min(dotCount, 3) }, (_, i) => (
                      <span key={i} className="reminders__day-dot" />
                    ))
                  : <span className="reminders__day-spacer" />}
              </span>
            </button>
          )
        })}
      </div>

      {/* ── Add reminder form ─────────────────────────── */}
      <p className="reminders__section-label" aria-hidden>Add reminder</p>
      <p className="reminders__selected-date">{selectedLabel}</p>

      {/* Article preview strip when pre-filling from a card */}
      {pendingArticleId && feedById.has(pendingArticleId) && (() => {
        const a = feedById.get(pendingArticleId)!
        return (
          <div className="reminders__prefill-article">
            <img
              className="reminders__prefill-thumb"
              src={a.imageUrl}
              alt=""
              loading="lazy"
              decoding="async"
            />
            <div className="reminders__prefill-copy">
              <span className="reminders__prefill-label">From article</span>
              <p className="reminders__prefill-title">{a.title}</p>
            </div>
            <button
              type="button"
              className="reminders__prefill-clear"
              aria-label="Remove article link"
              onClick={() => { setPendingArticleId(null); onPrefillConsumed?.() }}
            >
              <X size={14} strokeWidth={2.5} aria-hidden />
            </button>
          </div>
        )
      })()}

      <form
        ref={formRef}
        className="reminders__form"
        onSubmit={handleAdd}
        aria-label={`Add reminder for ${selectedLabel}`}
      >
        <div className="reminders__field">
          <label className="reminders__label" htmlFor="reminder-time">
            Time
          </label>
          <input
            id="reminder-time"
            className="reminders__input reminders__input--time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            aria-required="true"
          />
        </div>
        <div className="reminders__field">
          <label className="reminders__label" htmlFor="reminder-link">
            Link <span className="reminders__label-optional">(optional)</span>
          </label>
          <input
            id="reminder-link"
            className="reminders__input"
            type="text"
            inputMode="url"
            autoComplete="url"
            placeholder="https://…"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>
        <div className="reminders__field">
          <label className="reminders__label" htmlFor="reminder-topic">
            AI news or topic{' '}
            <span className="reminders__label-optional">(optional)</span>
          </label>
          <input
            id="reminder-topic"
            className="reminders__input"
            type="text"
            placeholder="e.g. Suno v5, Firefly 4, voice APIs"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        <div className="reminders__field">
          <label className="reminders__label" htmlFor="reminder-desc">
            Description <span className="reminders__label-optional">(optional)</span>
          </label>
          <textarea
            id="reminder-desc"
            className="reminders__textarea"
            placeholder="Extra notes for this reminder"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        <button type="submit" className="reminders__submit">
          Add reminder
        </button>
      </form>

      {/* ── Reminder list ─────────────────────────────── */}
      <p className="reminders__section-label" aria-hidden>Scheduled for this day</p>

      {/* aria-live announces adds/removals to screen readers */}
      <div aria-live="polite" aria-atomic="false">
        {dayReminders.length === 0 ? (
          <p className="reminders__empty">No reminders on this date.</p>
        ) : (
          <ul className="reminders__list" role="list" aria-label={`Reminders for ${selectedLabel}`}>
            {dayReminders.map((r) => {
              const linkedArticle = r.articleId ? feedById.get(r.articleId) : undefined
              return (
                <li key={r.id} className="reminders__item">
                  <time className="reminders__item-time" aria-label={`Time: ${r.time}`}>
                    {r.time}
                  </time>
                  <div className="reminders__item-body">
                    {linkedArticle && (
                      <div className="reminders__item-article">
                        <img
                          className="reminders__item-article-thumb"
                          src={linkedArticle.imageUrl}
                          alt=""
                          loading="lazy"
                          decoding="async"
                        />
                        <span
                          className="reminders__item-article-source"
                          style={{ color: linkedArticle.categoryColor }}
                        >
                          {linkedArticle.categoryLabel}
                        </span>
                      </div>
                    )}
                    {r.topic ? (
                      <p className="reminders__item-topic">{r.topic}</p>
                    ) : null}
                    {r.link ? (
                      <a
                        className="reminders__item-link"
                        href={linkHref(r.link)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {r.link}
                      </a>
                    ) : null}
                    {r.description ? (
                      <p className="reminders__item-desc">{r.description}</p>
                    ) : null}
                    {!r.topic && !r.link && !r.description ? (
                      <p className="reminders__item-desc reminders__item-desc--empty">
                        No details yet
                      </p>
                    ) : null}
                  </div>
                  {removeReminder && (
                    <button
                      type="button"
                      className="reminders__item-remove"
                      aria-label={`Remove reminder at ${r.time}${r.topic ? ` for ${r.topic}` : ''}`}
                      onClick={() => removeReminder(r.id)}
                    >
                      <X size={18} strokeWidth={2} aria-hidden />
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
