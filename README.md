# VishnuGonuguntla.github.io
Portfolio Website

## License

- Code in this repository is licensed under the [MIT License](./LICENSE).
- Content (writeups, blog posts, images, diagrams) is licensed under [CC BY 4.0](./LICENSE-content).



jekyll-portfolio/
├── _config.yml                      ← site settings, GitHub username, plugins
├── Gemfile                          ← Jekyll 4.3 + plugins
├── index.html                       ← lightweight shell (hero + project grid)
│
├── _layouts/
│   ├── default.html                 ← base HTML wrapper
│   └── project.html                 ← per-repo page (fetches README live)
│
├── _includes/
│   ├── header.html                  ← sticky nav
│   ├── footer.html
│   └── project-card.html            ← reusable card component
│
├── _projects/                       ← one .md file per repo
│   ├── my-awesome-cli.md
│   └── react-dashboard.md
│
├── assets/
│   ├── css/main.css                 ← dark editorial design (Syne + DM Mono)
│   └── js/github-api.js             ← fetches stars/forks/README from GitHub API
│
└── .github/workflows/deploy.yml    ← auto-deploys on push to main