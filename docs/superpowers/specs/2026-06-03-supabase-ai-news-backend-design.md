# Supabase AI News Backend Design

## Goal

Build a Supabase backend for the AI News app that supports real user accounts, private user data, external-source news ingestion, AI-assisted curation, private saved boards, profile interests, and community fire ranking.

## Product Principles

- The app is an AI-curated news reader, not an AI-generated news publisher.
- Every feed item must come from a real external source and link back to the original URL.
- AI may classify, rank, score, deduplicate, and summarize source-derived material, but it must not invent article titles, URLs, sources, publish dates, or news content.
- Preview images and images shown inside article detail views must come from original source metadata or extracted source article assets, not AI-generated replacements.
- The main feed should initially show the same trusted AI-picked top news to everyone.
- User interests should power filtering and future "For You" ranking, without hiding important global AI news from the main feed.
- Saved boards are private to each user.
- Community ranking is driven by authenticated users manually spending daily fire reactions.

## Backend Platform

Use Supabase for:

- Authentication.
- Postgres database.
- Row Level Security.
- Edge Functions.
- Scheduled ingestion.
- Server-side reaction quota enforcement.

The React app remains a Vite frontend. It will gradually replace local-only hooks with Supabase-backed data access.

## Authentication

Supported login methods:

- Google OAuth.
- Apple OAuth.
- Email magic link or OTP.
- Phone OTP.

On first login, the backend creates a user profile row connected to `auth.users.id`.

Profile fields:

- `user_id`.
- `display_name`.
- `avatar_url`.
- `onboarding_completed`.
- `created_at`.
- `updated_at`.

Settings fields:

- `user_id`.
- `saved_retention_days`, default `30`.
- `refresh_interval_minutes`, default `720` for a 12-hour feed cadence.
- `theme`.
- notification/reminder preferences when those features move server-side.

Interest fields:

- `user_id`.
- `interest_id`.

Initial interests:

- `models`.
- `agents`.
- `coding`.
- `image`.
- `video`.
- `voice`.
- `research`.
- `business`.
- `startups`.
- `safety`.
- `hardware`.
- `open_source`.

## Source Registry

The backend stores a source registry so ingestion can be adjusted without code changes where possible.

Source fields:

- `id`.
- `name`.
- `homepage_url`.
- `feed_url`.
- `source_type`: `official`, `trusted_news`, `research_signal`, or `developer_signal`.
- `trust_tier`: integer from `1` to `4`, where `1` is highest trust.
- `enabled`.
- `created_at`.
- `updated_at`.

Recommended initial sources:

- OpenAI.
- Anthropic.
- Google DeepMind.
- Google AI / Gemini.
- Meta AI.
- Mistral AI.
- Hugging Face.
- Perplexity.
- xAI.
- Stability AI.
- Runway.
- ElevenLabs.
- GitHub Blog.
- Microsoft AI.
- NVIDIA AI.
- MIT Technology Review AI.
- VentureBeat AI.
- The Decoder.
- TechCrunch AI.
- arXiv AI/ML/NLP/CV feeds.
- Papers with Code.
- Hugging Face trending.
- GitHub Trending AI repositories.
- Hacker News AI keyword search.

## News Ingestion

A scheduled Supabase Edge Function runs every 12 hours.

Ingestion flow:

1. Fetch enabled source feeds and provider APIs.
2. Normalize raw items into a common shape.
3. Store raw items for audit/debugging.
4. Deduplicate by canonical URL, title similarity, and source cluster.
5. Ask AI to score and classify only the real collected items.
6. Publish around 15 selected articles per run.
7. Mark 3-5 selected articles as `hot` when scores justify it.
8. Keep published articles visible for several days, with freshness weighted higher in ranking.

Normalized article fields:

- `id`.
- `source_id`.
- `canonical_url`.
- `original_url`.
- `title`.
- `source_name`.
- `published_at`.
- `excerpt`.
- `image_url`.
- `image_source_url`.
- `image_attribution`.
- `author`.
- `language`.
- `raw_payload`.
- `created_at`.

Published feed fields:

- `article_id`.
- `scan_id`.
- `category_id`.
- `ai_score`.
- `credibility_score`.
- `freshness_score`.
- `impact_score`.
- `novelty_score`.
- `interest_tags`.
- `is_hot`.
- `selection_reason`.
- `published_to_feed_at`.

The AI selection prompt must explicitly forbid invented facts and require item IDs from the collected candidate list.

## Article Images

Article images should be copied from original source metadata or source article assets whenever licensing and technical access allow it.

Image behavior:

- Prefer Open Graph image metadata from the original source page.
- Fall back to RSS/media image fields when available.
- Fall back to an extracted in-article image only when it belongs to the original article page.
- Store the image URL, source page URL, and attribution/source name.
- Do not use AI-generated images as replacements for real article images.
- Do not use unrelated stock images for real news items.
- If no usable source image exists, show a neutral app placeholder that clearly does not pretend to be article media.
- If hotlinking is unreliable or disallowed, cache only when allowed by the source's terms and store attribution.

## Feed Behavior

The main feed initially shows the same AI-picked top articles to every user.

Feed ordering:

- Current 12-hour selection first.
- Hot items can be visually highlighted.
- Older articles remain visible for several days.
- Fire count can be displayed but does not replace the editorial feed ordering.

Interests behavior:

- Interests are saved in the profile.
- Users can filter feed sections by interest/category.
- A future "For You" view can rank articles higher when `interest_tags` match selected interests.
- The global main feed does not remove major articles because of user interests.

## Sharing

Article sharing should work for every feed, community, saved, and detail surface.

Share behavior:

