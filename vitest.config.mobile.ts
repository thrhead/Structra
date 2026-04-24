import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  define: {
    '__DEV__': true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './apps/mobile/src'),
      'react-native': 'react-native-web',
      '@react-native-async-storage/async-storage': path.resolve(__dirname, 'apps/mobile/node_modules/@react-native-async-storage/async-storage'),
      '@react-native-community/netinfo': path.resolve(__dirname, 'apps/mobile/node_modules/@react-native-community/netinfo'),
      '@testing-library/react-native': path.resolve(__dirname, 'apps/mobile/node_modules/@testing-library/react-native'),
    },
    extensions: ['.web.js', '.web.jsx', '.web.ts', '.web.tsx', '.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['apps/mobile/src/**/__tests__/**/*.{js,ts,jsx,tsx}'],
    server: {
      deps: {
        external: [/node_modules\/@testing-library\/react-native/],
        inline: [
          'react-native-web',
          '@react-native-async-storage/async-storage',
          '@react-native-community/netinfo',
          '@testing-library/react-native',
          'expo-modules-core',
          'expo-linear-gradient',
        ],
      },
    },
  },
})
