// 設定（configure）、不自動關閉（lifeTime 0）、控制物件（close / update）與 clear
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { allTargets, setup, container, boxes, titles, card, flush, advance, fire } from './helpers.js'

describe.each(allTargets)('設定與控制物件 — $name', (target) => {
  let mod, notify, count

  beforeEach(async () => {
    vi.useFakeTimers()
    ;({ mod, notify, count } = await setup(target))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('configure', () => {
    it('預設設定為 max 10、duration 5、position top-right', () => {
      expect(mod.notify.getConfig()).toEqual({ max: 10, duration: 5, position: 'top-right' })
    })

    it('只套用有傳入的欄位', () => {
      notify.configure({ duration: 3 })

      expect(mod.notify.getConfig()).toEqual({ max: 10, duration: 3, position: 'top-right' })
    })

    it('max 與 setMaxItemNumber / getMaxItemNumber 同步', () => {
      notify.configure({ max: 4 })

      expect(notify.getMaxItemNumber()).toBe(4)
    })

    it.each([
      [{ max: 0 }],
      [{ duration: -1 }],
      [{ duration: NaN }],
      [{ position: 'middle' }],
    ])('不合法的值 %o 拋出 RangeError', (options) => {
      expect(() => notify.configure(options)).toThrow(RangeError)
    })

    it('有任一欄位不合法時，其他欄位也不套用', () => {
      expect(() => notify.configure({ max: 3, position: 'middle' })).toThrow(RangeError)

      expect(mod.notify.getConfig().max).toBe(10)
    })

    it('duration 作為未指定 lifeTime 時的顯示秒數', async () => {
      notify.configure({ duration: 2 })
      notify.success('a')

      await advance(1999)
      expect(count()).toBe(1)
      await advance(1)
      expect(count()).toBe(0)
    })

    it('position 套用到容器的 class', () => {
      notify.configure({ position: 'bottom-left' })
      notify.success('a')

      expect(container().className).toBe('popout-position--bottom-left')
    })

    it('容器已存在時修改 position 會立即套用', () => {
      notify.success('a')
      notify.configure({ position: 'top-center' })

      expect(container().className).toBe('popout-position--top-center')
    })
  })

  describe('lifeTime 0（不自動關閉）', () => {
    it('lifeTime 0 不會自動關閉，也不顯示倒數遮罩', async () => {
      notify.error('重要錯誤', '', 0)

      await advance(60_000)
      expect(count()).toBe(1)
      expect(boxes()[0].querySelector('.popout-card__time-mask').hidden).toBe(true)
    })

    it('懸停後移開也不會開始計時', async () => {
      notify.error('重要錯誤', '', 0)
      const el = card(boxes()[0])

      fire(el, 'mouseenter')
      fire(el, 'mouseleave')
      await advance(60_000)
      expect(count()).toBe(1)
    })

    it('仍可點擊關閉', () => {
      notify.error('重要錯誤', '', 0)
      card(boxes()[0]).click()

      expect(count()).toBe(0)
    })

    it('duration 0 讓所有未指定 lifeTime 的訊息都不自動關閉', async () => {
      notify.configure({ duration: 0 })
      notify.info('a')

      await advance(60_000)
      expect(count()).toBe(1)
    })

    it.each([-1, NaN])('lifeTime %s 拋出 RangeError', (value) => {
      expect(() => notify.info('a', '', value)).toThrow(RangeError)
    })
  })

  describe('控制物件', () => {
    it('close() 立即開始關閉，重複呼叫沒有影響', async () => {
      const msg = notify.info('a', '', 60)
      notify.info('b', '', 60)

      msg.close()
      msg.close()
      expect(count()).toBe(1)
      await advance(2000)
      expect(titles()).toEqual(['b'])
    })

    it('update() 修改文字與類型', () => {
      const msg = notify.info('上傳中…', '請稍候', 0)

      msg.update({ type: 'error', mainString: '上傳失敗', despString: '網路錯誤' })
      const el = card(boxes()[0])
      expect(el.classList.contains('popout-card--fail')).toBe(true)
      expect(el.classList.contains('popout-card--info')).toBe(false)
      expect(el.querySelector('.popout-card__title').textContent).toBe('上傳失敗')
      expect(el.querySelector('.popout-card__desp').textContent).toBe('網路錯誤')
    })

    it('update() 只改有傳入的欄位', () => {
      const msg = notify.info('標題', '說明', 0)

      msg.update({ mainString: '新標題' })
      expect(boxes()[0].querySelector('.popout-card__desp').textContent).toBe('說明')
    })

    it('update() 以原本的 lifeTime 重新計時', async () => {
      const msg = notify.info('a', '', 5)

      await advance(4000)
      msg.update({ mainString: 'b' })
      await advance(4999)
      expect(count()).toBe(1)
      await advance(1)
      expect(count()).toBe(0)
    })

    it('update() 以新的 lifeTime 重新計時（處理中 → 完成）', async () => {
      const msg = notify.info('上傳中…', '', 0)

      await advance(60_000)
      msg.update({ type: 'success', mainString: '上傳完成', lifeTime: 3 })
      expect(boxes()[0].querySelector('.popout-card__time-mask').hidden).toBe(false)
      await advance(2999)
      expect(count()).toBe(1)
      await advance(1)
      expect(count()).toBe(0)
    })

    it('update() 改成 lifeTime 0 後不再自動關閉', async () => {
      const msg = notify.info('a', '', 5)

      msg.update({ lifeTime: 0 })
      await advance(60_000)
      expect(count()).toBe(1)
    })

    it('懸停中 update() 會保持暫停，移開後才以新的時間計時', async () => {
      const msg = notify.info('a', '', 5)
      const el = card(boxes()[0])

      fire(el, 'mouseenter')
      msg.update({ lifeTime: 2 })
      await advance(10_000)
      expect(count()).toBe(1)

      fire(el, 'mouseleave')
      await advance(1999)
      expect(count()).toBe(1)
      await advance(1)
      expect(count()).toBe(0)
    })

    it('update() 不合法的 type 或 lifeTime 拋出 RangeError', () => {
      const msg = notify.info('a', '', 0)

      expect(() => msg.update({ type: 'fail' })).toThrow(RangeError)
      expect(() => msg.update({ lifeTime: -1 })).toThrow(RangeError)
    })

    it('已開始關閉的訊息 update() 沒有任何變化', () => {
      const msg = notify.info('a', '', 0)
      msg.close()

      expect(() => msg.update({ mainString: 'b', type: 'nope' })).not.toThrow()
      expect(boxes()[0].querySelector('.popout-card__title').textContent).toBe('a')
    })
  })

  describe('clear', () => {
    it('關閉所有顯示中的訊息', async () => {
      notify.info('a', '', 0)
      notify.info('b', '', 60)
      notify.info('c')

      notify.clear()
      expect(count()).toBe(0)
      await advance(2000)
      expect(boxes()).toHaveLength(0)
    })

    it('沒有訊息時呼叫也不會出錯', () => {
      expect(() => notify.clear()).not.toThrow()
    })
  })

  it('Vue 的 status 隨 configure 與 clear 同步', async () => {
    if (target.kind !== 'vue') return
    notify.info('a', '', 0)
    notify.configure({ max: 4 })
    await flush()
    expect(notify.status.maxItemNumber.value).toBe(4)

    notify.clear()
    expect(notify.status.count.value).toBe(0)
  })
})
