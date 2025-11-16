import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: true,
    cssMinify: true,
  },
  server: {
    port: 3001,
    open: true,
  },
});