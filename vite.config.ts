import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      // MSW only needs tldts for cookies, which the mock doesn't use, so a minimal stub replaces it.
      tldts: path.resolve(import.meta.dirname, 'src/mocks/vendor/tldts-lite.ts'),
    },
  },
  server: { port: 5173 },
  preview: { port: 4173 },
  build: {
    sourcemap: false,
    target: 'es2022',
    rolldownOptions: {
      preserveEntrySignatures: false,
      output: { codeSplitting: { experimentalInlineCommonChunks: { maxSize: Infinity } } },
    },
  },
})
