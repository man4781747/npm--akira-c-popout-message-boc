# akira-c-popout-message-box

版本：0.1.0

輕量的彈出訊息框，提供多種樣式和自動消失功能。核心不依賴任何框架，可在原生 JS 或任何框架中使用，並提供 Vue 3 plugin。

[English](README.md) | 繁體中文

# [Demo Page](https://man4781747.github.io/Vue3_Typescript__PopoutMessageBox__Demo/)

## 安裝

```bash
npm install akira-c-popout-message-box
```

> 只使用 `/core` 時不需要 Vue；使用 Vue plugin 時需要 Vue 3（`vue` 為選用的 peerDependency，會使用專案中已安裝的 Vue）。

樣式已內建於 JS 中，顯示第一則訊息時會自動注入，不需要另外引入 CSS。

## 不使用 Vue（原生 JS／其他框架）

```javascript
import { notify } from 'akira-c-popout-message-box/core'

notify.success('操作成功', '資料已成功儲存')
notify.error('操作失敗', '請檢查網路連線', 7)
```

### 以 `<script>` 引入

```html
<script src="https://unpkg.com/akira-c-popout-message-box@0.1.0/lib/popout-message-box-core.umd.cjs"></script>
<script>
  PopoutMessageBox.notify.success('操作成功', '資料已成功儲存')
</script>
```

### 讀取與訂閱狀態

```javascript
notify.getCount()          // 目前顯示中的訊息數
notify.getMaxItemNumber()  // 同時顯示的上限

// 狀態變化（建立、關閉、設定上限）時收到通知，回傳取消訂閱的函數
const unsubscribe = notify.subscribe(({ count, maxItemNumber }) => {
  badge.textContent = `${count}/${maxItemNumber}`
})
unsubscribe()
```

## 在 Vue 3 中使用

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

// 顯示成功訊息（預設顯示 5 秒）
notify.success('操作成功', '資料已成功儲存')

// 顯示錯誤訊息，指定顯示時間（秒）
notify.error('操作失敗', '請檢查網路連線', 7)

// 其他類型
notify.warning('注意事項', '此操作無法復原', 5)
notify.info('系統通知', '系統將於今晚進行維護', 5)
notify.primary('重要通知', '請更新您的密碼', 5)
notify.debug('除錯資訊', 'API 回應時間：200ms', 3)

// 設定同時顯示的最大訊息數量（必須是大於等於 1 的整數，否則拋出 RangeError）
// 若目前顯示數量超過新的上限，會立即關閉最舊的訊息
notify.setMaxItemNumber(6)

// 取得目前最大顯示數量
const max = notify.getMaxItemNumber()

// 可透過響應式狀態（Vue ref，唯讀用途）讀取目前顯示數量與最大值
// notify.status.count.value  -> 目前顯示中的訊息數
// notify.status.maxItemNumber.value -> 最大顯示數量
</script>
```

### 在組件以外使用

在 axios 攔截器、router guard、Pinia store 等不在 `setup()` 中的地方，可直接匯入 `notify`，與 `usePopoutMessage()` 共用同一份狀態：

```typescript
import { notify } from 'akira-c-popout-message-box'

axios.interceptors.response.use(undefined, (error) => {
  notify.error('請求失敗', error.message)
  return Promise.reject(error)
})
```

### 以 `<script>` 引入

需先載入 Vue，全域變數為 `PopoutMessageBoxVue`：

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
<script src="https://unpkg.com/akira-c-popout-message-box@0.1.0/lib/popout-message-box.umd.cjs"></script>
<script>
  Vue.createApp(App).use(PopoutMessageBoxVue.default).mount('#app')
</script>
```

## 設定

可設定同時顯示的上限、預設顯示秒數與顯示位置，只會套用有傳入的欄位：

```typescript
// Vue：安裝時帶入
app.use(PopoutMessagePlugin, { max: 5, duration: 3, position: 'bottom-right' })

// 不使用 Vue，或在執行中修改
notify.configure({ position: 'top-center' })
notify.getConfig() // { max: 5, duration: 3, position: 'top-center' }
```

