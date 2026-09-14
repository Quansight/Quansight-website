# Quansight Website

This repo holds two sites, both [Astro](https://astro.build) apps with the
same architecture (content collections of local Markdown/YAML, no external
CMS):

- **Labs** (`apps/labs/`) — labs.quansight.org, live.
- **Consulting** (`apps/consulting/`) — an **in-progress migration target**
  for quansight.com. The live quansight.com today runs on WordPress,
  entirely outside this repo. Not yet deployed as the live site.

Are you...

- Looking for [how to publish a new blog post](how-to-publish-a-new-blog-post.md)?
  (Written for Labs; Consulting now follows the same content model —
  `authors: [slug]`/`people/*.md`/etc. — but has no dedicated doc yet.)
- A [site admin](site-admin.md)?

## Running the website locally 🖥

System requirements:

- [Node.js](https://nodejs.org) 22 or newer

Both sites are standalone npm projects (own `package.json`, own
dependencies) — install/run from inside the app directory, not the repo
root. Replace `<app>` below with `labs` or `consulting`.

Copy and paste the following commands:

```sh
git clone git@github.com:Quansight/Quansight-website.git
cd Quansight-website/apps/<app>
npm install
npm run dev
```

Optionally, use a docker to avoid some of the worst npm supply chain attacks

```sh
git clone git@github.com:Quansight/Quansight-website.git
cd Quansight-website
# if using non-root docker, drop the --user arg
docker run --rm -it -v "$PWD":/app -w /app/apps/<app> -p 4321:4321 --user "$(id -u):$(id -g)" node:22-alpine sh
npm install
npm run dev -- --host 0.0.0.0
```

You should see some startup info, including `http://0.0.0.0:4321/` if you
are using the docker command.

Go to <http://localhost:4321/>.
