# akira-c-popout-message-box

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

const app = createApp(App)
app.use(PopoutMessagePlugin)
app.mount('#app')
```

### 在組件中使用

```typescript
<script setup>
import { usePopoutMessage } from 'akira-c-popout-message-box'

const notify = usePopoutMessage()

// 顯示成功訊息
notify.success('操作成功', '資料已成功儲存')

// 顯示錯誤訊息
notify.error('操作失敗', '請檢查網路連線')

// 顯示警告訊息
notify.warning('注意事項', '此操作無法復原')

// 顯示一般訊息
notify.info('系統通知', '系統將於今晚進行維護')

// 顯示主要訊息
notify.primary('重要通知', '請更新您的密碼')

// 顯示除錯訊息
notify.debug('除錯資訊', 'API 回應時間：200ms')
</script>
```

## 參數說明

每個通知方法都接受以下參數：

- `mainString`: 主要訊息文字（必填）
- `despString`: 補充說明文字（選填）
- `lifeTime`: 顯示時間（秒），預設為 5 秒（選填）

## 樣式

本組件使用 Bootstrap 5 的樣式系統，支援以下訊息類型：

- `success`: 成功訊息（綠色）
- `error`: 錯誤訊息（紅色）
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