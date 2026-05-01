/**
 * render-brand.cjs
 *
 * Refero-grade renderer for Blick brand surface pages.
 *
 * Each surface gets:
 *  - Editorial hero (wordmark in brand-display font + tagline + essence prose)
 *  - Role-grouped colour swatches with click-to-copy
 *  - Real type specimens at actual size/weight/line-height
 *  - Per-font cards with rationale
 *  - Spacing / radii / shadows tables with copy buttons
 *  - Do / Don't twin lists
 *  - Live component preview rendered with the surface's own tokens
 *  - Sticky right-rail export panel: DESIGN.md / Tailwind / CSS Vars / Tokens JSON
 *  - Copy + .md download
 *
 * The renderer takes (filename, markdown, tokens) and returns a full HTML page.
 */

const fs = require('fs');
const path = require('path');

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Component preview templates — live HTML rendered with the surface's tokens.
function componentPreview(surfaceId, tokens) {
  if (surfaceId === 'hub-app') {
    return `
      <div class="cp-frame cp-dark">
        <div class="cp-row">
          <button class="cp-btn cp-btn-primary">Approve batch</button>
          <button class="cp-btn cp-btn-secondary">Cancel</button>
          <span class="cp-badge cp-badge-success">Active</span>
          <span class="cp-badge cp-badge-warning">Stale</span>
          <span class="cp-badge cp-badge-danger">Blocked</span>
        </div>
        <div class="cp-table">
          <div class="cp-tr cp-th"><div>Batch</div><div>Product</div><div>Status</div><div>Owner</div></div>
          <div class="cp-tr"><div class="mono">28A-9921</div><div>Carry-Flow</div><div><span class="cp-badge cp-badge-success">Active</span></div><div>Margaret</div></div>
          <div class="cp-tr cp-tr-selected"><div class="mono">28A-9920</div><div>Filter-High</div><div><span class="cp-badge cp-badge-warning">Stale</span></div><div>John</div></div>
          <div class="cp-tr"><div class="mono">28A-9919</div><div>One-Stop</div><div><span class="cp-badge cp-badge-info">Pending</span></div><div>Margaret</div></div>
        </div>
      </div>`;
  }
  if (surfaceId === 'website') {
    return `
      <div class="cp-frame cp-light">
        <div class="cp-hero">
          <h2 class="cp-hero-title">Better drilling starts here.</h2>
          <p class="cp-hero-lead">Quality fluids, expert advice, on site when you need it. Across Australia and New Zealand.</p>
          <div class="cp-row">
            <button class="cp-btn cp-btn-primary cp-btn-web">Talk to us</button>
            <button class="cp-btn cp-btn-secondary cp-btn-web">View product range</button>
          </div>
        </div>
        <div class="cp-card-row">
          <div class="cp-card"><div class="cp-card-tag">Case study · WA</div><h3>HDD bore back in production in 48h</h3><p>Loss-Swell on site Tuesday morning, returns restored Wednesday afternoon.</p></div>
          <div class="cp-card"><div class="cp-card-tag">Product · Bentonite</div><h3>Carry-Flow holds up in tough clay</h3><p>Stable rheology under 60°C downhole conditions across 30+ Pilbara jobs.</p></div>
        </div>
      </div>`;
  }
  if (surfaceId === 'content') {
    return `
      <div class="cp-frame cp-editorial">
        <div class="cp-mast"><span class="cp-mast-brand">BLICK · DAILY</span><span class="cp-mast-date">2 MAY 2026</span></div>
        <h2 class="cp-edit-title">AMC supply window slipping in WA</h2>
        <p class="cp-edit-lead">Crews in the Pilbara are asking why Carry-Flow stocks have moved without notice — here is what we know.</p>
        <p class="cp-edit-body">Three weeks ago a Pilbara crew called Margaret because their HDD bore was losing returns. We had Loss-Swell on site within 48 hours and the bore was back in production by Wednesday. Specifics like this are why customers stay.</p>
        <blockquote class="cp-pull">We are in the field with you, not just behind a desk.</blockquote>
        <p class="cp-edit-body">Two AMC customers in the Pilbara reported delivery slippage of 10–14 days this month. Sources: <a href="#">[[ausdrill]]</a>, <a href="#">[[carey-mining]]</a>.</p>
      </div>`;
  }
  // brand (parent) — show a sampler of all three
  return `
      <div class="cp-frame cp-light cp-multi">
        <div class="cp-multi-row">
          <div class="cp-multi-col cp-multi-dark">
            <div class="cp-multi-label">HUB-APP</div>
            <button class="cp-btn cp-btn-primary">Approve batch</button>
            <span class="cp-badge cp-badge-success" style="margin-left:8px">Active</span>
          </div>
          <div class="cp-multi-col cp-multi-light">
            <div class="cp-multi-label">WEBSITE</div>
            <button class="cp-btn cp-btn-primary cp-btn-web">Talk to us</button>
          </div>
          <div class="cp-multi-col cp-multi-edit">
            <div class="cp-multi-label">CONTENT</div>
            <p class="cp-edit-lead" style="margin:0">We are in the field with you, not just behind a desk.</p>
          </div>
        </div>
      </div>`;
}

