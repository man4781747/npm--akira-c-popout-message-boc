# akira-c-popout-message-box

版本：0.0.10

一個基於 Vue 3 的彈出訊息框組件，提供多種樣式和自動消失功能。

[English](README.md) | 繁體中文

# [Demo Page](https://man4781747.github.io/Vue3_Typescript__PopoutMessageBox__Demo/)

## 安裝

```bash
npm install akira-c-popout-message-box
```

## 使用方法

### 全域註冊

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import PopoutMessagePlugin from 'akira-c-popout-message-box'
import 'akira-c-popout-message-box/lib/popout-message-box.css'

const app = createApp(App)
app.use(PopoutMessagePlugin)
app.mount('#app')
```

> 注意：套件會隨 package 發佈 `lib` 目錄，若需要樣式請額外引入 `lib/popout-message-box.css`。

### 在組件中使用

```typescript
<script setup>
import { usePopoutMessage } from 'akira-c-popout-message-box'

const notify = usePopoutMessage()

// 顯示成功訊息（預設顯示 5 秒）
notify.success('操作成功', '資料已成功儲存')

// 顯示錯誤訊息，指定顯示時間（秒）
notify.error('操作失敗', '請檢查網路連線', 7)

// 其他類型
notify.warning('注意事項', '此操作無法復原', 5)
notify.info('系統通知', '系統將於今晚進行維護', 5)
notify.primary('重要通知', '請更新您的密碼', 5)
notify.debug('除錯資訊', 'API 回應時間：200ms', 3)

// 設定同時顯示的最大訊息數量
notify.setMaxItemNumber(6)

// 取得目前最大顯示數量
const max = notify.getMaxItemNumber()

// 可透過狀態讀取目前顯示數量與最大值
// notify.status.count.value  -> 目前顯示中的訊息數
// notify.status.maxItemNumber.value -> 最大顯示數量
</script>
```

## 參數說明

每個通知方法都接受以下參數：

- `mainString`: 主要訊息文字（必填）
- `despString`: 補充說明文字（選填）
- `lifeTime`: 顯示時間（秒），預設為 5 秒（選填）

## 新增功能（0.0.10）

- 新增 API：`setMaxItemNumber(max)` 與 `getMaxItemNumber()`，可設定/取得同時顯示的訊息上限。
- 提供 `status` 物件，可透過 `notify.status.count` 讀取目前顯示數量。
- 修正自動移除與 DOM 清理流程，新增事件 `popout-removed` 作為內部移除同步機制。

## 樣式

本組件使用 Bootstrap 5 的樣式系統，支援以下訊息類型：

- `success`: 成功訊息（綠色）
- `error` / `fail`: 錯誤訊息（紅色）
- `warning`: 警告訊息（黃色）
- `info`: 一般訊息（藍色）
- `primary`: 主要訊息（深藍色）
- `debug`: 除錯訊息（灰色）

## 功能特點

- 自動消失計時器
- 滑鼠懸停時暫停計時
- 可點擊關閉
- 支援多個訊息同時顯示
- 響應式設計
- 動畫效果

## 開發

```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 建置函式庫
npm run build:lib

# 建置示範頁面
npm run build:demo
```

## 授權

MIT License