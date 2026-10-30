import { createApp, nextTick } from 'vue'
import { vi } from 'vitest'

// Vue 入口：分別對「原始碼」與「建置產物 lib/」執行
// Vue entry: run against both the source and the built lib/
export const vueTargets = [
  { kind: 'vue', name: 'vue src (packages/index.ts)', load: () => import('../../packages/index.ts') },
  { kind: 'vue', name: 'vue lib (lib/popout-message-box.js)', load: () => import('../../lib/popout-message-box.js') },
]

// 不依賴框架的 core 入口
// Framework-agnostic core entry
export const coreTargets = [
  { kind: 'core', name: 'core src (packages/core.ts)', load: () => import('../../packages/core.ts') },
  { kind: 'core', name: 'core lib (lib/popout-message-box-core.js)', load: () => import('../../lib/popout-message-box-core.js') },
]

export const allTargets = [...vueTargets, ...coreTargets]

/**
 * 每個測試重新載入模組，避免模組層級的狀態互相影響
 * 回傳 notify（Vue 為 usePopoutMessage() 取得的服務，core 為 notify）與讀取目前數量的 count()
 */
export async function setup(target) {
  vi.resetModules()
  document.head.innerHTML = ''
  document.body.innerHTML = ''
  const mod = await target.load()

  if (target.kind === 'core') {
    return { mod, notify: mod.notify, count: () => mod.notify.getCount() }
  }

  let notify
  const app = createApp({
    setup() {
      notify = mod.usePopoutMessage()
      return () => null
    },
  })
  app.use(mod.default)
  app.mount(document.createElement('div'))
  return { mod, app, notify, count: () => notify.status.count.value }
}

export const container = () => document.getElementById('popout-message-box-list')

// 依畫面順序（最上方 = 最新）回傳每則訊息的外層 div
export const boxes = () => Array.from(container()?.children ?? [])

export const titles = () => boxes().map((box) => box.querySelector('.popout-card__title')?.textContent)

export const card = (box) => box.querySelector('.popout-card')

// 等待 Vue 的響應式更新（core 不需要，但等待也無害）
export const flush = () => nextTick()

export const advance = (ms) => vi.advanceTimersByTimeAsync(ms)

export const fire = (el, type) => el.dispatchEvent(new MouseEvent(type))
