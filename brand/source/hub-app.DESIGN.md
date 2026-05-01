---
title: Hub-App Design System
date: 2026-05-01
type: system
tags: [design-system, hub-app, internal-tool]
status: active
source: manual
schema: awesome-design-md-v1
surface: hub-app
parent: Brand
---

# Hub-App Design System

> **Audience:** ~11 internal users (Operations, Sales, Compliance, Drivers). Roles: owner-operators in their 40s–60s comfortable with phones and field work, less so with dense SaaS UIs.
>
> **Surface scope:** the hub-app at `hub-app/frontend/` — Compass (work), Copper (CRM), Operations (people, fleet, H&S), Rig (jobs), Health.
>
> **Inherits from:** [[Brand]] (voice, marks, terminology, brand orange `#f05323`).
>
> **Excludes:** marketing website ([[website.DESIGN]]), AI-generated content ([[content.DESIGN]]).
>
> **Token source of truth:** `hub-app/frontend/src/styles/themes.css`. This document is what that file *should* be. The `/design-token-audit` skill diffs the two.

---

## 1. Visual Theme & Atmosphere

**Calm, dense, get-out-of-the-way.** This is a tool people use for hours a day. It is not a marketing surface. It is not trying to delight. It is trying to make the next click obvious and the screen quiet enough to think.

The atmosphere is **operations-room dark by default**, with a high-contrast light mode for field/outdoor screens. Brand orange is reserved for action, never decoration. Information density is high — internal-tool tables and forms, not landing-page generosity.

If the hub-app feels like a marketing site, we got it wrong. If it feels like a senior advisor's notebook — orderly, dense, marked-up where it matters — we got it right.

---

## 2. Color Palette & Roles

Tokens live in `frontend/src/styles/themes.css` as CSS custom properties. Reference via Tailwind arbitrary values: `bg-[var(--bg-surface)]`. Never hardcode hex in a component.

### Dark theme (default)

| Role | Token | Value | Notes |
|---|---|---|---|
| Brand action | `--primary` | `#f05323` | Buttons, primary CTA, key links. Restraint — one orange anchor per view. |
| Brand action hover | `--primary-hover` | `#ff6a3d` | Hover, focus ring start |
| Accent (highlights, badges) | `--secondary` | `#22d3ee` | Cyan. Use for non-action emphasis (status, metrics). Not an action colour. |
| Page background | `--bg-page` | `#1a1a1a` | The surface behind everything |
| Card surface | `--bg-surface` | `#2a2a2a` | Cards, modals, drawers |
| Hover surface | `--bg-hover` | `#3a3a3a` | Row hover, button-on-card hover |
| Body text | `--text-primary` | `#bcbec0` | Default reading text |
| Heading text | `--text-heading` | `#ffffff` | h1–h4 |
| Muted text | `--text-muted` | `#707070` | Timestamps, helper text, disabled |
| Default border | `--border-default` | `#58595b` | Separators, input borders |
| Subtle border | `--border-subtle` | `#404040` | Card edges, table cell rules |

### Light theme

Defined in `themes.css` under `[data-theme="light"]`. Mirror role, different value. The audit skill checks symmetry.

### Status colour roles

| Role | Use for | Example surfaces |
|---|---|---|
| Success | Completed work, healthy metrics | Compass "Done" lane, healthz green |
| Warning | Needs attention, soon-overdue | Stale tickets, expiring docs |
| Danger | Blocked, breach, hard error | Blocked modal, validation, prod alerts |
| Info | Neutral status, metadata | Audit log entries, default badges |

Do **not** use brand orange for status. Orange is for *action this user can take now*, not state.

### Product category colours

When rendering a product anywhere in hub-app, use the colour-coded category palette from [[Brand]] §7.2. Category chip = category colour at 16% opacity background, full colour text, full colour 1px border.

---

## 3. Typography Rules

Inter as the screen face — Proxima Nova is a print/marketing font and isn't worth the licensing complexity for an 11-user internal tool. JetBrains Mono for IDs, codes, batch numbers, and any value that gets copied.

| Token | Family | Weight | Size / line | Use |
|---|---|---|---|---|
| `--font-display` | Inter | 600 | 28 / 36 | Page H1, dashboard hero |
| `--font-h2` | Inter | 600 | 22 / 30 | Section H2 |
| `--font-h3` | Inter | 600 | 17 / 24 | Card title, modal title |
| `--font-body` | Inter | 400 | 14 / 20 | Default body, table cells |
| `--font-body-strong` | Inter | 600 | 14 / 20 | Emphasis in body |
| `--font-small` | Inter | 400 | 12 / 16 | Helper, timestamps, badges |
| `--font-mono` | JetBrains Mono | 400 | 13 / 18 | IDs, codes, batch numbers, JSON |

**Never more than three weights per view.** **Never more than two sizes per row.** If you find yourself reaching for a fourth heading level, the page needs splitting, not another size.

Numerals: tabular by default in tables and metrics (`font-variant-numeric: tabular-nums`).

---

## 4. Component Stylings

This is the **internal-tool** layer that nobody else's design system covers. Every component below has explicit states and is the contract that hub-app components must implement.

