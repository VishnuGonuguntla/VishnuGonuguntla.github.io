/**
 * github-api.js
 * Fetches live repo stats and README content from GitHub's public API.
 * No token required for public repos (60 req/hr unauthenticated).
 */

const GH_API = "https://api.github.com";
const GH_RAW = "https://raw.githubusercontent.com";

// ── Utilities ────────────────────────────────────────────────────────────────

async function fetchJSON(url) {
  const res = await fetch(url, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
  return res.text();
}

function fmtNum(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}

function starIcon() {
  return `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>`;
}

function forkIcon() {
  return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/>
    <path d="M18 9v2a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"/><line x1="12" y1="12" x2="12" y2="15"/>
  </svg>`;
}

// ── Markdown renderer (via marked CDN or minimal fallback) ───────────────────

function renderMarkdown(raw) {
  if (window.marked) {
    return window.marked.parse(raw);
  }
  // Minimal fallback if marked isn't loaded
  return `<pre style="white-space:pre-wrap">${escapeHTML(raw)}</pre>`;
}

function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ── Live repo stats (cards on index page) ────────────────────────────────────

async function loadCardStats() {
  const cards = document.querySelectorAll("[data-repo]");
  const username = document.querySelector("meta[name='github-username']")?.content;

  // Grab username from a data attribute on body if present
  const user =
    username ||
    document.body.dataset.githubUser ||
    // fallback: parse from a known link in the header
    (() => {
      const a = document.querySelector('a[href*="github.com/"]');
      if (!a) return null;
      return a.href.split("github.com/")[1]?.split("/")[0];
    })();

  if (!user) return;

  for (const card of cards) {
    const repo = card.dataset.repo;
    if (!repo) continue;

    const statsEl = document.getElementById(`stats-${repo}`);
    if (!statsEl) continue;

    try {
      const data = await fetchJSON(`${GH_API}/repos/${user}/${repo}`);
      statsEl.innerHTML = `
        <span class="stat">${starIcon()} ${fmtNum(data.stargazers_count)}</span>
        <span class="stat">${forkIcon()} ${fmtNum(data.forks_count)}</span>
        ${data.language ? `<span class="stat lang-dot" data-lang="${data.language}">${data.language}</span>` : ""}
      `;
    } catch {
      // silently skip if repo is private or doesn't exist
    }
  }
}

// ── README loader (project page) ─────────────────────────────────────────────

async function loadReadme() {
  const el = document.getElementById("readme-content");
  if (!el) return;

  const repo = el.dataset.repo;
  const user = el.dataset.user;
  if (!repo || !user) return;

  try {
    // Try main branch first, then master
    let raw;
    for (const branch of ["main", "master"]) {
      try {
        raw = await fetchText(`${GH_RAW}/${user}/${repo}/${branch}/README.md`);
        break;
      } catch {
        continue;
      }
    }

    if (!raw) throw new Error("README not found");

    // Rewrite relative image URLs so they load from GitHub
    const repoBase = `https://raw.githubusercontent.com/${user}/${repo}/main/`;
    const withFixedImages = raw.replace(
      /!\[([^\]]*)\]\((?!https?:\/\/)([^)]+)\)/g,
      (_, alt, src) => `![${alt}](${repoBase}${src})`
    );

    el.innerHTML = renderMarkdown(withFixedImages);
  } catch (err) {
    el.innerHTML = `<p class="readme-error">Could not load README. <a href="https://github.com/${user}/${repo}" target="_blank">View on GitHub ↗</a></p>`;
  }
}

// ── Repo stats on project page header ────────────────────────────────────────

async function loadProjectStats() {
  const el = document.getElementById("repo-stats");
  if (!el) return;

  const repo = el.dataset.repo;
  const user =
    document.querySelector("[data-user]")?.dataset.user ||
    document.body.dataset.githubUser;

  if (!repo || !user) return;

  try {
    const data = await fetchJSON(`${GH_API}/repos/${user}/${repo}`);
    el.innerHTML = `
      <span class="stat-badge">${starIcon()} ${fmtNum(data.stargazers_count)} stars</span>
      <span class="stat-badge">${forkIcon()} ${fmtNum(data.forks_count)} forks</span>
      ${data.language ? `<span class="stat-badge">${data.language}</span>` : ""}
      ${data.license ? `<span class="stat-badge">⚖ ${data.license.spdx_id}</span>` : ""}
    `;
  } catch {
    // silently fail
  }
}

// ── Boot ─────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  loadCardStats();
  loadReadme();
  loadProjectStats();
});
