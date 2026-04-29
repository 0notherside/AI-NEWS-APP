/**
 * Validates user-supplied strings before using them in href or window navigation.
 * Blocks javascript:, data:, file:, etc. — common XSS / phishing vectors.
 */
const BLOCKED_SCHEME = /^(javascript|vbscript|data|file|about|blob):/i

export function sanitizeUserUrlForHref(raw: string): string | null {
  const t = raw.trim()
  if (!t) return null
  if (BLOCKED_SCHEME.test(t)) return null

  const withScheme = /^https?:\/\//i.test(t) ? t : `https://${t}`
  if (BLOCKED_SCHEME.test(withScheme)) return null

  let parsed: URL
  try {
    parsed = new URL(withScheme)
  } catch {
    return null
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null

  // Reject URLs with embedded credentials (phishing / odd clients)
  if (parsed.username || parsed.password) return null

  return parsed.href
}
