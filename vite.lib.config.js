import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import postcssNesting from 'postcss-nesting';
import fs from 'fs'
import path from 'path'
import { resolve } from 'path'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
    {
      name: 'inject-css-content',
      transform(code, id) {
        // 只在入口文件添加 CSS 內容
        // Only add CSS content to entry file
        if (id.endsWith('packages/index.js')) {
          // 讀取 CSS 文件內容
          // Read CSS file content
          const cssPath = path.resolve(__dirname, 'lib/popout-message-box.css')
          const cssContent = fs.existsSync(cssPath) 
            ? fs.readFileSync(cssPath, 'utf-8')
            : ''
          return {
            code: `${code};const style = document.createElement('style')
style.textContent = \`${cssContent}\`
document.head.appendChild(style);`,
            map: null
          }
        }
      }
    }
  ],
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

  build: {
    outDir: 'lib',
    cssCodeSplit: false,
    lib: {
      // entry: resolve(__dirname, 'packages/index.js'),
      entry: './packages/index.js',
      name: 'PopoutMwessageBox',
      fileName: 'popout-message-box',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        },
        exports: 'named'
      }
    }
  },

})
