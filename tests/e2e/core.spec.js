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
