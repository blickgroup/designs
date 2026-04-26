#!/usr/bin/env node
/**
 * build-gallery.cjs
 *
 * Multi-project design gallery for Blick Group.
 * Scans each project's design directories and generates a unified
 * gallery site with project tabs for GitHub Pages deployment.
 *
 * Output: _site/index.html + _site/designs/<project>/<filename>.html
 *
 * Usage: node build-gallery.cjs
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OUT = path.join(ROOT, '_site');
const DESIGNS_OUT = path.join(OUT, 'designs');

// ── Project definitions ──
// Each project defines where its designs live.
// Paths are relative to this script's directory unless absolute.
const PROJECTS = [
  {
    id: 'hub-app',
    label: 'Hub App',
    description: 'Internal operations platform',
    iterationsDir: path.join(ROOT, 'design_iterations'),
    approvedDir: path.join(ROOT, 'approved_designs'),
    archiveDir: path.join(ROOT, 'design_iterations', 'archive'),
  },
  {
    id: 'website',
    label: 'Website',
    description: 'Public-facing blick.group',
    // Website prototypes live in the website-test repo's reference/prototypes
    // We copy them into a local directory so the gallery can serve them.
    iterationsDir: path.join(ROOT, 'external', 'website', 'iterations'),
    approvedDir: path.join(ROOT, 'external', 'website', 'approved'),
    archiveDir: path.join(ROOT, 'external', 'website', 'archive'),
  },
  {
    id: 'video',
    label: 'Video',
    description: 'Hyperframes video compositions',
    iterationsDir: path.join(ROOT, 'external', 'video', 'iterations'),
    approvedDir: path.join(ROOT, 'external', 'video', 'approved'),
    archiveDir: path.join(ROOT, 'external', 'video', 'archive'),
  },
];

function humanName(filename) {
  return filename
    .replace(/\.html$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\bv(\d)/g, 'v$1')
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();
}

function scanDir(dir, status, projectId) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.html') && f !== 'index.html' && !f.endsWith('.raw.html'))
    .map(f => {
      const fullPath = path.join(dir, f);
      const stat = fs.statSync(fullPath);
      // For video projects, read brief sidecar for metadata
      let meta = null;
      if (projectId === 'video') {
        const briefPath = path.join(dir, f.replace('.html', '.brief.json'));
        if (fs.existsSync(briefPath)) {
          const b = JSON.parse(fs.readFileSync(briefPath, 'utf8'));
          meta = { duration: b.duration, format: b.format, type: b.type };
        }
      }
      return {
        filename: f,
        name: humanName(f),
        status,
        project: projectId,
        modified: stat.mtime.toISOString().split('T')[0],
        size: Math.round(stat.size / 1024),
        sourcePath: fullPath,
        meta,
      };
    })
    .sort((a, b) => b.modified.localeCompare(a.modified));
}

function scanProject(project) {
  const approved = scanDir(project.approvedDir, 'approved', project.id);
  const iterations = scanDir(project.iterationsDir, 'iteration', project.id);
  const archived = scanDir(project.archiveDir, 'archived', project.id);
  return { approved, iterations, archived, all: [...approved, ...iterations, ...archived] };
}

function buildGalleryHTML(projects, allDesigns) {
  const cards = allDesigns.map(d => {
    const badgeColor = d.status === 'approved'
      ? 'background:rgba(18,163,109,0.12);color:#12a36d'
      : d.status === 'archived'
      ? 'background:rgba(138,153,171,0.12);color:#8a99ab'
      : 'background:rgba(240,83,35,0.12);color:#f05323';
    const badgeLabel = d.status === 'approved' ? 'Approved' : d.status === 'archived' ? 'Archived' : 'Iteration';

    const previewHTML = d.project === 'video'
      ? `<div class="preview video-preview">
           <div class="video-thumb">
             <div class="play-icon">▶</div>
             <div class="video-label">${d.meta?.duration ? d.meta.duration + 's' : 'Video'} · ${d.meta?.format || 'Hyperframes'}</div>
           </div>
         </div>`
      : `<div class="preview"><iframe src="designs/${d.project}/${d.filename}" loading="lazy" sandbox></iframe></div>`;

    return `
      <a href="designs/${d.project}/${d.filename}" class="card" data-project="${d.project}" target="_blank">
        ${previewHTML}
        <div class="card-body">
          <div class="card-top">
            <span class="badge" style="${badgeColor}">${badgeLabel}</span>
            <span class="date">${d.modified}</span>
          </div>
          <h3>${d.name}</h3>
          <span class="meta">${d.size} KB</span>
        </div>
      </a>`;
  }).join('\n');

  const approvedCount = allDesigns.filter(d => d.status === 'approved').length;
  const iterationCount = allDesigns.filter(d => d.status === 'iteration').length;
  const archivedCount = allDesigns.filter(d => d.status === 'archived').length;

  const projectTabs = projects.map((p, i) => {
    const count = allDesigns.filter(d => d.project === p.id && d.status !== 'archived').length;
    return `<button class="tab${i === 0 ? ' active' : ''}" data-project="${p.id}">
      ${p.label} <span class="tab-count">${count}</span>
    </button>`;
  }).join('\n      ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blick \u2014 Design Library</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #f3f6fa;
      --surface: #ffffff;
      --line: #dce3ec;
      --text: #1e2a36;
      --text-soft: #607286;
      --text-muted: #8a99ab;
      --primary: #f05323;
      --radius: 16px;
      --font: Inter, ui-sans-serif, system-ui, -apple-system, sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font);
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
    }
    .header {
      padding: 32px 24px 0;
      max-width: 1400px;
      margin: 0 auto;
    }
    .header h1 {
      font-size: 28px;
      letter-spacing: -0.03em;
      margin-bottom: 4px;
    }
    .header h1 span { color: var(--primary); }
    .header p {
      color: var(--text-soft);
      font-size: 14px;
      line-height: 1.5;
      margin-bottom: 20px;
    }

    /* ── Project tabs ── */
    .tabs {
      display: flex;
      gap: 0;
      border-bottom: 2px solid var(--line);
      margin-bottom: 16px;
    }
    .tab {
      padding: 12px 20px;
      border: none;
      background: none;
      font: inherit;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-muted);
      cursor: pointer;
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      transition: 0.15s;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .tab:hover { color: var(--text); }
    .tab.active {
      color: var(--primary);
      border-bottom-color: var(--primary);
    }
    .tab-count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 20px;
      height: 20px;
      padding: 0 6px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 700;
      background: rgba(240,94,34,0.08);
      color: var(--primary);
    }
    .tab.active .tab-count {
      background: var(--primary);
      color: #fff;
    }

    /* ── Controls row ── */
    .controls {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
      padding: 0 24px;
      max-width: 1400px;
      margin: 0 auto 8px;
    }
    .stats {
      display: flex;
      gap: 12px;
    }
    .stat {
      padding: 8px 12px;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
    }
    .stat span { color: var(--primary); font-weight: 800; }
    .filters {
      display: flex;
      gap: 6px;
    }
    .filter-btn {
      padding: 6px 12px;
      border: 1px solid var(--line);
      border-radius: 999px;
      background: var(--surface);
      font: inherit;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-soft);
      cursor: pointer;
      transition: 0.15s;
    }
    .filter-btn:hover, .filter-btn.active {
      border-color: var(--primary);
      color: var(--primary);
      background: rgba(240,94,34,0.06);
    }
    .search {
      margin-left: auto;
      width: 240px;
      padding: 8px 12px;
      border: 1px solid var(--line);
      border-radius: 8px;
      font: inherit;
      font-size: 13px;
      background: var(--surface);
      color: var(--text);
    }
    .search:focus {
      outline: none;
      border-color: rgba(240,94,34,0.5);
      box-shadow: 0 0 0 3px rgba(240,94,34,0.08);
    }

    /* ── Grid ── */
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 18px;
      padding: 16px 24px 24px;
      max-width: 1400px;
      margin: 0 auto;
    }
    .card {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      overflow: hidden;
      text-decoration: none;
      color: inherit;
      transition: 0.2s;
      display: block;
    }
    .card:hover {
      transform: translateY(-3px);
      box-shadow: 0 16px 32px rgba(27,39,53,0.1);
    }
    .preview {
      height: 220px;
      overflow: hidden;
      border-bottom: 1px solid var(--line);
      background: #fbfcfe;
      position: relative;
    }
    .preview iframe {
      width: 200%;
      height: 200%;
      border: none;
      pointer-events: none;
      transform: scale(0.5);
      transform-origin: top left;
    }
    .card-body {
      padding: 14px 16px 16px;
    }
    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .badge {
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .date {
      font-size: 12px;
      color: var(--text-muted);
    }
    .card h3 {
      font-size: 15px;
      letter-spacing: -0.01em;
      margin-bottom: 4px;
      line-height: 1.3;
    }
    .meta {
      font-size: 12px;
      color: var(--text-muted);
    }
    .card.hidden { display: none; }
    .video-preview { background: #111; display: flex; align-items: center; justify-content: center; }
    .video-thumb { display: flex; flex-direction: column; align-items: center; gap: 12px; }
    .play-icon { width: 56px; height: 56px; background: #f05323; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; color: #fff; padding-left: 4px; }
    .video-label { font-size: 12px; color: rgba(255,255,255,0.4); font-family: var(--font); }
    .empty {
      grid-column: 1 / -1;
      text-align: center;
      padding: 48px 24px;
      color: var(--text-muted);
      font-size: 15px;
    }
    @media (max-width: 700px) {
      .grid { grid-template-columns: 1fr; padding: 16px; }
      .header { padding: 20px 16px 0; }
      .header h1 { font-size: 22px; }
      .controls { padding: 0 16px; flex-direction: column; align-items: stretch; }
      .search { width: 100%; margin-left: 0; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Blick<span>.</span> Design Library</h1>
    <p>Mockups, prototypes, and approved designs across all Blick projects.</p>
    <div class="tabs">
      <button class="tab active" data-project="all">All Projects</button>
      ${projectTabs}
    </div>
  </div>
  <div class="controls">
    <div class="stats">
      <div class="stat"><span>${approvedCount}</span> approved</div>
      <div class="stat"><span>${iterationCount}</span> iterations</div>
      <div class="stat"><span>${archivedCount}</span> archived</div>
    </div>
    <div class="filters">
      <button class="filter-btn active" data-filter="all">All</button>
      <button class="filter-btn" data-filter="approved">Approved</button>
      <button class="filter-btn" data-filter="iteration">Iterations</button>
      <button class="filter-btn" data-filter="archived">Archived</button>
    </div>
    <input type="text" class="search" placeholder="Search designs\u2026" />
  </div>
  <div class="grid">
    ${cards}
    <div class="empty" style="display:none;">No designs match your filters.</div>
  </div>
  <script>
    const cards = document.querySelectorAll('.card');
    const empty = document.querySelector('.empty');
    const search = document.querySelector('.search');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const tabs = document.querySelectorAll('.tab');
    let activeFilter = 'all';
    let activeProject = 'all';

    function applyFilters() {
      const q = search.value.toLowerCase();
      let visible = 0;
      cards.forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        const badge = card.querySelector('.badge').textContent.toLowerCase();
        const project = card.dataset.project;
        const isArchived = badge === 'archived';
        const matchProject = activeProject === 'all' || project === activeProject;
        const matchFilter = activeFilter === 'all' ? !isArchived : badge === activeFilter;
        const matchSearch = !q || name.includes(q);
        const show = matchProject && matchFilter && matchSearch;
        card.classList.toggle('hidden', !show);
        if (show) visible++;
      });
      empty.style.display = visible === 0 ? 'block' : 'none';

      // Update stats for active project
      let a = 0, it = 0, ar = 0;
      cards.forEach(card => {
        const project = card.dataset.project;
        if (activeProject !== 'all' && project !== activeProject) return;
        const badge = card.querySelector('.badge').textContent.toLowerCase();
        if (badge === 'approved') a++;
        else if (badge === 'iteration') it++;
        else if (badge === 'archived') ar++;
      });
      const statEls = document.querySelectorAll('.stat span');
      if (statEls.length >= 3) {
        statEls[0].textContent = a;
        statEls[1].textContent = it;
        statEls[2].textContent = ar;
      }
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter;
        applyFilters();
      });
    });

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeProject = tab.dataset.project;
        applyFilters();
      });
    });

    search.addEventListener('input', applyFilters);
  </script>
