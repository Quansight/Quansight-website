# Quansight Website

Are you...

- Looking for [how to publish a new blog post](how-to-publish-a-new-blog-post.md)?
- A [site admin](site-admin.md)?

## Running the website locally 🖥

System requirements:

- [Node.js](https://nodejs.org) 22 or newer

The Labs site lives in `apps/labs/` and is built with [Astro](https://astro.build).
Copy and paste the following commands:

```sh
git clone git@github.com:Quansight/Quansight-website.git
cd Quansight-website/apps/labs
npm install
npm run dev
```

Optionally, use a docker to avoid some of the worst npm supply chain attacks

```sh
git clone git@github.com:Quansight/Quansight-website.git
cd Quansight-website
docker run --rm -it -v "$PWD":/app -w /app/apps/labs -p 4321:4321 --user node node:22-alpine sh
npm install
npm run dev -- --host 0.0.0.0
```

You should see some startup info, including `http://0.0.0.0:4321/` if you
are using the docker command.

Go to <http://localhost:4321/>.
