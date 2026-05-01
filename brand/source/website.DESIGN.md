---
title: Blick.group Website Design System
date: 2026-05-01
type: system
tags: [design-system, website, marketing]
status: active
source: manual
schema: awesome-design-md-v1
surface: website
parent: Brand
---

# Blick.group Website Design System

> **Audience:** drillers, owner-operators, site managers in their 40s–60s across AU and NZ. Practical people who pick up the phone, value experience over qualifications, prefer a printed catalogue to an app.
>
> **Surface scope:** blick.group public marketing site — homepage, product pages, case studies, contact, careers, eco range.
>
> **Inherits from:** [[Brand]] (voice, marks, terminology, brand orange `#f05323`).
>
> **Excludes:** internal hub-app ([[hub-app.DESIGN]]), AI-generated content ([[content.DESIGN]]).
>
> **The site is not a SaaS landing page.** It's a digital business card backed by a working knowledge library. It has to look like a credible Australasian drilling-fluids supplier, not a Y Combinator startup.

---

## 1. Visual Theme & Atmosphere

**Field-credible, generous, plain-spoken.** Big photography of real rigs and real crews. Generous white space. Confident orange anchors. No gradients-for-the-sake-of-gradients, no glassmorphism, no animated hero blobs.

The site says: *"We've been in the field for years, our products perform, and we'll pick up the phone."* It does not say: *"We are a venture-backed disruptor reimagining drilling."*

If the homepage feels like a SaaS landing page, we got it wrong. If it feels like a great trade publication that happens to belong to a drilling-fluids company, we got it right.

---

## 2. Color Palette & Roles

| Role | Hex | Notes |
|---|---|---|
| **Brand orange** | `#f05323` | Primary CTAs, key links, section anchors. Use restraint — orange is a comma in a sentence, not a highlighter. |
| Orange hover | `#ff6a3d` | Hover/active for interactive orange |
| Ink (heading) | `#0a0a0a` | Headings, primary text on light |
| Body | `#1f1f1f` | Body copy on light |
| Muted | `#5a5a5a` | Captions, metadata, secondary text |
| Page bg (light) | `#ffffff` | Default |
| Section bg (warm grey) | `#f5f3ef` | Alternate sections, editorial pull-outs |
| Section bg (dark) | `#0a0a0a` | Dark sections (case studies, full-bleed photo) |
| Border subtle | `#e5e5e5` | Card edges, table rules |
| Border strong | `#1f1f1f` | Editorial rules, blockquote borders |

### Product category palette
When the site shows products (catalogue, range pages, comparison tables), the [[Brand]] §7.2 colour-coded category palette is the only category palette. No inventing.

### Eco range
Eco Dry and any future eco product gets a **secondary green accent**: `#3c8c4c` (already in the product category palette as Clay Control — repurposed for eco context only on eco-specific surfaces). Never a lighter "natural" green; never a leaf icon.

---

## 3. Typography Rules

**Proxima Nova** for everything (we hold the licence and the brand book mandates it). **JetBrains Mono** for spec values and technical data on PDS/SDS pages.

| Token | Family | Weight | Size / line | Use |
|---|---|---|---|---|
| `--web-display` | Proxima Nova | Bold | 56 / 60 | Hero H1 |
| `--web-h1` | Proxima Nova | Bold | 40 / 48 | Page H1 |
| `--web-h2` | Proxima Nova | Bold | 28 / 36 | Section H2 |
| `--web-h3` | Proxima Nova | Medium | 20 / 28 | Subhead |
| `--web-lead` | Proxima Nova | Medium | 18 / 28 | Intro paragraphs |
| `--web-body` | Proxima Nova | Regular | 16 / 26 | Body |
| `--web-small` | Proxima Nova | Regular | 14 / 22 | Captions |
| `--web-mono` | JetBrains Mono | Regular | 14 / 22 | Spec values |

**Web fallback** when Proxima Nova is unavailable: `Inter, ui-sans-serif, system-ui, sans-serif` (matches [[Brand]] §7.3).

**Measure:** body copy `max-width: 68ch`. Lead `max-width: 64ch`. Never edge-to-edge prose.

**Headings sentence case**, not title case. ("Better drilling starts here" not "Better Drilling Starts Here.")

