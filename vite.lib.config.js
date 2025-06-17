import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import postcssNesting from 'postcss-nesting';
import { resolve } from 'path'


// https://vitejs.dev/config/
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

  build: {
    outDir: 'lib',
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
        }
      }
    }
  },

})
