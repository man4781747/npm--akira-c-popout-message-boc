import { defineConfig } from 'vite'
import postcssNesting from 'postcss-nesting';
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

// build:lib 依序以三種 mode 建置（UMD 只能有單一入口）：
// Built three times by build:lib, once per mode (UMD supports a single entry only):
// - es:       ESM，Vue 入口與 core 入口共用同一個核心 chunk；同時產生型別與 CSS 檔
// - umd-core: <script> 用的 core（全域 PopoutMessageBox，不含 Vue）
// - umd-vue:  <script> 用的 Vue 版（全域 PopoutMessageBoxVue，內含核心）
const entries = {
  'popout-message-box': resolve(__dirname, 'packages/index.ts'),
  'popout-message-box-core': resolve(__dirname, 'packages/core.ts'),
}

// 把核心以 ?inline 載入的 CSS 另外輸出成 lib/popout-message-box.css（相容舊版的 import 路徑）
// Also emit the CSS imported with ?inline as lib/popout-message-box.css (keeps the old import path working)
function emitCssFile() {
  let css = ''
  return {
    name: 'emit-css-file',
    enforce: 'post',
    transform(code, id) {
      if (id.endsWith('popoutMessageBox.css?inline')) {
        css = JSON.parse(code.replace(/^export default /, '').replace(/;?\s*$/, ''))
      }
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'popout-message-box.css', source: css })
    },
  }
}

function libOptions(mode) {
  if (mode === 'umd-core') {
    return { entry: entries['popout-message-box-core'], name: 'PopoutMessageBox', formats: ['umd'], fileName: () => 'popout-message-box-core.umd.cjs' }
  }
  if (mode === 'umd-vue') {
    return { entry: entries['popout-message-box'], name: 'PopoutMessageBoxVue', formats: ['umd'], fileName: () => 'popout-message-box.umd.cjs' }
  }
  return { entry: entries, formats: ['es'], fileName: (format, entryName) => `${entryName}.js` }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: mode === 'es'
    ? [
      // 產生型別宣告，型別入口為 lib/packages/index.d.ts 與 lib/packages/core.d.ts（見 package.json 的 exports）
      // Generate type declarations; the types entries are lib/packages/index.d.ts and lib/packages/core.d.ts (see "exports" in package.json)
      dts({
        tsconfigPath: './tsconfig.lib.json',
        outDirs: resolve(__dirname, 'lib'),
      }),
      emitCssFile(),
    ]
    : [],
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
    // 只有第一個建置（es）清空 lib/，避免刪掉前面的產物
    emptyOutDir: mode === 'es',
    lib: libOptions(mode),
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

}))
