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

Then go to <http://localhost:4200/>.
