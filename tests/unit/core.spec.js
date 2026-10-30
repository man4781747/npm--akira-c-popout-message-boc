import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import fs from 'fs'
import { resolve } from 'path'
import { coreTargets, setup, advance } from './helpers.js'

describe.each(coreTargets)('core 狀態 API — $name', (target) => {
  let notify

  beforeEach(async () => {
    vi.useFakeTimers()
    ;({ notify } = await setup(target))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('getCount 回傳顯示中的訊息數', async () => {
    expect(notify.getCount()).toBe(0)
    notify.success('a', '', 1)
    notify.info('b', '', 60)
    expect(notify.getCount()).toBe(2)

    await advance(1000)
    expect(notify.getCount()).toBe(1)
  })

  it('subscribe 在建立、關閉、設定上限時收到最新狀態', async () => {
    const states = []
    notify.subscribe((state) => states.push(state))

    notify.success('a', '', 1)
    await advance(1000)
    notify.setMaxItemNumber(3)

    expect(states).toEqual([
      { count: 1, maxItemNumber: 10 },
      { count: 0, maxItemNumber: 10 },
      { count: 0, maxItemNumber: 3 },
    ])
  })

  it('subscribe 回傳的函數可取消訂閱', () => {
    const listener = vi.fn()
    const unsubscribe = notify.subscribe(listener)

    notify.success('a')
    unsubscribe()
    notify.success('b')

    expect(listener).toHaveBeenCalledTimes(1)
  })
})

describe('core 不依賴 Vue', () => {
  it('src 核心模組沒有 import vue', async () => {
    const src = fs.readFileSync(resolve(__dirname, '../../src/components/popoutMessageBox/popoutMessageCore.ts'), 'utf-8')
    expect(src).not.toMatch(/from ['"]vue['"]/)
  })

  it('lib core（ESM 與 UMD）沒有引用 vue', async () => {
    for (const file of ['popout-message-box-core.js', 'popout-message-box-core.umd.cjs']) {
      const code = fs.readFileSync(resolve(__dirname, '../../lib', file), 'utf-8')
      expect(code, file).not.toMatch(/from\s*["']vue["']|require\(["']vue["']\)/)
    }
  })
})

describe('lib 的 Vue 入口與 core 入口共用同一份狀態', () => {
  it('從 core 建立訊息，Vue 入口匯出的 notify 也看得到', async () => {
    vi.resetModules()
    document.body.innerHTML = ''
    const core = await import('../../lib/popout-message-box-core.js')
    const vue = await import('../../lib/popout-message-box.js')

    core.notify.success('shared')
    expect(vue.notify.getCount()).toBe(1)
    expect(vue.notify).toBe(core.notify)
  })
})
