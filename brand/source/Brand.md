---
title: Blick Brand — Source of Truth
date: 2026-05-01
type: system
tags: [brand, guidelines, governance, voice, identity]
status: active
source: manual
schema: blick-brand-v1
---

# Blick Brand — Source of Truth

This is the canonical brand reference for Blick Group. Logos, marks, multi-entity rules, voice, terminology, and document templates live here. Surface-specific visual systems (website, hub-app, AI-generated content) live in their sibling `*.DESIGN.md` files and import from this document.

> **Read order for AI agents and humans:** `Brand.md` (this file — *who we are*) → `<surface>.DESIGN.md` (*how we render on a surface*) → consume.

> **Conflict rule:** if a surface DESIGN.md disagrees with this file on voice, terminology, marks, or governance, **this file wins**. If it disagrees on visual primitives (color, spacing, layout), the surface file wins for that surface.

---

## 1. Identity

**Legal entity stack** (per [[blick_entity_structure]]):

| Entity | Country | Use the mark when… |
|---|---|---|
| Blick Ltd | NZ | NZ-domiciled work, NZ contracts, .nz comms |
| Blick LLP Ltd | AU | AU-domiciled work, AU contracts, .au comms |
| Blick Pty Ltd | AU | AU agent role only — back-office, not customer-facing |
| Blick Group | Holding | Group-level brand, investor-facing, web homepage |

**Naming rules**:
- Always **Blick** or **Blick Group**. Never "Blick Drilling", "Blick Drilling Solutions", or "Blick Fluids" except where Fluids is the formal sub-brand on product labels and PDS/SDS.
- Australasian framing — never "NZ-based", never "expanding into AU". We operate across both.
- AU-facing content does not lead with NZ heritage. NZ-facing content can speak with market-leader authority.

---

## 2. Marks

### Primary logo
Full-colour orange + black (Pantone Orange 021 C, `#f05323`) is default. Monochrome only where background contrast forces it. Icon-only (the circle B) is restricted to watermarks, banners, and space-constrained applications.

### Standard files (canonical IDs in [[blick_brand_assets]])
- **Blick (NZ):** `orange black@2x.png` — Drive `1Aq9u6zh4J6-f-1r8mw-o4iOXSBeASaIr`
- **Blick LLP (AU):** `orange blacklarge.png` — Drive `11TztnVTn4pIjB9FdFdyB77JHhKmkmiSa`
- Nexus copies live in `Hub/Nexus/Assets/STANDARD-*` and are the ones AI agents should pull when generating documents.

### Clear space and minimum size
- Icon-to-lettermark ratio: **100% : 150%**.
- Minimum reproduction: **10mm high** in print, **24px high** on screen.
- Clear space: nothing between the "B" and the icon.

### Don'ts
- Don't stretch, rotate, or recolour the logo.
- Don't place the logo on similarly-coloured backgrounds without switching to monochrome.
- Don't use the icon-only mark inline with body text.
- Don't pair the NZ mark with AU contact details, or vice versa.

### Multi-entity co-branding
- **Group-level surfaces** (blick.group homepage, investor decks, careers) use the unbadged Blick mark.
- **Operational surfaces** (proposals, invoices, letterhead, PDS/SDS) use the entity mark matching the issuing entity.
- Never show two entity marks on the same page. If a document spans both, use the Group mark and disclose entity context in the footer.

---

## 3. Voice

Source of truth: [[brand-voice-guidelines]]. Summarised here so agents working on a single surface don't need to read both files.

**The Expert Mate.** Technically brilliant, completely approachable. Picks up the phone, knows your name, solves the problem on the spot. Confident without being flashy, helpful without being pushy.

| We are | We are not |
|---|---|
| Expert problem-solvers | Know-it-alls |
| Dependable | Slow or bureaucratic |
| In the field | Desk-bound |
| Down-to-earth | Corporate or slick |
| Quality-focused | The cheapest option |
| Relationship-driven | Pushy salespeople |
| Proactive | Passive order-takers |
| Honest | Oversellers |

