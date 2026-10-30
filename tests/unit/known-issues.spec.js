// 專案概覽（doc/專案概覽.html）第 6 節記錄的已知問題
// 這些測試描述「正確行為」，在問題修好之前會失敗
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { allTargets, setup, boxes, titles, card, flush, advance, fire } from './helpers.js'

describe.each(allTargets)('已知問題 — $name', (target) => {
  let notify, count

  beforeEach(async () => {
    vi.useFakeTimers()
    ;({ notify, count } = await setup(target))
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('[A] 點擊關閉後滑鼠移開，status.count 不應被重複扣減', async () => {
    notify.info('keep', '', 60)
    notify.success('target', '', 5)
    await flush()
    const el = card(boxes()[0])

    await advance(4990) // 剩 10ms
    fire(el, 'mouseenter')
    el.click()
    fire(el, 'mouseleave')
    await advance(100)

    expect(count()).toBe(1)
  })

  it('[F] 建立訊息時不應輸出 console.log', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    notify.success('quiet')
    await flush()

    expect(log).not.toHaveBeenCalled()
  })

  it.each([0, -1, NaN, 1.5])('[I] setMaxItemNumber(%s) 應拋出 RangeError', (value) => {
    expect(() => notify.setMaxItemNumber(value)).toThrow(RangeError)
  })

  it('[I] 調低上限時應立即關閉最舊的多餘訊息', async () => {
    for (const title of ['1', '2', '3', '4', '5']) {
      notify.success(title, '', 60)
      await flush()
    }

    notify.setMaxItemNumber(2)
    await flush()
    expect(count()).toBe(2)
    await advance(2000)
    expect(titles()).toEqual(['5', '4'])
  })

  it('[J] 同一個 tick 內連續建立超過上限時，應關閉被擠出的訊息', async () => {
    notify.setMaxItemNumber(1)
    notify.success('a', '', 60)
    notify.success('b', '', 60)
    await flush()

    expect(count()).toBe(1)
    await advance(2000)
    expect(titles()).toEqual(['b'])
  })
})
