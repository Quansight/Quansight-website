import fs from 'node:fs';

import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

// Shiki has no bundled MLIR grammar; see src/grammars/README.md for provenance.
// The upstream grammar's `name` is "MLIR", so lowercase it to match ```mlir fences.
const mlirGrammar = JSON.parse(
  fs.readFileSync(
    new URL('./src/grammars/mlir.tmLanguage.json', import.meta.url),
    'utf8',
  ),
);

// `site` is what BaseLayout builds absolute og:url/og:image from. On a
// Vercel preview build, point it at that deployment so the tags describe
// the preview being tested rather than production; VERCEL_BRANCH_URL is
// the stable per-branch host (labs-git-<branch>-quansight.vercel.app),
// VERCEL_URL the per-deployment one. Production always keeps the real
// domain, as does a local build (neither variable is set).
const previewHost = process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL;
const site =
  process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production' && previewHost
    ? `https://${previewHost}`
    : 'https://labs.quansight.org';

export default defineConfig({
  site,
  output: 'static',
  markdown: {
    shikiConfig: {
      langs: [{ ...mlirGrammar, name: 'mlir' }],
    },
  },
  integrations: [
    react(),
    mdx({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    {
      name: 'blog-post-route',
      hooks: {
        'astro:config:setup': ({ injectRoute }) => {
          injectRoute({
            pattern: '/blog/[post]',
            entrypoint: './src/templates/BlogPost.astro',
          });
        },
      },
    },
  ],
  vite: {
    css: {
      postcss: './postcss.config.cjs',
    },
  },
});
