/* ============================================================
   project.js — renders a GitHub repo's README inside the site
   Reads ?repo=owner/name (or ?repo=name, using the default owner)
   ============================================================ */
(function () {
  'use strict';

  var root = document.getElementById('readme-root');
  if (!root) return;

  var params = new URLSearchParams(window.location.search);
  var raw = (params.get('repo') || '').trim().replace(/^\/+|\/+$/g, '');
  var owner = (window.DEFAULT_OWNER || '').trim();

  if (raw && raw.indexOf('/') === -1 && owner) {
    raw = owner + '/' + raw;
  }

  var VALID = /^[\w.-]+\/[\w.-]+$/;
  if (!VALID.test(raw)) {
    renderError(
      'No project selected',
      'Open this page from a project card, or add <code>?repo=owner/name</code> to the URL.'
    );
    setHero(null, raw);
    return;
  }

  var repoName = raw.split('/')[1];
  var meta = findMeta(raw, repoName);
  setHero(meta, raw);
  document.title = (meta && meta.title ? meta.title : repoName) + ' | Portfolio';

  fetchReadme(raw)
    .then(function (html) { renderReadme(html); })
    .catch(function (err) {
      renderError(
        err && err.title ? err.title : 'Could not load the README',
        (err && err.message ? err.message : 'Something went wrong while contacting GitHub.') +
          ' <a href="https://github.com/' + escapeAttr(raw) + '" target="_blank" rel="noopener">Open the repository on GitHub &nearr;</a>'
      );
    });

  /* ---------- data ---------- */

  function findMeta(fullRepo, name) {
    var list = Array.isArray(window.PROJECTS) ? window.PROJECTS : [];
    var lc = fullRepo.toLowerCase();
    for (var i = 0; i < list.length; i++) {
      var r = (list[i].repo || '').toLowerCase();
      if (r === lc || r.split('/')[1] === name.toLowerCase()) return list[i];
    }
    return null;
  }

  /* ---------- hero ---------- */

  function setHero(m, fullRepo) {
    var name = fullRepo && fullRepo.indexOf('/') > -1 ? fullRepo.split('/')[1] : (fullRepo || 'Project');
    text('ph-eyebrow', (m && m.language) ? m.language : 'Project');
    text('ph-title', (m && m.title) ? m.title : name);
    text('ph-desc', (m && m.description) ? m.description : '');

    var tagWrap = document.getElementById('ph-tags');
    if (tagWrap) {
      tagWrap.innerHTML = '';
      var tags = (m && Array.isArray(m.tags)) ? m.tags : [];
      tags.forEach(function (t) {
        var s = document.createElement('span');
        s.className = 'project-tag';
        s.textContent = t;
        tagWrap.appendChild(s);
      });
    }

    var cta = document.getElementById('ph-cta');
    if (cta && fullRepo && VALID.test(fullRepo)) {
      cta.appendChild(makeBtn('Source on GitHub ↗', 'https://github.com/' + fullRepo, true, ''));
      if (m && m.homepage) {
        cta.appendChild(makeBtn('Live ↗', m.homepage, true, 'btn-ghost'));
      }
    }
  }

  function makeBtn(label, href, external, extra) {
    var a = document.createElement('a');
    a.className = 'btn' + (extra ? ' ' + extra : '');
    a.href = href;
    a.textContent = label;
    if (external) { a.target = '_blank'; a.rel = 'noopener'; }
    return a;
  }

  /* ---------- fetch + render ---------- */

  function fetchReadme(fullRepo) {
    var url = 'https://api.github.com/repos/' + fullRepo + '/readme';
    return fetch(url, { headers: { Accept: 'application/vnd.github.html' } }).then(function (res) {
      if (res.ok) return res.text();
      if (res.status === 404) {
        return Promise.reject({ title: 'No README found', message: 'This repository does not have a README.md yet.' });
      }
      if (res.status === 403) {
        return Promise.reject({ title: 'GitHub rate limit reached', message: 'Too many requests from your network. Try again in a little while.' });
      }
      return Promise.reject({ title: 'GitHub returned ' + res.status, message: 'The README could not be retrieved right now.' });
    });
  }

  function renderReadme(html) {
    var doc = new DOMParser().parseFromString(html, 'text/html');

    // strip anything executable / styling that could clash
    doc.querySelectorAll('script, style, link, meta, iframe, object, embed').forEach(function (n) { n.remove(); });
    doc.querySelectorAll('*').forEach(function (el) {
      for (var i = el.attributes.length - 1; i >= 0; i--) {
        var attr = el.attributes[i].name;
        if (/^on/i.test(attr) || (attr === 'href' && /^\s*javascript:/i.test(el.getAttribute('href') || ''))) {
          el.removeAttribute(attr);
        }
      }
    });

    // open external links in a new tab
    doc.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (/^https?:\/\//i.test(href)) { a.target = '_blank'; a.rel = 'noopener'; }
    });

    // let wide tables scroll instead of breaking the layout
    doc.querySelectorAll('table').forEach(function (t) {
      var wrap = document.createElement('div');
      wrap.className = 'readme-table-wrap';
      t.parentNode.insertBefore(wrap, t);
      wrap.appendChild(t);
    });

    root.innerHTML = '';
    var body = doc.body;
    while (body.firstChild) root.appendChild(body.firstChild);

    if (!root.textContent.trim()) {
      renderError('README is empty', 'This repository has a README file, but it has no content.');
    }
  }

  function renderError(title, htmlMsg) {
    root.innerHTML =
      '<div class="readme-error">' +
      '<p class="readme-error-title">' + escapeHtml(title) + '</p>' +
      '<p class="readme-error-msg">' + htmlMsg + '</p>' +
      '</div>';
  }

  /* ---------- helpers ---------- */

  function text(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function escapeAttr(s) { return escapeHtml(s); }
})();