// Build CSS variables block from tokens (for the export panel).
function tokensToCss(tokens) {
  const lines = [':root {'];
  Object.entries(tokens.colors || {}).forEach(([group, colors]) => {
    lines.push(`  /* ${group} */`);
    colors.forEach(c => {
      const slug = c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      lines.push(`  --${slug}: ${c.hex};`);
    });
  });
  (tokens.spacing || []).forEach(s => lines.push(`  --space-${s.label}: ${s.value};`));
  (tokens.radii || []).forEach(r => lines.push(`  --radius-${r.label}: ${r.value};`));
  (tokens.shadows || []).forEach(sh => lines.push(`  --shadow-${sh.label}: ${sh.value};`));
  lines.push('}');
  return lines.join('\n');
}

function tokensToTailwind(tokens) {
  const colors = {};
  Object.entries(tokens.colors || {}).forEach(([group, list]) => {
    list.forEach(c => {
      const slug = c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      colors[slug] = c.hex;
    });
  });
  return `// tailwind.config.js — Blick ${tokens.id} surface
module.exports = {
  theme: {
    extend: {
      colors: ${JSON.stringify(colors, null, 2).split('\n').map((l,i)=>i?'      '+l:l).join('\n')},
      spacing: {
${(tokens.spacing||[]).map(s=>`        '${s.label}': '${s.value}',`).join('\n')}
      },
      borderRadius: {
${(tokens.radii||[]).map(r=>`        '${r.label}': '${r.value}',`).join('\n')}
      },
      boxShadow: {
${(tokens.shadows||[]).map(sh=>`        '${sh.label}': '${sh.value}',`).join('\n')}
      }
    }
  }
};`;
}

function tokensToJson(tokens) {
  const out = { colors: {}, spacing: {}, radii: {}, shadows: {} };
  Object.entries(tokens.colors || {}).forEach(([group, list]) => {
    out.colors[group] = {};
    list.forEach(c => out.colors[group][c.name] = c.hex);
  });
  (tokens.spacing||[]).forEach(s => out.spacing[s.label] = s.value);
  (tokens.radii||[]).forEach(r => out.radii[r.label] = r.value);
  (tokens.shadows||[]).forEach(sh => out.shadows[sh.label] = sh.value);
  return JSON.stringify(out, null, 2);
}