### 4.1 Buttons
- **Primary:** orange gradient (`linear-gradient(135deg, #f05323 0%, #ff6a3d 100%)`), white text, 8px radius, 12px shadow at 30% opacity. One per view. Always the action the user came here for.
- **Secondary:** transparent background, `--text-primary` text, 1px `--border-default` border. Used for cancel, back, secondary actions. Can be repeated.
- **Ghost:** transparent background, no border, `--text-primary` text. For toolbar / row-level actions.
- **Destructive:** danger background, white text. Confirms wrap with double-confirm modal — no inline destructive on row hover.
- **States required:** default, hover, focus (visible 2px ring `--primary-hover`), active, disabled (`--text-muted` text, no shadow), loading (spinner replaces label, button stays sized).

### 4.2 Tables (the workhorse — get this right)
- Tabular numerals. Row height 40px default, 48px when row is the primary interaction surface.
- Sticky header (`--bg-surface`), 1px `--border-subtle` between rows.
- Row hover: `--bg-hover`. Selected row: 2px left border in `--primary`, background unchanged.
- **Sort affordance** in every sortable header (chevron indicator), default sort indicated.
- **Empty state:** centred, max-width 320px, single sentence + a primary action. Never just "No data."
- **Loading state:** skeleton rows matching final row height — never a spinner over an empty table.
- **Permission-denied state:** "You don't have access to this. Ask [owner]." with a link to the owner contact.

### 4.3 Forms
- One column. Always. No two-column forms in hub-app — they break field flow on the field laptop screens our users actually use.
- Labels above fields, 12px `--font-small` `--text-muted`. Required marker is `*` after the label, no colour change.
- Inline validation on blur, never on keystroke. Error text directly below the field in danger colour.
- Save state visible in the form footer: clean / dirty / saving / saved / error. Never silent.
- Long forms use **Save Draft** as a secondary action — never auto-discard on navigation.

### 4.4 Cards
- `--bg-surface`, 12px radius, 1px `--border-subtle`, 16px padding.
- Card title in `--font-h3`, body in `--font-body`. Don't nest cards more than one level deep.
- Card actions live in a footer row, never floating in the body.

### 4.5 Modals & Drawers
- Modal for confirms and short forms (≤ 5 fields). Drawer (right-side, 480px wide) for anything longer.
- Both have a visible cancel and a primary action. Primary action is on the right.
- Close on `Esc`. Close on backdrop click for modals; **never** for drawers (too easy to lose work).
- Loading state inside a modal disables both buttons and shows label state on the primary.

### 4.6 Navigation
- Left rail. Collapsible to icon-only. Active item indicated with a 3px left border in `--primary` and `--text-heading` text.
- No more than 7 top-level items. If you need more, you need a sub-app, not another nav item.
- Breadcrumbs only when nesting is ≥ 3 levels deep.

### 4.7 Status badges
- Pill shape, 4px radius, 12px font, 4/8px padding.
- Background = role colour at 16% opacity. Text = role colour at full intensity. Optional 1px border at 32% opacity.
- One status per row. Never stack badges.

### 4.8 Audit / activity log
- Reverse-chronological. Each entry: timestamp (mono, muted), actor (linked), verb (body), object (linked).
- Group by day with a sticky day header.
- Truncate long values, expand on click — never wrap to 4 lines in the feed.

### 4.9 Document viewer (PDS / SDS / COA)
- PDF rendered inline in a 2/3 width pane. Right pane shows metadata (version, last reviewed, owner, supersedes link).
- Never just link out to Drive — render in-app so the audit trail captures the view.

### 4.10 Data viz
- Time-series: line, never area, never stacked area for ops metrics.
- Threshold/alert lines in danger colour, 1px dashed.
- Categorical: use the product category palette from [[Brand]] §7.2 in category order.
- Always label axes. Never use the brand colour for non-action data series.

---

## 5. Depth & Elevation

Elevation indicates *interactivity*, not aesthetics. Static surfaces stay flat.

| Token | Use | Shadow |
|---|---|---|
| `--elev-flat` | Page background, table rows | none |
| `--elev-card` | Cards, list items | `0 1px 0 rgba(0,0,0,0.4)` |
| `--elev-floating` | Dropdowns, popovers | `0 4px 12px rgba(0,0,0,0.4)` |
| `--elev-modal` | Modals, drawers | `0 12px 32px rgba(0,0,0,0.5)` |
| `--elev-action` | Primary buttons | `0 4px 12px rgba(240,83,35,0.3)` |

Never animate elevation on hover for non-interactive surfaces. Elevation change = "this is interactive."

---

## 6. Layout Principles

### Spacing scale (4px base)
`4, 8, 12, 16, 24, 32, 48, 64`. No off-grid values. Use Tailwind defaults (`gap-2`, `gap-3`, `gap-4`, `gap-6`).

### Grid
- Main app shell: left rail (`240px`, `64px` collapsed) + content (fluid).
- Content max-width: `1440px`. Tables can exceed this with horizontal scroll — never compress columns past their natural minimum.
- Card grids: `repeat(auto-fill, minmax(320px, 1fr))`, `gap-4`.

