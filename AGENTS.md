# Commons

A Vite + React SPA for curated, finite content consumption: a unified reader, interest spaces, and personal knowledge. Scope and user stories: [docs/prd.md](docs/prd.md). Decisions: [docs/adr/](docs/adr/).

**Status:** pre-MVP

## Core Principles

1. **Code Quality:** maintainable, readable, production-ready code that follows the [Architecture rules](#architecture-rules). Remove unused imports, dead code, and needless duplication.
2. **UI Quality:** polished, cohesive, and distinctive interfaces built on Tailwind `@theme` tokens. Avoid generic default styling. Prioritise consistency, usability, responsiveness, and accessibility (WCAG 2.2 AA).
3. **Test-Driven:** no feature is complete without automated tests. See [Testing](#testing).
4. **Collaborative Workflow:** Scrum on GitHub Issues, with feature branches and pull requests. See [Conventions](#conventions).
5. **Incremental Commits:** commit at each valid checkpoint, at least every time a feature or sub-component is completed.

## Workflow Execution Rules

1. **Planning & Execution:**
   - Before a non-trivial task, state (1) your understanding of the request, (2) the steps you'll take, and (3) what the result should look like.
   - Ask for clarification when requirements conflict or an important decision is unresolved.
   - For substantial changes, identify the affected components and dependencies before coding.
   - Prefer small, reviewable diffs. Preserve existing behaviour and avoid unrelated refactoring.
2. **References:** consult these before implementing. Report missing or conflicting references instead of assuming requirements.
   - PRD: [docs/prd.md](docs/prd.md)
   - Architecture decisions: [docs/adr/](docs/adr/)
   - Design specification: `docs/DESIGN.md` (not yet created)
   - Workflow board: GitHub Projects (link not yet added)
3. **Issue Tracking:** link every feature or significant change to a GitHub issue. If none exists, create or flag one before implementing.
4. **Verification:**
   - Prioritise accuracy over agreement. State uncertainty, and challenge flawed assumptions with clear reasoning.
   - Run the [Done means](#commands) checks before reporting completion.
   - Disclose any test that could not be run or did not pass.
5. **Security & Scope:** follow [Boundaries](#boundaries).

## Commands

| Task                   | Command                                                         |
| ---------------------- | --------------------------------------------------------------- |
| Dev server             | `pnpm dev`                                                      |
| Unit + component tests | `pnpm test` (`pnpm test:watch`)                                 |
| E2E + accessibility    | `pnpm e2e` (first run: `pnpm exec playwright install chromium`) |
| Lint / types / format  | `pnpm lint` · `pnpm typecheck` · `pnpm format:check`            |
| Build                  | `pnpm build`                                                    |

**Done means** `pnpm typecheck && pnpm lint && pnpm test` passes, plus `pnpm e2e` when routes or pages change. CI runs all of these on every PR. Lefthook runs Prettier and ESLint on staged files at commit time.

## Stack

| Layer      | Choice                                                   |
| ---------- | -------------------------------------------------------- |
| Runtime    | Node 26 (`.nvmrc`), pnpm pinned via `packageManager`     |
| Language   | TypeScript strict + `noUncheckedIndexedAccess`           |
| UI         | React, React Router, Vite                                |
| Styling    | Tailwind v4 with `@theme` tokens; shadcn/ui (Radix)      |
| Data       | TanStack Query over a feature repository (in-memory now) |
| Validation | Zod                                                      |
| Tests      | Vitest, Testing Library, Playwright, axe                 |
| Hosting    | Netlify                                                  |

### Planned (not installed)

Add each item when its milestone starts, and ask first.

| Item                           | Gap it fills                                  | Source         |
| ------------------------------ | --------------------------------------------- | -------------- |
| Supabase (Postgres, Auth, RLS) | Per-user data; magic-link sign-in             | ADR 0001, 0004 |
| Hono on Netlify functions      | Server-side feed fetching (browsers hit CORS) | ADR 0003       |
| RSS/Atom feed parser           | Reads untrusted feed XML                      | ADR 0003       |
| Netlify scheduled functions    | Polling sources; expiring shelf items         | ADR 0003, 0004 |

## Layout

```
src/
  app/              App.tsx (routes), providers, not-found page
  components/ui/    shadcn components (generated)
  features/<name>/  schema, repository, hooks, page, colocated tests
  lib/              Supabase client, shared utilities
  test/             Vitest setup
e2e/                Playwright journeys and axe checks
docs/prd.md         product requirements
docs/adr/           architecture decisions
.claude/            Claude Code permissions (ADR 0002)
```

## Architecture rules

| Concern     | Rule                                                                                                 |
| ----------- | ---------------------------------------------------------------------------------------------------- |
| Data access | Components → TanStack Query hooks → `<Feature>Repository` interface → implementation                 |
| Persistence | In-memory repository until a feature needs per-user data, then Supabase                              |
| Ingestion   | Feeds are fetched server-side only. Items are held in the database until their delivery window opens |
| Permissions | Postgres RLS (`user_id = auth.uid()`), never only in the client                                      |
| Validation  | One Zod schema per entity; parse at every trust boundary (API, DB rows, URL params, forms, feed XML) |
| Types       | `z.infer<typeof Schema>`; no hand-written duplicate interfaces                                       |
| Routing     | Routes in `src/app/`; set page titles with `usePageTitle`                                            |
| Styling     | `@theme` tokens in `src/index.css`; no hard-coded colours or spacing                                 |
| Shared code | Goes in `src/lib/` only once two or more features need it                                            |

## Testing

| Layer          | Tool                     | Covers                                             | Location                       |
| -------------- | ------------------------ | -------------------------------------------------- | ------------------------------ |
| Schema / logic | Vitest                   | Zod parse/reject cases, repository contract        | `*.test.ts` beside the source  |
| Components     | Vitest + Testing Library | Rendering, user events, loading/error/empty states | `*.test.tsx` beside the source |
| Journeys       | Playwright               | One happy path per PRD user story                  | `e2e/`                         |
| Accessibility  | `@axe-core/playwright`   | Every page in each state (empty, filled, error)    | `e2e/`                         |

- Write tests first. Every feature ships with tests.
- Query by role, label, or text. Use a test-id only when an element has no accessible name.
- Run one contract suite against every repository implementation (in-memory and Supabase).

## Conventions

- **Naming:** files are `kebab-case.ts`, components `PascalCase.tsx`, constants `UPPER_SNAKE_CASE`.
- **Issues:** every change links to a GitHub issue. Create the issue first if there isn't one.
- **Branches:** `type/<issue>-<short-description>`, opened as a PR against `main`; merge with rebase-and-merge.
- **Commits:** Conventional Commits, `type(scope): summary (#issue)`.
- **PRs:** link the PRD user story the change serves.
- **Comments:** explain why, not what.

## Boundaries

- Never commit or print secrets. Local values go in `.env.local` (template: `.env.example`); deployed values go in Netlify environment variables.
- Never log or store auth tokens. Error messages must not reveal whether an account exists.
- No `any`, `@ts-ignore`, or non-null `!`. Narrow types instead.
- Never call `supabase-js` from components; go through the repository.
- Ask before adding a dependency, and state which gap it fills.
- Write an ADR (`docs/adr/NNNN-title.md`, the format of 0001) before changing the stack, data model, auth, or hosting, and before adding SSR, a state library, or CSS-in-JS.
- Never edit generated files by hand (`src/components/ui/*` beyond token tweaks, `pnpm-lock.yaml`).
- Don't push to `main`, force-push, squash-merge, or skip hooks.

## Version pins

Don't upgrade these until the blocker is resolved.

| Pin                        | Why                                                                     |
| -------------------------- | ----------------------------------------------------------------------- |
| TypeScript ~6.0            | typescript-eslint supports < 6.1; revisit when it supports TS 7         |
| ESLint 9                   | jsx-a11y supports ≤ 9; revisit when it supports ESLint 10               |
| shadcn `radix-nova` preset | Add new components with the same preset so they match the existing ones |
