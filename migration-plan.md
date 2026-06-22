# Migration Plan: Storyblok → File-Based Content

> **Status:** Historical. The migration is complete; this document is kept as a
> record of what was done and why. It is no longer maintained. For how to run
> and edit the site today, see [site-admin.md](site-admin.md) and
> [ARCHITECTURE.md](ARCHITECTURE.md). Remaining **TODO** markers below were never
> filled in and are left as-is.

## Executive Summary

_Write last. Working draft:_

> Over the past 12 months, the Quansight Labs site has received 35 content
> edits — roughly 90% of them roster changes (staff joining or leaving).
> Pages and site chrome received 4 edits combined. We propose moving all
> content into the git repository, replacing the Storyblok + GraphQL codegen
>
> - Nx + Next.js stack with **Astro** consuming file-based content, and
>   consolidating site ownership in the engineering team. Estimated effort:
>   2–4 focused engineering days. Ongoing maintenance burden for editors is
>   comparable to today, with content edits flowing through PRs.

## Strategic Context

The longer-term goal is to **unify the existing `labs` and `consulting`
sites into a single site**. This migration is the enabling first step:
simplifying the Labs stack now means we're not later unifying two
complicated stacks. The Consulting app stays as-is during this migration;
it gets folded in afterward as part of the unification work.

---

## Part 1 — What Exists in Storyblok, and How to Extract It

### 1.1 Content inventory

- **115 stories total**
  - **106** `person` records
  - **7** `page` records
  - **1** `header` singleton
  - **1** `footer` singleton
- **2 datasources** — _TODO: list slugs and what they hold_
- **2 content folders** — _TODO: confirm structure (likely `team/` and pages tree)_
- **254 assets** — images and uploads referenced from content
- **38 block schemas defined** — only 10 are user-facing top-level types
  (the `ComponentType` enum); the remaining 28 are sub-blocks and config

### 1.2 The 10 top-level block types

From `apps/labs/components/BlockProvider/types.ts`:

`PageHeading`, `ColumnArticle`, `Form`, `Logos`, `Projects`, `Team`,
`Teaser`, `Hero`, `Statute`, `Video`

These compose the 7 pages. Each has a corresponding React component that
stays after migration — only the data source changes.

### 1.3 How Storyblok has actually been used (past 12 months)

| Surface                                           | Edits in past 12 months |
| ------------------------------------------------- | ----------------------: |
| Person records                                    |                     ~31 |
| Pages (`team`, `home` — same session, 2026-04-30) |                       2 |
| Header + footer (both, Dec 2025)                  |                       2 |
| **Total**                                         |                 **~35** |

- ~80 of 115 stories untouched in past year
- Initial build phase: Jun 2022 – Oct 2023 (~60 edits, including a 34-edit
  population burst in Sept 2023)
- Maintenance phase since: averages ~2 edits/month, almost all to people

**One-line characterization:** Storyblok is functioning as a CRUD form
for a list of 106 people, with rare touch-ups to otherwise-static pages.

### 1.4 Active users

_TODO: from Storyblok admin → Settings → Users, list each of the 5 users
with role and last-login date. Identify who is genuinely active._

### 1.5 Extraction approach

Scripted one-time export from Storyblok CDN API to the repo:

| Storyblok content  | Target in repo                  | Format                         |
| ------------------ | ------------------------------- | ------------------------------ |
| 106 person records | `content/people/<slug>.md`      | Markdown + YAML frontmatter    |
| 7 pages            | `content/pages/<slug>.mdx`      | MDX composing block components |
| Header singleton   | `data/header.yml`               | YAML                           |
| Footer singleton   | `data/footer.yml`               | YAML                           |
| 2 datasources      | `data/<slug>.json`              | JSON                           |
| 254 assets         | `public/img/...` (or CDN — TBD) | Files in repo                  |

_TODO: write the `jq` transforms for each content type. Write the asset-
download + URL-rewrite script._

### 1.6 Verification after extraction

- Build site from extracted files; visual diff against production
- Spot-check ~10 person pages and all 7 main pages
- Verify every asset URL resolves
- Compare rendered HTML byte-for-byte where possible

### 1.7 Data quality issues found during extraction

Migration surfaced several silently broken references in Storyblok content.
These were hard to detect while Storyblok was the source of truth; they're
trivially caught by CI lints once content lives in the repo.

