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
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('reactflow')) {
              return 'reactflow-vendor';
            }
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('draft-js') || id.includes('immutable')) {
              return 'draft-vendor';
            }
            return 'vendor';
          }
          if (id.includes('/src/nodes/') || id.includes('/src/components/')) {
            return 'nodes-components';
          }
        }
      }
    }
  },
  define: {
    global: 'window', // This aliases 'global' to 'window' for browser builds
  }
});
