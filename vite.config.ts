import { defineConfig } from 'vite';

export default defineConfig({
  base: '/bookworm/',
  build: {
    outDir: 'docs',
    sourcemap: true,
  },
  server: {
    port: 3000,
    open: true,
  },
});
