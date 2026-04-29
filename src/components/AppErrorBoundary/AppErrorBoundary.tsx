import { Component, type ErrorInfo, type ReactNode } from 'react'
import { trackEvent } from '../../lib/telemetry'

interface AppErrorBoundaryProps {
  children: ReactNode
}

interface AppErrorBoundaryState {
  hasError: boolean
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    trackEvent('ui.crash', 'error', {
      message: error.message,
      stack: error.stack,
      componentStack: info.componentStack,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <main
          style={{
            minHeight: '100dvh',
            display: 'grid',
            placeItems: 'center',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <section
            style={{
              maxWidth: '28rem',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: '16px',
              padding: '20px',
              background: 'var(--color-card)',
            }}
          >
            <h1 style={{ marginTop: 0 }}>Something went wrong</h1>
            <p>
              Please reload the app. This crash has been logged locally for debugging.
            </p>
            <button type="button" onClick={() => window.location.reload()}>
              Reload app
            </button>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}
