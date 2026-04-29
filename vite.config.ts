import type { Plugin } from 'vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages project site: set VITE_BASE_PATH=/REPO_NAME/ in CI (trailing slash required).
const base = process.env.VITE_BASE_PATH?.trim() || '/'

/**
 * Production-only CSP meta tag. Omitted in dev so Vite HMR and tooling keep working.
 * When you add a backend, tighten connect-src to your API origin(s).
 */
function contentSecurityPolicyMeta(): Plugin {
  const directives = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src https://fonts.gstatic.com data:",
    "img-src 'self' https: data: blob:",
    "connect-src 'self' https: wss:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    'upgrade-insecure-requests',
  ].join('; ')

  return {
    name: 'content-security-policy-meta',
    transformIndexHtml(html, ctx) {
      if (ctx.server) return html
      const tag = `    <meta http-equiv="Content-Security-Policy" content="${directives}" />\n`
      return html.replace(
        '<meta charset="UTF-8" />',
        `<meta charset="UTF-8" />\n${tag}`,
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), contentSecurityPolicyMeta()],
  base,
})
