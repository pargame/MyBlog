import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path assumes project pages: /MyBlog/
export default defineConfig({
  base: '/MyBlog/',
  plugins: [react()],
  server: {
    port: 5173
  }
  ,
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (!id) return undefined;
          // Create smaller, semantically grouped vendor chunks to avoid
          // shipping an unnecessarily large single vendor file on first load.
          // keep react-router-dom bundled with other vendor chunks (avoid empty chunk)
          if (id.includes('node_modules/react-dom')) return 'vendor.react-dom';
          if (id.includes('node_modules/react')) return 'vendor.react';
          if (id.includes('node_modules/marked')) return 'vendor.marked';
          if (id.includes('node_modules/vis-network')) return 'vendor.vis-network';
          // Fallback: other node_modules grouped into vendor
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
  },
})
