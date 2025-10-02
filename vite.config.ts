import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path assumes project pages: /MyBlog/
export default defineConfig({
  base: '/MyBlog/',
  plugins: [react()],
  server: {
    port: 5173
  },
  build: {
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (!id) return undefined;

          // Split large dependencies for better caching
          if (id.includes('node_modules')) {
            // React core - changes rarely
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor.react';
            }
            // Router - separate chunk for route-based code splitting
            if (id.includes('react-router')) {
              return 'vendor.router';
            }
            // Markdown processing - only loaded on content pages
            if (id.includes('marked')) {
              return 'vendor.marked';
            }
            // Monaco editor - heavy dependency
            if (id.includes('monaco-editor')) {
              return 'vendor.monaco';
            }
            // All other dependencies
            return 'vendor.misc';
          }
        },
      },
    },
  },
})
