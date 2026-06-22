# Site admin

Guide for site changes that are **not** [blog posts](how-to-publish-a-new-blog-post.md).

- [Running the website locally](#running-the-website-locally)
- [Orientation](#orientation)
- [Deployment](#deployment)
- [Content changes](#content-changes)
  - [Adding or editing a team member](#adding-or-editing-a-team-member)
  - [Adding or editing a page](#adding-or-editing-a-page)
  - [Editing the header or footer](#editing-the-header-or-footer)
  - [Editing the projects list](#editing-the-projects-list)
- [Code changes](#code-changes)
  - [Adding a new block component](#adding-a-new-block-component)
  - [Hero images](#hero-images)
- [Integrations](#integrations)
  - [GitHub](#github)
  - [Vercel](#vercel)
  - [Slack](#slack)

## Running the website locally

Prerequisites: Docker (recommended) or Node 22+.

**With Docker:**

```bash
# dev server (live reload)
DOCKER_API_VERSION=1.42 docker run --rm -it -v "$PWD":/app -w /app/apps/labs \
  -p 4321:4321 --user node node:22-alpine sh
# inside container:
npm install && npm run dev -- --host 0.0.0.0
```

Navigate to <http://localhost:4321/>.

```bash
# production build check
DOCKER_API_VERSION=1.42 docker run --rm -v "$PWD":/app -w /app/apps/labs \
  node:22-alpine sh -c "npm run build 2>&1"
```

**Without Docker:** `cd apps/labs && npm install && npm run dev`

## Orientation

- `apps/labs/` — Quansight Labs site ([labs.quansight.org](https://labs.quansight.org)), Astro, static output
  - `posts/` — blog post markdown files (one per post) + `categories.json`
  - `people/` — team member markdown files (one per person)
  - `pages/` — page content YAML files (home, blog, team, projects, …)
  - `data/` — `header.yml`, `footer.yml`, `projects.json`, `person-roles.json`
  - `public/` — static assets (images under `public/images/`, icons, fonts)
  - `src/` — Astro pages, layouts, templates, components
- `apps/consulting/` — Quansight Consulting site (Next.js, separate deployment)
- All content is file-based; there is no CMS. Changes flow through pull requests.

Content is wired into Astro by `apps/labs/src/content.config.ts`, which defines
four collections: `people` (`people/*.md`), `pages` (`pages/*.yml`), `posts`
(`posts/*.{md,mdx}`), and `singletons` (`data/*.yml` — header and footer). See
[ARCHITECTURE.md](ARCHITECTURE.md) for the full layout.

## Deployment

Merging a pull request to `main` triggers a production deployment on Vercel.
Every pull request also gets an automatic Vercel preview URL, posted as a comment
on the PR by the Vercel GitHub app. Use this to review changes before merging.

Deployment notifications are sent to the
[#website-vercel-bot-log][slack-channel] Slack channel.

## Content changes

Edit the relevant file and open a pull request to `main`. No code required.

| What to change                            | Where                                                                       |
| ----------------------------------------- | --------------------------------------------------------------------------- |
| Team member                               | `apps/labs/people/<slug>.md` (+ photo in `apps/labs/public/images/people/`) |
| Page content (home, blog, team, projects) | `apps/labs/pages/<slug>.yml`                                                |
| Header navigation                         | `apps/labs/data/header.yml`                                                 |
| Footer                                    | `apps/labs/data/footer.yml`                                                 |
| Projects list                             | `apps/labs/data/projects.json`                                              |

### Adding or editing a team member

One markdown file per person at `apps/labs/people/<slug>.md`, with `<slug>` in
kebab-case (e.g. `aaron-meurer.md`).

1. Add the photo to `apps/labs/public/images/people/<slug>.<ext>` (JPEG/PNG,
   square renders best).
2. Create or edit `apps/labs/people/<slug>.md`:

   ```yaml
   ---
   firstName: 'Aaron'
   lastName: 'Meurer'
   role: 'author' # "team" or "author"
   displayName: 'full' # "full" or "firstName"
   githubNick: 'asmeurer' # optional
   image: '/images/people/aaron-meurer.jpeg'
   imageAlt: 'Aaron Meurer'
   projects: # optional; each must exist in data/projects.json
     - 'SymPy'
     - 'ndindex'
   ---
   ```

- `role` values come from `apps/labs/data/person-roles.json`. Only `role: team`
  appears on `/team`; `author` is for blog authors not on the roster. A blog
  author must have a matching `people/<slug>.md` or the build fails.
- Every `projects` entry must match a name in `apps/labs/data/projects.json`
  exactly (case-sensitive) or the build fails.

### Adding or editing a page

Each page is a YAML file in `apps/labs/pages/<slug>.yml` listing its blocks top
to bottom. Existing pages: `home`, `blog`, `team`, `projects`, `privacy-policy`,
`terms-and-conditions`. To edit a page, change the relevant block's fields.

```yaml
slug: home
blocks:
  - type: hero
    image: /images/page-assets/labs-home-hero.svg
    imageAlt: An illustration of a hand holding up a globe
    variant: medium
    objectFit: cover
  - type: column-article
    header: Quansight
    leftColumn: …
    rightColumn: …
```

Available block `type`s, each backed by a component in `apps/labs/src/components/`
and dispatched by `apps/labs/src/components/BlockRenderer.astro`:

`hero`, `column-article`, `logos`, `teaser`, `page-heading`, `statute`, `team`,
`projects`.

For a block's fields, read its branch in `BlockRenderer.astro` and copy an
existing block of the same type. To add a block type that doesn't exist yet, see
[Adding a new block component](#adding-a-new-block-component).

To add a **new page** at a new URL:

1. Create `apps/labs/pages/<slug>.yml` with the page's blocks.
2. Create `apps/labs/src/pages/<slug>.astro` that reads the entry from the
   `pages` collection and passes its blocks to `BlockRenderer`. Copy
   `src/pages/index.astro`; `src/pages/team.astro` shows how to pass the
   `people` collection into a `team` block.
3. If it belongs in the nav, add it to `apps/labs/data/header.yml`.

### Editing the header or footer

Two YAML files in the `singletons` collection, rendered by
`apps/labs/src/components/SiteHeader.astro` and `SiteFooter.astro`.

- **Header** — `apps/labs/data/header.yml`. Edit `navigation` (each item is
  `text` + `href`) to change top-nav links; `logo` for the header logo.
- **Footer** — `apps/labs/data/footer.yml`. Sections `contact`, `navigation`,
  `socialMedia`, each a titled list of links. `logo` has responsive variants
  (`srcMobile`, `srcTablet`, `srcDesktop`).

Conventions to preserve: email links use a `mailto:` href with `kind: email`;
every external URL includes its scheme (`https://`).

### Editing the projects list

`apps/labs/data/projects.json` is the canonical list of project names. People
files and the `projects` block validate against it, so add a project here before
referencing it elsewhere.

## Code changes

A change that needs code, not just content — e.g. a new block type for a layout
no existing block produces.

1. Create a feature branch from `main`.
2. Make your changes. Run the dev server locally to verify.
3. Open a pull request to `main`. Vercel will post a preview URL on the PR.
4. Once approved, merge to `main`. Vercel deploys to production automatically.

### Adding a new block component

When a page needs a layout none of the eight block types produces, add a new one:

1. Create the component in `apps/labs/src/components/`. Copy an existing block
   (`Teaser.tsx`, `Hero.tsx`): typed props, Tailwind classes, native `<img>`/`<a>`
   (not `next/*`). For interactivity, render as a React island with `client:load`
   (`Projects` is the only current example).
2. Add a `block.type === '<your-block-type>'` branch in
   `apps/labs/src/components/BlockRenderer.astro` mapping YAML fields to props.
3. Use the block in a page YAML file with `type: <your-block-type>`.

The `pages` schema in `src/content.config.ts` uses `.passthrough()`, so new
block fields validate without a schema change. Styling tokens live in
`tailwind.config.cjs` and `src/styles/` — reuse them rather than hard-coding.

### Hero images

The `Hero` component supports two image configurations:

1. **Single image** — set `image` and `imageAlt`. Used at all screen sizes.
2. **Responsive images** — set `imageDesktop`, `imageTablet`, and `imageMobile`
   (all three required). The correct image is selected via a `<picture>` element.

In both cases, `objectFit` can be `cover` (fill the box, cropping if needed) or
`contain` (fit within the box, preserving aspect ratio).

## Integrations

### GitHub

The Vercel GitHub app is installed on this repo. It posts a preview deployment
URL on every pull request and deploys to production when commits land on `main`.

### Vercel

The Labs site corresponds to the `quansight-labs` project in Vercel. Build
configuration is in `vercel.json` at the repo root — it points Vercel at
`apps/labs/` and runs `npm run build` there.

### Slack

Vercel sends deployment notifications to [#website-vercel-bot-log][slack-channel].

<!-- reusable urls -->

[slack-channel]: https://quansight.slack.com/archives/C03PG5SFG5P
