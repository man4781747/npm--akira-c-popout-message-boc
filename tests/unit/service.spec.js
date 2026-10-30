import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { allTargets, setup, container, boxes, titles, card, flush, advance } from './helpers.js'

describe.each(allTargets)('服務 API — $name', (target) => {
  let notify, count

  beforeEach(async () => {
    vi.useFakeTimers()
    ;({ notify, count } = await setup(target))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it.each([
    ['success', 'success'],
    ['error', 'fail'],
    ['info', 'info'],
    ['warning', 'warning'],
    ['debug', 'debug'],
    ['primary', 'primary'],
  ])('%s() 建立 class 為 popout-card--%s 的卡片並顯示文字', async (method, cssClass) => {
    notify[method]('主訊息', '補充說明')
    await flush()

    const box = boxes()[0]
    expect(box.classList.contains('popout-message-box')).toBe(true)
    expect(card(box).classList.contains(`popout-card--${cssClass}`)).toBe(true)
    expect(box.querySelector('.popout-card__title').textContent).toBe('主訊息')
    expect(box.querySelector('.popout-card__desp').textContent).toBe('補充說明')
  })

  it('despString 可省略', async () => {
    notify.info('只有主訊息')
    await flush()

    expect(boxes()[0].querySelector('.popout-card__desp').textContent).toBe('')
  })

  it('所有訊息都放在 body 下唯一的 #popout-message-box-list', async () => {
    notify.success('a')
    notify.success('b')
    await flush()

    expect(document.querySelectorAll('#popout-message-box-list')).toHaveLength(1)
    expect(container().parentElement).toBe(document.body)
    expect(boxes()).toHaveLength(2)
  })

  it('新訊息出現在最上方', async () => {
    notify.success('first')
    notify.success('second')
    notify.success('third')
    await flush()

    expect(titles()).toEqual(['third', 'second', 'first'])
  })

  it('顯示數量隨建立的訊息數增加', async () => {
    expect(count()).toBe(0)
    notify.success('a')
    notify.error('b')
    await flush()

    expect(count()).toBe(2)
  })

  it('getMaxItemNumber 預設為 10', () => {
    expect(notify.getMaxItemNumber()).toBe(10)
  })

  it('setMaxItemNumber 後 getMaxItemNumber 回傳新值', () => {
    notify.setMaxItemNumber(3)

    expect(notify.getMaxItemNumber()).toBe(3)
  })

  it('第一則訊息顯示時把樣式注入 <head>（只注入一次）', async () => {
    expect(document.getElementById('popout-message-box-style')).toBeNull()
    notify.success('a')
    notify.success('b')
    await flush()

    expect(document.head.querySelectorAll('#popout-message-box-style')).toHaveLength(1)
  })

  it('超過上限時關閉最舊的訊息', async () => {
    notify.setMaxItemNumber(2)
    for (const title of ['1', '2', '3']) {
      notify.success(title, '', 60)
      await flush()
    }

    expect(count()).toBe(2)
    await advance(2000)
    expect(titles()).toEqual(['3', '2'])
  })
})
