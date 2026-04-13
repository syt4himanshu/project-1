import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: '/student/',
    plugins: [react()],
    server: {
        port: 5173,
        strictPort: true,
        hmr: {
            clientPort: 3005,
        },
        proxy: {
            '/api': {
                target: 'http://localhost:5002',
                changeOrigin: true,
            },
        },
    },
})
