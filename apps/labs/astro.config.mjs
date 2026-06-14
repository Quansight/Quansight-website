import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

export default defineConfig({
  output: 'static',
  integrations: [react(), mdx()],
  vite: {
    css: {
      postcss: './postcss.config.cjs',
    },
  },
});
