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
          // Group vis-network into a single chunk for better caching and
          // predictable output size. Other node_modules go into 'vendor'.
          if (id.includes('node_modules/vis-network')) return 'vis-network';
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
  },
})
