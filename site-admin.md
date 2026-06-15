# Site admin

A contributors' guide for website changes that are **not** [blog posts](how-to-publish-a-new-blog-post.md).

- [Running the website locally](#running-the-website-locally)
- [Orientation](#orientation)
- [Deployment](#deployment)
- [How to make changes](#how-to-make-changes)
  - [Content changes](#content-changes)
  - [Code changes](#code-changes)
- [Integrations](#integrations)
  - [GitHub](#github)
  - [Vercel](#vercel)
  - [Slack](#slack)
- [Adding new pages](#adding-new-pages)
- [Adding new block components](#adding-new-block-components)
- [Hero images](#hero-images)

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

- `apps/labs/` — Quansight Labs site ([labs.quansight.org](https://labs.quansight.org))
  - `posts/` — blog post markdown files (one file per post)
  - `people/` — team member markdown files (one file per person)
  - `page/` — page content YAML files (home, blog, team, projects, …)
  - `data/` — `header.yml`, `footer.yml`, `projects.json`, `person-roles.json`
  - `public/` — static assets (images, icons)
  - `src/` — Astro pages, layouts, and React components
- `apps/consulting/` — Quansight Consulting site (Next.js, separate deployment)
- All content is file-based. There is no CMS.

## Deployment

Merging a pull request to `main` triggers a production deployment on Vercel.
Every pull request also gets an automatic Vercel preview URL, posted as a comment
on the PR by the Vercel GitHub app. Use this to review changes before merging.

Deployment notifications are sent to the
[#website-vercel-bot-log][slack-channel] Slack channel.

## How to make changes

### Content changes

All content lives in files in this repository. Edit the relevant file and open a
pull request to `main`.

| What to change                            | Where                                                                                                    |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Team member                               | `apps/labs/people/<slug>.md`                                                                             |
| Page content (home, blog, team, projects) | `apps/labs/page/<slug>.yml`                                                                              |
| Header navigation                         | `apps/labs/data/header.yml`                                                                              |
| Footer                                    | `apps/labs/data/footer.yml`                                                                              |
| Projects list                             | `apps/labs/data/projects.json`                                                                           |
| Blog post                                 | `apps/labs/posts/<slug>.md` — see [how-to-publish-a-new-blog-post.md](how-to-publish-a-new-blog-post.md) |

### Code changes

1. Create a feature branch from `main`.
2. Make your changes. Run the dev server locally to verify.
3. Open a pull request to `main`. Vercel will post a preview URL on the PR.
4. Once approved, merge to `main`. Vercel deploys to production automatically.

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

## Adding new pages

1. Create a content YAML file at `apps/labs/page/<slug>.yml` with the page
   blocks.
2. Create an Astro page at `apps/labs/src/pages/<slug>.astro` that reads from
   the `pages` content collection and passes blocks to `BlockRenderer`.
3. If the page should appear in the navigation, add it to
   `apps/labs/data/header.yml`.

## Adding new block components

1. Create the React component in `apps/labs/src/components/`.
2. Add a case for it in `apps/labs/src/components/BlockRenderer.astro`.
3. Use the block in a page YAML file with `type: <your-block-type>`.

## Hero images

The Hero component supports two image configurations:

1. **Single image** — set `image` and `imageAlt`. Used at all screen sizes.
2. **Responsive images** — set `imageDesktop`, `imageTablet`, and `imageMobile`
   (all three required). The correct image is selected via a `<picture>` element.

In both cases, `objectFit` can be `cover` (fill the box, cropping if needed) or
`contain` (fit within the box, preserving aspect ratio).

<!-- reusable urls -->

[slack-channel]: https://quansight.slack.com/archives/C03PG5SFG5P
