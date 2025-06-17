# 🧩 Popout Notification System for Vue 3/TypeScript
# 🧩 Vue 3/TypeScript 彈出式通知系統

A pluggable popup notification component system that supports multiple message types (success, error, warning, etc.). It displays brief messages in the top-right corner with animations and automatically fades out after a set time. Suitable for any Vue 3 project.

這是一個可插拔的彈出式通知元件系統，支援多種訊息類型（成功、錯誤、警告等），能在畫面右上方以動畫顯示簡短訊息，並在設定時間後自動淡出。適用於任何 Vue 3 專案。

---

## 📦 File Structure / 檔案結構
```
components/
├── popoutMessageBox.vue    # Single message display component (animation, content, timer control)
│                          # 單一訊息顯示元件（動畫、內容、計時控制）
├── popoutMessageService.ts # Message creation logic and external call interface
│                          # 訊息建立邏輯與外部調用接口
└── PopoutMessagePlugin.ts  # Vue plugin, provides global notification service for injection
                           # Vue 插件，提供 inject 用的全域通知服務
```

---

## 🚀 Installation & Usage / 安裝與使用

### 1️⃣ Install Plugin (main.ts) / 安裝插件（main.ts）

```ts
import { createApp } from 'vue'
import App from './App.vue'
import PopoutMessagePlugin from '@/components/popoutMessageBox/PopoutMessagePlugin'

const app = createApp(App)
app.use(PopoutMessagePlugin)
app.mount('#app')
```

### 2️⃣ Using Notifications in Components / 在組件中使用通知功能

Example 1 / 範例1
```ts
----- xxx.ts ----
import { usePopoutMessage } from '@/components/popoutMessageBox/PopoutMessagePlugin'

export default {
  setup() {
    const notify = usePopoutMessage()
    notify.success('儲存成功', '資料已更新')
    notify.error('儲存失敗', '請稍後再試', 10)
  }
}
```

Example 2 / 範例2
```ts
----- xxx.vue ----
<script setup lang="ts">
  const { count, add, logMsg } = useCounter()
  import { usePopoutMessage } from '@/components/popoutMessageBox/PopoutMessagePlugin'
  const $notify = usePopoutMessage()
</script>

<template>
  <div class="container">
    <div class="row">
      <h1>Popout Logs Show (total: {{ $notify.status.count }})</h1>
      <div class="col">
        <div class="input-group mb-3">
          <input type="text" class="form-control" v-model="logMsg">
          <button class="btn btn-success" @click="$notify.success(logMsg, 'Success訊息', 10)">Success訊息</button>
          <button class="btn btn-danger" @click="$notify.error(logMsg, 'Error訊息', 10)">Error/Fail訊息</button>
          <button class="btn btn-info" @click="$notify.info(logMsg, 'Info訊息', 10)">Info訊息</button>
          <button class="btn btn-warning" @click="$notify.warning(logMsg, 'Waring訊息', 10)">Warning訊息</button>
          <button class="btn btn-secondary" @click="$notify.debug(logMsg, 'Debug訊息', 10)">Debug訊息</button>
          <button class="btn btn-primary" @click="$notify.primary(logMsg, 'Primary訊息', 10)">Primary訊息</button>
        </div>
      </div>
    </div>
  </div>
</template>
```

## 📝 API Reference / API 參考

### Message Types / 訊息類型
- `success`: 成功訊息 (綠色)
- `error`: 錯誤訊息 (紅色)
- `info`: 資訊訊息 (藍色)
- `warning`: 警告訊息 (黃色)
- `debug`: 除錯訊息 (灰色)
- `primary`: 主要訊息 (深藍色)

### Parameters / 參數
- `mainString`: 主要訊息文字
- `despString`: 補充說明文字（選填）
- `lifeTime`: 顯示時間（秒），預設為 5 秒

### Example Usage / 使用範例
```ts
const notify = usePopoutMessage()

// Success message / 成功訊息
notify.success('操作成功', '資料已更新', 5)

// Error message / 錯誤訊息
notify.error('操作失敗', '請稍後再試', 10)

// Info message / 資訊訊息
notify.info('系統通知', '系統將於 5 分鐘後維護', 8)

// Warning message / 警告訊息
notify.warning('注意事項', '請確認資料正確性', 6)

// Debug message / 除錯訊息
notify.debug('除錯資訊', 'API 回應時間: 200ms', 4)

// Primary message / 主要訊息
notify.primary('重要通知', '請更新您的密碼', 7)
```