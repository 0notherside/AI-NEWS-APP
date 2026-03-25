import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useReminders } from '../../hooks/useReminders'
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

export function RemindersScreen() {
  const today = new Date()
  const [cursorYear, setCursorYear] = useState(today.getFullYear())
  const [cursorMonth, setCursorMonth] = useState(today.getMonth())
  const [selectedKey, setSelectedKey] = useState(() => localDateKey(today))
  const [time, setTime] = useState('09:00')
  const [link, setLink] = useState('')
  const [topic, setTopic] = useState('')
  const [description, setDescription] = useState('')

  const { reminders, addReminder, removeReminder } = useReminders()

  const cells = useMemo(
    () => buildMonthCells(cursorYear, cursorMonth),
    [cursorYear, cursorMonth],
  )

  const todayKey = localDateKey(today)

  const datesWithReminder = useMemo(() => {
    const s = new Set<string>()
    for (const r of reminders) s.add(r.dateKey)
    return s
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
    })
    setLink('')
    setTopic('')
    setDescription('')
  }

  return (
    <div className="reminders">
      <h1 className="reminders__title">Reminders</h1>

      <div className="reminders__month">
        <button
          type="button"
          className="reminders__nav-btn"
          aria-label="Previous month"
          onClick={() => goMonth(-1)}
        >
          <ChevronLeft size={20} strokeWidth={2} />
        </button>
        <span className="reminders__month-label">
          {formatMonthYear(cursorYear, cursorMonth)}
        </span>
        <button
          type="button"
          className="reminders__nav-btn"
          aria-label="Next month"
          onClick={() => goMonth(1)}
        >
          <ChevronRight size={20} strokeWidth={2} />
        </button>
      </div>

      <div className="reminders__weekdays" aria-hidden>
        {WEEKDAYS.map((w, i) => (
          <div key={i} className="reminders__weekday">
            {w}
          </div>
        ))}
      </div>

      <div className="reminders__grid" role="grid" aria-label="Calendar">
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
          const hasDot = datesWithReminder.has(dateKey)
          return (
            <button
              key={dateKey}
              type="button"
              role="gridcell"
              aria-selected={isSelected}
              className={
                'reminders__day' +
                (isToday ? ' reminders__day--today' : '') +
                (isSelected ? ' reminders__day--selected' : '')
              }
              onClick={() => setSelectedKey(dateKey)}
            >
              <span>{day}</span>
              {hasDot ? (
                <span className="reminders__day-dot" aria-hidden />
              ) : (
                <span className="reminders__day-spacer" aria-hidden />
              )}
            </button>
          )
        })}
      </div>

      <p className="reminders__section-label">Add reminder</p>
      <p className="reminders__selected-date">{formatSelectedLabel(selectedKey)}</p>

      <form className="reminders__form" onSubmit={handleAdd}>
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

      <p className="reminders__section-label">Scheduled for this day</p>
      {dayReminders.length === 0 ? (
        <p className="reminders__empty">No reminders on this date.</p>
      ) : (
        <ul className="reminders__list" role="list">
          {dayReminders.map((r) => (
            <li key={r.id} className="reminders__item">
              <span className="reminders__item-time">{r.time}</span>
              <div className="reminders__item-body">
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
              <button
                type="button"
                className="reminders__item-remove"
                aria-label="Remove reminder"
                onClick={() => removeReminder(r.id)}
              >
                <X size={18} strokeWidth={2} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