| Issue                                                                           | Where                                                                                                            | Fix applied                                              | Future prevention                                                                                          |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `Napari` referenced as project name; canonical form is `napari` (case mismatch) | One person record's `projects` field                                                                             | Normalized to `napari`                                   | CI lint: every project name in a person file must exist in `data/projects.json`                            |
| Footer logo asset missing — Storyblok CDN returns HTTP 403 (S3 object deleted)  | `labs-logo-footer.png` referenced in footer config                                                               | Substituted `srcTablet` variant (same 226×62 dimensions) | CI lint: every asset path in YAML/MDX must exist on disk                                                   |
| Schema typo: `logoMogile` field duplicates `logoMobile`                         | Footer logo block in Storyblok schema                                                                            | Field dropped from migrated YAML                         | N/A — typo existed only in Storyblok's schema                                                              |
| Email link href missing `mailto:` prefix                                        | Footer contact `connect@quansight.com`                                                                           | Normalized to `mailto:...` during extraction             | CI lint: links with `kind: email` must have `mailto:` href                                                 |
| Project link missing `https://` protocol                                        | conda-forge projectLink: `github.com/conda-forge`                                                                | Auto-prepended `https://` during extraction              | CI lint: external URLs must have a scheme                                                                  |
| Placeholder content never replaced                                              | `terms-and-conditions` page, "Introduction" section: `"Sampel description"` (also typo: _Sampel_)                | Migrated as-is; flagged for human review                 | Content owner to author real terms; spell-check in CI                                                      |
| Placeholder alt text never replaced                                             | Home page hero image: `alt="hero placeholder"`                                                                   | Migrated as-is; flagged for human review                 | Manual cleanup pass before launch                                                                          |
| Editor noise in rich text                                                       | `column-article` blocks contained `textStyle` color marks set to default black                                   | Stripped during extraction                               | N/A — won't be reintroduced in file-based content                                                          |
| Empty/unused page exists                                                        | `test` page has empty body                                                                                       | Excluded from migration                                  | N/A — won't be created by file convention                                                                  |
| Large unoptimized images                                                        | Several team photos (~620KB each) and project logos (napari 826×1066, conda-forge 825×450, scikit-image 867×468) | Migrated as-is                                           | Post-migration: run images through `oxipng`/`mozjpeg` — projected 60–80% size reduction                    |
| Typo: "diffrent" (should be "different")                                        | At least 4 alt-text fields on hero illustrations                                                                 | Migrated as-is                                           | Spell-check on YAML/MDX content in CI                                                                      |
| Typo: "technTology" (should be "technology")                                    | Home page `column-article` rightColumn                                                                           | Migrated as-is                                           | Spell-check on YAML/MDX content in CI                                                                      |
| Typo in asset filename: `labs-illustarion-2.svg`                                | Home page newsletter teaser image                                                                                | Migrated with original filename                          | Optional: rename file + update references; minor                                                           |
| Empty `alt` text on named decorative images                                     | All 5 logo grid items on the home page; teaser images                                                            | Migrated as-is                                           | A11y review: either supply meaningful alt or mark explicitly decorative (`alt=""` + `role="presentation"`) |
| Link mark wraps entire sentence rather than the call-to-action phrase           | Home page "Learn about our consulting services: Visit quansight.com" — whole sentence is the link                | Migrated as-is (preserves source intent)                 | Editorial review: probably only "Visit quansight.com" should be the link                                   |

_More issues likely to surface as we extract the pages._

---

## Part 2 — Tech Stack Refactor

### 2.1 Current stack

- Nx monorepo (apps: `labs`, `consulting` — consulting marked unused in README)
- Next.js 16 (Turbopack)
- Storyblok headless CMS
- `graphql-codegen` pipeline (`codegen-labs.yml`, `codegen-quansight.yml`)
- Vercel deployment + Storyblok webhook + Next.js preview mode
- Per-app `.env` files holding CMS tokens

### 2.2 Target stack: Astro

**We have decided to migrate to Astro.** Other options considered and
rejected were keeping Next.js (would still ship the React runtime for
essentially static content) and a pure SSG like Hugo or Eleventy (would
require reimplementing all React components in templates).

Why Astro:

- **Site shape fits Astro's strengths exactly.** ~95% of the site is static
  content. Of the 10 block components, only `Form` and `Video` would benefit
  from any client-side JS — and Astro's islands architecture means those
  hydrate as React components while the other 8 ship as plain HTML.
- **Cleanest end-state.** Drops the Next.js runtime overhead that's overkill
  for what we now know is brochure-ware + a roster. Build output is plain
  static HTML; Vercel hosts it the same as today, only cheaper to serve.
- **Migration is non-traumatic.** The 10 React block components mostly port
  as-is to Astro's React integration. The YAML/MD content we've already
  extracted maps directly to Astro's Content Collections API.
