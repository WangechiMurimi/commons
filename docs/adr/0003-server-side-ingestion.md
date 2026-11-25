# 0003. Server-side ingestion

Status: proposed · 2026-11-25

## Context

Commons pulls content from user-chosen sources. Browsers block cross-origin requests to most feeds (CORS), so a client-only SPA cannot read them. Delivery schedules also need items held until a window opens, which a closed browser tab cannot do.

## Decision

- Netlify scheduled functions, written with Hono, poll each source's feed and write new items to Postgres.
- The SPA reads items from Supabase under RLS (`user_id = auth.uid()`). It never fetches feeds itself.
- Items stay in the database until the user's delivery window opens. The client only shows delivered items.
- Supported in the MVP: RSS, Atom, podcast feeds, YouTube channel feeds. Platforms without open feeds are out of scope.
- Feed XML is untrusted input. Parse it, then validate every item with a Zod schema before inserting.

## Consequences

- Adds a server component; the app was otherwise client-only.
- Needs a feed parser dependency and a Supabase project. Both are added when the first ingestion feature starts, not before.
- Functions run locally with `netlify dev`, so behaviour matches production.
