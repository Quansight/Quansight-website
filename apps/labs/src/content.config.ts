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
    blocks: z.array(z.object({ type: z.string() }).passthrough()),
  }),
});

export const collections = { people, pages };
