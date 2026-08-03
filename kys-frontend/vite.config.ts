import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

const devApiProxyTarget = process.env.VITE_DEV_API_PROXY_TARGET || 'http://localhost:5002'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: devApiProxyTarget,
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/testing/setup.ts',
    globals: true,
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/testing/**', 'src/main.tsx', 'src/app/main.tsx'],
    },
  },
})
