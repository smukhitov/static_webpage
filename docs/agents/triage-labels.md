# Triage Labels

Obsidian has no labels, so the five canonical triage roles are recorded as the
`status` frontmatter field on an issue note. The label strings are used verbatim.

| Canonical role    | Value in our tracker | Meaning                                  |
| ----------------- | -------------------- | ---------------------------------------- |
| `needs-triage`    | `needs-triage`       | Maintainer needs to evaluate this issue  |
| `needs-info`      | `needs-info`         | Waiting on reporter for more information |
| `ready-for-agent` | `ready-for-agent`    | Fully specified, ready for an AFK agent  |
| `ready-for-human` | `ready-for-human`    | Requires human implementation            |
| `wontfix`         | `wontfix`            | Will not be actioned                     |

Set with `vault_patch` on the `status` frontmatter key.

Note: wayfinder **tickets** use a different `status` vocabulary
(`open`/`claimed`/`closed`) — the two never mix. Triage statuses apply to notes under
`static-webpage/issues/`, wayfinder statuses to notes under `static-webpage/wayfinder/`.