| 選項 | 預設 | 說明 |
|---|---|---|
| `max` | `10` | 同時顯示的上限，必須是大於等於 1 的整數（同 `setMaxItemNumber`） |
| `duration` | `5` | 未指定 `lifeTime` 時的顯示秒數；`0` 代表不自動關閉 |
| `position` | `'top-right'` | `'top-left'`、`'top-center'`、`'top-right'`、`'bottom-left'`、`'bottom-center'`、`'bottom-right'` |

- 放在上方時新訊息在最上面；放在下方時新訊息在最下面（永遠最靠近畫面邊緣）。
- 不合法的值會拋出 `RangeError`，且整組設定都不會套用。
- 容器已顯示時修改 `position` 會立即移動。

## 控制訊息

### 不自動關閉

`lifeTime` 傳 `0` 的訊息不會自動關閉（也不顯示倒數），使用者點擊或程式呼叫 `close()` 才會關閉，適合重要錯誤：

```typescript
notify.error('付款失敗', '請聯絡客服', 0)
```

### 控制物件

每個訊息方法都會回傳控制物件：

```typescript
const msg = notify.info('上傳中…', '請稍候', 0)

// 之後修改內容；只改有傳入的欄位，並以新的（或原本的）lifeTime 重新計時
msg.update({ type: 'success', mainString: '上傳完成', despString: '', lifeTime: 3 })

// 或直接關閉
msg.close()
```

`update()` 可傳入的欄位：

| 欄位 | 說明 |
|---|---|
| `mainString` | 主要訊息文字 |
| `despString` | 補充說明文字 |
| `type` | `'success'`、`'error'`、`'info'`、`'warning'`、`'debug'`、`'primary'` |
| `lifeTime` | 新的顯示秒數（`0` 代表不自動關閉） |

- 已開始關閉的訊息呼叫 `update()` 不會有任何變化，`close()` 重複呼叫也沒有影響。
- 不合法的 `type` 或 `lifeTime` 會拋出 `RangeError`。

### 全部關閉

```typescript
notify.clear()
```

## TypeScript

套件附帶型別宣告，可直接取得型別提示，也可匯入相關型別：

```typescript
// Vue
import { usePopoutMessage, type PopoutMessageMethods } from 'akira-c-popout-message-box'
const notify: PopoutMessageMethods = usePopoutMessage()

// 不使用 Vue
import { notify, type PopoutMessageState, type PopoutMessageCore } from 'akira-c-popout-message-box/core'

// 其他型別：MessageHandle、MessageUpdate、MessageType、Position、PopoutMessageOptions
```

## API

### 訊息方法

`success` / `error` / `info` / `warning` / `debug` / `primary` 都接受以下參數：

- `mainString`: 主要訊息文字（必填）
- `despString`: 補充說明文字（選填）
- `lifeTime`: 顯示時間（秒），省略時使用 `duration` 設定（預設 5 秒）；`0` 代表不自動關閉；負數或 `NaN` 拋出 `RangeError`（選填）

