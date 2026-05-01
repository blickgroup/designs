---
title: AI-Generated Content Design System
date: 2026-05-01
type: system
tags: [design-system, content, nexus, marketing, briefs, linkedin]
status: active
source: manual
schema: awesome-design-md-v1
surface: content
parent: Brand
---

# AI-Generated Content Design System

> **Audience:** mixed — internal readers of daily briefs, external readers of LinkedIn posts, prospects reading proposals, the team reading session digests.
>
> **Surface scope:** anything Nexus or a Claude skill produces — daily briefs (HTML), LinkedIn posts and carousels, outreach emails, Marp slide decks, investor overviews, internal memos, candidate research notes.
>
> **Inherits from:** [[Brand]] (voice, marks, terminology, brand orange `#f05323`).
>
> **Excludes:** marketing website ([[website.DESIGN]]), internal hub-app ([[hub-app.DESIGN]]).
>
> **Why this exists:** AI is a content factory. Without a design surface of its own, every skill drifts toward generic LLM aesthetics — sans-serif heroes, gradient cards, "🚀" bullet points. This document is what stops that.

---

## 1. Visual Theme & Atmosphere

**Editorial, not corporate. Considered, not breathless.**

Imagine the FT's Lex column, Stratechery's daily memo, or a great industry trade journal. Not a Notion template. Not a SaaS pitch deck. Not "AI-flavoured" anything (no glow, no neon gradient, no "intelligence" iconography).

The voice is the [[Brand]] voice — Expert Mate — written down. The format borrows from print editorial: clear hierarchy, tables when tables help, pull quotes when a customer's words deserve weight, white space when an idea needs to land.

If a brief looks like ChatGPT output, we got it wrong. If it looks like a half-page from a trade magazine that someone might actually want to read, we got it right.

The existing [[editorial-magazine-design]] system in the vault is the seed for this surface — extend it, don't replace it.

---

## 2. Color Palette & Roles

Content surfaces live in many container colours (LinkedIn dark mode, Gmail light mode, printed PDF, Marp slide background). The palette here is **content-on-light** by default; dark mode mirrors hold the same role.