### Density
- **High density.** Default row height 40px, default card padding 16px. We are not a marketing site. Whitespace serves grouping, not breathing.
- Section spacing: 24px between sibling sections. 32px before a new H2.

### Whitespace philosophy
Whitespace groups related things and separates unrelated things. It does not "let the design breathe." If a section feels empty, the section is wrong, not the spacing.

---

## 7. Do's and Don'ts

### Do
- ✅ Use `--primary` for *the one action* this view exists for.
- ✅ Use status roles (success/warning/danger/info) for state, not orange.
- ✅ Render every state of a component (default, loading, empty, error, permission-denied).
- ✅ Default to dark theme. Light theme is the field/outdoor mode.
- ✅ Use product category colours from [[Brand]] §7.2 for product chips and category data viz.
- ✅ Save draft on long forms.
- ✅ Show save state explicitly.
- ✅ Render PDS/SDS in-app (audit-trail capture).

### Don't
- ❌ Two-column forms.
- ❌ Auto-discard on navigation.
- ❌ Spinner over an empty table — use skeletons.
- ❌ "No data" with no follow-up action.
- ❌ Stacked status badges.
- ❌ Brand orange as decoration or category colour.
- ❌ Hardcoded hex in components — always reference tokens.
- ❌ Animated elevation on non-interactive surfaces.
- ❌ More than 7 top-level nav items.
- ❌ Card nesting deeper than one level.
- ❌ Inventing a new colour, spacing value, or font size not in this document or [[Brand]] §7.

---

## 8. Responsive Behavior

Hub-app is **desktop-first** for office users and **tablet-second** for field/site users on iPads in trucks. We do not optimise for phones — phones are for taking calls, not running compliance audits.

| Breakpoint | Width | Behaviour |
|---|---|---|
| `desk-lg` | ≥ 1440px | Full layout, tables uncompressed |
| `desk` | 1024–1439 | Full layout, dense tables |
| `tablet` | 768–1023 | Left rail collapses to icons, drawers become modals |
| `narrow` | < 768 | Read-only mode warning — interactive flows are blocked, view-only redirect |

**Touch targets ≥ 44px** on tablet. **Inputs ≥ 40px high** on desktop, `48px` on tablet.

No mobile flow design until 3+ users ask for one. Per [[feedback_no_accessibility_requirements]] we have no WCAG/screen-reader requirement, but we still ship **visible focus rings** because keyboard navigation is faster for power users.

---

## 9. Agent Prompt Guide

When generating hub-app UI in Claude/Cursor or via `/team-design-studio` or `/team-build-lite`, include this brief in the system prompt:

```
You are designing for the Blick hub-app — an internal SaaS for ~11 users.

Read these in order:
1. BlickVault/Brand/brand-guidelines/Brand.md — voice, marks, terminology
2. BlickVault/Brand/brand-guidelines/hub-app.DESIGN.md — this document
3. hub-app/frontend/src/styles/themes.css — actual token values

Ironclad rules:
- Reference tokens, never hex. (`bg-[var(--bg-surface)]` not `bg-[#2a2a2a]`)
- Default to dark theme.
- One primary action per view, in --primary orange.
- Render every state: default, hover, focus, loading, empty, error, permission-denied.
- One-column forms only.
- Tables use tabular numerals, skeleton loading, structured empty states.
- High density — this is an operations tool, not a landing page.
- Australasian English. No US spellings except in code identifiers.
- No accessibility ceremony — visible focus rings yes, ARIA-everything no.

If the design feels like a marketing site, you got it wrong.
If it feels like a senior advisor's notebook, you got it right.
```

### Quick token reference (paste into prompts)

| | dark | light |
|---|---|---|
| Brand action | `#f05323` | `#f05323` |
| Brand action hover | `#ff6a3d` | `#ff6a3d` |
| Accent | `#22d3ee` | `#0ea5b7` |
| Page bg | `#1a1a1a` | `#fafafa` |
| Surface bg | `#2a2a2a` | `#ffffff` |
| Body text | `#bcbec0` | `#1f1f1f` |
| Heading text | `#ffffff` | `#000000` |
| Muted text | `#707070` | `#6b6b6b` |
| Default border | `#58595b` | `#e5e5e5` |

---

## Anti-pattern audit (open items, last reviewed 2026-05-01)

These are known places hub-app drifts from this spec. Tracked here so the audit skill has something to compare against.

- [ ] Some Compass views use hardcoded hex instead of tokens (sweep needed).
- [ ] Form save state inconsistent across services — Compass shows it, Operations doesn't.
- [ ] Empty states default to "No data found" in 4+ tables — needs structured empty pattern.
- [ ] Two-column forms exist in [[Operations]] new-employee flow — refactor.
- [ ] Brand orange used as decorative accent on at least one dashboard card — should be replaced with `--secondary`.

---

## Related
- [[Brand]] — parent brand source of truth
- [[website.DESIGN]] — sister surface
- [[content.DESIGN]] — sister surface
- [[project_hub_app_monorepo]] — repo structure and deploy model
- [[feedback_no_accessibility_requirements]] — why we skip WCAG ceremony
