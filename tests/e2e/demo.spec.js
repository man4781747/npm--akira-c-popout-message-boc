import { test, expect } from '@playwright/test'

// demo 頁（src/App.vue）的按鈕都以 lifeTime = 10 秒建立訊息
const LIFE_TIME = 10_000

const list = (page) => page.locator('#popout-message-box-list')
const boxes = (page) => page.locator('#popout-message-box-list .popout-message-box')
const cards = (page) => page.locator('#popout-message-box-list .popout-card')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.getByPlaceholder('you can type some message').fill('Hello E2E')
})

test('點擊按鈕顯示訊息，標題為輸入的文字', async ({ page }) => {
  await page.getByRole('button', { name: 'Success log' }).click()

  await expect(cards(page)).toHaveCount(1)
  await expect(cards(page).first().locator('.popout-card__title')).toHaveText('Hello E2E')
  await expect(cards(page).first().locator('.popout-card__desp')).toHaveText('Success log')
})

for (const [button, cssClass] of [
  ['Success log', 'success'],
  ['Error/Fail log', 'fail'],
  ['Info log', 'info'],
  ['Warning log', 'warning'],
  ['Debug log', 'debug'],
  ['Primary log', 'primary'],
]) {
  test(`「${button}」建立 class 為 popout-card--${cssClass} 的訊息`, async ({ page }) => {
    await page.getByRole('button', { name: button }).click()

    await expect(cards(page).first()).toHaveClass(new RegExp(`(^| )popout-card--${cssClass}( |$)`))
  })
}

test('樣式已套用：容器固定於右上角', async ({ page }) => {
  await page.getByRole('button', { name: 'Info log' }).click()

  await expect(list(page)).toHaveCSS('position', 'fixed')
  await expect(list(page)).toHaveCSS('right', '0px')
  const box = await cards(page).first().boundingBox()
  const viewport = page.viewportSize()
  expect(box.x + box.width).toBeGreaterThan(viewport.width - 50)
})

test('新訊息出現在最上方', async ({ page }) => {
  const input = page.getByPlaceholder('you can type some message')
  await input.fill('first')
  await page.getByRole('button', { name: 'Info log' }).click()
  await input.fill('second')
  await page.getByRole('button', { name: 'Info log' }).click()

  await expect(cards(page).locator('.popout-card__title')).toHaveText(['second', 'first'])
})

test('標題的 count 隨訊息數更新', async ({ page }) => {
  await page.getByRole('button', { name: 'Success log' }).click()
  await page.getByRole('button', { name: 'Info log' }).click()

  await expect(page.getByRole('heading', { level: 1 })).toContainText('count: 2/10')
})

test('點擊訊息後關閉並從 DOM 移除', async ({ page }) => {
  await page.getByRole('button', { name: 'Success log' }).click()
  await cards(page).first().click()

  await expect(page.getByRole('heading', { level: 1 })).toContainText('count: 0/10')
  await expect(boxes(page)).toHaveCount(0, { timeout: 4000 })
})

test('Max Item Number 設為 2 後只保留最新的 2 則', async ({ page }) => {
  const max = page.getByRole('spinbutton')
  await max.fill('2')
  await max.dispatchEvent('change')

  const input = page.getByPlaceholder('you can type some message')
  for (const title of ['1', '2', '3']) {
    await input.fill(title)
    await page.getByRole('button', { name: 'Info log' }).click()
  }

  await expect(page.getByRole('heading', { level: 1 })).toContainText('count: 2/2')
  await expect(boxes(page)).toHaveCount(2, { timeout: 4000 })
  await expect(cards(page).locator('.popout-card__title')).toHaveText(['3', '2'])
})

test('lifeTime 到期後自動消失', async ({ page }) => {
  test.setTimeout(LIFE_TIME + 15_000)
  await page.getByRole('button', { name: 'Success log' }).click()
  await expect(cards(page)).toHaveCount(1)

  await page.waitForTimeout(LIFE_TIME - 2000)
  await expect(cards(page)).toHaveCount(1)
  await expect(boxes(page)).toHaveCount(0, { timeout: 6000 })
})

test('滑鼠懸停時不會自動消失', async ({ page }) => {
  test.setTimeout(LIFE_TIME + 15_000)
  await page.getByRole('button', { name: 'Success log' }).click()
  await cards(page).first().hover()

  await page.waitForTimeout(LIFE_TIME + 1000)
  await expect(cards(page)).toHaveCount(1)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('count: 1/10')
})
