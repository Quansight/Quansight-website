# Migration Plan: Storyblok → File-Based Content

> **Status:** Draft scaffolding. Sections marked **TODO** to be filled in.

## Executive Summary

*Write last. Working draft:*

> Over the past 12 months, the Quansight Labs site has received 35 content
> edits — roughly 90% of them roster changes (staff joining or leaving).
> Pages and site chrome received 4 edits combined. We propose moving all
> content into the git repository, replacing the Storyblok + GraphQL codegen
> + Nx + Next.js stack with **Astro** consuming file-based content, and
> consolidating site ownership in the engineering team. Estimated effort:
> 2–4 focused engineering days. Ongoing maintenance burden for editors is
> comparable to today, with content edits flowing through PRs.

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
- **2 datasources** — *TODO: list slugs and what they hold*
- **2 content folders** — *TODO: confirm structure (likely `team/` and pages tree)*
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

| Surface | Edits in past 12 months |
|---|---:|
| Person records | ~31 |
| Pages (`team`, `home` — same session, 2026-04-30) | 2 |
| Header + footer (both, Dec 2025) | 2 |
| **Total** | **~35** |

- ~80 of 115 stories untouched in past year
- Initial build phase: Jun 2022 – Oct 2023 (~60 edits, including a 34-edit
  population burst in Sept 2023)
- Maintenance phase since: averages ~2 edits/month, almost all to people

**One-line characterization:** Storyblok is functioning as a CRUD form
for a list of 106 people, with rare touch-ups to otherwise-static pages.

### 1.4 Active users

*TODO: from Storyblok admin → Settings → Users, list each of the 5 users
with role and last-login date. Identify who is genuinely active.*

### 1.5 Extraction approach

Scripted one-time export from Storyblok CDN API to the repo:

| Storyblok content | Target in repo | Format |
|---|---|---|
| 106 person records | `content/people/<slug>.md` | Markdown + YAML frontmatter |
| 7 pages | `content/pages/<slug>.mdx` | MDX composing block components |
| Header singleton | `data/header.yml` | YAML |
| Footer singleton | `data/footer.yml` | YAML |
| 2 datasources | `data/<slug>.json` | JSON |
| 254 assets | `public/img/...` (or CDN — TBD) | Files in repo |

*TODO: write the `jq` transforms for each content type. Write the asset-
download + URL-rewrite script.*

### 1.6 Verification after extraction

- Build site from extracted files; visual diff against production
- Spot-check ~10 person pages and all 7 main pages
- Verify every asset URL resolves
- Compare rendered HTML byte-for-byte where possible

### 1.7 Data quality issues found during extraction

Migration surfaced several silently broken references in Storyblok content.
These were hard to detect while Storyblok was the source of truth; they're
trivially caught by CI lints once content lives in the repo.

| Issue | Where | Fix applied | Future prevention |
|---|---|---|---|
| `Napari` referenced as project name; canonical form is `napari` (case mismatch) | One person record's `projects` field | Normalized to `napari` | CI lint: every project name in a person file must exist in `data/projects.json` |
| Footer logo asset missing — Storyblok CDN returns HTTP 403 (S3 object deleted) | `labs-logo-footer.png` referenced in footer config | Substituted `srcTablet` variant (same 226×62 dimensions) | CI lint: every asset path in YAML/MDX must exist on disk |
| Schema typo: `logoMogile` field duplicates `logoMobile` | Footer logo block in Storyblok schema | Field dropped from migrated YAML | N/A — typo existed only in Storyblok's schema |
| Email link href missing `mailto:` prefix | Footer contact `connect@quansight.com` | Normalized to `mailto:...` during extraction | CI lint: links with `kind: email` must have `mailto:` href |
| Project link missing `https://` protocol | conda-forge projectLink: `github.com/conda-forge` | Auto-prepended `https://` during extraction | CI lint: external URLs must have a scheme |
| Placeholder content never replaced | `terms-and-conditions` page, "Introduction" section: `"Sampel description"` (also typo: *Sampel*) | Migrated as-is; flagged for human review | Content owner to author real terms; spell-check in CI |
| Placeholder alt text never replaced | Home page hero image: `alt="hero placeholder"` | Migrated as-is; flagged for human review | Manual cleanup pass before launch |
| Editor noise in rich text | `column-article` blocks contained `textStyle` color marks set to default black | Stripped during extraction | N/A — won't be reintroduced in file-based content |
| Empty/unused page exists | `test` page has empty body | Excluded from migration | N/A — won't be created by file convention |
| Large unoptimized images | Several team photos (~620KB each) and project logos (napari 826×1066, conda-forge 825×450, scikit-image 867×468) | Migrated as-is | Post-migration: run images through `oxipng`/`mozjpeg` — projected 60–80% size reduction |
| Typo: "diffrent" (should be "different") | At least 4 alt-text fields on hero illustrations | Migrated as-is | Spell-check on YAML/MDX content in CI |
| Typo: "technTology" (should be "technology") | Home page `column-article` rightColumn | Migrated as-is | Spell-check on YAML/MDX content in CI |
| Typo in asset filename: `labs-illustarion-2.svg` | Home page newsletter teaser image | Migrated with original filename | Optional: rename file + update references; minor |
| Empty `alt` text on named decorative images | All 5 logo grid items on the home page; teaser images | Migrated as-is | A11y review: either supply meaningful alt or mark explicitly decorative (`alt=""` + `role="presentation"`) |
| Link mark wraps entire sentence rather than the call-to-action phrase | Home page "Learn about our consulting services: Visit quansight.com" — whole sentence is the link | Migrated as-is (preserves source intent) | Editorial review: probably only "Visit quansight.com" should be the link |

