# Production, Staging, Preview configuration

Storyblok = place where content is stored (Headless CMS = content management system)

GitHub (this repo) = place where code is stored (hosted SVC = software version control)

Vercel/Next.js = service that generates and deploys website by combining content + code.

The following document uses Quansight Consulting "LLC" as an example, but it also applies to
Labs: wherever you come across the string `consulting` below, you just have to
replace it with `labs`.

## Production = Live Public-Facing Site

Currently deploys to: quansight-consulting.vercel.app

Later, will deploy to: quansight.com

Triggered by:

- adding new commits (e.g. merging a PR) to `main` branch of [Quansight-website
  repo](https://github.com/Quansight/Quansight-website)
- Promote to Production button in vercel.com admin

Behind the scenes: Vercel fetches all of the Published content from Storyblok
and generates a static site using the code on `main`.

## Staging = Semi-Public Preview Site

Semi-public = anybody with the url can see the preview site so be careful not to
publish anything sensitive or prematurely to staging!

Deploys to: quansight-consulting-git-develop-quansight.vercel.app

Triggered by:

- Publish/unpublish hook on Storyblok (this means the Publish button in
  top-right of the UI)
- Commit/merge to `develop` branch

Behind the scenes: Vercel fetches all of the Published content from Storyblok
and generates a static site using the code on `develop`.

## Private Preview

This is for changes in Storyblok that have been **saved** but **not published**.

Production preview = Published + Saved (not Published) Storyblok content + code
on `main` branch
https://quansight-consulting.vercel.app/api/preview?secret=SECRET&slug=

Staging preview = Published + Saved (not Published) Storyblok content + code on
`develop` branch Is the same as test preview? Which equals =
https://quansight-consulting-3rme6k2nl-quansight.vercel.app/api/preview?secret=SECRET&slug=

Feature PR preview = Published + Saved (not Published) Storyblok content + code
on local machine http://localhost:4200/api/preview?secret=SECRET&slug=

If you visit a preview URL in the browser, you must visit the exit-preview path
to get out of preview mode. E.g. exit preview prod:
https://quansight-consulting.vercel.app/api/exit-preview?slug= (Why is slug
needed?) Remember: Preview = being able to see Published + Saved (but not
Published) Exit preview = seeing only content that has been Published

Behind the scenes: Vercel fetches content dynamically from Storyblok (this is
any content that has been saved, whether or not it has been published yet) and
generates the page dynamically using the code at `main`, `develop`, or local
machine depending on which URL you use.

## Content Authoring Workflow: Creation to Publication

Putting all of the above together, these are the steps that a new page in Storyblok must go through in order to get to the public website.
There are three stages: drafting, reviewing, publishing.

1. Drafting
   1. Modify existing page or add new page in Storybok. (If adding new page, should add link to that page from another page or in nav.)
   2. Save changes.
   3. Preview your changes against staging preview (use staging preview and not production preview because when your changes are pushed to the live public site, they will be combined with whatever is currently in staging). Remember: nothing goes to production without going through staging first. That's why it's called staging. It stages all of the changes so they can be seen together before presenting the website to the general public.
2. Reviewing
   1. Note: in some cases (for small changes, for example), the content author and reviewer can be the same person.
   2. Reviewer should preview changes against staging preview.
   3. Reviewer should check with web dev team whether there are any upcoming code changes to the site and whether the content changes under review need to be checked against any upcoming code changes.
   4. If everything looks good, reviewer should okay the changes and change the status of the content to "Ready to publish"; otherwise, change status back to "Drafting" and request changes from the content author.
3. Ready to publish
   1. If the content is ready to publish, you have to hit the publish button. This triggers a webhook on Vercel that generates the static site and deploys it to the staging url. This means the changes are now accessible to anyone on the Internet, but not yet on the main site.
   2. If everything looks good at the staging url, and you want the content to go to the official public website, make a request to the web dev team to publish to production.
