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
          // Avoid splitting React and related routing libraries into separate chunks.
          // Splitting them can create circular initialization issues where one chunk
          // references the other before it's initialized (see runtime `memo` undefined).
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router') || id.includes('node_modules/react-router-dom')) {
            return 'vendor.react';
          }
          if (id.includes('node_modules/marked')) return 'vendor.marked';
          if (id.includes('node_modules/vis-network')) return 'vendor.vis-network';
          // Fallback: other node_modules grouped into vendor
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
  },
})
