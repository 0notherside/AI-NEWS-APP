type TelemetryLevel = 'info' | 'warn' | 'error'

interface TelemetryEvent {
  name: string
  level: TelemetryLevel
  at: string
  details?: Record<string, unknown>
}

const STORAGE_KEY = 'ai-pulse-telemetry-v1'
const MAX_EVENTS = 200

function readEvents(): TelemetryEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((event) => typeof event === 'object' && event !== null) as TelemetryEvent[]
  } catch {
    return []
  }
}

function persist(events: TelemetryEvent[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-MAX_EVENTS)))
}

export function trackEvent(
  name: string,
  level: TelemetryLevel = 'info',
  details?: Record<string, unknown>,
) {
  const event: TelemetryEvent = {
    name,
    level,
    at: new Date().toISOString(),
    details,
  }
  const next = [...readEvents(), event]
  persist(next)

  if (level === 'error') {
    console.error(`[telemetry] ${name}`, details ?? {})
  } else if (level === 'warn') {
    console.warn(`[telemetry] ${name}`, details ?? {})
  } else {
    console.info(`[telemetry] ${name}`, details ?? {})
  }
}
