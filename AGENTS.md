# Commons

Commons: a Vite + React SPA for curated, finite content consumption. Product scope: [docs/prd.md](docs/prd.md). Claude rules: [CLAUDE.md](CLAUDE.md).

## Stack

| Layer      | Choice                                                         |
| ---------- | -------------------------------------------------------------- |
| Runtime    | Node 26 LTS, fnm, `.nvmrc`                                     |
| Packages   | pnpm, pinned via `packageManager`                              |
| Language   | TypeScript strict + noUncheckedIndexedAccess                   |
| Build      | Vite                                                           |
| UI         | React + React Router                                           |
| Styling    | Tailwind v4 + own `@theme` tokens; shadcn/ui (Radix)           |
| Data       | TanStack Query over a `NotesRepository` (in-memory by default) |
| Backend    | Supabase client wired up, unused (ADR 0001, 0004)              |
| Validation | Zod at trust boundaries                                        |
| Tests      | Vitest + Testing Library + Playwright + axe                    |
| Hosting    | Netlify                                                        |

## Commands

- dev: `pnpm dev`
- test: `pnpm test`
- e2e: `pnpm e2e`
- lint: `pnpm lint`
- typecheck: `pnpm typecheck`
- build: `pnpm build`
- format: `pnpm format` (check: `pnpm format:check`)

## Layout

```
src/
  app/                 routes, providers, not-found page
  components/ui/       shadcn components (generated)
  features/
    notes/             schema, repository, hooks, page, colocated tests
  lib/                 supabase client, utils
.claude/settings.json  Claude Code permissions (ADR 0002)
e2e/                   Playwright journeys and axe checks
docs/prd.md            product requirements
docs/adr/              architecture decisions
```

## Planned stack (not installed)

Nothing here is a dependency yet. Add each one when its milestone starts, and ask first.

| Item                        | Gap it fills                                        | Brought in by                            |
| --------------------------- | --------------------------------------------------- | ---------------------------------------- |
| Supabase local (Docker)     | Per-user data, Auth, RLS                            | ADR 0001, 0004; first persistent feature |
| Hono + Netlify functions    | Server-side feed fetching (browsers hit CORS)       | ADR 0003; first source feature           |
| Feed parser (RSS/Atom)      | Reads untrusted feed XML; output validated with Zod | ADR 0003; first source feature           |
| Netlify scheduled functions | Polling sources; expiring shelf items               | ADR 0003, 0004                           |
| `netlify dev`               | Run functions locally like production               | ADR 0003                                 |

## Domain vocabulary

Source (a followed feed) · Item (one piece of content) · Space (a group of sources) · Delivery schedule (when items are released) · Shelf (saves that expire) · Note. Definitions: `docs/prd.md`.

## Deviations from baseline

| Choice                                                                   | Why                                                                                     |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| TypeScript ~6.0                                                          | typescript-eslint supports <6.1. Revisit when it supports TS 7.                         |
| ESLint 9                                                                 | jsx-a11y supports ≤9. Revisit when it supports ESLint 10.                               |
| Server component (Hono + Netlify functions), planned                     | Feeds need server-side fetching; see ADR 0003. Baseline default is no server.           |
| shadcn `radix-nova` preset; Prettier default (double quotes, semicolons) | Current `shadcn init` requires a preset; Prettier runs with its defaults (`{}` config). |

## Decisions

Architecture decisions live in [docs/adr/](docs/adr/).
