# 0004. Data model and auth

Status: proposed · 2026-11-25

## Context

All Commons data is personal: sources, spaces, schedules, saves and notes. Per-user data triggers ADR 0001, which says to add Supabase when persistent per-user data is needed.

## Decision

- Entities: Source, Item, Space, SpaceSource, DeliverySchedule, ShelfItem, Note. Fields are sketched in `docs/prd.md`.
- Every table has a `user_id` column and an RLS policy `user_id = auth.uid()`. Permissions are never enforced only in the client.
- ~~Auth is Supabase email magic link. No passwords, no OAuth in the MVP.~~ Superseded by [0005](0005-auth-methods.md).
- A ShelfItem has an `expires_at` (default 14 days after saving). Expiry is enforced by a scheduled job, not by the client.
- Each entity gets a Zod schema and a `<Entity>Repository` interface, with an in-memory implementation for tests and a Supabase one for production. Both share one contract test suite.

## Consequences

- Supersedes the in-memory-only setup once the first feature needs persistence.
- Requires local Supabase (see ADR 0001 steps) and migrations in `supabase/migrations/`.
- Delivery rules live in the data (schedules), so they can change without a deploy.
