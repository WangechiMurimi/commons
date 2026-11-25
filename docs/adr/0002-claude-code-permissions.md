# 0002. Claude Code permissions: allowlist + deny

Status: accepted · 2026-11-25

## Context

Claude Code works in this repo. Prompting on every command is slow. Allowing everything risks leaking secrets and running destructive git commands.

## Decision

The committed `.claude/settings.json` sets three tiers:

- **Allow:** read-only actions and ones that can be undone. These are pnpm scripts, read-only git and gh, and edits under `src/`, `e2e/`, and `docs/`.
- **Ask:** commits, pushes, PR creation and merging, dependency changes, and edits to `package.json`, `.github/`, and `.claude/`.
- **Deny:** reading or editing `.env*`, force-pushing, `reset --hard`, `rm -rf`, `npm`/`yarn`, production deploys, and resetting the database.

Personal overrides go in `.claude/settings.local.json`, which is gitignored.

## Consequences

The sandbox is not enabled. Turn it on if the repo starts running untrusted scripts.
