# Flow Explorer Manifest

Tracks which Blick projects have an interactive flow explorer and when they were last refreshed.

Skill to update: `/flow-explorer` (see `~/.claude/skills/flow-explorer/SKILL.md`)

| Project    | Status   | File                                          | Components | Flows | Last refreshed | Outstanding              |
|------------|----------|-----------------------------------------------|------------|-------|----------------|--------------------------|
| Hub App    | ✅ Live  | `approved_designs/hub-app-flow-explorer.html` | 35         | 27    | 2026-05-13     | reverse highlight + shareable URLs (Esc clears) |
| Nexus      | ⬜ TODO  | —                                             | —          | —     | —              | Build initial inventory  |
| Website    | ⬜ TODO  | —                                             | —          | —     | —              | Build initial inventory  |
| Compass    | n/a      | (lives inside Hub App explorer)               | —          | —     | —              | —                        |
| Copper API | n/a      | (lives inside Hub App explorer)               | —          | —     | —              | —                        |
| Trading    | ⬜ TODO  | —                                             | —          | —     | —              | Private — host elsewhere |

## Companion artefacts

| Artefact                                          | Project | File                                            |
|---------------------------------------------------|---------|-------------------------------------------------|
| Static text-only flow reference (precursor)       | Hub App | `approved_designs/hub-app-flows-static.html`    |

## Update protocol

When code in a project changes substantially:

1. Run `/flow-explorer` and tell it which project
2. Skill diffs the current inventory against the codebase, proposes additions/removals
3. After updates, bump the **Last refreshed** date here and commit

When a new project should get its own explorer, add a row above with status `⬜ TODO` and assign.
