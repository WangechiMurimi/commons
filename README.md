# Commons

A calm, finite home for the content you follow: a unified subscription reader, personal interest spaces, and a personal knowledge environment. You set the volume and frequency of what reaches you. No recommendation algorithm, no infinite scroll, no permanent archive.

**Status:** pre-MVP

## Docs

| Doc                        | Contents                                     |
| -------------------------- | -------------------------------------------- |
| [docs/prd.md](docs/prd.md) | Scope, domain vocabulary, MVP user stories   |
| [docs/adr/](docs/adr/)     | Architecture decisions                       |
| [AGENTS.md](AGENTS.md)     | Stack, architecture rules, conventions, done |

## Stack

Vite + React SPA with React Router, Tailwind v4 (`@theme` tokens) and shadcn/ui, TanStack Query over a feature repository, Zod at every trust boundary. Tests: Vitest, Testing Library, Playwright, axe. Hosted on Netlify.

Planned, added per milestone: Supabase (per-user data, magic-link auth), Hono on Netlify functions (server-side feed fetching), an RSS/Atom parser, and Netlify scheduled functions. See ADRs 0001, 0003 and 0004.

## Getting started

Requires Node 26 (`.nvmrc`) and pnpm (pinned via `packageManager`).

```powershell
pnpm install
pnpm exec playwright install chromium   # once, before the first pnpm e2e
pnpm dev
```

## Commands

| Task                   | Command                                              |
| ---------------------- | ---------------------------------------------------- |
| Dev server             | `pnpm dev`                                           |
| Unit + component tests | `pnpm test` (`pnpm test:watch`)                      |
| E2E + accessibility    | `pnpm e2e`                                           |
| Lint / types / format  | `pnpm lint` · `pnpm typecheck` · `pnpm format:check` |
| Build                  | `pnpm build`                                         |

A change is done when `pnpm typecheck && pnpm lint && pnpm test` passes, plus `pnpm e2e` when routes or pages change. CI runs all of these on every PR; Lefthook runs Prettier and ESLint on staged files at commit time.
