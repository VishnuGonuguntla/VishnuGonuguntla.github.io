# VishnuGonuguntla.github.io

Portfolio website built with Jekyll and deployed to GitHub Pages through GitHub
Actions.

## Projects

The homepage project tiles are managed in `_data/projects.yml`. Each entry links
directly to a public GitHub repository:

```yaml
- title: "Project Name"
  description: "What the project does."
  repo_url: "https://github.com/VishnuGonuguntla/project-name"
  language: "Python"
  tags:
    - "API"
```

Add, remove, or reorder entries in that file to curate the portfolio.

## Structure

```text
_data/projects.yml          Project cards and GitHub repository links
_includes/                  Shared header, footer, and project card markup
_layouts/default.html       Shared page shell
assets/css/main.css         Site styling
assets/js/main.js           Small UI enhancements
index.html                  Homepage content
_config.yml                 Jekyll configuration
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