- The share button uses the browser native share sheet when available.
- If native sharing is unavailable, the app copies a durable article URL to the clipboard.
- If clipboard access is unavailable, the app opens a share hub fallback.
- Shared URLs must open the article detail view for signed-out and signed-in users.
- Shared URLs must not expose private saved board IDs or other user-private state.
- Shared links should use the public article ID or slug, not a local-only hash that only works on the sender's device.

Shared article page behavior:

- Load article details from public published article data.
- Show original source, original URL, publish date, title, excerpt, image, and fire count.
- Let signed-in users save, fire, or manage reminders from the shared article view.
- Let signed-out users read the public article card and then sign in if they want to save or react.

## Private Saved Boards

Saved boards are private to each user.

Board fields:

- `id`.
- `user_id`.
- `name`.
- `created_at`.
- `updated_at`.

Saved board item fields:

- `id`.
- `board_id`.
- `user_id`.
- `article_id`.
- `saved_at`.
- `expires_at`.

Retention:

- Default board item retention is 30 days.
- `expires_at` is set at save time using the user setting.
- A scheduled cleanup function removes expired saved items.

Security:

- Users can only create, read, update, and delete their own boards.
- Users can only save and remove items from their own boards.

## Fire Reactions

Each authenticated user receives 10 fire reactions per calendar day.

Rules:

- Daily fire budget resets by calendar date.
- The server enforces budget use.
- Spending one fire increments the article's community score.
- A user can spend at most one fire per article per day in the first version.
- Optional un-fire/refund can be added later, but the first version should keep the mechanic simple.

Reaction fields:

- `id`.
- `user_id`.
- `article_id`.
- `reaction_date`.
- `created_at`.

Daily budget fields:

- `user_id`.
- `budget_date`.
- `spent_count`.
- `limit_count`, default `10`.

Community ranking:

- The Community tab shows the top 10 articles by fire count in a rolling 24-48 hour window.
- The default window should be 48 hours, with UI copy that can call this "Last 48h".
- Old articles naturally fall out as their reaction timestamps leave the window.

## Row Level Security

Public readable tables:

- Published feed articles.
- Source names and non-sensitive source metadata.
- Aggregated fire counts.

User-private tables:

- Profiles.
- User settings.
- User interests.
- Saved boards.
- Saved board items.
- User reaction rows, except through controlled aggregate views/functions.

Server-only operations:

- Raw ingestion writes.
- AI scoring writes.
- Fire budget mutation.
- Published feed selection writes.
- Expired saved-item cleanup.

## Frontend Migration

Migrate the app gradually:

1. Add Supabase client configuration.
2. Add auth screen/session handling.
3. Replace `useProfile` with Supabase-backed profile state.
4. Replace `useNewsSettings` with Supabase-backed settings.
5. Replace `newsService.getFeed()` with published feed reads.
6. Replace `useSavedNews` with private boards and saved items.
7. Replace `useRelevance` with server-backed fire reactions and community rankings.
8. Replace local-only share URLs with public article detail URLs.
9. Add session-aware state refresh so user actions stay consistent across app tabs.

Local storage can remain temporarily for anonymous/offline fallback, but authenticated state should prefer Supabase.

## Cross-Tab and Cross-Surface Consistency

User-facing features should behave consistently across bottom navigation tabs and across multiple browser tabs.

App surface consistency:

- Saving an article from Home should immediately show it as saved in Saved, Community, and Article Details.
- Removing a saved article should update all surfaces that show that article.
- Spending a fire from Home, Community, or Article Details should update remaining fire count and community score everywhere.
- Profile interest and settings changes should affect filters/settings without requiring a full reload.
- Auth state changes should update the whole app when a user signs in or signs out.

Browser tab consistency:

- Supabase auth session changes should be observed by every open browser tab.
- Server-backed user data should be revalidated after save, fire, profile, settings, and board mutations.
- Supabase Realtime or a lightweight polling/revalidation strategy should keep fire counts and saved state fresh between open tabs.
- When browser tabs disagree temporarily, the next server read wins because Supabase is the source of truth.

## Error Handling

- If Supabase auth is unavailable, show a retryable sign-in error.
- If feed reads fail, keep the existing retry/error state in the feed screen.
- If a user has no fire budget remaining, the server returns a clear quota error and the UI shows zero remaining fires.
- If ingestion fails for one source, the scan continues with other sources and records the failed source.
- If AI scoring fails, the scan can publish no new articles rather than publishing unreviewed low-confidence items.
- If sharing fails at every fallback, show a non-blocking error state and leave the user on the current article.
- If a cross-tab refresh fails, keep the current visible data and retry on focus/visibility change.

## Testing

Backend tests should cover:

- User profile creation after first auth.
- RLS isolation for private boards and saved items.
- Fire quota enforcement at 10 per calendar day.
- Community ranking window.
- Saved item expiration after 30 days.
- Ingestion dedupe behavior.
- AI selection validation that selected IDs exist in the candidate set.
- Public shared article reads for signed-out users.
- Private board data not leaking through shared article URLs.

Frontend tests should cover:

- Signed-in user profile loading.
- Interest selection persistence.
- Feed rendering from Supabase article shape.
- Saving/removing articles from private boards.
- Fire reaction remaining count and quota exhausted state.
- Community tab ordering from aggregate fire counts.
- Share button behavior with native share, clipboard fallback, and final fallback.
- Shared article URL opens the detail view.
- Saved/fire/profile changes stay consistent when switching app tabs.
- Auth/session changes and saved/fire updates refresh across multiple browser tabs.

## Open Implementation Decisions

- Which AI model/provider will score candidate articles.
- Whether summaries are included in version one or deferred.
- Whether phone OTP is enabled immediately or after Google/Apple/email auth is working.
- Whether external paid news APIs are added in version one or after the RSS-first path works.

For version one, use RSS-first ingestion and defer paid news APIs unless broader coverage is required during testing.
