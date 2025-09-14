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
          // Simpler grouping: put all third-party modules into a single 'vendor' chunk.
          // This prevents React/ReactDOM from being split into separate chunks which
          // can lead to runtime errors (e.g. reading internal symbols like `memo` on
          // an undefined module when duplicates are loaded).
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
})
