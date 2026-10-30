import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { allTargets, setup, boxes, card, flush, advance, fire } from './helpers.js'

describe.each(allTargets)('元件行為 — $name', (target) => {
  let notify, count

  beforeEach(async () => {
    vi.useFakeTimers()
    ;({ notify, count } = await setup(target))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('lifeTime 預設 5 秒後開始關閉', async () => {
    notify.success('auto')
    await flush()

    await advance(4999)
    expect(count()).toBe(1)
    await advance(1)
    expect(count()).toBe(0)
  })

  it('依自訂 lifeTime（秒）開始關閉', async () => {
    notify.success('custom', '', 2)
    await flush()

    await advance(1999)
    expect(count()).toBe(1)
    await advance(1)
    expect(count()).toBe(0)
  })

  it('開始關閉 2 秒後從 DOM 移除', async () => {
    notify.success('remove', '', 1)
    await flush()
    const box = boxes()[0]

    await advance(1000)
    expect(box.isConnected).toBe(true)
    await advance(1999)
    expect(box.isConnected).toBe(true)
    await advance(1)
    expect(box.isConnected).toBe(false)
    expect(boxes()).toHaveLength(0)
  })

  it('滑鼠懸停時暫停計時，移開後以剩餘時間繼續', async () => {
    notify.success('hover', '', 5)
    await flush()
    const el = card(boxes()[0])

    await advance(3000)
    fire(el, 'mouseenter')
    await advance(10000)
    expect(count()).toBe(1)

    fire(el, 'mouseleave')
    await advance(1999)
    expect(count()).toBe(1)
    await advance(1)
    expect(count()).toBe(0)
  })

  it('懸停時倒數遮罩動畫暫停', async () => {
    notify.success('mask')
    await flush()
    const el = card(boxes()[0])
    const mask = el.querySelector('.popout-card__time-mask')

    expect(mask.classList.contains('popout-card__time-mask--stop')).toBe(false)
    fire(el, 'mouseenter')
    await flush()
    expect(mask.classList.contains('popout-card__time-mask--stop')).toBe(true)
  })

  it('點擊訊息立即開始關閉', async () => {
    notify.success('click', '', 60)
    await flush()
    const box = boxes()[0]

    card(box).click()
    expect(count()).toBe(0)
    await advance(2000)
    expect(box.isConnected).toBe(false)
  })
})