| Role | Hex | Use |
|---|---|---|
| **Brand orange** | `#f05323` | Section anchors, pull-quote rules, one accent per page max |
| Orange muted | `#c4421b` | Print-safe orange (CMYK won't reproduce `#f05323` cleanly) |
| Ink | `#0a0a0a` | Body text, headings |
| Editorial rule | `#1f1f1f` | 1px and 2px structural rules |
| Muted | `#5a5a5a` | Captions, attribution, dates, sources |
| Page bg | `#ffffff` | Default canvas |
| Section bg (warm) | `#f5f3ef` | Pull-out boxes, sidebars |
| Highlight (yellow) | `#fde68a` | Editorial highlight on key claim — sparingly |

### Dark mode mirror (LinkedIn dark, dark slide decks)

| Role | Hex |
|---|---|
| Brand orange | `#f05323` (unchanged) |
| Ink (text) | `#f5f3ef` |
| Muted | `#a0a0a0` |
| Page bg | `#0a0a0a` |
| Section bg | `#1a1a1a` |

### Product category palette
When mentioning a product category, the [[Brand]] §7.2 colour applies (chip, accent line, slide divider). Don't invent.

---

## 3. Typography Rules

Editorial content uses a **serif body + sans heading** pairing. This is the deliberate divergence from hub-app and website (both sans-only).

| Token | Family | Weight | Use |
|---|---|---|---|
| `--c-display` | Proxima Nova Bold | 700 | Brief title, slide title, post H1 |
| `--c-h2` | Proxima Nova Bold | 700 | Section H2 |
| `--c-h3` | Proxima Nova Medium | 500 | Subhead |
| `--c-body` | Source Serif Pro / Charter / Georgia | 400 | Body copy, brief paragraphs |
| `--c-lead` | Source Serif Pro Italic | 400 | Standfirst, intro paragraph |
| `--c-pull` | Proxima Nova Medium | 500 | Pull quotes (sans for contrast against serif body) |
| `--c-caption` | Proxima Nova Regular | 400 | Captions, sources, dates |
| `--c-mono` | JetBrains Mono | 400 | Numbers, codes, batch IDs in a brief |

**Web fallback** when serif unavailable: `Charter, Georgia, "Times New Roman", serif`.

### Size scale (rem)
- Brief title: `2.0rem / 2.5rem`
- H2: `1.4rem / 1.8rem`
- H3: `1.1rem / 1.5rem`
- Body: `1.0rem / 1.65rem`
- Lead: `1.15rem / 1.7rem`
- Caption: `0.85rem / 1.3rem`

**Measure: 60–70 characters per line.** Editorial body never goes wider.

---

## 4. Component Stylings

### 4.1 Daily brief (HTML)
Produced by `nexus/brief-pipeline.js`. Uses [[editorial-magazine-design]] as the layout primitive.

- **Masthead:** Blick mark (top-left), date (top-right), single ink rule below.
- **Standfirst:** one paragraph italic serif, sets the day's read.
- **Sections:** H2 sans-bold, body serif, max 600 words per section.
- **Sources:** every claim links to a vault note or a verified URL. Unsourced claims are not shipped (see [[feedback_blick_identity]] and global rule on fabrication).
- **Pull quotes:** customer or external quote, with full attribution.
- **Action register footer:** if the brief surfaces an action, link to the Action Register entry.

### 4.2 LinkedIn post (single)
- Hook in the first line — specific, not "Here's why X matters."
- One idea per post. If you have two, write two posts.
- Numbered or bulleted lists OK; emoji bullets not OK (per [[Brand]] anti-patterns).
- 800 characters target, 1300 hard cap.
- Always close with either a question that invites reply, or a link with one-line context. Never both.
- No "Curious to hear your thoughts in the comments below 👇". Banned.

### 4.3 LinkedIn carousel (bento grid)
The bento pattern from `bergside/awesome-design-skills` is the right format here. Up to 10 cards.

- Card 1: title + standfirst, big.
- Cards 2–9: one idea each, mostly type, photo only when it earns its place.
- Final card: source + a line from Blick voice (an Expert Mate sign-off, not a sales close).
- Background: alternates ink + page bg + warm section bg, never random colour.
- Brand orange used as a *single* anchor element on each card (rule, dot, number) — never as a card background.

### 4.4 Outreach email (drafted by `/draft-outreach`)
- Subject: ≤ 7 words, lower-case, no emoji.
- Greeting: first name only.
- First sentence: reference something specific about *their* business.
- Body: ≤ 120 words. Three short paragraphs maximum.
- Sign-off: "— [Name], Blick" with regional contact in signature.
- No "Hope this finds you well." No "I wanted to reach out." No "Just circling back."

### 4.5 Slide deck (Marp / `slide-generator.js`)
- 16:9.
- One idea per slide. Title sans, body serif.
- Maximum two type sizes per slide.
- One photo or one chart per slide, never both.
- Section dividers use brand orange ink rule with section name — not a full orange slide.
- Closing slide is a contact slide with regional details, not a "Thank you" slide.

### 4.6 Investor / group overview
- Editorial cover (full-bleed photo, masthead, date, "Blick Group Overview" title).
- Section anatomy mirrors brief (§4.1).
- Numbers in `--c-mono`, sources in caption type.
- Entity disclosure on contact pages — never mix entity marks (per [[Brand]] §2).

### 4.7 Vault note generated by Nexus (autoresearch, writeback)
- Frontmatter per [[BlickVault/CLAUDE.md]] spec — required.
- `source_type` and `verification_status` always set.
- `source_url` always set when claim is from external source. Per [[feedback_nexus_privacy_fail_closed]], never fabricate URLs.
- Wikilinks for every entity mentioned (per `/vault-consistency` skill).

---

## 5. Depth & Elevation

Print-derived: **flat**. No shadows on cards, no glow on highlighted text, no drop shadows on photography.

The only "depth" used in this surface:
- Editorial rules (1px ink) to separate sections.
- 2px coloured rule (brand orange) for section anchors.
- White space — the most important elevation tool in editorial design.

---

## 6. Layout Principles

### Brief / long-form layout
- Single column, max-width 720px, generous margins.
- Section spacing: 48px between sections.
- Pull quotes break to wider measure (840px) to signal a shift.

### Carousel / slide layout
- Safe area: 80px from edges (LinkedIn crops aggressively).
- Vertical rhythm: 8px base, multiples of 8 only.
- Title baseline 25% from top, body starts 40% from top.

### Email layout
- Width: render at 600px, plain text fallback always shipped.
- One clear CTA per email, never two.

### Generosity
Content is the surface where whitespace is *most* generous. Hub-app density and website confidence go away here. Editorial surfaces breathe. A brief crammed to the page edges reads as low-confidence; a brief with margin reads as authored.

---

## 7. Do's and Don'ts

### Do
- ✅ Lead every brief with a standfirst.
- ✅ Source every claim. Link to vault notes by wikilink, external by URL.
- ✅ Use serif for body, sans for headings. Always.
- ✅ One pull quote per long-form piece, max.
- ✅ Numbers and dates in mono.
- ✅ Sentence case headlines.
- ✅ Pair every technical term with a plain-language explanation.
- ✅ Specific over generic — name customers (with permission), regions, products.
- ✅ Customer is the hero. Always.

### Don't
- ❌ Emoji in marketing copy. Internal Slack OK; published content not OK.
- ❌ "🚀", "💡", "✨", "🤖" anywhere in published output. Banned.
- ❌ "Here's why this matters", "Curious to hear your thoughts", "Just circling back", "Hope this finds you well."
- ❌ AI-flavoured imagery (glowing brains, neural-net lattices, "intelligence" hexagons).
- ❌ Stock photography (per [[website.DESIGN]] §7).
- ❌ Generic "Solutions for the modern X" framing.
- ❌ Em-dash overuse (one per paragraph max — readers notice when AI overdoes them).
- ❌ Fabricated quotes, numbers, or sources. Hard rule from [[Brand]] §3 + global fabrication rule.
- ❌ Title-case headlines.
- ❌ "We are excited to announce."
- ❌ Greenwashing.
- ❌ Two CTAs in one email.

### Specific banned phrases
The voice guide bans these; this surface enforces them:
*world-class, innovative, disruptive, game-changer, leverage, synergies, optimise (in marketing), solutions (replacing the actual product/service name), cheapest, one-stop-shop, NZ-based.*

---

## 8. Responsive Behavior

Content surfaces are container-shaped. Each format has its own:

| Format | Container | Notes |
|---|---|---|
| Brief HTML | 720px max, single column | Mobile collapses gracefully — no two-column |
| LinkedIn post | Native, plain text + link | No formatting beyond line breaks |
| Carousel | 1080×1080 fixed | Safe area 80px |
| Slide deck | 16:9 1920×1080 | Render to PDF for distribution |
| Outreach email | 600px render, plain text fallback | Always send multipart |
| Vault note | Markdown — Obsidian renders responsively | No CSS |

---

## 9. Agent Prompt Guide

When generating content via any Claude skill (`/draft-outreach`, brief-pipeline, slide-generator, autoresearch, writeback), include:

```
You are producing content for Blick Group on the AI-generated content surface.

Read in order:
1. BlickVault/Brand/brand-guidelines/Brand.md — voice, marks, terminology
2. BlickVault/Brand/brand-guidelines/content.DESIGN.md — this document
3. The format-specific section in §4 above for your output type

Voice: Expert Mate (Brand §3). Plain English, specific, customer-as-hero.

Ironclad rules:
- Source every claim. No fabrication. Link to vault by wikilink, external by URL.
- Australasian English.
- Banned vocabulary list in §7. Especially: world-class, innovative,
  disruptive, leverage, synergies, solutions (as a noun), one-stop-shop.
- Banned phrases: "Hope this finds you well", "Just circling back",
  "Here's why this matters", "Curious to hear your thoughts".
- No emoji in published content. None.
- No AI-flavoured imagery prompts.
- Sentence-case headlines.
- Serif body + sans heading on visual formats.
- One CTA per email. One pull quote per long-form. One photo OR one chart per slide.
- If a fact isn't in a sourced vault note or PDS/SDS, say "needs verification" —
  never invent.
- Conflicting sources surface, never silently overwrite.

If the output looks like ChatGPT default voice, you got it wrong.
If it looks like a piece from a great trade publication, you got it right.
```

### Quick palette + token reference

| | light | dark |
|---|---|---|
| Brand orange | `#f05323` | `#f05323` |
| Ink (text) | `#0a0a0a` | `#f5f3ef` |
| Muted | `#5a5a5a` | `#a0a0a0` |
| Page | `#ffffff` | `#0a0a0a` |
| Section warm / surface | `#f5f3ef` | `#1a1a1a` |
| Highlight | `#fde68a` | `#fde68a` |

---

## Anti-pattern audit (open items, last reviewed 2026-05-01)

- [ ] Sweep historical Nexus briefs for emoji and banned phrases.
- [ ] Check `slide-generator.js` defaults match this spec.
- [ ] `/draft-outreach` prompts updated to ban "Hope this finds you well".
- [ ] LinkedIn carousel template (Canva) audited against §4.3.
- [ ] Brief HTML template aligned with [[editorial-magazine-design]] tokens.

---

## Related
- [[Brand]] — parent brand source of truth
- [[website.DESIGN]] — sister surface
- [[hub-app.DESIGN]] — sister surface
- [[editorial-magazine-design]] — existing editorial system this extends
- [[brand-voice-guidelines]] — full voice reference
