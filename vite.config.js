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
  }
})
