import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    copyPublicDir: false,
    lib: {
      entry: [
        resolve(__dirname, 'lib/main.js'),
        resolve(__dirname, 'lib/utils/utils.js')
      ],
      formats: ['es']
    },
    rollupOptions: {
      external: ['vue', 'axios', 'pinia']
    }
  },
  server: {
    proxy: {
      '/room': 'http://localhost:8080',
      '/game-ws': {
        target: 'ws://localhost:8080',
        changeOrigin: true,
        ws: true
      }
    }
  },
  define: {
    'env.VGR_BASE': 'import.meta.env.BASE_URL'
  },
})
