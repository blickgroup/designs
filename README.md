# Blick Design Library

Public design gallery for Blick Group projects, served at **https://blickgroup.github.io/designs/**.

Build: `node build-gallery.cjs` (also runs in GitHub Actions on every push to `main`).

## Layout

```
designs/
├── approved_designs/      Hub App approved mockups + final reference artefacts
├── design_iterations/     Hub App work-in-progress (auto-classified as "iteration")
│   └── archive/           Hub App archived mockups
├── brand/                 Brand source-of-truth surfaces (Brand.md, hub-app DESIGN.md, etc.)
├── nexus/                 Nexus AI system mockups
├── external/
│   ├── website/           Public-site prototypes (mirrored from website-test repo)
│   ├── video/             Hyperframes video composition briefs + viewers
│   └── linkedin/          Drafted LinkedIn post previews
├── build-gallery.cjs      Gallery builder — scans projects, writes _site/index.html
└── _site/                 Build output (gitignored — produced fresh on every push)
```

Each project has its own tab on the gallery. Cards on a tab are sorted modified-date-desc and filtered by status (`approved` / `iteration` / `archived`).

## Flow Explorers

Interactive system-architecture diagrams. **One explorer per project.**

| Project   | Explorer file                                                | Live URL                                                                         |
|-----------|--------------------------------------------------------------|----------------------------------------------------------------------------------|
| Hub App   | `approved_designs/hub-app-flow-explorer.html`                | https://blickgroup.github.io/designs/designs/hub-app/hub-app-flow-explorer.html  |
| Hub App   | `approved_designs/hub-app-flows-static.html` (text-only ref) | https://blickgroup.github.io/designs/designs/hub-app/hub-app-flows-static.html   |

Manifest of all explorers: `approved_designs/_flow-explorer-manifest.md`

### What a flow explorer is

A single-page HTML diagram. Components shown as nodes in a layered DAG (UI → Infra → Services → Data → External). Named flows in a left sidebar. Click a flow → its path lights up, edges animate in sequentially with numbered badges, right panel reads out each step's protocol and payload.

Fully self-contained — no external JS, no `fetch()`, no build step. Component and flow data live in two `<script type="application/json">` blocks at the bottom of the HTML.

### To create or update an explorer

Use the **`flow-explorer`** skill: `/flow-explorer`

The skill walks through:
1. Inventory components and flows by reading the project codebase
2. Hand-place node positions in a layered DAG
3. Validate every flow step references a real component
4. Push to `main` — GitHub Actions deploys to GitHub Pages in ~60s

Full skill spec: `~/.claude/skills/flow-explorer/SKILL.md`

### To hand-edit JSON without the skill

1. Open the explorer HTML
2. Scroll to the bottom, find `<script type="application/json" id="components-data">` and `<script type="application/json" id="flows-data">`
3. Edit the JSON inline. Add components with a unique `id`, a `kind` from the allowed set (`frontend-view`, `frontend-infra`, `package`, `backend-service`, `datastore`, `external`, `infrastructure`), a `layer` (`ui` / `infra` / `service` / `data` / `external`), and a `pos: { x, y }`
4. Validate with the node snippet in the skill (checks JSON parses + all `from`/`to` IDs resolve)
5. Commit + push

## Auto-publishing

A launchd job `com.blick.publish-design-library` runs every hour 07:15–19:15 and auto-commits new HTML under `external/...` (linkedin, website, video, brand). It does NOT touch `approved_designs/` or `design_iterations/` — those need manual commits.

GitHub Actions workflow `.github/workflows/deploy-design-library.yml` runs `build-gallery.cjs` and deploys `_site/` to GitHub Pages on every push to `main`.

## Adding a new project tab

1. Edit `build-gallery.cjs` → add to the `PROJECTS` array with `iterationsDir` / `approvedDir` / `archiveDir` paths
2. Create those directories
3. Drop HTML files into them
4. Push to `main`

## Brand

Canonical tokens are in `brand/approved/hub-app-DESIGN.html` (mirrored from `BlickVault/Brand/brand-guidelines/`). Source of truth for surfaces lives in the vault — this gallery shows the rendered mirror.

Never substitute brand colours. Orange `#f05323` and cyan `#22d3ee` are reserved for active/interactive states only. Purple collides with `--chart-1` (Stabilisers product category) — substitute slate `rgba(148,163,184,*)` for any "data layer" tint.
