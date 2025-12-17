import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  define: {
    global: 'window', // This aliases 'global' to 'window' for browser builds
  }
});
