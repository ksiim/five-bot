import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      buffer: 'buffer/',
    },
  },
  define: {
    'global': {},
    'process.env': {},
    'Buffer': ['buffer', 'Buffer'],
  },
  optimizeDeps: {
    include: ['buffer'],
  },
})