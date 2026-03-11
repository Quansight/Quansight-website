# Quansight Website

Are you...

- Looking for [how to publish a new blog post](how-to-publish-a-new-blog-post.md)?
- A [site admin](site-admin.md)?

## Running the website locally 🖥

System requirements:

- [Node.js](https://nodejs.org)

Note that the site is currently incompatible with Node 25, so use
node 24. On homebrew you can install it with `brew install node@24`.

Copy and paste the following commands:

```sh
git clone git@github.com:Quansight/Quansight-website.git
cd Quansight-website
npm install
cp apps/labs/.env.example apps/labs/.env
npm run start:labs
```

Go to <http://localhost:4200/>.
