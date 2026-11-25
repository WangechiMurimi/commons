# proj3

Vite + React SPA template: React Router, Tailwind v4, shadcn/ui, TanStack Query, Zod, Vitest, Playwright + axe. CI runs format, lint, typecheck, tests, e2e, and build. Stack and conventions: see `AGENTS.md`.

`notes` is an example feature: replace or delete `src/features/notes`.

## Commands

`pnpm dev` · `pnpm test` · `pnpm e2e` · `pnpm lint` · `pnpm typecheck` · `pnpm format` · `pnpm build`

Before the first `pnpm e2e`, install the browser: `pnpm exec playwright install chromium`.

## Start a new app

```powershell
gh repo create <name> --template WangechiMurimi/app-template --private --clone
cd <name>; pnpm install
```

Then rename the project: `name` in `package.json`, and the `<title>` in `index.html` (page titles are set per route with `usePageTitle`).

## Environment

Supabase is optional. To use it locally, copy the example file (`.env.local` is gitignored):

```powershell
Copy-Item .env.example .env.local
```

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.local`, and in the Netlify environment variables for deploys.

## Repo settings

Template settings are NOT inherited. In each new repo, run:

```powershell
gh repo edit --enable-rebase-merge --enable-squash-merge=false --enable-merge-commit=false --delete-branch-on-merge
```
