import { ArrowLeft, Check } from 'lucide-react'
import './PrivacyScreen.css'

interface PrivacyScreenProps {
  onBack: () => void
}

const LAST_UPDATED = 'April 24, 2026'

export function PrivacyScreen({ onBack }: PrivacyScreenProps) {
  return (
    <div className="privacy">
      {/* Header */}
      <div className="privacy__header">
        <button
          type="button"
          className="privacy__back"
          aria-label="Back to profile"
          onClick={onBack}
        >
          <ArrowLeft size={18} strokeWidth={2.2} aria-hidden />
        </button>
        <h1 className="privacy__title">Privacy &amp; Data</h1>
        <span className="privacy__updated">Updated {LAST_UPDATED}</span>
      </div>

      <div className="privacy__body">

        {/* Agreement banner */}
        <div className="privacy__banner">
          <span className="privacy__banner-icon" aria-hidden>
            <Check size={16} strokeWidth={3} />
          </span>
          <div>
            <p className="privacy__banner-title">You are covered</p>
            <p className="privacy__banner-sub">
              AI Pulse is designed with your privacy in mind. We collect only what's
              necessary to deliver your personalised news feed.
            </p>
          </div>
        </div>

        {/* Data we collect */}
        <section className="privacy__section">
          <h2 className="privacy__section-title">Data We Collect</h2>

          <div className="privacy__card">
            <div className="privacy__row">
              <span className="privacy__row-dot privacy__row-dot--green" />
              <div>
                <p className="privacy__row-label">Preferences &amp; Interests</p>
                <p className="privacy__row-sub">
                  Your selected topic interests and reading preferences are stored
                  locally on your device only and never transmitted to our servers.
                </p>
              </div>
            </div>
            <div className="privacy__divider" />
            <div className="privacy__row">
              <span className="privacy__row-dot privacy__row-dot--green" />
              <div>
                <p className="privacy__row-label">Saved Articles &amp; Reminders</p>
                <p className="privacy__row-sub">
                  Bookmarks and reminders are stored locally on your device using
                  your browser's localStorage. No account is required.
                </p>
              </div>
            </div>
            <div className="privacy__divider" />
            <div className="privacy__row">
              <span className="privacy__row-dot privacy__row-dot--yellow" />
              <div>
                <p className="privacy__row-label">Anonymous Usage Analytics</p>
                <p className="privacy__row-sub">
                  We may collect anonymised, aggregated usage data (e.g. which
                  categories are most popular) to improve the app. This data cannot
                  identify you personally.
                </p>
              </div>
            </div>
            <div className="privacy__divider" />
            <div className="privacy__row">
              <span className="privacy__row-dot privacy__row-dot--red" />
              <div>
                <p className="privacy__row-label">What We Do NOT Collect</p>
                <p className="privacy__row-sub">
                  We do not collect your name, email, location, device identifiers,
                  financial information, or any biometric data. We do not sell data
                  to third parties.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How we use your data */}
        <section className="privacy__section">
          <h2 className="privacy__section-title">How We Use Your Data</h2>
          <div className="privacy__card">
            {[
              'To personalise your news feed based on selected interests',
              'To remember your saved articles and reminders between sessions',
              'To improve content classification and category accuracy',
              'To maintain your chosen appearance theme (dark / light)',
            ].map((item, i) => (
              <div key={i}>
                {i > 0 && <div className="privacy__divider" />}
                <div className="privacy__row privacy__row--check">
                  <span className="privacy__check-icon" aria-hidden>
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <p className="privacy__row-label">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Third-party content */}
        <section className="privacy__section">
          <h2 className="privacy__section-title">Third-Party Content</h2>
          <div className="privacy__card">
            <div className="privacy__row">
              <div>
                <p className="privacy__row-label">News Sources</p>
                <p className="privacy__row-sub">
                  Article thumbnails and content are sourced from public news
                  providers. Their individual privacy policies apply to any
                  interaction with their websites.
                </p>
              </div>
            </div>
            <div className="privacy__divider" />
            <div className="privacy__row">
              <div>
                <p className="privacy__row-label">Image CDN (Unsplash)</p>
                <p className="privacy__row-sub">
                  Placeholder images are served via Unsplash. Unsplash may log
                  standard server access data per their privacy policy at
                  unsplash.com/privacy.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Your rights */}
        <section className="privacy__section">
          <h2 className="privacy__section-title">Your Rights</h2>
          <div className="privacy__card">
            {[
              { title: 'Access', sub: 'All your data is stored on your device — you can inspect it at any time via your browser\'s developer tools.' },
              { title: 'Deletion', sub: 'Clear your browser\'s localStorage to delete all app data instantly. No account deletion request needed.' },
              { title: 'Portability', sub: 'Your preferences are stored as plain JSON in localStorage and can be exported at any time.' },
              { title: 'Opt-out', sub: 'You can disable all interest-based personalisation by clearing your interests in the Profile tab.' },
            ].map((item, i) => (
              <div key={i}>
                {i > 0 && <div className="privacy__divider" />}
                <div className="privacy__row">
                  <div>
                    <p className="privacy__row-label">{item.title}</p>
                    <p className="privacy__row-sub">{item.sub}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Data retention */}
        <section className="privacy__section">
          <h2 className="privacy__section-title">Data Retention</h2>
          <div className="privacy__card">
            <div className="privacy__row">
              <div>
                <p className="privacy__row-sub">
                  All data is stored locally on your device with no server-side
                  retention. Data persists until you clear your browser storage or
                  uninstall the app.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Children */}
        <section className="privacy__section">
          <h2 className="privacy__section-title">Children's Privacy</h2>
          <div className="privacy__card">
            <div className="privacy__row">
              <div>
                <p className="privacy__row-sub">
                  AI Pulse is not directed at children under the age of 13. We do
                  not knowingly collect personal information from children. If you
                  believe a child has provided personal information, please contact
                  us immediately.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="privacy__section">
          <h2 className="privacy__section-title">Contact</h2>
          <div className="privacy__card">
            <div className="privacy__row">
              <div>
                <p className="privacy__row-sub">
                  For any privacy-related questions or requests, contact us at{' '}
                  <span className="privacy__link">privacy@aipulse.app</span>.
                  We aim to respond within 48 hours.
                </p>
              </div>
            </div>
          </div>
        </section>

        <p className="privacy__footer">
          By using AI Pulse you agree to this Privacy Policy. We will notify you of
          any material changes via an in-app notice before they take effect.
        </p>

      </div>
    </div>
  )
}
