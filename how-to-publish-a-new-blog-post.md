# How to publish a new blog post

All the **Quansight Labs** blog posts are located inside `apps/labs/post`,
and therefore, any new posts _must_ be added to this same folder.

Every post is a `.md` or [`.mdx` file](https://mdxjs.com/docs/using-mdx/). The
`posts` directory also contains a [`categories.json`
file](./apps/labs/posts/categories.json) containing the posts categories.

The `categories.json` file is also used for displaying category filters on the
`/blog` page so after adding a new category, it will also be visible on that
page.

For more details about `.mdx` please see:

- <https://mdxjs.com/>
- <https://github.com/hashicorp/next-mdx-remote>

- [How to publish a new blog post](#how-to-publish-a-new-blog-post)
  - [Step-by-step instructions 📝](#step-by-step-instructions-)
  - [Structure of the blog post](#structure-of-the-blog-post)
    - [Example of blog post meta section](#example-of-blog-post-meta-section)
  - [Adding a new blog category](#adding-a-new-blog-category)

## Step-by-step instructions 📝

1. Starting from the latest commit on the `main` branch, create a new feature
   branch. Example: `feature/new-hello-world-post`.
2. Choose a good, human-readable slug for your blog post. This slug will be used
   both in the URL path to your blog post and in the folder and file names in
   the next steps.
3. Add feature and hero images plus any other images contained in your blog
   post to `apps/labs/public/posts/<post-slug>/`. The feature image is used for
   sharing on social media and in the blog index. The hero image is the big
   banner above the blog post.
4. Add a new `.md|.mdx` file inside the `app/labs/posts` directory (careful:
   this is not the same directory as the images). Make sure to
   read the [Structure of the blog post section](#structure-of-the-blog-post) in
   this file to ensure that the post is properly structured.
5. Your commit tree should have the following structure:
   - apps/labs/posts/
     - new-hello-world-post.mdx
   - apps/labs/public/posts/new-hello-world-post/
     - descriptive-name-of-feature-image.png
     - descriptive-name-of-hero-image.png
     - ... any other images needed within your blog post
6. Commit and push your changes to the repository. For commits please follow the
   format of the [conventional
   commit](https://www.conventionalcommits.org/en/v1.0.0/).
7. Create a pull request to the `main` branch. Make sure to add the `type: content 📝`
   and `labs 🔭` labels to the PR.
8. Wait for someone to review the new blog post.
   > TIP: Look for the Vercel preview URL posted by a bot to the pull request so
   > you can check that the blog post looks okay before publishing to the world
   > wide web.
9. Once your pull request is approved, you should be able to merge your PR into
   the `main` branch.
10. Once merged into the `main` branch, your blog post should appear within a few
    minutes on labs.quansight.org.

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
- `authors` (required) - Array of unique author slugs (from Storyblok). Usually
  the blog post will have only one author and the value of this field will look
  like `[tania-allard]`, but when the same blog post has multiple authors it
  will look like `[tania-allard, ralf-gommers]`. Based on this property, the
  blog post page will display proper info about the author(s) (and their
  avatars). The author(s) must be present in Storyblok in order for the post to
  build without error.
- `category` (required) - Array of categories for example `[Machine Learning]`. All
  categories should be the same as in the previously mentioned
  [`categories.json`](./apps/labs/posts/categories.json) file.
  **Important note:** categories are case-sensitive.
- `featuredImage` (required) - Object with two required properties: `src` and `alt`.
  - The `src` property is a path to the featured image. The image is displayed both
    (a) in the posts gallery on the`/blog` page and (b) in rich social media
    preview cards (on Twitter, Slack, LinkedIn, etc.). The image should be added
    to the `apps/labs/public/posts/<post-slug>` directory and the `src` property
    should be `/posts/<post-slug>/<image-filename-with-extension>`. For example,
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
  - The `alt` property is alternative text for the image for use by blind and
    low vision readers.
- `hero` (required) - the object for the Hero section of the post. This can have
  two different structures:
  - The first structure is an object with `imageSrc` and `imageAlt`. The
    `imageSrc` property is a path to the hero image, which is displayed on the
    blog post page between the nav bar and the blog heading title. The
    `imageAlt` property is alternative text for the image. The image should be
    added to the `apps/labs/public/posts/<post-name>` directory, for example,
    `apps/labs/public/posts/hello-world-post`.
  - The second structure is an object with properties:
    `imageMobile`,`imageTablet`, and `imageDesktop`. Each of these properties
    also contain `imageSrc` and `imageAlt` properties.
  - The src should begin with `/posts/` (not apps/labs/public/posts/).

#### Example of blog post meta section

For a blog post with the file name, `hello-world-post.mdx`:

```yaml
title: 'This is hello world post!'
authors: [anirrudh-krishnan]
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

### Adding a new blog category

1. Create a new feature branch.
2. Open the `apps/labs/posts/categories.json` file.
3. Add a new category to the array. Make sure to follow the same format as the
   other categories.
4. Commit and push your changes to the repository. For commits please follow the
   format of the [conventional
   commit](https://www.conventionalcommits.org/en/v1.0.0/).
5. Wait for someone in the website team to review. If everything is ok, the PR
   will be merged.
