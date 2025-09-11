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
          // Split vis-network into up to 4 chunks by hashing the module id so
          // that the large dist bundle is divided into smaller, cacheable files.
          if (id.includes('node_modules/vis-network')) {
            // simple hash: sum char codes
            let h = 0;
            for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i)) | 0;
            const idx = Math.abs(h) % 4 + 1; // 1..4
            return `vis-network-${idx}`;
          }
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
  },
})
