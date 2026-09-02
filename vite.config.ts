import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  build: {
    // The article pages ship from public/ untouched; only the landing page is
    // built. Keeping the two side by side is what makes the migration
    // incremental rather than a rewrite.
    outDir: 'dist',
  },
  server: { port: 5173 },
  preview: { port: 4173, host: '127.0.0.1' },
});