回傳控制物件 `{ close(), update(changes) }`，見[控制訊息](#控制訊息)。

### 其他方法

| 方法 | core | Vue | 說明 |
|---|---|---|---|
| `configure(options)` | ✓ | ✓ | 修改設定，見[設定](#設定) |
| `getConfig()` | ✓ | （透過 `notify`） | 取得目前設定 |
| `clear()` | ✓ | ✓ | 關閉所有顯示中的訊息 |
| `setMaxItemNumber(max)` | ✓ | ✓ | 設定同時顯示的上限（預設 10），等同 `configure({ max })`。必須是大於等於 1 的整數，否則拋出 `RangeError` |
| `getMaxItemNumber()` | ✓ | ✓ | 取得上限 |
| `getCount()` | ✓ | | 取得目前顯示中的訊息數 |
| `subscribe(listener)` | ✓ | | 狀態變化時呼叫 `listener({ count, maxItemNumber })`，回傳取消訂閱的函數 |
| `status.count` / `status.maxItemNumber` | | ✓ | Vue ref，可直接用在模板中 |

> 從 `akira-c-popout-message-box` 匯入的 `notify` 就是 core 的 `notify`，因此 Vue 專案也可以使用 `getConfig()`、`getCount()` 與 `subscribe()`。

## 變更說明

### 0.1.0

**⚠️ 破壞性變更**

- 核心改為不依賴 Vue，訊息不再以 Vue 元件渲染：
  - 不再匯出 `PopoutMessageBox` 元件，`app.use()` 時也不再全域註冊 `<PopoutMessageBox>`。
  - 樣式改為在**顯示第一則訊息時**才注入 `<head>`（原本是載入套件時）。
  - 訊息外層 div 不再有隨機 `id`；內部同步用的 `removed`、`popout-removed` 事件也已移除。
- UMD 的全域變數名稱修正：Vue 版由拼錯的 `PopoutMwessageBox` 改為 `PopoutMessageBoxVue`；新增的 core 版為 `PopoutMessageBox`。
- 元件內部的 class 名稱改為 BEM 命名並加上 `popout-` 前綴，避免與頁面上其他樣式（例如 Bootstrap 的 `.card`）互相影響。若您曾以舊名稱覆寫樣式，請依下表更新：

  | 舊名稱 | 新名稱 |
  |---|---|
  | `.card` | `.popout-card` |
  | `.card-body` | `.popout-card__body` |
  | `.card-title` | `.popout-card__title` |
  | `.card-desp` | `.popout-card__desp` |
  | `.success` `.fail` `.info` `.warning` `.primary` `.debug` | `.popout-card--success` `.popout-card--fail` `.popout-card--info` `.popout-card--warning` `.popout-card--primary` `.popout-card--debug` |
  | `.time-mask` | `.popout-card__time-mask` |
  | `.stop` | `.popout-card__time-mask--stop` |
  | 動畫 `when-create-*` | `popout-slide-*` |
  | `@keyframes time_mask_anime` | `@keyframes popout-time-mask` |

- `setMaxItemNumber` 收到不是大於等於 1 的整數（例如 `0`、負數、`NaN`、小數）時，改為拋出 `RangeError`（原本會直接接受）。
- `lifeTime` 為負數或 `NaN` 時改為拋出 `RangeError`（原本會立即關閉）；`lifeTime` 為 `0` 改為代表不自動關閉。
- 訊息方法改為回傳控制物件（原本沒有回傳值）。
- `vue` 由 `dependencies` 改為選用的 `peerDependencies`，避免專案中安裝到第二份 Vue；只使用 `/core` 時不需要安裝 Vue。

**新增**

- 不依賴框架的入口 `akira-c-popout-message-box/core`，提供 `notify` 與 `getCount()`、`subscribe()`。
- 設定：`notify.configure({ max, duration, position })`、`notify.getConfig()`，Vue 可用 `app.use(PopoutMessagePlugin, options)` 帶入。
- 顯示位置：支援上、下方的左、中、右六個位置；下方位置時新訊息在最下面。
- 不自動關閉：`lifeTime`（或 `duration`）為 `0` 時不自動關閉。
- 控制物件：訊息方法回傳 `{ close(), update() }`，`update()` 可修改文字、類型與顯示時間並重新計時。
- `notify.clear()` 關閉所有訊息。
- Vue 入口匯出 `notify`，可在組件以外使用。
- 附帶 TypeScript 型別宣告（`.d.ts`），並匯出 `PopoutMessageMethods`、`PopoutMessageCore`、`PopoutMessageState` 等型別。
- 調低 `setMaxItemNumber` 時，會立即關閉超出上限的最舊訊息（原本要等下一則訊息建立時才生效）。

**修正**

- 點擊關閉訊息後滑鼠移開，`status.count` 會被重複扣減的問題。
- 同一個 tick 內連續建立超過上限的訊息時，被擠出的訊息不會關閉的問題。
- 移除每次建立訊息時殘留的 `console.log`。
- 載入套件時不再存取 `document`，可在 SSR 環境中匯入。

**其他**

- 移除 `uuid` 依賴，套件不再有任何執行期依賴。

### 0.0.10

- 新增 API：`setMaxItemNumber(max)` 與 `getMaxItemNumber()`，可設定/取得同時顯示的訊息上限。
- 提供 `status` 物件，可透過 `notify.status.count` 讀取目前顯示數量。
- 修正自動移除與 DOM 清理流程，新增事件 `popout-removed` 作為內部移除同步機制。

## 樣式

不依賴 Bootstrap。若頁面上有 Bootstrap 5 的 CSS 變數（如 `--bs-green`），會沿用其顏色，否則使用內建的後備色。支援以下訊息類型：

- `success`: 成功訊息（綠色）
- `error`: 錯誤訊息（紅色，class 為 `popout-card--fail`）
- `warning`: 警告訊息（黃色）
- `info`: 一般訊息（藍色）
- `primary`: 主要訊息（深藍色）
- `debug`: 除錯訊息（灰色）

### 自訂樣式

可透過以下 class 覆寫樣式：

| 選擇器 | 說明 |
|---|---|
| `#popout-message-box-list` | 所有訊息的容器（固定於畫面上，位置依 `position` 設定） |
| `.popout-position--top-right` 等 | 容器目前的位置（加在容器上） |
| `.popout-message-box` | 單則訊息的外層 |
| `.popout-card` | 訊息卡片 |
| `.popout-card--success` / `--fail` / `--info` / `--warning` / `--primary` / `--debug` | 各訊息類型（左側邊框顏色） |
| `.popout-card__body` | 卡片內容區（內距） |
| `.popout-card__title` | 主要訊息文字 |
| `.popout-card__desp` | 補充說明文字 |
| `.popout-card__time-mask` | 倒數計時遮罩 |
| `.popout-card__time-mask--stop` | 滑鼠懸停時的遮罩（動畫暫停） |

內建樣式在顯示第一則訊息時才注入 `<head>`，通常排在您的 CSS 之後，因此覆寫時需使用**更高**的權重（例如在內建選擇器前加上 `body`）：

```css
body #popout-message-box-list .popout-message-box .popout-card.popout-card--success {
  border-color: #00b894;
}

body #popout-message-box-list .popout-message-box .popout-card .popout-card__body {
  padding: 0.75rem;
}
```

只想換顏色時，也可以直接設定 CSS 變數（`info` 類型除外，它使用固定色）：

```css
:root {
  --bs-green: #00b894;     /* success */
  --bs-red: #d63031;       /* error */
  --bs-warning: #fdcb6e;   /* warning */
  --bs-primary: #0984e3;   /* primary */
  --bs-secondary: #636e72; /* debug */
  --bs-gray-500: #999;     /* 補充說明文字 */
}
```

## 功能特點

- 核心不依賴框架，另提供 Vue 3 plugin
- 自動消失計時器
- 滑鼠懸停時暫停計時
- 可點擊關閉
- 支援多個訊息同時顯示，並可設定上限
- 六個顯示位置
- 可不自動關閉，或之後修改、關閉訊息
- 響應式設計
- 動畫效果
- 附帶 TypeScript 型別
- 無執行期依賴

## 開發

```bash
# 安裝依賴
pnpm install

# 開發模式（直接使用 src 原始碼）
pnpm run dev:local

# 開發模式（先建置 lib，再以建置產物執行，模擬正式使用）
pnpm run dev:built

# 建置函式庫（依序建置 ESM、core UMD、Vue UMD）
pnpm run build:lib

# 建置示範頁面
pnpm run build:demo
```

> `dev:local` 與 `dev:built` 使用 Windows 的 `set` 語法設定環境變數，目前僅支援 Windows。

## 授權

MIT License
