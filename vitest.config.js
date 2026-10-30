import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import postcssNesting from 'postcss-nesting';
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  css: {
    postcss: {
      plugins: [
        postcssNesting
      ],
    },
  },
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.spec.js'],
  },
})
