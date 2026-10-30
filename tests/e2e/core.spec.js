import { test, expect } from '@playwright/test'

// 不使用 Vue 的頁面（tests/e2e/fixtures/core.html）直接呼叫 akira-c-popout-message-box/core
const list = (page) => page.locator('#popout-message-box-list')
const boxes = (page) => page.locator('#popout-message-box-list .popout-message-box')
const cards = (page) => page.locator('#popout-message-box-list .popout-card')

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/e2e/fixtures/core.html')
})

test('沒有 Vue 的頁面也能顯示訊息', async ({ page }) => {
  await page.locator('#success').click()

  expect(await page.evaluate(() => window.__noVue)).toBe(true)
  await expect(cards(page)).toHaveCount(1)
  await expect(cards(page).first()).toHaveClass(/(^| )popout-card--success( |$)/)
  await expect(cards(page).first().locator('.popout-card__title')).toHaveText('Hello core')
  await expect(cards(page).first().locator('.popout-card__desp')).toHaveText('core success')
})

test('樣式已注入並套用', async ({ page }) => {
  await page.locator('#error').click()

  await expect(list(page)).toHaveCSS('position', 'fixed')
  await expect(cards(page).first()).toHaveCSS('border-left-width', '5px')
  await expect(cards(page).first().locator('.popout-card__body')).toHaveCSS('padding', '16px')
})

test('進場動畫結束後卡片停在定位', async ({ page }) => {
  await page.locator('#success').click()

  await expect(cards(page).first()).toHaveCSS('transform', /none|matrix\(1, 0, 0, 1, 0, 0\)/)
})

test('subscribe 讓頁面上的計數同步更新', async ({ page }) => {
  await page.locator('#success').click()
  await page.locator('#error').click()
  await expect(page.locator('#count')).toHaveText('2')

  await cards(page).first().click()
  await expect(page.locator('#count')).toHaveText('1')
})

test('點擊訊息後關閉並從 DOM 移除', async ({ page }) => {
  await page.locator('#success').click()
  await cards(page).first().click()

  await expect(boxes(page)).toHaveCount(0, { timeout: 4000 })
})

test('調低上限時立即只保留最新的訊息', async ({ page }) => {
  for (const title of ['1', '2', '3']) {
    await page.locator('#msg').fill(title)
    await page.locator('#success').click()
  }
  await page.locator('#max2').click()

  await expect(page.locator('#count')).toHaveText('2')
  await expect(boxes(page)).toHaveCount(2, { timeout: 4000 })
  await expect(cards(page).locator('.popout-card__title')).toHaveText(['3', '2'])
})

// 六個位置：容器貼齊對應的角落 / 邊緣，下方位置時新訊息在最下面
for (const [position, horizontal, vertical] of [
  ['top-left', 'left', 'top'],
  ['top-center', 'center', 'top'],
  ['top-right', 'right', 'top'],
  ['bottom-left', 'left', 'bottom'],
  ['bottom-center', 'center', 'bottom'],
  ['bottom-right', 'right', 'bottom'],
]) {
  test(`position: ${position}`, async ({ page }) => {
    await page.evaluate((position) => {
      window.notify.configure({ position })
      window.notify.info('old', '', 0)
      window.notify.info('new', '', 0)
    }, position)
    await expect(cards(page)).toHaveCount(2)
    // 等進場動畫結束
    await expect(cards(page).first()).toHaveCSS('transform', /none|matrix\(1, 0, 0, 1, 0, 0\)/)
    await page.waitForTimeout(600)

    const viewport = page.viewportSize()
    const box = await list(page).boundingBox()
    if (horizontal === 'left') expect(box.x).toBeLessThan(50)
    if (horizontal === 'right') expect(box.x + box.width).toBeGreaterThan(viewport.width - 50)
    if (horizontal === 'center') {
      expect(Math.abs(box.x + box.width / 2 - viewport.width / 2)).toBeLessThan(5)
    }
    if (vertical === 'top') expect(box.y).toBeLessThan(viewport.height / 2)
    if (vertical === 'bottom') expect(box.y + box.height).toBeGreaterThan(viewport.height - 50)

    const newY = (await cards(page).filter({ hasText: 'new' }).boundingBox()).y
    const oldY = (await cards(page).filter({ hasText: 'old' }).boundingBox()).y
    if (vertical === 'top') expect(newY).toBeLessThan(oldY)
    if (vertical === 'bottom') expect(newY).toBeGreaterThan(oldY)
  })
}

test('update() 改變內容後卡片高度跟著調整', async ({ page }) => {
  await page.evaluate(() => {
    window.msg = window.notify.info('短', '', 0)
  })
  await page.waitForTimeout(600)
  const before = (await cards(page).first().boundingBox()).height

  await page.evaluate(() => {
    window.msg.update({ despString: '很長的說明文字 '.repeat(20) })
  })
  await page.waitForTimeout(100)
  const after = (await cards(page).first().boundingBox()).height
  expect(after).toBeGreaterThan(before)
  // 內容沒有被固定高度裁切
  const clipped = await cards(page).first().evaluate((el) => el.scrollHeight > el.clientHeight + 1)
  expect(clipped).toBe(false)
})

test('clear() 關閉所有訊息', async ({ page }) => {
  await page.evaluate(() => {
    window.notify.info('a', '', 0)
    window.notify.info('b', '', 0)
    window.notify.clear()
  })

  await expect(page.locator('#count')).toHaveText('0')
  await expect(boxes(page)).toHaveCount(0, { timeout: 4000 })
})
