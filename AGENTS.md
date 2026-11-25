# proj3

Vite + React SPA (temporary name). Product scope: [docs/prd.md](docs/prd.md). Claude rules: [CLAUDE.md](CLAUDE.md).

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
| Backend    | Supabase client wired up, unused (see `docs/adr/0001-*`)       |
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

## Deviations from baseline

| Choice                                                                   | Why                                                                                     |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| TypeScript ~6.0                                                          | typescript-eslint supports <6.1. Revisit when it supports TS 7.                         |
| ESLint 9                                                                 | jsx-a11y supports ≤9. Revisit when it supports ESLint 10.                               |
| shadcn `radix-nova` preset; Prettier default (double quotes, semicolons) | Current `shadcn init` requires a preset; Prettier runs with its defaults (`{}` config). |

## Decisions

Architecture decisions live in [docs/adr/](docs/adr/).
