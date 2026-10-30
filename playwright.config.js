import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: 'tests/e2e',
  use: {
    baseURL: 'http://localhost:5173',
    // demo 頁依瀏覽器語言決定預設語言，固定為英文讓測試結果一致
    locale: 'en-US',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  // 使用 src 原始碼啟動 demo（等同 dev:local）
  // Start the demo from source (same as dev:local)
  webServer: {
    command: 'pnpm exec vite --config vite.demo.config.js --port 5173 --strictPort',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
  },
})
