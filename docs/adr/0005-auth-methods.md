# 0005. Auth methods

Status: accepted · 2026-11-25

Supersedes the auth line of [0004](0004-data-model-and-auth.md).

## Context

ADR 0004 chose magic link only. The product now wants a conventional sign-in page: email and password, Google, and a way to recover a password. Per-user data and RLS from 0004 are unchanged.

## Decision

- Methods: email and password, Google OAuth, password recovery by email. Magic link is not part of the first login page.
- Sign-in sits behind an `AuthRepository` interface. An in-memory implementation serves tests and the UI until Supabase Auth is wired in under ADR 0001.
- A failed sign-in returns one generic error, so the page never reveals whether an account exists.
- Tokens are never logged or stored by app code. Session handling is left to Supabase when it arrives.

## Consequences

- Passwords add a recovery flow and a sign-up flow, tracked as separate issues. The login page links to both.
- Google needs an OAuth client configured in Supabase before it works for real.
- Reintroducing magic link later needs a new ADR.
