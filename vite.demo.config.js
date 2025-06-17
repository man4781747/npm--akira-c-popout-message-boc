import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import postcssNesting from 'postcss-nesting';
import { viteSingleFile } from "vite-plugin-singlefile"
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue(),viteSingleFile(),],
  css: {
    postcss: {
      plugins: [
        postcssNesting
      ],
    },
  },
  build: {
    outDir: 'dist', // 避免污染 lib/
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