*More issues likely to surface as we extract the pages.*

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
2. **Scaffold Astro inside `apps/labs/`**: install Astro deps, add
   `astro.config.mjs`, set up `src/` structure. Tear out Next.js
   (`next.config.*`, the `pages/` or `app/` router dir, `next-env.d.ts`).
3. **Wire Astro Content Collections** to read the content we've already
   extracted: `apps/labs/people/*.md`, `apps/labs/page/*.yml`,
   `apps/labs/data/*.{yml,json}`. Define schemas in `src/content/config.ts`
   so frontmatter is typed.
4. **Port React block components** from `apps/labs/components/`. Most stay
   as React components. Presentational blocks (`Hero`, `Logos`, `Team`,
   `Teaser`, `Statute`, `PageHeading`, `ColumnArticle`, `Projects`) render
   to plain HTML at build time. `Form` and `Video` hydrate as islands only
   where present (currently nowhere).

   Components land in `src/components/`. Key changes vs. the original
   `libs/shared/ui-components/` + `apps/labs/components/` sources:

   | Change | Affects |
   |---|---|
   | `next/image` → native `<img>` | `Hero`, `Picture`, and everything using `Picture` (`LogosGrid`, `TeamMemberImage`, `Teaser`, `ColumnArticle`, `ProjectLogo`) |
   | `next/link` → `<a>` | `Logos`, `TeamMemberGithub`, `ButtonLink` |
   | Storyblok rich-text AST → markdown `string` | `ColumnArticle` columns, `StatuteSection.text`, `ProjectSummary`, `ProjectDescription` — rendered with `marked` |
   | `TImage {filename, alt}` → `image: string` + `imageAlt: string` | `TeamMemberImage` |
   | `projects: {name}[]` → `projects: string[]` | `TeamMemberProjects` |
   | Logo grid `{imageSrc, imageAlt}` → `{src, alt}` | `LogosGrid` — matches extracted YAML field names |
   | People list injected from Content Collections | `Team` — Astro page fetches people, filters by role, passes array in |
   | `HeroResponsiveImages` dropped | No page YAML uses responsive-image hero variant |
   | `@quansight/shared/*` monorepo imports removed | All — components are self-contained in `src/components/` |
5. **Port the design system** — CSS / Tailwind config / tokens / fonts —
   from the existing app.
6. **Build routes**: `/`, `/team`, `/blog`, `/blog/[slug]`, `/projects`,
   `/privacy-policy`, `/terms-and-conditions`. Blog post pipeline reads
   from existing `apps/labs/post/`.
7. **Deploy to a Vercel preview** (automatic per branch push), visual-diff
   against production.
8. **Remove the Storyblok integration entirely** in the same branch:
   queries, codegen, env vars, preview middleware, Vercel webhook.
9. **Merge to main**, monitor production, decommission Storyblok
   subscription after a 2–4 week grace period.

**Vercel adapter:** none needed initially — the site is fully static, no
SSR or API routes. Vercel auto-detects Astro and serves the `dist/`
output. If forms or other server-side functionality is added later, slot
in `@astrojs/vercel` at that point. Trivial change.

**Docker workflow during development:** same pattern as before, just bump
the port to Astro's default 4321:

```bash
docker run --rm -it -v "$PWD":/app -w /app -p 4321:4321 \
  --user node node:22-alpine sh
# inside container, from apps/labs:
npm install && npm run dev -- --host 0.0.0.0
```

---

## Part 3 — Maintenance Going Forward

### 3.1 Adding or editing a person

*TODO: detailed workflow. Sketch:*

- Create or edit `content/people/<slug>.md`
- Frontmatter: `full_name`, `short_name`, `role`, `photo`, `links`, etc.
- Drop photo in `public/img/people/<slug>.<ext>`
- Open PR, merge → site deploys via existing Vercel pipeline

### 3.2 Adding or editing a page

*TODO: detailed workflow. Sketch:*

- Edit the relevant `content/pages/<slug>.mdx`
- Compose existing block components inline:
  `<Hero ... />`, `<Team people={...} />`, `<Logos ... />`, etc.
- Preview via local dev server
- Open PR, merge

### 3.3 Editing header / footer

*TODO: detailed workflow. Sketch:*

- Edit `data/header.yml` or `data/footer.yml`
- Schema documented inline in the file as comments
