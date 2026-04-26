import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { siteEntries } from './src/site/page-manifest';
import { siteHtmlPlugin } from './src/site/vite-site-html';

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const base = repoName ? `/${repoName}/` : '/';
const entryInputs = Object.fromEntries(
  Object.entries(siteEntries).map(([name, entryPath]) => [name, resolve(__dirname, entryPath)]),
);

export default defineConfig({
  base,
  plugins: [react(), siteHtmlPlugin(base)],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      input: entryInputs,
    },
  },
});
