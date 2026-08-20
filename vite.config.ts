/// <reference types="vitest/config" />
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
  },
  server: {
    open: '/landing',
    proxy: {
      '/canvas': 'http://127.0.0.1:4302',
      '/generate-code': 'http://127.0.0.1:4302',
      '/layout': 'http://127.0.0.1:4302',
      '/health': 'http://127.0.0.1:4302',
      '/generate': 'http://127.0.0.1:4302',
      '/api': 'http://127.0.0.1:4301',
    },
  },
})
