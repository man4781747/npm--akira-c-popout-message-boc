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
      '@': resolve(__dirname, 'src'),
      'akira-c-popout-message-box': process.env.USE_BUILT_MODULE === 'true'
        ? () => {
          let targetPath = path.resolve(__dirname, 'lib/popout-message-box.js')
          console.log("[模擬正式使用] akira-c-popout-message-box 模組路徑導向至:", targetPath)
          return targetPath
        }
        : () => {
          let targetPath = path.resolve(__dirname, 'src/components/popoutMessageBox/PopoutMessagePlugin')
          console.log("[開發模式使用] akira-c-popout-message-box 模組路徑導向至:",targetPath)
          return targetPath
        },
    }
  }
})
