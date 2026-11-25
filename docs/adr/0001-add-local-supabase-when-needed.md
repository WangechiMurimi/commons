# 0001. Add local Supabase when needed

Status: accepted · 2026-11-22

## Context

The template ships without a back end. Notes live behind a `NotesRepository` interface with an in-memory implementation, so tests and CI need no database. `getSupabase()` is wired up but unused; it returns `null` without env vars.

## Decision

Add Supabase only when an app needs persistent, per-user data.

## Steps

1. `supabase init`, then `supabase start` (needs Docker).
2. Put migrations in `supabase/migrations/`.
3. Enable RLS with `user_id = auth.uid()` policies.
4. Implement `SupabaseNotesRepository` behind the same `NotesRepository` interface and swap it in through `AppProviders`.
5. Add a CI service step only if e2e tests need the database.
