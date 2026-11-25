# Commons — Claude instructions

Stack, commands, layout, and deviations: @AGENTS.md
Product requirements (what we're building and why): @docs/prd.md

Global habits (TDD, GitHub Flow, Conventional Commits, rebase-merge) come from `~/.claude/CLAUDE.md`. This file adds the rules specific to Commons.

## Project context

- **What:** Commons, a Vite + React SPA (from `app-template`) for curated, finite content consumption: unified reader, interest spaces, personal knowledge. Scope and metrics: `docs/prd.md`.
- **Status:** Pre-MVP. The `notes` feature is template scaffolding. Replace it with the first PRD feature, then delete it.
- **Vocabulary:** Source, Item, Space, Delivery schedule, Shelf, Note. Use these terms in code, tests and docs.

## Architecture

| Concern     | Rule                                                                                            |
| ----------- | ----------------------------------------------------------------------------------------------- |
| Structure   | One folder per feature in `src/features/<name>/`: schema, repository, hooks, page, tests        |
| Data access | Components → TanStack Query hooks → `<Feature>Repository` interface → implementation            |
| Persistence | In-memory repository until the PRD needs per-user data; then Supabase (ADR 0001, 0004)          |
| Ingestion   | Feeds are fetched server-side (Hono + Netlify functions), never from the browser (ADR 0003)     |
| Delivery    | Items wait in the database until a delivery window opens; the client shows delivered items only |
| Permissions | Enforced by Postgres RLS (`user_id = auth.uid()`), never only in the client                     |
| Validation  | Zod schema per entity; parse at every trust boundary (API, Supabase rows, URL params, forms)    |
| Types       | Derive with `z.infer<typeof Schema>`; don't hand-write duplicate interfaces                     |
| Routing     | React Router; routes live in `src/app/`; set the page title with `usePageTitle`                 |
| UI          | shadcn/ui components in `src/components/ui/` (generated: add via CLI, edit sparingly)           |
| Styling     | Tailwind v4 with `@theme` tokens in `src/index.css`; no hard-coded colors or spacing            |
| Shared code | `src/lib/` only when two or more features need it                                               |

Decisions: [docs/adr/](docs/adr/). Write a new ADR (`NNNN-title.md`, the format of 0001) for any change to the stack, data model, auth, or hosting.

## Testing strategy

| Layer               | Tool                         | What it covers                                     | Where                          |
| ------------------- | ---------------------------- | -------------------------------------------------- | ------------------------------ |
| Schema / pure logic | Vitest                       | Zod parse/reject cases, repository contract        | `*.test.ts` beside the source  |
| Components          | Vitest + Testing Library     | Rendering, user events, loading/error/empty states | `*.test.tsx` beside the source |
| Journeys            | Playwright                   | One happy path per PRD user story                  | `e2e/`                         |
| Accessibility       | axe (`@axe-core/playwright`) | Every page in each state (empty, filled, error)    | `e2e/`                         |

- Write the failing test first, run it, and confirm it fails for the right reason.
- Query by role, label, or text (`getByRole`, `getByLabelText`). Never query by CSS class or test-id unless there is no accessible name.
- Test repositories through the interface, so in-memory and Supabase implementations share one contract suite.
- Before you call a task done, run `pnpm typecheck && pnpm lint && pnpm test`. Run `pnpm e2e` too when routes or pages change.

## Do

- Read `docs/prd.md` before starting a feature; link the user story in the PR.
- Keep each change small: one green test, one commit.
- Add a Zod schema before you add a new data shape.
- Use `pnpm` for everything (`pnpm dlx` for one-off CLIs).
- Record new deviations from the baseline in `AGENTS.md` → "Deviations from baseline".
- Ask before you add a dependency. Say which baseline gap it fills.

## Don't

- Don't read, print, or commit `.env*` files (except `.env.example`). Secrets go in `.env.local` and Netlify.
- Don't use `npm`, `yarn`, `any`, `@ts-ignore`, or non-null `!` to silence `noUncheckedIndexedAccess`. Narrow the type instead.
- Don't call `supabase-js` from components. Go through the repository.
- Don't add SSR, a state library (Redux, Zustand), or a CSS-in-JS lib without an ADR.
- Don't push to `main`, force-push, squash-merge, or skip hooks (`--no-verify`).
- Don't edit generated files (`src/components/ui/*` beyond token tweaks, `pnpm-lock.yaml` by hand).
