# Login page: design

Status: approved · 2026-11-25 · Issue #6 · Size: small feature

## Explore (what exists)

- `src/features/notes/` is the template: `note-schema.ts` (Zod), `notes-repository.ts` (interface + in-memory), `use-notes.ts` (TanStack hooks + context), `NotesPage.tsx`, colocated tests.
- Providers inject repositories by context in `src/app/providers.tsx`; routes live in `src/app/App.tsx`.
- UI primitives: `components/ui/{button,input,label}.tsx`. Page titles: `lib/use-page-title.ts`.
- Geist is the only installed font. No auth code or Supabase wiring exists.
- ADR 0004 said magic link only; superseded by [ADR 0005](../../adr/0005-auth-methods.md).

## Intent

An editorial, understated sign-in page: refined type, generous whitespace, muted palette, brief product intro. Not a conventional SaaS card.

## Goals / non-goals

- Goals: email and password, Google sign-in, "Forgot password?" and "Create account" links, clear states, responsive, WCAG 2.2 AA, placeholder branding.
- Non-goals: real Supabase auth, sign-up and recovery pages, session persistence, new dependencies.
- Anti-goal: an error message that reveals whether an account exists.

## Approaches

- **A. UI only, hard-coded handler.** Quick, but untestable seams and no repository contract.
- **B. UI + in-memory `AuthRepository` behind a hook (chosen).** Mirrors notes; Supabase swaps in later with the same contract suite.
- **C. Install Supabase now.** Needs approval and Docker; out of scope.

## Design

- `auth-schema.ts`: `SignInSchema` (trimmed email, password min 8).
- `auth-repository.ts`: `signInWithPassword(input)` and `signInWithGoogle()` return a `Session`; failure is one generic `Error("Invalid email or password")`.
- `use-auth.ts`: `AuthRepositoryContext`, `useSignIn()` mutation.
- `LoginPage.tsx`: two-column editorial layout on wide screens (intro left, form right), single column below `md`. Errors use `role="alert"`, `aria-invalid`, `aria-describedby`; focus moves to the first invalid field; submit button disables with `aria-busy`.
- Tokens: muted paper, ink, accent and rule colours plus a type scale in `src/index.css` `@theme`.

## Acceptance criteria (one red-green-refactor cycle each)

1. Schema validation. 2. Repository contract. 3. `useSignIn` states. 4. Page content. 5. Validation errors and focus. 6. Submitting, error, success. 7. Route, title, tokens. 8. Playwright journey and axe in idle and error states.

## Verification

`pnpm typecheck && pnpm lint && pnpm test && pnpm e2e`; manual check at 360px and 1280px and keyboard-only.
