## General instructions

- folder to use in Obsidian: 'static-webpage'
- create feature branch for each new feature from master branch, commit changes with meaningful messages, and create a pull request for review before merging into the main branch.

## Stack

Vite + React + TypeScript + Tailwind v4 + shadcn/ui, built to `dist/` and served by Vercel.

The migration is deliberately half-finished, and the halves are different:

- **The landing page** (`/`) is React. It lives in `src/`, and its Classical design tokens are declared in `src/index.css` — as a Tailwind `@theme`, with shadcn's own variables (`--background`, `--primary`, …) derived from them so stock components inherit the palette.
- **The two article pages** (`/fundamentals.html`, `/modern-ai.html`) are still hand-written HTML in `public/`, served verbatim. They keep loading `public/design-system.css`.

So the same token values exist twice, in `src/index.css` and `public/design-system.css`. **Changing one means changing the other** until the article pages are ported too.

Class names like `.chapter`, `.nav-cta` and `.site-nav` survive in the React markup with no styling attached. They are the hooks the Playwright suite addresses; keep them.

`npm test` builds first, then validates the built HTML and runs Playwright against `dist/`.

## Agent skills

### Issue tracker

Issues, wayfinder maps and tickets live in the Obsidian vault under `static-webpage/`, accessed via the `obsidian` MCP server. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical roles, used verbatim as `status` frontmatter values. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context. `CONTEXT.md` and ADRs live in the vault at `static-webpage/`, not in this repo. See `docs/agents/domain.md`.
