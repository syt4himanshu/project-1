import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const devApiProxyTarget = env.VITE_DEV_API_PROXY_TARGET || 'http://localhost:5002'

  return {
    plugins: [
      tailwindcss(),
      react(),
      VitePWA({
        registerType: 'prompt',
        injectRegister: 'auto',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'favicon.svg', 'icons.svg', 'site.webmanifest'],
        manifest: {
          name: 'KYS',
          short_name: 'KYS',
          description: 'KYS Platform',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: '/android-chrome-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg}'],
          globIgnores: ['**/Step7SWOC-*.js'],
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/api/],
        },
      }),
    ],
    optimizeDeps: {
      include: ['country-state-city'],
    },
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
  }
})

