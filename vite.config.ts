import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const base = repoName ? `/${repoName}/` : '/';

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
        work: resolve(__dirname, 'work/index.html'),
        love: resolve(__dirname, 'love/index.html'),
        spend: resolve(__dirname, 'spend/index.html'),
        study: resolve(__dirname, 'study/index.html'),
        fitness: resolve(__dirname, 'fitness/index.html'),
        travel: resolve(__dirname, 'travel/index.html'),
        wbti: resolve(__dirname, 'wbti/index.html'),
        lbti: resolve(__dirname, 'lbti/index.html'),
      },
    },
  },
});