---

## 4. Component Stylings

### 4.1 Buttons
- **Primary:** solid orange `#f05323`, white text, 6px radius, no gradient on web (the gradient is hub-app-only). Hover: `#ff6a3d`. Focus ring 2px `#f05323` at 40% offset.
- **Secondary:** transparent, ink text, 1px ink border. Hover: ink fill, white text.
- **Tertiary / link:** orange text, no chrome, underline on hover.
- **Sizes:** default 44px height, large 52px (hero CTAs only).

### 4.2 Hero
- Full-bleed photo (real rig, real site — never stock).
- Headline left-aligned, max 7 words, Proxima Bold display.
- One sub-headline (≤ 18 words), one primary CTA, optional one secondary CTA.
- Never: rotating headlines, animated text, parallax, video autoplay with sound.

### 4.3 Cards (product, case study, article)
- 1px `#e5e5e5` border, 4px radius, 24px padding.
- Image at 16:10 ratio at top.
- Title in `--web-h3`, body in `--web-body` truncated to 2 lines.
- One link or one button — not both.

### 4.4 Tables (technical data, product specs)
- Header row in `#0a0a0a` ink with white text.
- Tabular numerals.
- 12px row padding, 1px `#e5e5e5` between rows.
- Spec values in `--web-mono`.
- No zebra-striping (it competes with category colour cells).

### 4.5 Forms (contact, sample request)
- Single column. Same as hub-app — drillers use these on phones at site.
- Labels above fields. Required marker `*` after label.
- Submit button is the only orange button on the form.
- Success state replaces the form with a plain-text confirmation + a name to call.
- No "marketing consent" pre-ticked checkboxes. Ever.

### 4.6 Pull quotes / customer voice
- Editorial rule above and below (1px ink), 24px vertical padding.
- Quote in `--web-lead`, italic.
- Attribution on its own line, `--web-small`, muted.
- No quote-mark glyphs. The rules carry the weight.

### 4.7 Case studies
- Three-act structure visible in the layout: **Challenge → What we recommended → Result.**
- Customer photo + quote anchors each act.
- Specific numbers prominent ("Stock on site in 48h", "30% less wasted product").
- A "Get the same result" CTA at the bottom links to the relevant product page.

### 4.8 Product pages
- Hero with product photo + name + one-sentence positioning.
- Spec table (uses §4.4 pattern).
- Plain-English explanation of what the product does and when to use it (per [[Brand]] §3 plain-language rule).
- Downloadable PDS, SDS, COA — labelled with version date.
- "Talk to us about [product]" CTA tied to the regional sales contact.

### 4.9 Footer
- Three columns: contact (NZ + AU addresses + phones), site map, legal.
- Email signature reference contacts in the footer match [[blick-brand-guideline-full]] §Brand Applications.
- Group-level surfaces show the unbadged Blick mark; entity-specific subdomains can show the entity mark.

---

## 5. Depth & Elevation

Web is **flat**. Cards have a 1px border, not a shadow. The only places shadow appears:
- Sticky header on scroll: `0 1px 0 rgba(0,0,0,0.06)`.
- Dropdown menus (e.g. region switcher): `0 8px 24px rgba(0,0,0,0.12)`.
- Lightbox / modal overlay: full-screen `rgba(0,0,0,0.7)` backdrop.

No floating cards, no neumorphism, no inner shadows.

---

## 6. Layout Principles

### Spacing scale (4px base)
Same as hub-app: `4, 8, 12, 16, 24, 32, 48, 64, 96, 128`. Web uses the larger end of the scale far more than hub-app.

### Grid
- Container max-width: `1280px`, 24px gutters.
- 12-column grid on desktop, 6-column on tablet, single-column on mobile.
- Section vertical rhythm: 96px between sections desktop, 64px tablet, 48px mobile.

### Generous, not airy
Whitespace is generous compared to hub-app, but it is structural — separating sections, framing photography, giving headlines weight. It is not Apple-style "let the page breathe" airiness for its own sake.

---

## 7. Do's and Don'ts