**Rules every surface must obey:**
1. **Plain English over jargon.** If there's a simpler way, use it. Pair every technical term with a plain-language explanation in the same sentence.
2. **Customer is the hero.** Stories, case studies, and product copy frame the customer's win, not Blick's.
3. **Specifics beat superlatives.** "We had stock on site in 48 hours" beats "world-class supply." Numbers, places, names.
4. **Active voice, short sentences.** "We'll have it on your site tomorrow" not "Your order will be dispatched in due course."
5. **Environmental claims are secondary.** Lead with performance; mention environmental benefit second, and only when product-specific.
6. **No filler vocabulary.** Banned: *leverage, synergies, optimise, disruptive, world-class, game-changer, cheapest, one-stop-shop, solutions* (as a noun replacing the actual product/service name).

---

## 4. Terminology Register

The single source of truth for product names, regional spellings, and contested terms. When two sources disagree, this register wins.

### Spelling
**Australasian English.** `colour`, `organisation`, `optimise`, `centre`, `analyse`. Never US spellings except in code identifiers and external system field names.

### Must-use
| Term | Use for | Don't use |
|---|---|---|
| Drilling fluids | Primary product category | "Mud" in formal content (acceptable in social) |
| Partner / partnership | Customer relationships | Vendor, supplier (where avoidable) |
| Expert advice | Our technical service | Consulting, solutions |
| On site | Physical presence | "On location", "in the field" (interchangeable) |
| Crew / team | Customer's people | Personnel, workforce |
| Australasian | Our geography | "ANZ" (acronym only in tables) |

### Eco vs green
- **Eco Dry** is a product name and proper noun. Always capitalised, no hyphen.
- **Eco-friendly** describes Eco Dry and the Eco range. Hyphenated.
- **Green** is not used as a brand or product modifier. It signals greenwashing and is banned in marketing copy.
- The eco/biodegradable drilling-fluid *range* is parked (see [[project_sco_eco_fluid_parked]]). Do not generate copy implying we sell eco fluids beyond Eco Dry.

### Contested / never-use
| Term | Reason |
|---|---|
| Cheapest in market | Contradicts positioning |
| One-stop-shop | Competitor CEA's positioning |
| World-class | Unsubstantiated |
| Innovative / disruptive | Customers don't talk like this |
| Thixotropic (unaccompanied) | Jargon — always pair with plain-English explanation |
| NZ-based | Wrong framing — we are Australasian |

### Product naming
Product files in [[blick-products-core]] are canonical. When in doubt, link the product as a wikilink (e.g. `[[carry-flow]]`) rather than retyping its name.

---

## 5. Document Templates

| Surface | Template | Owner | Location |
|---|---|---|---|
| NZ letterhead | Blick Letterhead template | Operations | Drive `1g9Cc9tSSLp3UFiGrsmP3Ko2DYMExADmmTbgWC8ID-6Y` |
| AU letterhead | Blick LLP Letterhead Template | Operations | Drive `1XleQagiOFGLHaeEKwtqV4mwaQLVjlwI9ywdr7MgEvNI` |
| PDS / SDS | Per-product, controlled in [[blick-products-core]] | Products | Google Drive `Marketing/Brand/Products/` |
| Proposal cover | TBD — to be drafted | Sales | — |
| Email signature | Per [[blick-brand-guideline-full]] §Brand Applications | All | Inline |
| AI brief (HTML) | Editorial magazine, [[editorial-magazine-design]] | Nexus | `nexus/templates/` |

**Rule:** AI-generated documents (briefs, decks, outreach drafts, proposals) **must** start from one of these templates or extend them. New templates need a brand owner before becoming canonical.

---

## 6. Imagery & Photography

- **Cooler tones** — never warm/sepia/golden-hour filters.
- **Real sites, real crews** — stock photography is banned in marketing copy. Field photography from Blick jobs is preferred.
- **Vector icons over low-quality product shots.** If a photo isn't sharp, replace with an icon or illustration.
- **Workplace-focused** — drilling rigs, mud tanks, products in use. Not hard-hat-pointing-at-laptop stock.
- **Product label photography** uses the colour-coded category palette (see §7.2).
- Vehicle signage: 3M 2080 Gloss Black on Tesla Model Y, full Blick logo across front side doors.

---

## 7. Visual Primitives (cross-surface)

Surface DESIGN.md files override these for their own context, but every surface starts from these.

### 7.1 Brand colour
| Role | Hex | Pantone | Notes |
|---|---|---|---|
| **Brand orange** | `#f05323` | Orange 021 C | Single primary anchor. Never substitute. |
| Dark grey | `#58595b` | 4279 C | Body text, secondary surfaces |
| Light grey | `#bcbec0` | Cool Gray 5 C | Borders, muted text |
| Black | `#000000` | — | Print body, document text |

