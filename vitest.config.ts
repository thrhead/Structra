import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'next/navigation': 'next/navigation.js',
      // Force local versions
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom/client': path.resolve(__dirname, 'node_modules/react-dom/client.js'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/apps/mobile/**', '**/e2e/**', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**', '**/.agent/**'],
    server: {
      deps: {
        inline: ['next-intl'],
      },
    },
    deps: {
      optimizer: {
        web: {
          include: ['react', 'react-dom'],
        },
      },
    },
  },
})
