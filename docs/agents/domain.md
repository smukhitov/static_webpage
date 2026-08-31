# Domain Docs

How the engineering skills should consume this repo's domain documentation.

This repo is **single-context**, and its domain docs live in the **Obsidian vault**,
not in the repo. Read them with the `obsidian` MCP server (`mcp__obsidian__vault_read`).

## Before exploring, read these

- **`static-webpage/CONTEXT.md`** in the vault — the glossary for this project.
- **`static-webpage/docs/adr/`** — read ADRs that touch the area you're about to work
  in. `vault_list` the folder first.
- The vault's root **`CONTEXT-MAP.md`** lists every project and links its `CONTEXT.md`.

If any of these don't exist, **proceed silently**. Don't flag their absence; don't
suggest creating them upfront. The `/domain-modeling` skill creates them lazily when
terms or decisions actually get resolved.

## File structure

```
<vault root>/
├── CONTEXT-MAP.md              ← index of all projects
└── static-webpage/
    ├── CONTEXT.md              ← this project's glossary
    └── docs/adr/
        ├── 0001-<slug>.md
        └── 0002-<slug>.md
```

`CONTEXT.md` is a glossary and nothing else — no implementation details, no specs, no
scratch notes.

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a
hypothesis, a test name), use the term as defined in `CONTEXT.md`. Don't drift to
synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal — either you're
inventing language the project doesn't use (reconsider) or there's a real gap (note it
for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently
overriding:

> _Contradicts ADR-0007 (single-page layout) — but worth reopening because…_
