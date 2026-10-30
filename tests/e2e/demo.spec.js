import { test, expect } from '@playwright/test'

// Vue 說明頁（src/App.vue）。以 data-testid 定位，避免受中英切換影響
const list = (page) => page.locator('#popout-message-box-list')
const boxes = (page) => page.locator('#popout-message-box-list .popout-message-box')
const cards = (page) => page.locator('#popout-message-box-list .popout-card')
const byId = (page, id) => page.getByTestId(id)

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('語言切換', () => {
  test('預設依瀏覽器語言（en-US）顯示英文', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.getByRole('heading', { level: 2 }).first()).toHaveText('Playground')
  })

  test('切換為中文後內容與 html lang 改變，重新整理後仍記得', async ({ page }) => {
    await byId(page, 'lang-zh').click()
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh-Hant-TW')
    await expect(page.getByRole('heading', { level: 2 }).first()).toHaveText('互動示範')

    await page.reload()
    await expect(byId(page, 'lang-zh')).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByRole('heading', { level: 2 }).first()).toHaveText('互動示範')
  })

  test('未修改的預設文字會跟著切換語言', async ({ page }) => {
    await byId(page, 'lang-zh').click()
    await expect(byId(page, 'main-string')).toHaveValue('哈囉！')
  })
})

test.describe('顯示訊息', () => {
  for (const [type, cssClass] of [
    ['success', 'success'],
    ['error', 'fail'],
    ['info', 'info'],
    ['warning', 'warning'],
    ['debug', 'debug'],
    ['primary', 'primary'],
  ]) {
    test(`${type} 按鈕建立 popout-card--${cssClass}`, async ({ page }) => {
      await byId(page, `show-${type}`).click()

      await expect(cards(page).first()).toHaveClass(new RegExp(`(^| )popout-card--${cssClass}( |$)`))
    })
  }

  test('使用輸入的文字與 lifeTime，並顯示對應的程式碼', async ({ page }) => {
    await byId(page, 'main-string').fill("It's E2E")
    await byId(page, 'desp-string').fill('desc')
    await byId(page, 'life-time').fill('3')
    await byId(page, 'show-success').click()

    await expect(cards(page).first().locator('.popout-card__title')).toHaveText("It's E2E")
    await expect(cards(page).first().locator('.popout-card__desp')).toHaveText('desc')
    await expect(byId(page, 'last-code')).toHaveText("notify.success('It\\'s E2E', 'desc', 3)")
  })

  test('程式碼區塊有語法上色', async ({ page }) => {
    await byId(page, 'show-info').click()

    await expect(byId(page, 'last-code').locator('.token').first()).toBeVisible()
  })

  test('樣式已套用：容器固定於畫面上', async ({ page }) => {
    await byId(page, 'show-info').click()

    await expect(list(page)).toHaveCSS('position', 'fixed')
  })

  test('狀態區的顯示數量隨訊息更新', async ({ page }) => {
    await byId(page, 'show-success').click()
    await byId(page, 'show-info').click()

    await expect(byId(page, 'status-count')).toHaveText('2')
  })

  test('點擊訊息後關閉並從 DOM 移除', async ({ page }) => {
    await byId(page, 'show-success').click()
    await cards(page).first().click()

    await expect(byId(page, 'status-count')).toHaveText('0')
    await expect(boxes(page)).toHaveCount(0, { timeout: 4000 })
  })

  test('lifeTime 到期後自動消失', async ({ page }) => {
    await byId(page, 'life-time').fill('1')
    await byId(page, 'show-success').click()

    await expect(cards(page)).toHaveCount(1)
    await expect(boxes(page)).toHaveCount(0, { timeout: 5000 })
  })

  test('滑鼠懸停時不會自動消失', async ({ page }) => {
    await byId(page, 'life-time').fill('1')
    await byId(page, 'show-success').click()
    await cards(page).first().hover()

    await page.waitForTimeout(2500)
    await expect(byId(page, 'status-count')).toHaveText('1')
  })

  test('lifeTime 0 不會自動消失', async ({ page }) => {
    await byId(page, 'life-time').fill('0')
    await byId(page, 'show-error').click()
    await page.mouse.move(0, 0)

    await page.waitForTimeout(6000)
    await expect(byId(page, 'status-count')).toHaveText('1')
  })
})

test.describe('設定', () => {
  test('選擇位置後容器移動，並顯示 configure 程式碼', async ({ page }) => {
    await byId(page, 'position-bottom-left').click()
    await byId(page, 'show-info').click()

    await expect(list(page)).toHaveClass('popout-position--bottom-left')
    await expect(byId(page, 'position-bottom-left')).toHaveAttribute('aria-pressed', 'true')
    await expect(byId(page, 'status-position')).toHaveText('bottom-left')
  })

  test('max 設為 2 後只保留最新的 2 則', async ({ page }) => {
    await byId(page, 'max-input').fill('2')
    await byId(page, 'max-input').dispatchEvent('change')
    for (const title of ['1', '2', '3']) {
      await byId(page, 'main-string').fill(title)
      await byId(page, 'show-info').click()
    }

    await expect(byId(page, 'status-max')).toHaveText('2')
    await expect(byId(page, 'status-count')).toHaveText('2')
    await expect(boxes(page)).toHaveCount(2, { timeout: 4000 })
    await expect(cards(page).locator('.popout-card__title')).toHaveText(['3', '2'])
  })

  test('不合法的 duration 顯示 RangeError，輸入框還原', async ({ page }) => {
    await byId(page, 'duration-input').fill('-1')
    await byId(page, 'duration-input').dispatchEvent('change')

    await expect(byId(page, 'error')).toContainText('RangeError')
    await expect(byId(page, 'duration-input')).toHaveValue('5')
  })
})

test.describe('控制物件與 clear', () => {
  test('開始上傳 → update 成功', async ({ page }) => {
    await byId(page, 'task-start').click()
    await expect(cards(page).first()).toHaveClass(/popout-card--info/)
    await expect(byId(page, 'task-start')).toBeDisabled()

    await byId(page, 'task-finish').click()
    await expect(cards(page).first()).toHaveClass(/popout-card--success/)
    await expect(cards(page).first().locator('.popout-card__title')).toHaveText('Upload complete')
    await expect(byId(page, 'last-code')).toContainText('task.update(')
    await expect(byId(page, 'task-start')).toBeEnabled()
  })

  test('開始上傳 → close()', async ({ page }) => {
    await byId(page, 'task-start').click()
    await byId(page, 'task-close').click()

    await expect(byId(page, 'status-count')).toHaveText('0')
  })

  test('clear() 關閉所有訊息', async ({ page }) => {
    await byId(page, 'task-start').click()
    await byId(page, 'show-info').click()
    await byId(page, 'clear').click()

    await expect(byId(page, 'status-count')).toHaveText('0')
    await expect(boxes(page)).toHaveCount(0, { timeout: 4000 })
  })
})

test('用法分頁切換', async ({ page }) => {
  await byId(page, 'tab-core').click()
  await expect(page.locator('#usage [role=tabpanel]')).toContainText("from 'akira-c-popout-message-box/core'")

  await byId(page, 'tab-script').click()
  await expect(page.locator('#usage [role=tabpanel]')).toContainText('PopoutMessageBox.notify.success')
})
