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

export default defineConfig({
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
