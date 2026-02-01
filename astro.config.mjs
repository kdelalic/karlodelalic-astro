import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://karlodelalic.me',
  integrations: [
    react(),
    mdx(),
    sitemap(),
  ],
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'always',
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern'
        }
      }
    },
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
    },
    ssr: {
      noExternal: ['@mui/material', '@mui/system', '@mui/utils', '@emotion/react', '@emotion/styled']
    }
  }
});