// Dependency-free markdown renderer for the curatorial body.
function renderMarkdownBody(md) {
  let body = md.replace(/^---\n[\s\S]*?\n---\n?/, '');
  body = body.replace(/^#\s+.+\n/, ''); // strip first H1 — we render our own hero
  const lines = body.split('\n');
  const out = [];
  let inCode = false, inList = null, inTable = false, para = [];
  function flushPara() { if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para = []; } }
  function closeList() { if (inList) { out.push(`</${inList}>`); inList = null; } }
  function closeTable() { if (inTable) { out.push('</tbody></table>'); inTable = false; } }
  function inline(s) {
    return s
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
      .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '<a class="wikilink" href="#">$2</a>')
      .replace(/\[\[([^\]]+)\]\]/g, '<a class="wikilink" href="#">$1</a>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  }
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('```')) {
      flushPara(); closeList(); closeTable();
      if (!inCode) { inCode = true; out.push('<pre><code>'); } else { inCode = false; out.push('</code></pre>'); }
      continue;
    }
    if (inCode) { out.push(escapeHtml(line)); continue; }
    if (/^---+\s*$/.test(line)) { flushPara(); closeList(); closeTable(); out.push('<hr>'); continue; }
    const h = line.match(/^(#{1,6})\s+(.+)$/);
    if (h) { flushPara(); closeList(); closeTable(); out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`); continue; }
    if (line.startsWith('>')) { flushPara(); closeList(); closeTable(); out.push(`<blockquote>${inline(line.replace(/^>\s?/, ''))}</blockquote>`); continue; }
    if (line.includes('|') && line.trim().startsWith('|')) {
      const isSep = /^\|[\s:|-]+\|$/.test(line.trim());
      if (isSep) continue;
      const cells = line.trim().slice(1, -1).split('|').map(c => c.trim());
      if (!inTable) { flushPara(); closeList(); inTable = true; out.push('<table><thead><tr>' + cells.map(c=>`<th>${inline(c)}</th>`).join('') + '</tr></thead><tbody>'); }
      else { out.push('<tr>' + cells.map(c=>`<td>${inline(c)}</td>`).join('') + '</tr>'); }
      continue;
    } else if (inTable) { closeTable(); }
    const ul = line.match(/^[-*]\s+(.+)$/);
    const ol = line.match(/^\d+\.\s+(.+)$/);
    if (ul) { flushPara(); if (inList!=='ul') { closeList(); out.push('<ul>'); inList='ul'; } out.push(`<li>${inline(ul[1])}</li>`); continue; }
    if (ol) { flushPara(); if (inList!=='ol') { closeList(); out.push('<ol>'); inList='ol'; } out.push(`<li>${inline(ol[1])}</li>`); continue; }
    if (line.trim() === '') { flushPara(); closeList(); continue; }
    para.push(line);
  }
  flushPara(); closeList(); closeTable();
  return out.join('\n');
}

function renderColorGroup(group, colors) {
  return `<div class="swatch-group">
    <div class="swatch-group-name">${escapeHtml(group)}</div>
    <div class="swatch-list">
      ${colors.map(c => `
        <button class="swatch" data-copy="${c.hex}" title="Click to copy ${c.hex}">
          <span class="swatch-chip" style="background:${c.hex}"></span>
          <span class="swatch-meta">
            <span class="swatch-row1">
              <span class="swatch-name">${escapeHtml(c.name)}</span>
              <span class="swatch-hex mono">${c.hex}</span>
            </span>
            <span class="swatch-role">${escapeHtml(c.role)}</span>
          </span>
        </button>`).join('')}
    </div>
  </div>`;
}

function renderTypeScale(items, fontFamily) {
  return `<div class="type-scale">
    ${items.map(t => {
      const [family, size, weight, lh, ...rest] = t.spec.split('·').map(s=>s.trim());
      const italic = rest.join(' ').includes('italic');
      const upper = rest.join(' ').includes('uppercase');
      const style = `font-family:${family}, ${family.includes('Serif')?'Charter,Georgia,serif':'Inter,sans-serif'}; font-size:${size.replace('px','')}px; font-weight:${weight}; line-height:${lh}; ${italic?'font-style:italic;':''} ${upper?'text-transform:uppercase; letter-spacing:.06em;':''}`;
      return `<div class="type-row">
        <div class="type-spec">
          <span class="type-label mono">${escapeHtml(t.label)}</span>
          <span class="type-meta mono">${escapeHtml(t.spec)}</span>
        </div>
        <div class="type-sample" style="${style}">${escapeHtml(t.sample)}</div>
      </div>`;
    }).join('')}
  </div>`;
}

function renderFontCards(fonts) {
  return `<div class="font-grid">
    ${fonts.map(f => `
      <div class="font-card">
        <div class="font-card-hero" style="font-family:${escapeHtml(f.family)},${f.family.includes('Serif')?'Charter,Georgia,serif':'Inter,sans-serif'}">${escapeHtml(f.family)}</div>
        <dl class="font-card-meta">
          <dt>Weights</dt><dd class="mono">${escapeHtml(f.weights)}</dd>
          <dt>Use</dt><dd>${escapeHtml(f.use)}</dd>
          <dt>Fallback</dt><dd class="mono">${escapeHtml(f.fallback)}</dd>
        </dl>
        <p class="font-card-why">${escapeHtml(f.why)}</p>
      </div>`).join('')}
  </div>`;
}

function renderTokenTable(rows, kind) {
  return `<table class="token-table">
    <thead><tr><th>Label</th><th>Value</th><th>Use</th><th></th></tr></thead>
    <tbody>
      ${rows.map(r => `
        <tr>
          <td class="mono">${escapeHtml(r.label)}</td>
          <td class="mono">${escapeHtml(r.value)}</td>
          <td>${escapeHtml(r.use)}</td>
          <td><button class="copy-btn" data-copy="${escapeHtml(r.value)}" title="Copy">⧉</button></td>
        </tr>`).join('')}
    </tbody>
  </table>`;
}

function renderDoDont(doDont) {
  return `<div class="dodont">
    <div class="dodont-col dodont-do">
      <h3>Do</h3>
      <ul>${doDont.do.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul>
    </div>
    <div class="dodont-col dodont-dont">
      <h3>Don't</h3>
      <ul>${doDont.dont.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul>
    </div>
  </div>`;
}

function buildExportPanel(filename, md, tokens) {
  const cssVars = tokensToCss(tokens);
  const tw = tokensToTailwind(tokens);
  const json = tokensToJson(tokens);
  return `
    <aside class="export-panel">
      <div class="export-tabs">
        <button class="exp-tab active" data-target="exp-md">DESIGN.md</button>
        <button class="exp-tab" data-target="exp-tw">Tailwind</button>
        <button class="exp-tab" data-target="exp-css">CSS Vars</button>
        <button class="exp-tab" data-target="exp-json">Tokens JSON</button>
      </div>
      <div class="export-actions">
        <button class="exp-action" id="exp-copy">Copy</button>
        <a class="exp-action" id="exp-download" download="${filename}">.md</a>
      </div>
      <div class="export-bodies">
        <pre class="exp-body active" id="exp-md"><code>${escapeHtml(md)}</code></pre>
        <pre class="exp-body" id="exp-tw"><code>${escapeHtml(tw)}</code></pre>
        <pre class="exp-body" id="exp-css"><code>${escapeHtml(cssVars)}</code></pre>
        <pre class="exp-body" id="exp-json"><code>${escapeHtml(json)}</code></pre>
      </div>
    </aside>`;
}

function pageStyles() {
  return `
  :root {
    --orange:#f05323; --orange-hover:#ff6a3d;
    --ink:#0a0a0a; --body:#1f1f1f; --muted:#5a5a5a;
    --page:#fff; --warm:#f5f3ef; --rule:#1f1f1f; --subtle:#e5e5e5;
    --success:#12a36d; --warning:#d97706; --danger:#dc2626; --info:#0891b2;
  }
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin:0; padding:0; }
  body { background: var(--page); color: var(--body); font-family: 'Source Serif Pro', Charter, Georgia, serif; font-size:17px; line-height:1.65; -webkit-font-smoothing:antialiased; }
  .mono { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace; }

  /* Layout */
  .layout { display:grid; grid-template-columns: minmax(0, 1fr) 420px; gap:48px; max-width:1320px; margin:0 auto; padding:48px 32px 96px; }
  @media (max-width: 1080px) { .layout { grid-template-columns: 1fr; } .export-panel { position:static; max-height:none; } }

  /* Breadcrumb */
  .breadcrumb { font-family: Inter, sans-serif; font-size:12px; letter-spacing:.04em; text-transform:uppercase; color: var(--muted); margin-bottom:24px; }
  .breadcrumb a { color: var(--muted); text-decoration:none; }
  .breadcrumb a:hover { color: var(--ink); }

  /* Hero */
  .hero { margin-bottom: 48px; padding-bottom:32px; border-bottom: 2px solid var(--rule); }
  .hero-wordmark { font-family: 'Proxima Nova', Inter, sans-serif; font-weight:700; font-size:80px; line-height:1; letter-spacing:-.025em; color: var(--ink); margin:0 0 16px; }
  .hero-tagline { font-family: 'Source Serif Pro', Charter, serif; font-style:italic; font-size:22px; color: var(--orange); margin:0 0 24px; }
  .hero-essence { font-family: 'Source Serif Pro', Charter, serif; font-size:18px; line-height:1.65; color: var(--body); max-width:60ch; margin:0 0 24px; }
  .hero-meta { display:flex; gap:16px; flex-wrap:wrap; align-items:center; font-family: Inter, sans-serif; font-size:13px; color: var(--muted); }
  .hero-meta a { color: var(--ink); text-decoration:none; border-bottom:1px solid var(--subtle); }
  .hero-meta a:hover { border-bottom-color: var(--orange); color: var(--orange); }

  /* Section heading */
  .section { margin-top:64px; }
  .section-head { font-family: Inter, sans-serif; font-size:11px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color: var(--muted); margin:0 0 24px; padding-bottom:8px; border-bottom:1px solid var(--subtle); }

  /* Swatches */
  .swatch-group { margin-bottom: 32px; }
  .swatch-group-name { font-family: Inter, sans-serif; font-size:13px; font-weight:600; color: var(--ink); margin-bottom:12px; }
  .swatch-list { display:grid; grid-template-columns: 1fr; gap:8px; }
  .swatch { display:grid; grid-template-columns: 56px 1fr; gap:16px; align-items:center; padding:12px; border:1px solid var(--subtle); border-radius:6px; background: var(--page); cursor:pointer; text-align:left; font:inherit; transition: border-color .15s, box-shadow .15s; }
  .swatch:hover { border-color: var(--ink); box-shadow: 0 1px 0 rgba(0,0,0,.04); }
  .swatch-chip { width:56px; height:56px; border-radius:4px; box-shadow: inset 0 0 0 1px rgba(0,0,0,.08); }
  .swatch-meta { display:flex; flex-direction:column; gap:4px; min-width:0; }
  .swatch-row1 { display:flex; gap:12px; align-items:baseline; }
  .swatch-name { font-family: Inter, sans-serif; font-weight:600; color: var(--ink); font-size:14px; }
  .swatch-hex { font-size:13px; color: var(--muted); }
  .swatch-role { font-family: 'Source Serif Pro', Charter, serif; font-size:14px; color: var(--body); line-height:1.4; }
  .swatch.copied { border-color: var(--success); }
  .swatch.copied .swatch-hex::after { content:" · copied"; color: var(--success); font-family: Inter, sans-serif; }

  /* Type scale */
  .type-scale { display:flex; flex-direction:column; gap:24px; padding:24px 0; }
  .type-row { display:grid; grid-template-columns: 200px 1fr; gap:24px; align-items:baseline; padding:16px 0; border-bottom:1px solid var(--subtle); }
  .type-spec { display:flex; flex-direction:column; gap:4px; }
  .type-label { font-family: 'JetBrains Mono', monospace; font-size:12px; color: var(--orange); font-weight:600; }
  .type-meta { font-family: 'JetBrains Mono', monospace; font-size:11px; color: var(--muted); line-height:1.4; }
  .type-sample { color: var(--ink); }

  /* Fonts */
  .font-grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:16px; }
  .font-card { padding:24px; border:1px solid var(--subtle); border-radius:8px; background: var(--page); }
  .font-card-hero { font-size:36px; line-height:1; color: var(--ink); margin-bottom:16px; }
  .font-card-meta { display:grid; grid-template-columns: 80px 1fr; gap:6px 12px; margin:0 0 16px; font-size:13px; }
  .font-card-meta dt { font-family: Inter, sans-serif; color: var(--muted); font-weight:600; }
  .font-card-meta dd { margin:0; color: var(--ink); }
  .font-card-why { font-family: 'Source Serif Pro', Charter, serif; font-style:italic; font-size:14px; color: var(--body); margin:0; line-height:1.55; }

  /* Token tables */
  .token-table { width:100%; border-collapse:collapse; font-family: Inter, sans-serif; font-size:13px; }
  .token-table th { text-align:left; padding:8px 12px; background: var(--ink); color: var(--page); font-size:11px; text-transform:uppercase; letter-spacing:.06em; }
  .token-table td { padding:10px 12px; border-bottom:1px solid var(--subtle); vertical-align:top; }
  .copy-btn { background:none; border:1px solid var(--subtle); border-radius:4px; padding:2px 8px; cursor:pointer; font-size:14px; color: var(--muted); }
  .copy-btn:hover { border-color: var(--ink); color: var(--ink); }
  .copy-btn.copied { border-color: var(--success); color: var(--success); }

  /* Do/Don't */
  .dodont { display:grid; grid-template-columns: 1fr 1fr; gap:24px; }
  @media (max-width:720px) { .dodont { grid-template-columns:1fr; } }
  .dodont-col { padding:24px; border-radius:8px; }
  .dodont-do { background: rgba(18,163,109,.06); border:1px solid rgba(18,163,109,.2); }
  .dodont-dont { background: rgba(220,38,38,.04); border:1px solid rgba(220,38,38,.2); }
  .dodont-col h3 { font-family: Inter, sans-serif; font-size:14px; margin:0 0 12px; }
  .dodont-do h3 { color: var(--success); }
  .dodont-do h3::before { content:"✓ "; }
  .dodont-dont h3 { color: var(--danger); }
  .dodont-dont h3::before { content:"✕ "; }
  .dodont-col ul { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:8px; }
  .dodont-col li { font-family: 'Source Serif Pro', Charter, serif; font-size:15px; line-height:1.5; padding-left:20px; position:relative; }
  .dodont-do li::before { content:"✓"; position:absolute; left:0; color: var(--success); font-family: Inter, sans-serif; font-weight:700; }
  .dodont-dont li::before { content:"✕"; position:absolute; left:0; color: var(--danger); font-family: Inter, sans-serif; font-weight:700; }

  /* Component preview */
  .cp-frame { border-radius:12px; padding:32px; margin-top:8px; }
  .cp-light { background: var(--warm); border:1px solid var(--subtle); }
  .cp-dark { background:#1a1a1a; color:#bcbec0; border:1px solid #404040; font-family: Inter, sans-serif; font-size:14px; }
  .cp-editorial { background: var(--page); border:1px solid var(--subtle); }
  .cp-row { display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
  .cp-btn { padding:10px 18px; border-radius:8px; font-family: Inter, sans-serif; font-size:14px; font-weight:500; cursor:pointer; border:none; }
  .cp-btn-primary { background: linear-gradient(135deg, #f05323 0%, #ff6a3d 100%); color:#fff; box-shadow: 0 4px 12px rgba(240,83,35,.3); }
  .cp-btn-secondary { background:transparent; color:#bcbec0; border:1px solid #58595b; }
  .cp-btn-web.cp-btn-primary { background:#f05323; box-shadow:none; border-radius:6px; }
  .cp-btn-web.cp-btn-secondary { background:transparent; color: var(--ink); border:1px solid var(--ink); border-radius:6px; }
  .cp-badge { display:inline-flex; padding:3px 10px; border-radius:4px; font-family: Inter, sans-serif; font-size:11px; font-weight:600; }
  .cp-badge-success { background: rgba(18,163,109,.16); color:#12a36d; }
  .cp-badge-warning { background: rgba(217,119,6,.16); color:#f59e0b; }
  .cp-badge-danger { background: rgba(220,38,38,.16); color:#ef4444; }
  .cp-badge-info { background: rgba(34,211,238,.16); color:#22d3ee; }
  .cp-table { margin-top:24px; border:1px solid #404040; border-radius:8px; overflow:hidden; }
  .cp-tr { display:grid; grid-template-columns: 140px 1fr 100px 120px; padding:10px 16px; border-bottom:1px solid #404040; }
  .cp-tr:last-child { border-bottom:none; }
  .cp-tr-selected { border-left:2px solid var(--orange); padding-left:14px; }
  .cp-th { background:#2a2a2a; font-size:12px; font-weight:600; color:#fff; text-transform:uppercase; letter-spacing:.04em; }
  .cp-table .mono { font-family: 'JetBrains Mono', monospace; font-size:13px; color:#bcbec0; }

  .cp-hero-title { font-family: 'Proxima Nova', Inter, sans-serif; font-size:40px; font-weight:700; color: var(--ink); margin:0 0 12px; line-height:1.1; }
  .cp-hero-lead { font-family: 'Proxima Nova', Inter, sans-serif; font-size:18px; color: var(--body); margin:0 0 24px; max-width:48ch; }
  .cp-card-row { display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-top:32px; }
  @media (max-width:600px) { .cp-card-row { grid-template-columns:1fr; } }
  .cp-card { background: var(--page); border:1px solid var(--subtle); border-radius:4px; padding:20px; }
  .cp-card-tag { font-family: Inter, sans-serif; font-size:11px; color: var(--muted); text-transform:uppercase; letter-spacing:.06em; margin-bottom:8px; }
  .cp-card h3 { font-family: 'Proxima Nova', Inter, sans-serif; font-size:18px; margin:0 0 8px; color: var(--ink); }
  .cp-card p { font-family: 'Proxima Nova', Inter, sans-serif; font-size:14px; color: var(--body); margin:0; }

  .cp-mast { display:flex; justify-content:space-between; align-items:baseline; padding-bottom:12px; border-bottom:2px solid var(--rule); margin-bottom:24px; }
  .cp-mast-brand { font-family: Inter, sans-serif; font-weight:700; font-size:13px; letter-spacing:.08em; }
  .cp-mast-date { font-family: 'JetBrains Mono', monospace; font-size:12px; color: var(--muted); }
  .cp-edit-title { font-family: 'Proxima Nova', Inter, sans-serif; font-weight:700; font-size:28px; color: var(--ink); margin:0 0 12px; }
  .cp-edit-lead { font-family: 'Source Serif Pro', Charter, serif; font-style:italic; font-size:18px; color: var(--body); margin:0 0 16px; }
  .cp-edit-body { font-family: 'Source Serif Pro', Charter, serif; font-size:16px; line-height:1.65; color: var(--body); margin:0 0 16px; }
  .cp-pull { border-left:3px solid var(--orange); margin:24px 0; padding:8px 0 8px 20px; font-family: 'Proxima Nova', Inter, sans-serif; font-size:20px; font-weight:500; color: var(--ink); }

  .cp-multi-row { display:grid; grid-template-columns: 1fr 1fr 1fr; gap:8px; }
  @media (max-width:720px) { .cp-multi-row { grid-template-columns:1fr; } }
  .cp-multi-col { padding:24px; border-radius:8px; min-height:140px; display:flex; flex-direction:column; gap:12px; }
  .cp-multi-dark { background:#1a1a1a; color:#bcbec0; }
  .cp-multi-light { background: var(--warm); }
  .cp-multi-edit { background: var(--page); border:1px solid var(--subtle); }
  .cp-multi-label { font-family: Inter, sans-serif; font-size:11px; font-weight:700; letter-spacing:.08em; color: var(--muted); }

  /* Markdown body */
  .md-body { font-family: 'Source Serif Pro', Charter, serif; font-size:17px; line-height:1.65; color: var(--body); }
  .md-body h1, .md-body h2, .md-body h3, .md-body h4 { font-family: 'Proxima Nova', Inter, sans-serif; color: var(--ink); margin:48px 0 16px; line-height:1.25; }
  .md-body h1 { font-size:32px; font-weight:700; }
  .md-body h2 { font-size:24px; font-weight:700; padding-top:32px; border-top:1px solid var(--subtle); }
  .md-body h3 { font-size:18px; font-weight:600; }
  .md-body h4 { font-size:14px; font-weight:600; color: var(--muted); text-transform:uppercase; letter-spacing:.04em; }
  .md-body p { margin:0 0 16px; max-width:64ch; }
  .md-body a { color: var(--orange); text-decoration:none; border-bottom:1px solid rgba(240,83,35,.3); }
  .md-body a.wikilink { color: var(--ink); border-bottom-style:dotted; }
  .md-body strong { color: var(--ink); font-weight:600; }
  .md-body code { font-family: 'JetBrains Mono', monospace; font-size:.88em; background: var(--warm); padding:1px 6px; border-radius:3px; }
  .md-body pre { background: var(--ink); color: var(--warm); padding:16px 20px; border-radius:4px; overflow-x:auto; }
  .md-body pre code { background:transparent; color:inherit; padding:0; font-size:13px; }
  .md-body blockquote { border-left:3px solid var(--orange); margin:16px 0; padding:4px 0 4px 16px; color: var(--muted); font-style:italic; }
  .md-body table { width:100%; border-collapse:collapse; margin:16px 0; font-family: Inter, sans-serif; font-size:14px; }
  .md-body th { background: var(--ink); color: var(--page); text-align:left; padding:8px 12px; font-size:11px; text-transform:uppercase; letter-spacing:.04em; }
  .md-body td { padding:10px 12px; border-bottom:1px solid var(--subtle); }
  .md-body ul, .md-body ol { margin:0 0 16px 20px; padding:0; }
  .md-body li { margin-bottom:4px; }

  /* Export panel */
  .export-panel { position: sticky; top:24px; max-height: calc(100vh - 48px); display:flex; flex-direction:column; border:1px solid var(--subtle); border-radius:8px; background: var(--page); overflow:hidden; font-family: Inter, sans-serif; }
  .export-tabs { display:flex; border-bottom:1px solid var(--subtle); background: var(--warm); overflow-x:auto; }
  .exp-tab { flex:1; padding:10px 12px; border:none; background:none; cursor:pointer; font:inherit; font-size:12px; font-weight:600; color: var(--muted); border-bottom:2px solid transparent; white-space:nowrap; }
  .exp-tab.active { color: var(--orange); border-bottom-color: var(--orange); }
  .export-actions { display:flex; gap:8px; padding:8px 12px; border-bottom:1px solid var(--subtle); }
  .exp-action { flex:1; text-align:center; padding:6px 10px; border:1px solid var(--subtle); border-radius:4px; background: var(--page); cursor:pointer; text-decoration:none; color: var(--ink); font-size:12px; font-weight:600; font:inherit; font-size:12px; font-weight:600; }
  .exp-action:hover { border-color: var(--orange); color: var(--orange); }
  .export-bodies { flex:1; overflow:auto; }
  .exp-body { display:none; margin:0; padding:16px; font-family: 'JetBrains Mono', monospace; font-size:11px; line-height:1.55; color: var(--body); white-space:pre; background: var(--page); }
  .exp-body.active { display:block; }
  `;
}

function pageScript(filename) {
  return `
    // Click-to-copy on swatches and copy-btns
    document.querySelectorAll('[data-copy]').forEach(el => {
      el.addEventListener('click', () => {
        const v = el.getAttribute('data-copy');
        navigator.clipboard.writeText(v).then(() => {
          el.classList.add('copied');
          setTimeout(() => el.classList.remove('copied'), 1200);
        });
      });
    });

    // Export-panel tabs
    const expTabs = document.querySelectorAll('.exp-tab');
    const expBodies = document.querySelectorAll('.exp-body');
    expTabs.forEach(t => t.addEventListener('click', () => {
      expTabs.forEach(x => x.classList.remove('active'));
      expBodies.forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      document.getElementById(t.dataset.target).classList.add('active');
    }));

    // Copy current export body
    document.getElementById('exp-copy').addEventListener('click', (e) => {
      const active = document.querySelector('.exp-body.active code');
      if (active) {
        navigator.clipboard.writeText(active.textContent);
        e.target.textContent = 'Copied';
        setTimeout(() => e.target.textContent = 'Copy', 1200);
      }
    });

    // Build .md download from the DESIGN.md panel content
    const dlBtn = document.getElementById('exp-download');
    const mdContent = document.querySelector('#exp-md code').textContent;
    const blob = new Blob([mdContent], { type: 'text/markdown' });
    dlBtn.href = URL.createObjectURL(blob);
  `;
}

function renderBrandPage(filename, md, tokens) {
  const surfaceId = tokens.id;
  const swatches = Object.entries(tokens.colors).map(([g, list]) => renderColorGroup(g, list)).join('');
  const typeScale = renderTypeScale(tokens.typeScale, tokens.fonts[0].family);
  const fontCards = renderFontCards(tokens.fonts);
  const spacing = renderTokenTable(tokens.spacing || [], 'spacing');
  const radii = renderTokenTable(tokens.radii || [], 'radius');
  const shadows = renderTokenTable(tokens.shadows || [], 'shadow');
  const doDont = renderDoDont(tokens.doDont);
  const components = componentPreview(surfaceId, tokens);
  const mdBody = renderMarkdownBody(md);
  const exportPanel = buildExportPanel(filename, md, tokens);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(tokens.title)} — Blick Brand</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+Pro:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
<style>${pageStyles()}</style>
</head>
<body>
<div class="layout">
  <main>
    <nav class="breadcrumb"><a href="../../index.html">Designs</a> · <a href="../../index.html#brand">Brand</a> · ${escapeHtml(tokens.title)}</nav>

    <header class="hero">
      <h1 class="hero-wordmark">${escapeHtml(tokens.wordmark)}</h1>
      <div class="hero-tagline">${escapeHtml(tokens.tagline)}</div>
      <p class="hero-essence">${escapeHtml(tokens.essence)}</p>
      <div class="hero-meta">
        <span><strong>Audience:</strong> ${escapeHtml(tokens.audience)}</span>
        ${tokens.sourceUrl ? `<a href="${tokens.sourceUrl}" target="_blank" rel="noopener">↗ ${escapeHtml(tokens.sourceUrl.replace(/^https?:\/\//,''))}</a>` : ''}
      </div>
    </header>

    <section class="section">
      <h2 class="section-head">Colour palette &amp; roles</h2>
      ${swatches}
    </section>

    <section class="section">
      <h2 class="section-head">Type scale</h2>
      ${typeScale}
    </section>

    <section class="section">
      <h2 class="section-head">Fonts</h2>
      ${fontCards}
    </section>

    <section class="section">
      <h2 class="section-head">Spacing</h2>
      ${spacing}
    </section>

    <section class="section">
      <h2 class="section-head">Radius</h2>
      ${radii}
    </section>

    <section class="section">
      <h2 class="section-head">Shadows</h2>
      ${shadows}
    </section>

    <section class="section">
      <h2 class="section-head">Do &amp; Don't</h2>
      ${doDont}
    </section>

    <section class="section">
      <h2 class="section-head">Live component preview</h2>
      ${components}
    </section>

    <section class="section">
      <h2 class="section-head">Full document</h2>
      <div class="md-body">${mdBody}</div>
    </section>
  </main>

  ${exportPanel}
</div>

<script>${pageScript(filename)}</script>
</body>
</html>`;
}

// Custom card preview (replaces generic iframe screenshot in the gallery index).
// Returns an HTML snippet rendered as a static, branded card preview.
function renderCardPreview(tokens) {
  const heroColor = (tokens.colors.Brand && tokens.colors.Brand[0]?.hex) || '#f05323';
  const ink = '#0a0a0a';
  const body = '#1f1f1f';
  const muted = '#5a5a5a';
  const page = '#ffffff';
  const swatches = Object.values(tokens.colors).flat().slice(0, 6);
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Source+Serif+Pro:ital,wght@0,400;1,400&display=swap" rel="stylesheet">
<style>
  html, body { margin:0; padding:0; background:${page}; color:${body}; font-family: 'Source Serif Pro', Charter, serif; }
  .card { padding:32px; height:100%; display:flex; flex-direction:column; gap:16px; }
  .card-mark { font-family: 'Proxima Nova', Inter, sans-serif; font-weight:700; font-size:36px; line-height:1; color:${ink}; letter-spacing:-.02em; margin:0; }
  .card-tag { font-family: 'Source Serif Pro', Charter, serif; font-style:italic; font-size:14px; color:${heroColor}; margin:0; }
  .card-essence { font-family: 'Source Serif Pro', Charter, serif; font-size:13px; line-height:1.55; color:${body}; margin:0; flex:1; max-width:42ch; }
  .card-strip { display:flex; gap:0; height:24px; border-radius:3px; overflow:hidden; box-shadow: inset 0 0 0 1px rgba(0,0,0,.06); }
  .card-strip span { flex:1; }
  .card-foot { display:flex; gap:12px; align-items:baseline; font-family: Inter, sans-serif; font-size:11px; color:${muted}; text-transform:uppercase; letter-spacing:.06em; }
  .card-foot strong { color:${ink}; font-weight:700; }
</style></head>
<body>
<div class="card">
  <h2 class="card-mark">${escapeHtml(tokens.wordmark)}</h2>
  <div class="card-tag">${escapeHtml(tokens.tagline)}</div>
  <p class="card-essence">${escapeHtml((tokens.essence || '').split('. ').slice(0, 2).join('. ') + '.')}</p>
  <div class="card-strip">${swatches.map(s => `<span style="background:${s.hex}"></span>`).join('')}</div>
  <div class="card-foot"><strong>${escapeHtml(tokens.id)}</strong> · ${tokens.fonts ? escapeHtml(tokens.fonts[0].family) : ''}</div>
</div>
</body></html>`;
}

module.exports = { renderBrandPage, renderCardPreview, escapeHtml };
