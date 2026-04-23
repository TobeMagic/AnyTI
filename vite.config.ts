import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const base = repoName ? `/${repoName}/` : '/';
const typesRoot = resolve(__dirname, 'types');
const typeDetailInputs = Object.fromEntries(
  readdirSync(typesRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const htmlPath = resolve(typesRoot, entry.name, 'index.html');
      return existsSync(htmlPath) ? [`type-${entry.name}`, htmlPath] : null;
    })
    .filter((entry): entry is [string, string] => Boolean(entry)),
);

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        notFound: resolve(__dirname, '404.html'),
        types: resolve(__dirname, 'types/index.html'),
        ...typeDetailInputs,
        rankings: resolve(__dirname, 'rankings/index.html'),
        about: resolve(__dirname, 'about/index.html'),
        lbtiMbti: resolve(__dirname, 'lbti-mbti/index.html'),
        test: resolve(__dirname, 'test/index.html'),
        lbti: resolve(__dirname, 'lbti/index.html'),
      },
    },
  },
});
