# Architecture

`apps/labs/` — Quansight Labs site (Astro, static output)

- `src/` — Astro pages, layouts, components, templates
- `posts/` — blog post markdown files
- `people/` — team member markdown files
- `pages/` — page content YAML files (home, blog, team, projects, …)
- `data/` — site-wide data: `header.yml`, `footer.yml`, `projects.json`, `person-roles.json`
- `public/` — static assets (images, icons, fonts)
- `astro.config.mjs` — Astro config (React + MDX integrations, injected blog route)
- `tailwind.config.cjs` — Tailwind theme (colors, fonts, spacing)
- `postcss.config.cjs` — PostCSS config (required by Tailwind)
- `tsconfig.json` — TypeScript config for the Astro app

`apps/consulting/` — Quansight Consulting site (Next.js)

`storyblok-extraction-scripts/` — one-time scripts used to export content from Storyblok into this repo

`examples/` — sample blog post templates for new contributors

`.husky/` — pre-commit hook: runs `lint-staged` (Prettier on staged files)

`.github/` — Dependabot config and issue templates

`vercel.json` — overrides Vercel build to use `apps/labs/` as root
