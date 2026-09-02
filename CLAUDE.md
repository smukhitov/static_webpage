## General instructions

- folder to use in Obsidian: 'static-webpage'
- create feature branch for each new feature from master branch, commit changes with meaningful messages, and create a pull request for review before merging into the main branch.
- **This describes how validated work reaches `master` — it is not licence to decide that work is validated.** The user runs everything outward-facing: push, PR, merge, deploy. Commit to the branch, prepare the exact command, and stop. Ask before pushing or opening anything.

## What you must not get wrong

**The site is two halves.** The landing page (`/`) is React in `src/`. The two article pages (`/fundamentals.html`, `/modern-ai.html`) are hand-written HTML in `public/`, served verbatim. A change to shared appearance has to be checked on both.

**`public/tokens.css` declares every design token, and nothing else does.** The article pages link it; `src/index.css` imports it and maps the names into Tailwind's namespace. Change a value there and both halves follow. Do not reintroduce a second copy.

**Class names like `.chapter`, `.nav-cta` and `.site-nav` carry no styling.** They are the hooks the Playwright suite addresses. Keep them.

**`npm test` is the only seam.** It validates the hand-written HTML (`index.html` + `public/*.html`), builds, then runs Playwright against `dist/` — not against the dev server, because `dist/` is what Vercel serves.

## Agent skills

### Issue tracker

Issues, wayfinder maps and tickets live in the Obsidian vault under `static-webpage/`, accessed via the `obsidian` MCP server. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical roles, used verbatim as `status` frontmatter values. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context. `CONTEXT.md` and ADRs live in the vault at `static-webpage/`, not in this repo. See `docs/agents/domain.md`.
