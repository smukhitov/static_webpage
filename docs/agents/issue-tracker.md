# Issue tracker: Obsidian

Issues, specs, wayfinder maps and tickets for this repo live as notes in the Obsidian
vault, under the project folder **`static-webpage/`**. All access is through the
`obsidian` MCP server (`mcp__obsidian__vault_*`) — never the filesystem.

If the MCP server is unreachable, say so and stop. Do not silently fall back to
`.scratch/` or GitHub Issues; the vault is the source of truth.

## Vault layout

```
static-webpage/
├── CONTEXT.md              ← glossary (see docs/agents/domain.md)
├── docs/adr/               ← NNNN-slug.md decision records
├── issues/                 ← NN-slug.md general issues and specs
└── wayfinder/
    ├── <effort>.md         ← the map
    └── <effort>/           ← one file per ticket
```

Register the project in the vault's root `CONTEXT-MAP.md` when creating it.

## Core operations

- **Create / overwrite**: `vault_write` with the full note body (creates parent dirs).
- **Read**: `vault_read`. For long notes, call `vault_get_document_map` first and read
  a targeted heading rather than the whole file.
- **Comment**: `vault_append` under a `## Comments` heading at the bottom of the note.
- **Edit in place**: `vault_patch`, passing the `version` from `vault_get_document_map`
  as `ifMatch` so a concurrent session's write can't be clobbered.
- **Search**: `search_simple` for text; `vault_list` to enumerate a folder.

## When a skill says "publish to the issue tracker"

Write `static-webpage/issues/<NN>-<slug>.md`, numbered from `01`, with frontmatter:

```yaml
---
status: needs-triage
---
```

## When a skill says "fetch the relevant ticket"

`vault_read` the referenced path. The user will normally pass a note name or path.

## Wayfinding operations

Used by `/wayfinder`.

- **Map**: `static-webpage/wayfinder/<effort>.md`, frontmatter `wayfinder: map`.
  Body: Destination / Notes / Decisions so far / Not yet specified / Out of scope.
- **Child ticket**: `static-webpage/wayfinder/<effort>/<slug>.md`. Frontmatter:

  ```yaml
  ---
  wayfinder: ticket
  type: research | prototype | grilling | task
  status: open | claimed | closed
  assignee: <dev, when claimed>
  blockedBy:
    - static-webpage/wayfinder/<effort>/<other-slug>.md
  map: static-webpage/wayfinder/<effort>.md
  ---
  ```

  Body is a single `## Question` section.
- **Blocking**: the `blockedBy` frontmatter list, holding full vault paths. Obsidian has
  no native dependency type; `blockedBy` is the canonical representation, and because
  the entries are real vault links they render as a navigable graph. A ticket is
  unblocked when every note it lists has `status: closed`.
- **Frontier query**: `vault_list` the effort folder, read each ticket's frontmatter,
  and keep those with `status: open`, no `assignee`, and no unclosed `blockedBy` entry.
- **Claim**: `vault_patch` `status: claimed` and set `assignee` — the session's first
  write, before any other work.
- **Resolve**: `vault_append` the answer under a `## Resolution` heading, `vault_patch`
  `status: closed`, then append a context pointer (gist + `[[wikilink]]`) to the map's
  **Decisions so far**.

## Linking

Refer to notes with `[[path/to/note|Display Name]]` wikilinks, never bare paths — this
is what makes the map navigable in Obsidian and populates backlinks.