- **Forward-compatible with the unification goal.** A clean Astro setup is
  a much easier base to fold Consulting into later than an Nx + Next.js
  monorepo.

Acknowledged trade-offs:

- Cloudflare acquired Astro in January 2026. Team is currently independent;
  governance is fine for now. Re-evaluate at the 2–3 year horizon.
- Astro's File-Based Routing differs from Next.js's; some route handlers
  and middleware need rewriting (minor — the Storyblok preview-mode
  middleware is going away anyway).

### 2.3 What gets removed

- Storyblok SDK and all integration code
- `apps/labs/api/queries/` (GraphQL queries)
- `apps/labs/api/utils/` (Storyblok fetchers)
- `codegen-labs.yml`, `codegen-quansight.yml`, related deps
- `npm run codegen:*` scripts
- Storyblok-related middleware / preview-mode handling
- Storyblok webhook in Vercel
- Nx infrastructure (if moving to single-app project)
- Tokens from `.env`; the `.env` file shrinks dramatically
- **ESLint** removed from the Labs pre-commit hook (was run via Nx;
  `apps/labs/` has no standalone ESLint config). Pre-commit now runs
  Prettier only. Notable loss: `eslint-plugin-jsx-a11y` no longer catches
  accessibility issues (missing alt text, unlabelled buttons, bad ARIA) on
  commit. Consider adding `@astrojs/eslint` to `apps/labs/` as a follow-up.
  Note: `apps/consulting/` previously shared the same Nx-driven pre-commit
  hook; it now also gets Prettier-only, which is a regression for that app
  too — its ESLint config still exists but is no longer enforced on commit.

### 2.4 What stays

- The 10 block components (`Hero`, `Team`, `Logos`, etc.)
- Existing styling system
- Existing blog post pipeline (already file-based in `apps/labs/post/`)
- Header/footer React components
- Vercel deployment (just static output now)

### 2.5 Migration sequencing

The migration happens **in place at `apps/labs/`**. Vercel previews per
branch give us side-by-side comparison with production; no parallel
directory needed.

1. ~~**Branch off** the extraction branch: `git checkout -b astro-migration`~~ — **done.**
2. ~~**Scaffold Astro inside `apps/labs/`**~~ — **done.**
   - `apps/labs/package.json` — standalone Astro package (no Nx); run from this dir
   - `astro.config.mjs` — React + MDX integrations, `remark-math` + `rehype-katex` for blog posts
   - `tailwind.config.cjs`, `postcss.config.cjs` — CJS-safe copies; originals removed
   - `tsconfig.json` — extends `astro/tsconfigs/strict`
   - `src/styles/global.css` — Tailwind directives + custom classes
   - `src/layouts/BaseLayout.astro` — Google Fonts, KaTeX CSS, `text-[62.5%]` on `<html>`
   - Dynamic blog post route injected via `astro.config.mjs` `injectRoute` (pattern
     `/blog/[post]` → `src/templates/BlogPost.astro`) to avoid brackets in filenames.
   - Dev workflow: `docker run --rm -it -v "$PWD":/app -w /app/apps/labs -p 4321:4321 --user node node:22-alpine sh` then `npm install && npm run dev -- --host 0.0.0.0`
3. ~~**Wire Astro Content Collections**~~ — **done.**
   - `src/content.config.ts` uses Astro 5 Content Layer API (`glob` loader).
   - `people` collection → `./people/*.md` (106 records, typed schema)
   - `pages` collection → `./page/*.yml` (6 pages, loose block schema with `.passthrough()`)
   - `posts` collection → `./posts/*.{md,mdx}` (162 posts; `hero` field is `z.record` to
     accommodate both simple `imageSrc/imageAlt` and responsive `imageDesktop/Mobile/Tablet` variants)
   - All content stays at its current path — no files moved.
