/* ============================================================
   main.js — landing-page enhancements
   ============================================================ */

/* ---- current year in the footer ---- */
const year = document.getElementById('year');
if (year) {
  year.textContent = new Date().getFullYear();
}

/* ---- reveal-on-scroll ---- */
const fadeInElements = document.querySelectorAll('.fade-in');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  fadeInElements.forEach((element) => observer.observe(element));
} else {
  fadeInElements.forEach((element) => element.classList.add('visible'));
}

/* ---- filter projects by tag ---- */
(function () {
  const chips = document.querySelectorAll('.filter-chip');
  const grid = document.getElementById('projects-grid');
  if (!chips.length || !grid) return;

  const cards = Array.from(grid.querySelectorAll('.project-card'));
  const empty = document.getElementById('projects-empty');

  function apply(filter) {
    let shown = 0;
    cards.forEach((card) => {
      const tags = (card.dataset.tags || '').split(',');
      const match = filter === 'all' || tags.indexOf(filter) !== -1;
      card.classList.toggle('is-hidden', !match);
      if (match) shown++;
    });
    if (empty) empty.hidden = shown !== 0;
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      apply(chip.dataset.filter);
    });
  });

  // deep-link support: /#projects?tag=python  or  /?tag=python#projects
  const wanted = new URLSearchParams(window.location.search).get('tag');
  if (wanted) {
    const target = Array.from(chips).find((c) => c.dataset.filter === wanted.toLowerCase());
    if (target) target.click();
  }
})();
