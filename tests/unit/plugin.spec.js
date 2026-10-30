import { describe, it, expect, vi } from 'vitest'
import { createApp } from 'vue'
import { vueTargets, setup, boxes, flush } from './helpers.js'

describe.each(vueTargets)('Plugin 註冊 — $name', (target) => {
  it('匯出 default、PopoutMessagePlugin、usePopoutMessage、notify', async () => {
    const { mod } = await setup(target)

    expect(typeof mod.default.install).toBe('function')
    expect(typeof mod.default.usePopoutMessage).toBe('function')
    expect(typeof mod.PopoutMessagePlugin.install).toBe('function')
    expect(typeof mod.usePopoutMessage).toBe('function')
    expect(typeof mod.notify.success).toBe('function')
  })

  it('0.1.0 起不再匯出、也不再全域註冊 PopoutMessageBox 元件', async () => {
    const { app, mod } = await setup(target)

    expect(mod.PopoutMessageBox).toBeUndefined()
    expect(app.component('PopoutMessageBox')).toBeUndefined()
  })

  it('status 的 ref 與核心狀態同步', async () => {
    const { notify } = await setup(target)

    notify.success('a', '', 60)
    notify.success('b', '', 60)
    expect(notify.status.count.value).toBe(2)

    notify.setMaxItemNumber(1)
    expect(notify.status.maxItemNumber.value).toBe(1)
    expect(notify.status.count.value).toBe(1)
  })

  it('匯出的 notify 與 usePopoutMessage() 共用同一份狀態（可在元件外使用）', async () => {
    const { mod, notify } = await setup(target)

    mod.notify.success('outside component')
    expect(notify.status.count.value).toBe(1)
    expect(mod.notify.getCount()).toBe(1)
  })

  it('只安裝 PopoutMessagePlugin 也能使用通知', async () => {
    vi.resetModules()
    document.body.innerHTML = ''
    const mod = await target.load()
    let notify
    createApp({
      setup() {
        notify = mod.usePopoutMessage()
        return () => null
      },
    })
      .use(mod.PopoutMessagePlugin)
      .mount(document.createElement('div'))

    notify.success('plugin only')
    await flush()
    expect(boxes()).toHaveLength(1)
  })

  it('未安裝 plugin 時 usePopoutMessage 拋出錯誤', async () => {
    vi.resetModules()
    const mod = await target.load()
    let error
    const app = createApp({
      setup() {
        try {
          mod.usePopoutMessage()
        } catch (e) {
          error = e
        }
        return () => null
      },
    })
    app.config.warnHandler = () => {}
    app.mount(document.createElement('div'))

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toContain('PopoutMessagePlugin')
  })
})
