# Quansight Website

## Running project locally

Prerequisites: 

- [Node](https://nodejs.org/en/)
- To add the needed environment variables to your local environment, you will
  need admin access to the [Quansight org in
  Vercel](https://vercel.com/quansight), or you will need to work with a dev who
  has this access. 
- (Optional) [Vercel CLI](https://vercel.com/cli)

To run the website locally on your own machine, you must first clone this git
repo, `cd` into the repo, then run `npm install`.

This repo contains two projects (websites): Consulting and Labs. You must create
a `.env` file for each project that you want to develop locally. For example,
for Quansight Consulting LLC, you will need to create `apps/consulting/.env`.

The easiest way to create this file is with the [Vercel command line
interface](https://vercel.com/cli). For example, this is the command you would
run to create the `.env` file for Consulting:

```sh
cd apps/consulting
vercel env pull .env
```

If you're running this for the first time, you will have to configure the Vercel
CLI. You will need to link the folder to its corresponding project in Vercel:

- ./apps/consulting is linked to `quansight-consulting`
- ./apps/labs is linked to `quansight-labs`

If you cannot use the Vercel CLI, you can get the needed environment variables
from the admin portal:

- [consulting environment
  variables](https://vercel.com/quansight/quansight-consulting/settings/environment-variables)
- [labs environment
  variables](https://vercel.com/quansight/quansight-labs/settings/environment-variables)

Run `npm run start:consulting` or `npm run start:labs` to start a corresponding
dev server. Navigate to <http://localhost:4200/> or use localhost preview in
Storyblok panel. On the localhost the app will automatically reload if you
change any of the source files, in the Storyblok panel you need to refresh the
page manually.

Important: whenever the website's dependencies change or are updated, the lock
file `package-lock.json` will be updated. Whenever `package-lock.json` is
updated, you should re-run `npm install` (or `npm cli`), so that your local
environment's dependencies will match the production environment.

## Adding new components

1. Create the component with its schema in Storyblok components.
2. Create the React component. The components are located in `/apps/consulting/components` (LLC components), `/apps/labs/components` (labs components) or `/libs/shared/ui-components/src` (shared components). Name of the Storyblok component should be the same as the name of the React component.
3. (Only if you're adding a shared component) Add a component and types imports in `/libs/shared/ui-components/src/index.ts` file to make it available in the apps.
4. Add storyblok raw data types to `/apps/.../types/storyblok` folder.
5. Import these raw data types to `/apps/.../types/storyblok/rawBlok.ts` file and add to the collective `TRawBlock` type.
6. Add storyblok props mapper to `/apps/.../components/BlokProvider/mappers` folder.
7. Import this props mapper to `/apps/.../components/BlockProvider/utils/getPropsByType.ts` file and add the case to the switch statement.
8. Import the Next component to the `/apps/.../components/BlockProvider/componentsMap.ts` file and add to the `componentsMap` variable.
9. Import the Next component types to the `/apps/.../components/BlockProvider/types.ts` file, add component name to the `ComponentType` enum and add props types to the `TBlokComponentPropsMap` type.

## Adding new queries

You can fetch data from Storyblok directly using queries. To add the query:

1. Add the query schema .graphql file to `/apps/.../api/queries` folder.
2. Run `npm run codegen:quansight` or `npm run codegen:labs` command, depending which site are you adding query to.
3. Create the getting data function in `/apps/.../api/utils` folder using the function, type and hook created by the codegen script.

## Technical blog workflow

All of the **Quansight Labs** blog posts are located inside `apps/labs/posts`, and there all new posts should be added.

Every post is a `.md` or [`.mdx` file](https://mdxjs.com/docs/using-mdx/). The `posts` directory also contains a [`categories.json` file](./apps/labs/posts/categories.json) containing the posts categories.

The `categories.json` file is also used for displaying category filters on the `/blog` page so after adding a new category, it will also be visible on that page.

For more details about `mdx` please see:

- https://mdxjs.com/
- https://github.com/hashicorp/next-mdx-remote

### Structure of the blog post

Every post is structured with two main sections - the `meta` and `content` section. The `content` section is a body of the post added by markdown. The `meta` section is a `yaml` like structure and should be wrapped with `---` signs. The meta section contains post related informations like:

- `title` - Title of the blog post. Used also as the title of the page inside `<title></title>` tag
- `description` - Description of the blog post. Used inside `<meta name="description" />` tag
- `published` - Publishing date of the blog post. Used also for sorting posts by date.
- `author` - Unique slug of the author (from Storyblok) usually looks like: `jon-doe`. Based on this property blog post page will display proper info about author (and image).
- `category` - Array of categories for example `[Machine Learning]`. All categories should be the same as in the previously mentioned `categories.json` file. Important note: Categories are case sensitive.
- `featuredImage` - Object with properties: `src` and `alt`. The `src` property is a path to featured image which is displayed on the posts list on the`/blog` page. The `alt` property is alternative text for the image. The image should be added to the `apps/labs/public/posts/<post-name>` directory, example: `apps/labs/public/posts/hello-world-post`. There is no need to provide full image path so the pathname should start with `/posts/`.
- `hero` - Object with properties: `imageSrc` and `imageAlt`. The `imageSrc` property is a path to hero image which is displayed on the post page between the nav bar and the blog heading title. The `imageAlt` property is alternative text for the image. The image should be added to the `apps/labs/public/posts/<post-name>` directory, example: `apps/labs/public/posts/hello-world-post`. There is no need to provide full image path so the pathname should start with `/posts/`.

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

### Adding new blog post

1.  Create new feature branch. Example `feature/new-hello-world-post`.
2.  Add `.md|.mdx` file inside `apps/labs/posts` directory.
3.  Add post feature image inside `apps/labs/public/posts/<post-name>`.
4.  Add post hero image inside `apps/labs/public/posts/<post-name>`.
5.  Add all of the meta information between `---` inside `.md|.mdx` file.
6.  After `---` add post content
7.  Save file.
8.  Commit and push changes to the repository. For commits please follow the conventional commits format. [See](https://www.conventionalcommits.org/en/v1.0.0/)
9.  Review the pull request and if ok then merge to develop branch.
10. To make the post visible in production there should be merged `develop` branch into the `main` branch. So create Pull request for this and merge.

### Adding new blog category

1.  Create new feature branch.
2.  Open `apps/labs/posts/categories.json` file.
3.  Add new category to array.
4.  Save file
5.  Commit and push changes to the repository. For commits please follow the conventional commits format. [See](https://www.conventionalcommits.org/en/v1.0.0/)
6.  Review the pull request and if ok then merge to develop branch.
7.  To make the changes visible in production there should be merged `develop` branch into the `main` branch. So create Pull request for this and merge.

### Adding new components for usage inside `mdx` posts.

1.  Open `apps/labs/services/blogAllowedComponents.ts` file
2.  Import component from the codebase
3.  Add new component to `blogAllowedComponents` object.

### Specifications for Hero images

There are two options to add images to Hero component. First one is to add image in General tab of Hero component - image will be used for all screen sizes. Second one is to add different images in tabs: Image Mobile, Image Tablet and Image Desktop. While choosing second one remember to add all three of them.

By default, the images in the Hero component adjust their size to fill the full width of the container box (objectFit: cover). You can customize this behaviour by choosing different objectFit property:

- Contain: image is scaled to maintain its aspect ratio while fitting within the element's content box (height).

- Cover: image is sized to maintain its aspect ratio while filling the element's entire content box (width).
