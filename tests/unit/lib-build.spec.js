import { describe, it, expect, vi } from 'vitest'
import fs from 'fs'
import { resolve } from 'path'

const libDir = resolve(__dirname, '../../lib')

// 讓 jsdom 以 <script> 的方式執行 UMD，回傳它掛上的全域變數
function runUmd(file, globalName) {
  delete window[globalName]
  window.eval(fs.readFileSync(resolve(libDir, file), 'utf-8'))
  return window[globalName]
}

describe('建置產物 lib/', () => {
  it('Vue 版、core 版的 ESM 與 UMD，以及 CSS、型別入口都存在', () => {
    for (const file of [
      'popout-message-box.js',
      'popout-message-box.umd.cjs',
      'popout-message-box-core.js',
      'popout-message-box-core.umd.cjs',
      'popout-message-box.css',
      'packages/index.d.ts',
      'packages/core.d.ts',
    ]) {
      expect(fs.existsSync(resolve(libDir, file)), file).toBe(true)
    }
  })

  it('顯示第一則訊息時把 CSS 注入 <head>', async () => {
    vi.resetModules()
    document.head.innerHTML = ''
    const { notify } = await import('../../lib/popout-message-box-core.js')

    expect(document.head.querySelector('style')).toBeNull()
    notify.success('a')
    const css = document.head.querySelector('style').textContent
    expect(css).toContain('#popout-message-box-list')
    expect(css).toContain('.popout-card')
  })

  it('注入的 CSS 與 lib/popout-message-box.css 內容一致', async () => {
    vi.resetModules()
    document.head.innerHTML = ''
    const { notify } = await import('../../lib/popout-message-box-core.js')
    notify.success('a')

    const injected = document.head.querySelector('style').textContent
    const cssFile = fs.readFileSync(resolve(libDir, 'popout-message-box.css'), 'utf-8')
    expect(injected.trim()).toBe(cssFile.trim())
  })

  it('vue 為 external，不打包進 lib', () => {
    const esm = fs.readFileSync(resolve(libDir, 'popout-message-box.js'), 'utf-8')
    expect(esm).toMatch(/from\s*"vue"/)
  })

  it('Vue 版 ESM 直接引用 core 入口，而非另外複製一份核心', () => {
    const esm = fs.readFileSync(resolve(libDir, 'popout-message-box.js'), 'utf-8')
    expect(esm).toMatch(/from\s*"\.\/popout-message-box-core\.js"/)
  })

  it('core UMD 以全域 PopoutMessageBox 提供 notify（不需要 Vue）', () => {
    document.body.innerHTML = ''
    const lib = runUmd('popout-message-box-core.umd.cjs', 'PopoutMessageBox')

    lib.notify.success('from umd')
    expect(document.querySelector('.popout-card__title').textContent).toBe('from umd')
  })

  it('Vue 版 UMD 以全域 PopoutMessageBoxVue 提供 plugin 與 notify', async () => {
    window.Vue = await import('vue')
    const lib = runUmd('popout-message-box.umd.cjs', 'PopoutMessageBoxVue')

    expect(typeof lib.default.install).toBe('function')
    expect(typeof lib.usePopoutMessage).toBe('function')
    expect(typeof lib.notify.success).toBe('function')
    expect(window.PopoutMwessageBox).toBeUndefined()
    delete window.Vue
  })
})
