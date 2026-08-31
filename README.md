# VishnuGonuguntla.github.io

Portfolio website built with Jekyll and deployed to GitHub Pages through GitHub
Actions.

## Add a project (the only file you touch)

Everything on the projects grid comes from **`_data/projects.yml`**. To add a
repository to the portfolio, append one entry:

```yaml
- repo: "VishnuGonuguntla/my-new-repo"   # required — "owner/name"
  title: "My New Repo"                    # optional — defaults to the repo name
  description: "One-line summary."         # required
  language: "Rust"                         # optional — shown as a chip
  homepage: "https://demo.example.com"     # optional — adds a "Live" button
  featured: true                           # optional — marks the card as pinned
  tags:                                    # optional — power the tag filter
    - "Systems"
    - "CLI"
```

No new files, no HTML. Order in the file = order on the page.

## How a project card works

Each card links to `/project/?repo=owner/name`. That page
([`project.html`](project.html)) reuses the site layout, renders a hero styled
like the landing page from the YAML metadata, then fetches and displays the
repository's `README.md` live from the GitHub API
([`assets/js/project.js`](assets/js/project.js)). A "Source" link still goes
straight to GitHub.

## Interactivity

- **Tag filter** on the projects grid — chips are generated from every `tag`
  used in `projects.yml` ([`assets/js/main.js`](assets/js/main.js)).
- Deep link a filter: `/?tag=jax#projects`.
- **README viewer** — the dynamic `/project/` page described above.

## Add another interactive page later

Drop a new `.html` file at the repo root with this front matter:

```yaml
---
layout: default
title: My Page
permalink: /my-page/
---
```

Anything after the front matter is your content; it inherits the nav, footer,
fonts, and `assets/css/main.css`. Link to it from `index.html` or the nav in
[`_includes/header.html`](_includes/header.html).

## Structure

```text
_data/projects.yml           Project entries — the single source of truth
_includes/                   Shared header, footer, project-card markup
_layouts/default.html        Shared page shell
index.html                   Landing page (hero / about / projects / contact)
project.html                 Dynamic per-repo README viewer (/project/?repo=…)
assets/css/main.css          Site styling
assets/js/main.js            Landing-page enhancements (reveal, tag filter)
assets/js/project.js         README viewer logic
.github/workflows/deploy.yml GitHub Pages build and deployment
```

## Development

Install Ruby and Bundler, then run:

```bash
bundle install
bundle exec jekyll serve
```

Pushes to `main` build and deploy the site. Pull requests run the Jekyll build
without deploying it.

## License

- Code in this repository is licensed under the [MIT License](./LICENSE).
- Content (writeups, blog posts, images, diagrams) is licensed under [CC BY 4.0](./LICENSE-content).