### Do
- ✅ Use real field photography. If we don't have it, ship without a photo before we ship a stock photo.
- ✅ Lead with the customer's problem, not Blick's history.
- ✅ Specifics: timeframes, regions, product names, real numbers.
- ✅ One primary CTA per section.
- ✅ Sentence-case headlines.
- ✅ Plain-English first; technical detail in expandable spec tables.
- ✅ Disclose entity (NZ vs AU) on the regional contact lines.
- ✅ Eco language only in eco contexts and only product-specific.

### Don't
- ❌ Stock photography. Period.
- ❌ Rotating heroes / carousels.
- ❌ Glassmorphism, gradients-for-decoration, animated background blobs.
- ❌ Cookie banner with pre-ticked consent.
- ❌ "World-class," "innovative," "disruptive," "leverage," "synergies."
- ❌ Tagline as a moving target — `Better drilling starts here` is the working tagline; do not invent variants.
- ❌ Eco/green imagery in non-eco contexts (greenwashing).
- ❌ Title-case headlines.
- ❌ Lead with NZ heritage on AU-targeted pages.
- ❌ Generic "Solutions for the modern driller" hero copy.

---

## 8. Responsive Behavior

| Breakpoint | Width | Behaviour |
|---|---|---|
| `web-xl` | ≥ 1280px | Full 12-col grid, hero at 56/60 type |
| `web-lg` | 1024–1279 | 12-col, hero drops to 48/56 |
| `web-md` | 768–1023 | 6-col, hero 40/48 |
| `web-sm` | 480–767 | Single col, hero 32/40 |
| `web-xs` | < 480 | Single col, hero 28/36, CTAs full-width |

**Tap targets ≥ 44px** on mobile. **Forms switch to native input UIs** below `web-md` (date picker, select).

Phone is a real surface here (unlike hub-app) — drillers at trade shows, on site, between jobs. Mobile must work end-to-end: contact, sample request, product spec, regional phone numbers tap-to-call.

---

## 9. Agent Prompt Guide

When generating website content or layout via Claude/Cursor or `/team-design-studio`:

```
You are designing for blick.group — Blick Group's public marketing site.

Read in order:
1. BlickVault/Brand/brand-guidelines/Brand.md — voice, marks, terminology
2. BlickVault/Brand/brand-guidelines/website.DESIGN.md — this document

Audience: drillers and site managers across AU and NZ, 40s–60s, practical,
phone-first. Speak like the Expert Mate from Brand §3.

Ironclad rules:
- Real field photography only. No stock.
- Sentence-case headlines, max 7 words.
- One primary CTA per section.
- Specific numbers, real places, named products.
- Plain English first; technical detail in expandable specs.
- Australasian English (colour, organisation, optimise).
- Banned vocabulary: world-class, innovative, disruptive, leverage,
  synergies, solutions (as a noun), one-stop-shop, cheapest, NZ-based.
- AU pages don't lead with NZ heritage. NZ pages can.
- Eco language only product-specific, never generic.
- No carousels, no glassmorphism, no animated blobs.

If the page feels like a SaaS landing page, you got it wrong.
If it feels like a great trade publication, you got it right.
```

### Quick token reference

| | hex |
|---|---|
| Brand orange | `#f05323` |
| Orange hover | `#ff6a3d` |
| Ink | `#0a0a0a` |
| Body | `#1f1f1f` |
| Muted | `#5a5a5a` |
| Page bg | `#ffffff` |
| Section warm | `#f5f3ef` |
| Section dark | `#0a0a0a` |
| Border subtle | `#e5e5e5` |
| Eco accent | `#3c8c4c` |

---

## Anti-pattern audit (open items, last reviewed 2026-05-01)

- [ ] Confirm stock photography is purged from current blick.group.
- [ ] Verify hero copy length on each page ≤ 7 words.
- [ ] Audit AU pages for "NZ-based" framing.
- [ ] Check eco-range page doesn't generalise eco language.
- [ ] Confirm Proxima Nova licensing covers all weights used.
- [ ] Footer regional addresses match current entity stack.

---

## Related
- [[Brand]] — parent brand source of truth
- [[hub-app.DESIGN]] — sister surface
- [[content.DESIGN]] — sister surface
- [[blick-marketing-strategy-full]] — strategy & positioning
- [[growth-strategy-summary]] — pillar messaging
