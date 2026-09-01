import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { localRustPlugin } from './vite-plugin-local-rust'

export default defineConfig({
  plugins: [react(), localRustPlugin()],
  esbuild: {
    drop: ['console', 'debugger'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/src/data/generated/')) {
            const match = id.match(/\/src\/data\/generated\/([^/.]+)\.ts/)
            if (match && match[1] !== 'index') {
              return `questions-${match[1]}`
            }
            return
          }
          if (!id.includes('node_modules')) return

          if (id.includes('@supabase')) return 'supabase'
          if (id.includes('monaco-editor') || id.includes('@monaco-editor')) return 'monaco'
          if (id.includes('prism-react-renderer') || id.includes('/prismjs/')) {
            return 'prism'
          }
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router') ||
            id.includes('node_modules/scheduler/')
          ) {
            return 'react'
          }
        },
      },
    },
  },
})
