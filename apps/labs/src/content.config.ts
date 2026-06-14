import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const people = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './people' }),
  schema: z.object({
    firstName: z.string(),
    lastName: z.string(),
    role: z.enum(['team', 'author']),
    displayName: z.enum(['full', 'firstName']),
    githubNick: z.string().optional(),
    image: z.string(),
    imageAlt: z.string(),
    projects: z.array(z.string()).optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.yml', base: './page' }),
  schema: z.object({
    slug: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
    blocks: z.array(z.object({ type: z.string() }).passthrough()),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './posts' }),
  schema: z.object({
    title: z.string(),
    published: z.string(),
    authors: z.array(z.string()).default([]),
    description: z.string().optional(),
    category: z.array(z.string()).default([]),
    featuredImage: z
      .object({ src: z.string(), alt: z.string() })
      .optional(),
    hero: z.record(z.unknown()).optional(),
  }),
});

const singletons = defineCollection({
  loader: glob({ pattern: '*.yml', base: './data' }),
  schema: z.object({}).passthrough(),
});

export const collections = { people, pages, posts, singletons };
