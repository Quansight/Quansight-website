# Architecture

`apps/labs/` and `apps/consulting/` are both Astro apps (static output)
with the identical structure below — `apps/consulting` was rebuilt to
mirror `apps/labs` (see `quansight.com-migration.md`), replacing an
earlier, broken Next.js + Storyblok attempt. Each is a standalone npm
project (own `package.json`, install/build run from inside the app dir).

- `src/` — Astro pages, layouts, components, templates
  - `src/content.config.ts` — content collections: `people`, `pages`, `posts`, `singletons` (header/footer)
- `posts/` — blog post markdown files
- `people/` — team member markdown files
- `pages/` — page content YAML files (home, blog, team, …)
- `data/` — site-wide data: `header.yml`, `footer.yml`, `person-roles.json`
- `public/` — static assets (images, icons, fonts)
- `astro.config.mjs` — Astro config (React + MDX integrations, injected blog route)
- `tailwind.config.cjs` — Tailwind theme (colors, fonts, spacing)
- `postcss.config.cjs` — PostCSS config (required by Tailwind)
- `tsconfig.json` — TypeScript config for the Astro app

`apps/labs/` — Quansight Labs site, labs.quansight.org, live.

`apps/consulting/` — migration target for quansight.com (currently
WordPress, entirely outside this repo). Blog posts are migrated; the 24
live WordPress marketing pages and the widget/block components they need
are not yet — not deployed as the live site.

`examples/` — sample blog post templates for new contributors

`.husky/` — pre-commit hook: runs `lint-staged` (Prettier on staged files)

`.github/` — Dependabot config, issue/PR templates, CODEOWNERS

`vercel.json` — overrides Vercel build to use `apps/labs/` as root (no
deploy target wired up yet for `apps/consulting`)
