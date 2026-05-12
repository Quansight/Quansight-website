# Quansight Website

Are you...

- Looking for [how to publish a new blog post](how-to-publish-a-new-blog-post.md)?
- A [site admin](site-admin.md)?

## Running the website locally 🖥

System requirements:

- [Node.js](https://nodejs.org)

Copy and paste the following commands:

```sh
git clone git@github.com:Quansight/Quansight-website.git
cd Quansight-website
npm install
cp apps/labs/.env.example apps/labs/.env
npm run start:labs
```
Optionally, use a docker to avoid some of the worst npm supply chain attacks
```sh
git clone git@github.com:Quansight/Quansight-website.git
cd Quansight-website
docker run --rm -it -v "$PWD":/app -w /app -p 4200:4200 --user node node:22-alpine sh
npm install
cp apps/labs/.env.example apps/labs/.env
npm run start:labs -- --hostname 0.0.0.0
```

You should see some startup info, including `- Network: http://0.0.0.0:4200` if you
are using the docker command

Go to <http://localhost:4200/>.