4. ~~**Port React block components**~~ — **done.** `src/components/`
   All 10 block types ported. Key changes vs. original sources:

   | Change                                                          | Affects                                                                                                                      |
   | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
   | `next/image` → native `<img>`                                   | `Hero`, `Picture`, and everything using `Picture` (`LogosGrid`, `TeamMemberImage`, `Teaser`, `ColumnArticle`, `ProjectLogo`) |
   | `next/link` → `<a>`                                             | `Logos`, `TeamMemberGithub`, `ButtonLink`                                                                                    |
   | Storyblok rich-text AST → markdown `string`                     | `ColumnArticle` columns, `StatuteSection.text`, `ProjectSummary`, `ProjectDescription` — rendered with `marked`              |
   | `TImage {filename, alt}` → `image: string` + `imageAlt: string` | `TeamMemberImage`                                                                                                            |
   | `projects: {name}[]` → `projects: string[]`                     | `TeamMemberProjects`                                                                                                         |
   | Logo grid `{imageSrc, imageAlt}` → `{src, alt}`                 | `LogosGrid` — matches extracted YAML field names                                                                             |
   | People list injected from Content Collections                   | `Team` — Astro page fetches people, filters by role, passes array in                                                         |
   | `HeroResponsiveImages` dropped                                  | No page YAML uses responsive-image hero variant                                                                              |
   | `@quansight/shared/*` monorepo imports removed                  | All — components are self-contained in `src/components/`                                                                     |
   | `ProjectsItem` uses `client:load`                               | Only interactive component — accordion toggle                                                                                |
   | `CH.Code` stubbed in `src/components/Blog/CodeHike.tsx`         | 10 posts use Code Hike; stub renders nothing; upgrade to Code Hike v1 + Astro integration deferred                           |

   `src/components/BlockRenderer.astro` dispatches each page block to the right component.

5. ~~**Port the design system**~~ — **done.**
   - Google Fonts (Inter, Mukta, Fira Code) and KaTeX CSS loaded in `BaseLayout.astro`
   - `html { font-size: 62.5% }` (`text-[62.5%]`) set on `<html>` — all components use rem units based on this
   - Tailwind theme (colors, fonts, spacing) in `tailwind.config.cjs` — unchanged from original
6. ~~**Build routes**~~ — **done.** 168 pages build clean.
   - `src/pages/index.astro` → `/`
   - `src/pages/team.astro` → `/team`
   - `src/pages/projects.astro` → `/projects` (exists on production but has no
     inbound internal links — not in nav, not linked from any page content)
   - `/privacy-policy` and `/terms-and-conditions` — pages were created from
     extracted YAML but removed: both 404 on production and are not linked
     from the nav. The `.yml` source files are kept in `page/` for reference.
   - `src/pages/blog/index.astro` → `/blog` (lists all posts, sorted by date; no pagination yet)
   - `src/templates/BlogPost.astro` → `/blog/<post>` (injected route, no brackets in filename)
   - Blog authors resolved from `people` collection by slug at build time.
   - Math rendering: `remark-math` + `rehype-katex`; KaTeX CSS already in layout.
   - Blog pagination, category filtering, featured-post layout, and RSS feed added.
     - `src/components/Blog/BlogList.tsx` — React island; 9 posts/page, category buttons, prev/next pagination
     - `src/pages/rss.xml.ts` — static RSS 2.0 endpoint (no extra deps; raw XML)
7. **Deploy to a Vercel preview** (automatic per branch push), visual-diff
   against production.
8. **Remove the Storyblok/Next.js/Nx integration** in the same branch:
   `apps/labs/pages/`, `apps/labs/api/`, `apps/labs/services/`, `apps/labs/types/`,
   `apps/labs/middleware.ts`, `apps/labs/next.config.js`, `apps/labs/next-env.d.ts`,
   `apps/labs/jest.config.ts`, `apps/labs/project.json`, `apps/labs/index.d.ts`,
   `apps/labs/components/` (old BlokProvider etc.), `libs/`, root `package.json` Nx deps,
   `codegen-labs.yml`, `.env` Storyblok tokens, Storyblok webhook in Vercel.
9. **Merge to main**, monitor production, decommission Storyblok
   subscription after a 2–4 week grace period.

**Vercel adapter:** none needed initially — the site is fully static, no
SSR or API routes. Vercel auto-detects Astro and serves the `dist/`
output. If forms or other server-side functionality is added later, slot
in `@astrojs/vercel` at that point. Trivial change.

**Docker workflow during development:** same pattern as before, just bump
the port to Astro's default 4321:

```bash
DOCKER_API_VERSION=1.42 docker run --rm -it -v "$PWD":/app -w /app/apps/labs -p 4321:4321 \
  --user node node:22-alpine sh
# inside container:
npm install && npm run dev -- --host 0.0.0.0
```

**Docker build check** (verify the site compiles cleanly; run as root so Vite
can write `dist/`):

```bash
DOCKER_API_VERSION=1.42 docker run --rm -v "$PWD":/app -w /app/apps/labs \
  node:22-alpine sh -c "npm run build 2>&1"
```

---

## Part 3 — Maintenance Going Forward

Maintenance workflows now live in [site-admin.md](site-admin.md): adding or
editing a person, adding or editing a page, editing the header/footer, the
projects list, and code changes (new block components). Blog posts are covered in
[how-to-publish-a-new-blog-post.md](how-to-publish-a-new-blog-post.md).
