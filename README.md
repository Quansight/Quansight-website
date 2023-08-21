# Quansight Website

- [Quansight Website](#quansight-website)
  - [Orientation 🗺](#orientation-)
  - [Deployment Schedule 📆](#deployment-schedule-)
  - [How to make changes to the website 👨🏿‍💻](#how-to-make-changes-to-the-website-)
    - [Content changes (Storyblok) 📰](#content-changes-storyblok-)
    - [Code changes (GitHub) 💻](#code-changes-github-)
  - [A word about the word "preview" 🤔](#a-word-about-the-word-preview-)
  - [Integrations 🛠](#integrations-)
    - [GitHub](#github)
    - [Storyblok](#storyblok)
    - [Vercel](#vercel)
    - [Slack](#slack)
    - [Next.js plus the codebase in this repo](#nextjs-plus-the-codebase-in-this-repo)
  - [Ways to view the site at different stages 🔍](#ways-to-view-the-site-at-different-stages-)
  - [System design decisions 🏗](#system-design-decisions-)
  - [Running the website locally 🖥](#running-the-website-locally-)
  - [Adding new components 🧩](#adding-new-components-)
  - [Adding new queries 🗃](#adding-new-queries-)
  - [GitHub-based blog workflow (Labs blog) 💻](#github-based-blog-workflow-labs-blog-)
    - [Structure of the blog post](#structure-of-the-blog-post)
      - [Example of blog post meta section](#example-of-blog-post-meta-section)
    - [Adding a new blog post 📝](#adding-a-new-blog-post-)
    - [Adding a new blog category](#adding-a-new-blog-category)
    - [Adding new components for usage inside `.mdx` posts](#adding-new-components-for-usage-inside-mdx-posts)
    - [Specifications for Hero images](#specifications-for-hero-images)

## Orientation 🗺

Here is some basic info to help orient you to this repo.

- This repo holds the **code** for two websites:
  - `./apps/consulting/` holds code for Quansight Consulting:
    <https://quansight.com>
  - `./apps/labs/` holds code for Quansight Labs: <https://labs.quansight.org>
  - `./libs` holds code shared by both websites.
- The websites' **content** lives in [Storyblok](https://app.storyblok.com)
  (requires login).
  - But Labs and Consulting **blog posts** live under `./apps/labs/posts` and
    `./apps/consulting/posts`, respectively.
- The websites are hosted and deployed via
  [Vercel](https://vercel.com/quansight) (requires login).
- The repo's default branch is `develop`, **not** `main`.
  - Most pull requests (including Labs blog posts) will be opened against
    `develop`.
  - `main` is used for production (i.e., the live websites).
  - You can think of `develop` as staging.
  - Only hotfixes and releases are to be opened against `main`.
  - Pushing commits to `main` triggers a deployment of both websites via Vercel.

## Deployment Schedule 📆

The current schedule for website deployment to live is weekly, on Tuesdays.
Please arrange to have all PRs that you wish to go live on a given week
merged to `develop` by end-of-day of the immediately preceding Monday.

We are following a rotating deployment manager schedule monthly as follows:

- 1st Tuesdays: [@bskinn](https://github.com/bskinn)
- 2nd Tuesdays: [@gabalafou](https://github.com/gabalafou)
- 3rd Tuesdays: [@pavithraes](https://github.com/pavithraes)
- 4th Tuesdays: [@trallard](https://github.com/trallard)

For months with a 5th Tuesday, the deployment manager role will follow the
same rotation sequence. Thus, through 2023:

- 29 Nov 2022: @bskinn
- 31 Jan 2023: @gabalafou
- 30 May 2023: @pavithraes
- 29 Aug 2023: @trallard
- 31 Oct 2023: @bskinn

Please coordinate your PRs and other deployment-related matters
in the #qwebsite-ops Slack channel.

## How to make changes to the website 👨🏿‍💻

> **Note**
> Before reading this section, familiarize yourself with [Vercel
> environments](https://vercel.com/docs/concepts/deployments/environments).

This repo contains two websites ([Consulting](./apps/consulting/) and [Labs](./apps/labs/)), but the process to update
either is essentially the same.

There are primarily two types of website changes, each with its process:

- Content changes ([Storyblok](https://www.storyblok.com/home), our CMS - Content Management System)
- Code changes (this GitHub repo)

Note that Labs blog posts are a bit of an exception. Categorically they are
content changes, but the content lives in the Git repo -- so technically they are
code changes, and they follow the process for code changes.

> **Note**
> Once [issue #396](https://github.com/Quansight/Quansight-website/issues/396)
> is implemented, the Consulting blog posts will be
> converted to use the same machinery as the Labs posts, and after that
> time the Consulting blog posts will _also_ follow the process for code changes.

This section will cover the process for each type of change.

### Content changes (Storyblok) 📰

Content in Storyblok moves through several stages: drafting -> reviewing -> ready to
publish -> published -> deployed.
It's confusing, but "published" in our Storyblok
configuration does not mean that the content has gone live on the
corresponding public website. However, you should never publish any content in
Storyblok if it is not ready for public presentation. In our configuration,
publishing content in Storyblok is a signal to the rest of the team that says:
this content is ready at any time to appear on the public website. **If it's not
ready, don't hit the publish button.**

The Storyblok process is covered in more detail in the [GitHub repo's wiki](https://github.com/Quansight/Quansight-website/wiki).
A simplified version is presented here.

The process for creating, updating, or deleting content in Storyblok is the
same. There are three major stages, each with distinct steps.

1. **Editing**
   1. Make your changes in Storyblok.
   2. Preview how your changes will look on the site using Storyblok's preview
      iframe. You should see a yellow overlay at the top of the page telling you
      that you can see draft content.
   3. Save your changes.
2. **Publishing**
   1. Subscribe to Slack channel `#website-vercel-bot-log` if you are not already
      subscribed.
   2. Once your content changes are approved, click the publish button in
      Storyblok. Remember, clicking "publish" means that you are certifying that
      to the best of your knowledge, these changes should be ready to be
      deployed at any time to the live website. When you click the publish
      button, Storyblok will make a request to Vercel to start a preview
      deployment.
   3. Look for deployment notifications in Slack. Vercel will send a message to
      the `#website-vercel-bot-log` channel containing a link to the preview URL.
   4. Visit the Vercel preview URL to review and double-check your changes.
3. **Going live**
   1. When you want your changes to go to the live production site, coordinate
      with the dev team to open a merge pull request to the `main` branch on
      GitHub. Refer to the [deployment schedule](#deployment-schedule-)
      to see whom you should specifically reach out to.
   2. When the Vercel GitHub app comments on the merge PR with a preview URL,
      visit that preview URL to check your changes. (You should also be able to
      get the Vercel preview URL from the Slack channel.)
   3. If it all looks good, coordinate with the dev team to merge the PR to the
      `main` branch.
   4. Once that PR is merged to `main`, wait for the production build to finish
      deploying (check our [internal Slack channel][slack-channel] for notifications), then check your changes
      against the live site. You may need to clear your browser's cache before
      you can see your changes.

### Code changes (GitHub) 💻

Code changes move through three stages, each of which corresponds to a branch in
git: a feature branch (PR), then the `develop` branch, then `main`. When your
code gets merged to the `main` branch, Vercel deploys it to the public website.

> **Note**
> You should never merge your code into the `develop` branch unless it's ready for
> deployment (via merge to `main`).
> Putting your code into the `develop` branch is a signal to the rest of your team that says:
> this code is ready to run on the public website.

These are the concrete steps to follow to move your code from branch to branch:

1. Open a pull request against the `develop` branch. This will kick off preview
   deployments in Vercel. Vercel will add a comment to your pull request with
   links to the preview URLs.
2. Check one or both preview URLs depending on whether your change affects one
   or both sites.
3. Once your pull request has been reviewed and approved, commit it to the
   `develop` branch.
   - Consider doing a
     [squash-merge](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/about-pull-request-merges#squash-and-merge-your-pull-request-commits),
     especially if your pull request is relatively small, to keep a
     clean commit history.
4. When you want your code change to go live, cut a release branch from
   `develop`, then open a pull request to merge the release branch into `main`.
   From the command line:

   ```sh
   git checkout develop
   git pull
   git checkout -b release-YYYYMMDD
   git push -u origin release-YYYYMMDD
   ```

   Be sure to use `main` as the base branch of your PR and not `develop`.

5. Review both preview URLs that Vercel will add to your Pull Request.
6. If all looks good and your Pull Request has gotten approval, then merge it
   into `main`. This will kick off a production deployment on Vercel. Check the live
   public websites once the deployment is finished (Vercel will send a notification
   to the [Slack channel][slack-channel]. You may need to clear your browser's cache before you
   can see your changes.
7. Delete the release branch if GitHub did not automatically delete it when you
   merged your Pull Request.

## A word about the word "preview" 🤔

There is a semantic trap in the word "preview." Storyblok, Next.js, and Vercel
all use the word preview, and it means different things to each of them.

Storyblok has two kinds of API keys: a preview key and a public key. With the
Storyblok preview key, you can pass either `version=draft` or
`version=published` to the Storyblok content API, where `version=draft`
shows the _Saved_ version of content from Storyblok and `version=published`
shows the _Published_ version from Storyblok. (Side note: Storyblok has
multiple APIs, but the main API we are concerned with is the content API). In contrast, [the public
key only allows access to published
content](https://www.storyblok.com/docs/api/content-delivery#topics/authentication).

Next.js supports a preview mode. The framework provides a method to set a cookie
on the client. When this cookie is set, Next.js renders pages dynamically
instead of statically and passes a boolean to the runtime. This allows the site
to switch its behavior at runtime -- for example, passing `version=draft` to the
Storyblok API when Next.js preview mode is activated versus `version=published` when it
is not.

Finally, Vercel has preview URLs and a preview environment. Preview URLs point
to builds (or deployments) that were performed in a preview environment.

It would be nice if all of these different uses of preview mapped cleanly to
each other, but they do not. For example, you may be on a Vercel preview URL,
but you may or may not be in Next.js preview mode. The Vercel preview
environment uses the Storyblok preview key, but if it's not in Next.js preview
mode, it passes `version=published` to the Storyblok API and you will see
only Published content from Storyblok.

Everything has been configured so that you shouldn't have to think about this
too much, but just in case you find yourself confused, hopefully, this section
will help clear things up.

## Integrations 🛠

Making changes to the website relies on the ability of several services
to interact with each other. This section is for developers and covers each service
one by one and how it integrates with some other services.

### GitHub

The Vercel app is installed on GitHub. The app kicks off deployments on Vercel
whenever someone opens a pull request or pushes a commit to the repo. All of
these deployments are [preview
deployments](https://vercel.com/docs/concepts/deployments/environments#preview)
(meaning they use the preview environment in Vercel and associated environment
variables), except for commits to the `main` branch. Commits to the `main`
branch are specially recognized by Vercel as a signal to deploy the live
website.

### Storyblok

Each website has its own "space" and configuration in Storyblok.

Each website has a unique pair of API keys: preview and public. The preview
API key allows API access to both published and draft content. The public key
only allows access to published content. The Vercel production environment is
configured with the value of the public API key so that it cannot accidentally
access the draft content. The Vercel preview environment (as well as the local
development environment) uses the preview API key so that the website team can
preview draft content.

Each website's publish function in Storyblok is connected to a webhook on
Vercel. When this Vercel webhook is called, it does a preview deployment based
on the current commit of the `develop` branch on GitHub.

The Storyblok preview iframe is configured to show content previews against the
Vercel URL that points to the latest build off the `develop` branch. This was
done to help ensure that if there are any possible issues or conflicts between
code changes and content changes, they will be caught early on. The Storyblok
editor automatically passes cache-busting query string parameters (as in
`?_storyblok=<timestamp>`) to the preview URL, so it should be okay to use a
constant URL base, such as
`quansight-consulting-git-develop-quansight.vercel.app`, rather than the always
changing SHA-based Vercel preview URLs
(`quansight-consulting-<SHA>-quansight.vercel.app`).

There is a fair amount of code in the codebase that integrates with Storyblok.
For example, there is a bridge that syncs the site with changes coming from the
Storyblok editor.

Some middleware checks if the HTTP referrer is
<https://app.storyblok.com/>. In that case, the code assumes that the end user
is coming to the site from within the Storyblok iframe. So it puts the user in
Next.js preview mode. When the user is in preview mode, the website shows a
yellow overlay at the top of the page, letting the user know that they are seeing
draft content on the site.

### Vercel

Each website corresponds to a separate project in Vercel, `quansight-consulting`,
and `quansight-labs`, respectively. However, because both projects are mapped to
the same repository on GitHub, whenever a commit is made to the repo, whether
the commit was only for the Consulting site or the Labs site, it
triggers a preview deployment for both sites. **Likewise, whenever a merge is made
to the `main` branch, it triggers a production deployment to both live websites**.

Each Vercel project has settings that allow it to integrate with Storyblok,
Next.js, and GitHub. Each Vercel project has three separate environments:
development, preview, and production. The development and preview environments
contain the preview key to Storyblok. The production environment contains the
public key to Storyblok, which only allows access to the published
version of the content, not the draft version.

Each Vercel project is also configured with a webhook that Storyblok uses to
kick off a preview deployment of the `develop` branch whenever new content is published
in Storyblok.

### Slack

There is a Vercel app for Slack. It is set up to send deployment notifications
to the `#website-vercel-bot-log` channel.

### Next.js plus the codebase in this repo

The code in this repo is built on top of the Next.js framework. Next.js has a
feature called preview mode. When preview mode is turned on (via a cookie), the
Next.js framework dynamically renders each page; otherwise, it serves a static,
pre-rendered page (except when doing local development, and then it always
dynamically renders each page).

The code in this repo takes advantage of the Next.js preview mode to integrate
better with Storyblok and Vercel. When the code detects preview mode, it defaults to passing
`{"version": "draft"}` to the Storyblok API to preview content that has
been saved but not yet published -- in other words, `draft` content.

There is also code that detects when the request comes from a Storyblok iframe.
In this case, the code forces the browser to automatically enter into Next.js
preview mode.

**To help the end user distinguish which view of the site they are seeing, the
codebase defines a visual overlay at the top of each page.** When the site is in
preview mode, the overlay turns yellow and displays a message telling the user
that they can see draft content. When the site is not in preview mode, the
overlay turns gray and tells the user that they can see published content. The
overlay provides a clickable link to switch in and out of Next.js preview mode.
This switch is turned off when the user is viewing the page via the Storyblok UI because when
they are working within Storyblok, they should always see the site in Next.js preview
mode so that they can see changes that are being worked on.
The overlay does not show at all if the site was built in a
production environment.

The codebase takes advantage of [Vercel environment
variables](https://vercel.com/docs/concepts/projects/environment-variables) at
build time. For example, the preview mode overlay links to the git branch that
the site was built from (when that environment variable is available at build
time).

## Ways to view the site at different stages 🔍

Throughout the develop-deploy process, there are several ways to view the
website. The following table summarizes the important ways in which those views
differ from each other.

| Name                        | How to access          | GitHub branch  | Vercel env | Storyblok API key | Next.js preview? | Storyblok version param | Display top overlay? | Top overlay color | Button to enter/exit preview? |
| --------------------------- | ---------------------- | -------------- | ---------- | ----------------- | ---------------- | ----------------------- | -------------------- | ----------------- | ----------------------------- |
| Production                  | .com/.org URL          | `main`         | production | public            | off              | `published`             | No                   | n/a               | n/a                           |
| Storyblok (yellow overlay)  | via Storyblok UI       | `develop`      | preview    | preview           | on               | `draft`                 | Yes                  | yellow            | No                            |
| Vercel URL (gray overlay)   | via link to Vercel URL | any non-`main` | preview    | preview           | off              | `published`             | Yes                  | gray              | Yes                           |
| Vercel URL (yellow overlay) | via enter-preview      | any non-`main` | preview    | preview           | on               | `draft`                 | Yes                  | yellow            | Yes                           |

Let's take the row labeled "Vercel URL (gray overlay)." This view is accessed by
clicking on a Vercel SHA-style URL, which looks like
`https://labs-{SHA}-quansight.vercel.app`. Typically, this URL is found
either on a GitHub pull request or in `#website-vercel-bot-log` in Slack. The site served by that URL can be
built from any branch or commit on GitHub except `main`, which is reserved for
production. It is built with the "preview" Vercel environment. It does not start
in Next.js preview mode (though the end user can switch to it). The preview
Vercel environment contains the preview Storyblok API key. The site passes
`version=published` to the Storyblok API. It displays a gray overlay at the top
of each page, and that gray overlay contains a way for the end user to switch to and out of the Next.js preview mode.

Note that within Storyblok, there is no button to switch out of preview mode.
This was done by design because the whole point of the Storyblok UI is to be
able to preview content that hasn't been published yet.

## System design decisions 🏗

Each website should have only one project in Vercel. Having more than one
project results in several preview URLs being posted to each pull request on
GitHub, which makes it hard for reviewers to know which preview URL they should
review. With only one project per website, you get one preview URL (per website)
posted to the pull request. If it's not clear from the pull request title or
code which website the PR affects, the author should clarify in the PR
description. Ideally, the PR author should add one or both of the (`Labs`,
`Consulting`) GitHub labels, as appropriate, to mark the site(s) that the changes
are meant to affect.

Code in the `main` branch should only be used by the production Vercel
environment, and it should show only published content from Storyblok. While it may be tempting
to want to see draft content against the `main` branch code, it creates the
potential for confusion, and it is better not to allow it.
For example, if someone takes a screenshot of a
webpage, and in the screenshot, you can see in the browser address bar that the
URL is on the live production site (such as quansight.com), then there is no doubt
that you're seeing content that was **published** in
Storyblok at the time the `main` branch was deployed to production. The other
reason for this discipline is that it's better to limit reviewers and content
editors to previewing draft content against the `develop` branch to help catch
any potential code/content conflicts before merging to `main`.

When viewing the site in local development or at a Vercel preview URL, there
should be a overlay that explains that you are looking at a preview of the site.
This helps reduce confusion when screenshots are shared. This overlay should not
be present on a production build of the site.

The preview/development environment overlay should allow the user to toggle
between seeing published versus draft/saved Storyblok content. The overlay should
change colors to indicate which of the two content preview modes the user is in
(that is, whether they are seeing draft or published content from Storyblok).

The above should hold _except_ when the user is using the Storyblok web
interface; then the website should always be in "draft" mode, showing saved (but
not published) content. And as mentioned previously, it should show this content
against the latest code from the `develop` branch (not the `main` branch).
Related: The content team shouldn't have to think about which URL to use with
the Storyblok editor. It should be only one default URL, and this URL should
show draft content against the latest code in `develop`.

Hitting the publish button in Storyblok should not push that content to the
public-facing site; rather, it should queue up the content for the next production deployment.
This prevents bypassing any GitHub workflows that have been
set up for quality control.

Content that is marked as "published" in Storyblok should be ready to be pushed
to production at any time. Likewise, code that is merged into the `develop`
branch on GitHub should also be ready to be pushed to `main` at any time.
Respecting this discipline should allow anyone to deploy a new version of the
site to production at any time.

All production deploys should happen via commits or merges to the `main` branch.
Vercel is opinionated about this. We should follow the conventions and opinions
of the systems we integrate. If there is a content change that needs to bypass
code changes in the `develop` branch, a pull request can be made to
update a log file. That single commit can then be merged into the `main` branch
to kick off a deployment. This is a hotfix for content. A hotfix for code can be
done similarly.

## Running the website locally 🖥

Prerequisites:

- [Node](https://nodejs.org/en/)

To run the website locally on your machine, you must first clone this git
repo, `cd` into the repo, then run `npm install`.

This repo contains two projects (websites): Consulting and Labs. You must create
a `.env` file for each project that you want to develop locally. For example,
for Quansight Consulting, you will need to create `apps/consulting/.env`.
You can do this by copying the example environment file:

```bash
cp apps/consulting/.env.example apps/consulting/.env
```

Run `npm run start:consulting` or `npm run start:labs` to start a corresponding
dev server. Navigate to <http://localhost:4200/> or use `localhost` to preview
in the Storyblok panel. On the local host, the app will automatically reload if you
change any of the source files, in the Storyblok panel you need to refresh the
page manually.

Important: whenever the website's dependencies change or are updated, the lock
file `package-lock.json` will be updated. Whenever `package-lock.json` is
updated, you should re-run `npm install` (or `npm ci`), so that your local
environment's dependencies will match the production environment.

## Adding new components 🧩

1. Create the component with its schema in Storyblok components.
2. Create the React component. The components are located in
   `/apps/consulting/components` (Consulting components), `/apps/labs/components` (Labs
   components), or `/libs/shared/ui-components/src` (shared components).
   The name of the Storyblok component should be the same as the name of the React
   component.
3. (Only if you're adding a shared component) Add a component and `types imports`
   in the `/libs/shared/ui-components/src/index.ts` file to make it available in the
   apps.
4. Add Storyblok raw data types to the `/apps/.../types/storyblok` folder.
5. Import these raw data types to the `/apps/.../types/storyblok/rawBlok.ts` file
   and add them to the collective `TRawBlock` type.
6. Add Storyblok props mapper to `/apps/.../components/BlokProvider/mappers`
   folder.
7. Import this props mapper to
   `/apps/.../components/BlockProvider/utils/getPropsByType.ts` file and add the
   case to the switch statement.
8. Import the Next component to the
   `/apps/.../components/BlockProvider/componentsMap.ts` file and add it to the
   `componentsMap` variable.
9. Import the Next.js component types to the
   `/apps/.../components/BlockProvider/types.ts` file, add the component name to the
   `ComponentType` `enum` and add the props types to the `TBlokComponentPropsMap`
   type.

## Adding new queries 🗃

You can fetch data from Storyblok directly using queries. To add the query:

1. Add the query schema `.graphql` file to the `/apps/.../api/queries` folder.
2. Run `npm run codegen:quansight` or `npm run codegen:labs` command, depending on
   which site are you adding the query to.
3. Create the data retrieval function in the `/apps/.../api/utils` folder using the
   function, type, and hook created by the code gen script.

## GitHub-based blog workflow (Labs blog) 💻

All the **Quansight Labs** blog posts are located inside `apps/labs/post`,
and therefore, any new posts _must_ be added to this same folder.

> **Note**
> For now, all posts should be
> contributed using a branch-and-merge strategy within the website repo itself,
> instead of a fork-and-merge strategy. This may change in the future.

Every post is a `.md` or [`.mdx` file](https://mdxjs.com/docs/using-mdx/). The
`posts` directory also contains a [`categories.json`
file](./apps/labs/posts/categories.json) containing the posts categories.

The `categories.json` file is also used for displaying category filters on the
`/blog` page so after adding a new category, it will also be visible on that
page.

For more details about `.mdx` please see:

- <https://mdxjs.com/>
- <https://github.com/hashicorp/next-mdx-remote>

### Structure of the blog post

Every post is structured with two main sections: `meta` and `content`.
The `content` section is the body of the post added in Markdown format.
The `meta` section is a `YAML` like structure and should be wrapped with `---`
signs. The meta section contains post-related information like:

- `title` (required) - Title of the blog post. Used also as the title of the page inside
  `<title></title>` tag
- `description` (required) - Description of the blog post. Used inside `<meta name="description" />` tag
- `published` (required) - Publishing date of the blog post. Used also for sorting posts by
  date (the format should be `Month d, yyyy` for example `January 1, 2023`)
- `author` (required) - Unique slug of the author (from Storyblok) usually looks like `jon-doe`.
  Based on this property blog post page will display proper info about the author
  (and their avatar). The author must be present in Storyblok in order for the
  post to build without error.
- `category` (required) - Array of categories for example `[Machine Learning]`. All
  categories should be the same as in the previously mentioned
  [`categories.json`](./apps/labs/posts/categories.json) file.
  **Important note:** categories are case-sensitive.
- `featuredImage` (required) - Object with two required properties: `src` and `alt`.
  - The `src` property is a path to the featured image which is displayed both
    (a) in the posts gallery on the`/blog` page and (b) in rich social media
    preview cards (on Twitter, Slack, LinkedIn, etc.). The image should be added
    to the `apps/labs/public/posts/<post-slug>` directory and the `src` property
    should be `/posts/<post-slug/<image-filename-with-extension>`. For example,
    if the filename of your blog post is `hello-world.md` and the filename of
    your featured image is `featured-image.png`, then you save the image at
    `apps/labs/public/posts/hello-world/featured-image.png`, and `src` would be
    `/posts/hello-world/featured-image.png`. This image should (a) be in PNG or
    JPEG format and (b) have close to a 2:1 aspect ratio and a minimum height of
    627 pixels. If you're unsure about how your image will appear in social
    media preview cards, you can open a PR for your blog post, get the preview
    build URL to your post, then paste the preview URL in a draft social media
    post to see how the card will look on that social media platform.[^1]
    [^1]: Note that Twitter post previews can be flaky and
    [LinkedIn has a useful post-inspector tool](linkedin.com/post-inspector).
  - The `alt` property is alternative text for the image.
- `hero` (required) - the object for the Hero section of the post. This can have two different structures:
  - The first structure is an object with `imageSrc` and `imageAlt`. The `imageSrc` property is a path to
    the hero image, which is displayed on the blog post page between the nav bar and the
    blog heading title. The `imageAlt` property is alternative text for the image.
    The image should be added to the `apps/labs/public/posts/<post-name>`
    directory, for example, `apps/labs/public/posts/hello-world-post`.
  - The second structure is an object with properties: `imageMobile`,`imageTablet`,
    and `imageDesktop`. Each of these properties also contain `imageSrc` and `imageAlt` properties.
  - For both of these structures, there is no need to provide full image paths,
    so the path names should start with`/posts/`.

#### Example of blog post meta section

```yaml
title: 'This is hello world post!'
author: anirrudh-krishnan
published: October 14, 2022
description: 'Lorem ipsum dolor sit amet'
category: [Machine Learning]
featuredImage:
  src: /posts/hello-world-post/featured.png
  alt: 'Excellent alt-text describing the featured image'
hero:
  imageSrc: /posts/hello-world-post/hero.jpeg
  imageAlt: 'Excellent alt-text describing the hero image'
```

### Adding a new blog post 📝

1. Create a new feature branch. Example: `feature/new-hello-world-post`.
2. Add post feature and hero images to `apps/labs/public/posts/<post-name>`.
3. Add a new `.md|.mdx` file inside the `app/labs/posts` directory. Make sure to read the
   [Structure of the blog post section](#structure-of-the-blog-post) in this file to ensure
   that the post is properly structured.
4. Commit and push your changes to the repository. For commits please follow the format of the conventional commit.
   [See](https://www.conventionalcommits.org/en/v1.0.0/)
5. Create a pull request to the `develop` branch. Make sure to add the `type: content 📝` and `labs 🔭` labels to the PR.
6. Wait for someone in the website team to review the new blog post. If everything is ok, the PR will be merged to the `develop` branch.

### Adding a new blog category

1. Create a new feature branch.
2. Ope the `apps/labs/posts/categories.json` file.
3. Add a new category to the array. Make sure to follow the same format as the other categories.
4. Commit and push your changes to the repository. For commits please follow the format of the conventional commit.
   [See](https://www.conventionalcommits.org/en/v1.0.0/)
5. Wait for someone in the website team to review the new blog post. If everything is ok, the PR will be merged to the `develop` branch.

### Adding new components for usage inside `.mdx` posts

1. Open `apps/labs/services/blogAllowedComponents.ts` file
2. Import the component from the codebase
3. Add a new component to `blogAllowedComponents` object.

### Specifications for Hero Images in Storyblok

There are two options to add images to the Hero component in Storyblok,
for non-blog pages of both the Consulting and Labs sites.

1. The first one is to add the image in the `General` tab of the Hero component -
   this image will be used for all screen sizes.
2. The second one is to add different images for the three screen sizes in their
   respective tabs: Image Mobile, Image Tablet, and Image Desktop. When choosing
   this second option, you **MUST** add images for all three screen sizes.

By default, the images in the Hero component adjust their size to fill the full
width of the container box (`objectFit: cover`). You can customize this behavior
by choosing a different `objectFit` property.

- `Contain`: the image is scaled to maintain its aspect ratio while fitting within the
  element's content box (height).
- `Cover`: the image is sized to maintain its aspect ratio while filling the element's
  entire content box (width).

<!-- reusable urls -->

[slack-channel]: https://quansight.slack.com/archives/C03PG5SFG5P
