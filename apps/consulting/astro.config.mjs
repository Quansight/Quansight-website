import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

export default defineConfig({
  // Absolute URLs (share links on posts) resolve against this.
  site: 'https://quansight.com',
  output: 'static',
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
