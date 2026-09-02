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
    // The article pages ship from public/ untouched; only this is built.
    outDir: 'dist',
  },
  server: { port: 5173 },
  preview: { port: 4173, host: '127.0.0.1' },
});
