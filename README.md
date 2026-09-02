# Machine Learning Fundamentals

A static, three-page explainer on machine learning — from "what is a model" through
transformers, LLMs and agents — written to be read start to finish rather than
skimmed. Fifteen chapters in two parts, each one illustrated with a hand-written
SVG diagram.

The site is deliberately small: no CMS, no client-side router, no analytics. It
builds to plain HTML, CSS and one JS bundle, and is served as static files by
Vercel.

| Page | Route | Built from |
| --- | --- | --- |
| Landing / chapter index | `/` | React (`src/`) |
| Part I — Foundations | `/fundamentals.html` | hand-written HTML (`public/`) |
| Part II — Modern AI | `/modern-ai.html` | hand-written HTML (`public/`) |

## Stack

Vite + React + TypeScript + Tailwind CSS v4.

Only the landing page is React; the two article pages are still the original
hand-written HTML, shipped verbatim out of `public/`. Both halves read their
design tokens from `public/tokens.css` — the article pages link it, and
`src/index.css` imports it and maps the names into Tailwind's namespace and onto
the shadcn variable contract (`--background`, `--primary`, `--border`, …) the one
UI component is built against.

## Requirements

- Node 24 (what CI runs; ≥20.11 is the real floor — `vite.config.ts` uses `import.meta.dirname`)
- npm

## Running it

```bash
npm install
npm run dev
```

Vite serves the landing page at http://localhost:5173, with the two article
pages alongside it at `/fundamentals.html` and `/modern-ai.html` — `public/` is
served from the site root, so internal links work in dev exactly as they do in
production.

To look at the real build output instead:

```bash
npm run build     # type-checks, then writes dist/
npm run preview   # serves dist/ at http://localhost:4173
```

## Testing

```bash
npm test
```

That validates the source HTML, builds, then drives the build. Playwright runs
against `dist/` and never against the dev server, because `dist/` is the only
place the React landing page and the static article pages sit side by side the
way Vercel serves them.

| Script | What it checks |
| --- | --- |
| `npm run test:html` | `html-validate` over the hand-written HTML: `index.html` and the two article pages. The React landing markup is not hand-written, so Playwright and axe cover it instead. |
| `npm run test:a11y` | Playwright: content, links, layout, and axe-core against WCAG 2 A/AA |

First run on a clean machine needs the browser binary:

```bash
npx playwright install --with-deps chromium
```

## Deploying

Vercel, static. `vercel.json` pins the framework, build command and output
directory so the deploy doesn't rely on dashboard detection.

CI (`.github/workflows/ci.yml`) runs the full test suite on every push and PR to
`master`. Deploys are **manual** — trigger the `workflow_dispatch` on the CI
workflow, which builds and promotes to production via the Vercel CLI. `vercel
pull` in that job runs with `VERCEL_TOKEN` alone. On paper that should not be
enough to link the checkout to a project — `.vercel/` is gitignored and no
`VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` is set — yet the deploy succeeds. The
mechanism is unexplained; read a deploy run's log before changing this job. If
it ever breaks, adding those two as repository secrets is the documented fix.

## Layout

```
index.html              Vite entry; fonts + the pre-paint reveal script
src/
  App.tsx               the landing page
  chapters.tsx          all 15 chapters, with their SVG diagrams, as typed data
  use-reveal.ts         IntersectionObserver scroll reveal
  utils.ts              cn(), the Tailwind class merger
  index.css             maps public/tokens.css onto Tailwind and shadcn
  components/           Hero, SiteNav, PartSection, ChapterRow, button
public/                 copied to dist/ verbatim: the two article pages, their
                        CSS/JS, and tokens.css
tests/                  Playwright specs
docs/agents/            conventions for agents working in this repo
```

The landing page is client-rendered: with JS off it renders nothing at all,
unlike the two article pages, which stay fully readable. Prerendering it would
fix that.