### 7.2 Product category palette (Blick Fluids)
Colour-blind-accessible palette used on labels, product UI, and category tags. **Do not invent new category colours** — extend the table here first.

| Category | Hex |
|---|---|
| Stabilisers | `#785ef0` |
| Filtration Control | `#118fae` |
| Clay Adjustment | `#dc267f` |
| Clay Control | `#3c8c4c` |
| LCM (Lost Circulation) | `#fe6100` |
| Support Chemicals | `#d0d0d0` |
| Bentonite | `#ffb000` |

### 7.3 Typography
- **Print + digital body:** Proxima Nova (Regular / Medium / Bold).
- **Code / monospace:** JetBrains Mono (digital surfaces only).
- **Web fallback stack** (when Proxima Nova is unavailable for licensing or weight reasons): `Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
- **Hierarchy rule:** never more than three weights on one screen or page.

---

## 8. Governance

**Owner:** Shaun Newman (Director). Brand changes require sign-off from the owner before merging into this file.

**Change process:**
1. Propose changes in a vault note in `BlickVault/Inbox/raw/` with `type: brand-change`.
2. Reference the section being changed and the conflict source.
3. Owner approves → edit propagates here → mirror updates push automatically (see §10).

**Source-of-truth precedence** (when documents disagree):
1. This `Brand.md` (governance, voice, terminology, marks)
2. `<surface>.DESIGN.md` (surface-specific visual primitives)
3. `[[blick-brand-guideline-full]]` (legacy 2025 brand book — historical reference only)
4. Anything in Drive (`Marketing/Brand/`) — superseded by the above

**Never silently overwrite a conflict.** Per global rule: surface the disagreement, name the sources, ask the owner.

**Review cadence:** quarterly review by owner. Last reviewed: 2026-05-01. Next review: 2026-08-01.

---

## 9. Surfaces (where this brand renders)

| Surface | DESIGN.md | Audience | Owned by |
|---|---|---|---|
| **Marketing website** (blick.group) | [[website.DESIGN]] | Prospects, candidates, public | Marketing |
| **Internal hub-app** | [[hub-app.DESIGN]] | ~11 internal users | Engineering / Operations |
| **AI-generated content** (briefs, LinkedIn, decks, outreach) | [[content.DESIGN]] | External + internal, machine-mediated | Nexus / Marketing |
| **Print and physical** (apparel, vehicles, packaging, labels) | Covered in §6, §7 here + [[blick-brand-guideline-full]] | External | Operations |

---

## 10. Where this lives and how it's mirrored

**Source of truth:** this file (`BlickVault/Brand/brand-guidelines/Brand.md`).

**Mirrors** (auto-generated, do not edit):
- `hub-app/docs/design/Brand.md` — for engineers and Claude/Cursor working in the repo.
- Public design gallery — only the surface DESIGN.md files are published; `Brand.md` is internal.

**Maintenance skills:**
- `/design-system-curator` — refresh mirrors, validate cross-references, surface drift.
- `/design-token-audit` — diff hub-app `themes.css` and website CSS against the tokens declared in surface DESIGN.md files.

---

## 11. Anti-patterns (brand-wide)

- ❌ Inventing tokens, colours, or terms not declared here or in a surface DESIGN.md.
- ❌ Using legacy "Blick Drilling Solutions" naming anywhere.
- ❌ Stock photography in marketing surfaces.
- ❌ "Green" as a product modifier.
- ❌ Mixing entity marks on a single document.
- ❌ Greenwashing (vague sustainability claims without a specific product reference).
- ❌ Corporate filler vocabulary (see §3 banned list).
- ❌ Silently resolving a brand conflict instead of surfacing it.

---

## Related
- [[brand-voice-guidelines]] — full voice and tone reference (longer than §3 above)
- [[blick-brand-guideline-full]] — legacy 2025 brand book (visual identity, apparel, packaging detail)
- [[blick-products-core]] — product naming canon
- [[blick_brand_assets]] (memory) — Drive IDs for logos and templates
- [[website.DESIGN]] — marketing website surface
- [[hub-app.DESIGN]] — internal app surface
- [[content.DESIGN]] — AI-generated content surface
