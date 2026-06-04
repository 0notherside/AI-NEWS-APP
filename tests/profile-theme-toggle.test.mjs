import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const profile = readFileSync('src/screens/ProfileScreen/ProfileScreen.tsx', 'utf8')
const css = readFileSync('src/screens/ProfileScreen/ProfileScreen.css', 'utf8')
const privacyCss = readFileSync('src/screens/PrivacyScreen/PrivacyScreen.css', 'utf8')

assert.ok(
  profile.includes('Moon') && profile.includes('Sun'),
  'profile theme toggle should use moon and sun icons',
)

assert.ok(
  profile.includes('profile__theme-slider') &&
    profile.includes('aria-label="Choose appearance"'),
  'profile appearance control should be a modern slider-style segmented control',
)

assert.match(
  css,
  /\.profile__theme-thumb\s*\{[\s\S]*transform:/,
  'profile theme toggle should include a moving selection thumb',
)

for (const [label, source] of [
  ['profile screen markup', profile],
  ['profile screen styles', css],
  ['privacy screen styles', privacyCss],
]) {
  assert.ok(
    !source.includes('accent-blue') && !source.includes('59, 130, 246'),
    `${label} should use the guided orange accent instead of the old blue accent`,
  )
}