</body>
</html>`;
}

// ── Generate a viewer wrapper for a video composition ──
// Raw Hyperframes HTML is 1920×1080 and won't display correctly in a browser
// without the player. This wraps it in a scaled iframe with brief metadata.
function buildVideoViewerHTML(compositionFilename, brief) {
  const scenes = (brief.scenes || []).map(s => `
        <div class="scene">
          <div class="scene-timing">${s.timing}</div>
          <div class="scene-name">${s.name}</div>
          <div class="scene-message">"${s.message}"</div>
          ${s.notes ? `<div class="scene-notes">${s.notes}</div>` : ''}
        </div>`).join('');

  const nextSteps = (brief.nextSteps || []).map(s => `<li>${s}</li>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brief.title} — Blick Design Library</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --orange: #f05323;
      --bg: #f3f6fa;
      --surface: #fff;
      --line: #dce3ec;
      --text: #1e2a36;
      --soft: #607286;
      --muted: #8a99ab;
      --font: Inter, ui-sans-serif, system-ui, sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: var(--font); background: var(--bg); color: var(--text); }

    .topbar {
      background: var(--surface);
      border-bottom: 1px solid var(--line);
      padding: 14px 32px;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .topbar a {
      font-size: 13px;
      color: var(--muted);
      text-decoration: none;
    }
    .topbar a:hover { color: var(--orange); }
    .topbar .sep { color: var(--line); }
    .topbar .current { color: var(--text); font-weight: 600; font-size: 13px; }

    .hero {
      background: #111;
      padding: 40px 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
    }

    /* Scale the 1920×1080 composition to fit the viewport */
    .composition-wrap {
      width: 100%;
      max-width: 960px;
      aspect-ratio: 16/9;
      position: relative;
      background: #000;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.1);
    }
    .composition-wrap iframe {
      position: absolute;
      top: 0; left: 0;
      width: 1920px;
      height: 1080px;
      border: none;
      transform-origin: top left;
      /* Scale is set by JS based on actual rendered width */
    }

    .play-notice {
      font-size: 13px;
      color: rgba(255,255,255,0.4);
      text-align: center;
    }
    .play-notice strong { color: rgba(255,255,255,0.7); }

    .content {
      max-width: 960px;
      margin: 0 auto;
      padding: 40px 32px 64px;
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 32px;
    }

    .main-col {}
    .side-col {}

    h1 {
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.03em;
      margin-bottom: 6px;
    }
    h1 .v { color: var(--muted); font-weight: 500; font-size: 18px; margin-left: 8px; }

    .meta-row {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 28px;
    }
    .chip {
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      background: rgba(240,83,35,0.1);
      color: var(--orange);
    }
    .chip.neutral {
      background: rgba(96,114,134,0.1);
      color: var(--soft);
    }

    h2 {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--muted);
      margin-bottom: 14px;
      margin-top: 28px;
    }
    h2:first-of-type { margin-top: 0; }

    .purpose-text {
      font-size: 16px;
      line-height: 1.6;
      color: var(--soft);
      margin-bottom: 4px;
    }

    .audience-text {
      font-size: 14px;
      line-height: 1.6;
      color: var(--soft);
    }

    .scenes { display: flex; flex-direction: column; gap: 12px; }
    .scene {
      background: var(--surface);
      border: 1px solid var(--line);
      border-left: 4px solid var(--orange);
      border-radius: 8px;
      padding: 14px 16px;
    }
    .scene-timing {
      font-size: 11px;
      font-weight: 700;
      color: var(--orange);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 4px;
    }
    .scene-name {
      font-size: 15px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .scene-message {
      font-size: 14px;
      color: var(--soft);
      font-style: italic;
      margin-bottom: 6px;
    }
    .scene-notes {
      font-size: 13px;
      color: var(--muted);
      line-height: 1.5;
    }

    /* Side column */
    .card {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 16px;
    }
    .card h2 { margin-top: 0; }

    .brand-swatches { display: flex; gap: 8px; margin-bottom: 12px; }
    .swatch {
      width: 32px; height: 32px;
      border-radius: 6px;
      border: 1px solid rgba(0,0,0,0.08);
    }
    .brand-detail { font-size: 13px; color: var(--soft); line-height: 1.6; }

    .next-steps { padding-left: 18px; }
    .next-steps li {
      font-size: 13px;
      color: var(--soft);
      line-height: 1.6;
      margin-bottom: 6px;
    }

    .render-box {
      background: #111;
      border-radius: 8px;
      padding: 14px 16px;
      margin-top: 12px;
    }
    .render-label {
      font-size: 11px;
      font-weight: 700;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 8px;
    }
    .render-cmd {
      font-family: 'SF Mono', 'Fira Code', monospace;
      font-size: 12px;
      color: #7dd3a8;
      word-break: break-all;
      line-height: 1.5;
    }
    .asset-notice {
      display: flex;
      align-items: center;
      gap: 20px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 28px 32px;
      max-width: 720px;
      width: 100%;
    }
    .asset-icon { font-size: 48px; }
    .asset-text { font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.7; }
    .asset-text strong { color: rgba(255,255,255,0.9); }
    .asset-text code { font-family: monospace; font-size: 12px; color: #7dd3a8; word-break: break-all; }

    @media (max-width: 800px) {
      .content { grid-template-columns: 1fr; padding: 24px 16px; }
      .hero { padding: 24px 16px; }
    }
  </style>
</head>
<body>
  <div class="topbar">
    <a href="../../index.html">Design Library</a>
    <span class="sep">›</span>
    <a href="../../index.html#video">Video</a>
    <span class="sep">›</span>
    <span class="current">${brief.title}</span>
  </div>

  <div class="hero">
    ${compositionFilename ? `
    <div class="composition-wrap" id="compWrap">
      <iframe id="compFrame" src="${compositionFilename}" scrolling="no" sandbox="allow-scripts allow-same-origin"></iframe>
    </div>
    <div class="play-notice">
      <strong>Static preview</strong> — this is a Hyperframes composition.
      To play the animation: <code>cd blick-explainer &amp;&amp; npx hyperframes preview</code>
    </div>` : `
    <div class="asset-notice">
      <div class="asset-icon">🎬</div>
      <div class="asset-text">
        <strong>Existing MP4 asset</strong><br>
        <code>${brief.assetPath || 'See asset path in brief'}</code>
      </div>
    </div>`}
  </div>

  <div class="content">
    <div class="main-col">
      <h1>${brief.title}<span class="v">${brief.version}</span></h1>
      <div class="meta-row">
        <span class="chip">${brief.duration}s</span>
        <span class="chip">${brief.format}</span>
        <span class="chip neutral">${brief.status}</span>
        <span class="chip neutral">${brief.created}</span>
      </div>

      <h2>Purpose</h2>
      <p class="purpose-text">${brief.purpose}</p>

      <h2>Audience</h2>
      <p class="audience-text">${brief.audience}</p>

      <h2>Scenes</h2>
      <div class="scenes">${scenes}</div>
    </div>

    <div class="side-col">
      <div class="card">
        <h2>Brand</h2>
        <div class="brand-swatches">
          ${Object.entries(brief.brand || {}).filter(([k]) => k !== 'font' && k !== 'voice').map(([k, v]) =>
            `<div class="swatch" style="background:${v}" title="${k}: ${v}"></div>`
          ).join('')}
        </div>
        <div class="brand-detail">
          <strong>Font:</strong> ${brief.brand?.font || '—'}<br>
          <strong>Voice:</strong> ${brief.brand?.voice || '—'}
        </div>
      </div>

      <div class="card">
        <h2>Next Steps</h2>
        <ul class="next-steps">${nextSteps}</ul>
        <div class="render-box">
          <div class="render-label">Render to MP4</div>
          <div class="render-cmd">${brief.renderCommand || ''}</div>
        </div>
      </div>
    </div>
  </div>

  <script>
    // Scale the 1920×1080 iframe to fit its container
    function scaleFrame() {
      const wrap = document.getElementById('compWrap');
      const frame = document.getElementById('compFrame');
      const scale = wrap.offsetWidth / 1920;
      frame.style.transform = 'scale(' + scale + ')';
      wrap.style.height = (1080 * scale) + 'px';
    }
    scaleFrame();
    window.addEventListener('resize', scaleFrame);
  </script>
</body>
</html>`;
}

// ── Sync video / hyperframes compositions ──
function syncVideoDesigns() {
  const hyperframesRoot = path.resolve(ROOT, '..', 'blick-explainer');
  const externalDir = path.join(ROOT, 'external', 'video');

  fs.mkdirSync(path.join(externalDir, 'iterations'), { recursive: true });
  fs.mkdirSync(path.join(externalDir, 'approved'), { recursive: true });
  fs.mkdirSync(path.join(externalDir, 'archive'), { recursive: true });

  if (!fs.existsSync(hyperframesRoot)) {
    console.log('  blick-explainer not found — using committed external/video files');
    return;
  }

  // Copy index.html as the raw composition (used inside the viewer wrapper)
  const rawDest = path.join(externalDir, 'iterations', 'blick-explainer-v1.raw.html');
  fs.copyFileSync(path.join(hyperframesRoot, 'index.html'), rawDest);

  // Generate viewer wrappers for all .brief.json files in iterations dir
  const iterDir = path.join(externalDir, 'iterations');
  const briefs = fs.readdirSync(iterDir).filter(f => f.endsWith('.brief.json'));
  briefs.forEach(bf => {
    const brief = JSON.parse(fs.readFileSync(path.join(iterDir, bf), 'utf8'));
    const baseName = bf.replace('.brief.json', '');
    const rawFile = baseName + '.raw.html';
    // Only generate HTML viewer if raw composition exists, or it's a reference-only asset
    const compositionSrc = fs.existsSync(path.join(iterDir, rawFile)) ? rawFile : null;
    const viewerHTML = buildVideoViewerHTML(compositionSrc, brief);
    fs.writeFileSync(path.join(iterDir, baseName + '.html'), viewerHTML);
  });
  console.log(`  Synced ${briefs.length} video brief(s) + viewers`);
}

// ── Sync external project designs ──
function syncWebsiteDesigns() {
  // Sibling directory in the workspace
  const websiteRepo = path.resolve(ROOT, '..', 'website-test');
  const prototypesDir = path.join(websiteRepo, 'reference', 'prototypes');
  const externalDir = path.join(ROOT, 'external', 'website');

  if (!fs.existsSync(prototypesDir)) {
    console.log('  Website source repo not found — using committed external/ files');
    return;
  }

  // Create external dirs
  fs.mkdirSync(path.join(externalDir, 'iterations'), { recursive: true });
  fs.mkdirSync(path.join(externalDir, 'approved'), { recursive: true });
  fs.mkdirSync(path.join(externalDir, 'archive'), { recursive: true });

  // Copy all prototypes as iterations (none are formally approved yet)
  const files = fs.readdirSync(prototypesDir).filter(f => f.endsWith('.html'));
  files.forEach(f => {
    fs.copyFileSync(path.join(prototypesDir, f), path.join(externalDir, 'iterations', f));
  });

  // Also check website-test .superdesign dirs
  const wsApproved = path.join(websiteRepo, '.superdesign', 'approved_designs');
  const wsIterations = path.join(websiteRepo, '.superdesign', 'design_iterations');

  if (fs.existsSync(wsApproved)) {
    fs.readdirSync(wsApproved).filter(f => f.endsWith('.html') && f !== 'index.html').forEach(f => {
      fs.copyFileSync(path.join(wsApproved, f), path.join(externalDir, 'approved', f));
    });
  }
  if (fs.existsSync(wsIterations)) {
    fs.readdirSync(wsIterations).filter(f => f.endsWith('.html') && f !== 'index.html').forEach(f => {
      fs.copyFileSync(path.join(wsIterations, f), path.join(externalDir, 'iterations', f));
    });
  }

  console.log(`  Synced ${files.length} website prototypes`);
}

// ── Main ──
console.log('Building multi-project design gallery...');

if (fs.existsSync(OUT)) fs.rmSync(OUT, { recursive: true });
fs.mkdirSync(DESIGNS_OUT, { recursive: true });

// Sync external designs
syncWebsiteDesigns();
syncVideoDesigns();

// Scan all projects
let allDesigns = [];
PROJECTS.forEach(project => {
  const result = scanProject(project);
  allDesigns = allDesigns.concat(result.all);

  // Create project output directory and copy files
  const projectOut = path.join(DESIGNS_OUT, project.id);
  fs.mkdirSync(projectOut, { recursive: true });
  result.all.forEach(d => {
    fs.copyFileSync(d.sourcePath, path.join(projectOut, d.filename));
    // For video projects, also copy the raw composition and brief sidecar
    const rawSrc = d.sourcePath.replace(/\.html$/, '.raw.html');
    if (fs.existsSync(rawSrc)) {
      fs.copyFileSync(rawSrc, path.join(projectOut, d.filename.replace(/\.html$/, '.raw.html')));
    }
    const briefSrc = d.sourcePath.replace(/\.html$/, '.brief.json');
    if (fs.existsSync(briefSrc)) {
      fs.copyFileSync(briefSrc, path.join(projectOut, d.filename.replace(/\.html$/, '.brief.json')));
    }
  });

  const counts = `${result.approved.length}A ${result.iterations.length}I ${result.archived.length}X`;
  console.log(`  ${project.label}: ${result.all.length} designs (${counts})`);
});

// Generate gallery index
const html = buildGalleryHTML(PROJECTS, allDesigns);
fs.writeFileSync(path.join(OUT, 'index.html'), html);

const total = allDesigns.length;
const approved = allDesigns.filter(d => d.status === 'approved').length;
const iterations = allDesigns.filter(d => d.status === 'iteration').length;
const archived = allDesigns.filter(d => d.status === 'archived').length;
console.log(`\nGallery built: ${total} designs (${approved} approved, ${iterations} iterations, ${archived} archived)`);
console.log(`Output: ${OUT}`);
