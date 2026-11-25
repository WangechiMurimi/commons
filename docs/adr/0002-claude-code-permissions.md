# 0002. Claude Code permissions: allowlist + deny + sandbox

Status: accepted · 2026-11-25

## Context

Claude Code works in this repo. Prompting on every command is slow. Allowing everything risks leaking secrets and running destructive git commands.

## Decision

The committed `.claude/settings.json` sets three tiers:

- **Allow:** read-only actions and ones that can be undone. These are pnpm scripts, read-only git and gh, and edits under `src/`, `e2e/`, and `docs/`.
- **Ask:** commits, pushes, PR creation and merging, dependency changes, and edits to `package.json`, `.github/`, and `.claude/`.
- **Deny:** reading or editing `.env*`, force-pushing, `reset --hard`, `rm -rf`, `npm`/`yarn`, production deploys, and resetting the database.

Rules that match command text can be sidestepped (`rm -r -f`, `type .env`). For that reason the **sandbox** is on and enforces limits at the OS level:

- `allowUnsandboxedCommands: false`: Claude can't opt a command out of the sandbox.
- Filesystem: the working directory is writable. `Read(.env*)` deny rules also block `.env` reads inside the sandbox.
- Network: only npm, GitHub, Playwright downloads, and Supabase.
- Excluded (run unsandboxed, but still under the permission rules): `gh` (needs the OS keyring) and Playwright (Chromium needs its own sandbox).

Machine-specific paths go in `.claude/settings.local.json`, which is gitignored. Today that is only the pnpm store as `sandbox.filesystem.allowWrite`.

## Consequences

- Run `/sandbox` once per machine to install and verify the Windows sandbox. Until then, Claude Code warns and runs commands unsandboxed.
- The sandbox wraps the Bash tool. PowerShell-tool commands rely only on the permission rules.
- A new external service means adding its domain to `sandbox.network.allowedDomains`.
