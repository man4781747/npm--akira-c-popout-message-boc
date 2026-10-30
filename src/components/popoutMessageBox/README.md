# 🧩 Popout Notification System
# 🧩 彈出式通知系統

This folder contains the source code of the `akira-c-popout-message-box` package. For installation, usage, API, and style customization, see the root [README](../../../README.md) / [繁體中文](../../../README.zh-TW.md).

此資料夾為 `akira-c-popout-message-box` 套件的原始碼。安裝方式、使用方法、API 與自訂樣式請見根目錄的 [README](../../../README.md) / [繁體中文](../../../README.zh-TW.md)。

---

## 📦 File Structure / 檔案結構
```
popoutMessageBox/
├── popoutMessageCore.ts     # Framework-agnostic core: DOM, animation, timers, limit, subscribe (no Vue)
│                            # 不依賴框架的核心：產生 DOM、動畫、計時、數量上限、狀態訂閱（不使用 Vue）
├── popoutMessageService.ts  # Vue adapter: syncs core state into refs (status), PopoutMessageMethods
│                            # Vue 轉接層：把核心狀態同步成 ref（status），定義 PopoutMessageMethods
├── PopoutMessagePlugin.ts   # Vue plugin: provides the service, usePopoutMessage()
│                            # Vue 插件：provide 通知服務、提供 usePopoutMessage()
└── popoutMessageBox.css     # Styles (nested CSS, compiled by postcss-nesting; BEM classes with popout- prefix)
                             # 樣式（巢狀 CSS，經 postcss-nesting 轉換；BEM 命名、popout- 前綴）
```

Library entries at the project root / 專案根目錄的打包入口：

- `packages/index.ts` → `akira-c-popout-message-box` (Vue)
- `packages/core.ts` → `akira-c-popout-message-box/core` (no Vue / 不使用 Vue)

## 🔄 How it works / 運作方式

1. `notify.success(...)` injects the styles into `<head>` and creates `#popout-message-box-list` under `<body>` (both only once), then builds the message DOM and prepends it.
   `notify.success(...)` 把樣式注入 `<head>`、在 `<body>` 下建立 `#popout-message-box-list`（皆只做一次），再建立訊息 DOM 並放到最上方。
2. Each message keeps its own timer; hovering pauses it and leaving resumes it. Clicking or timing out starts closing: it leaves the open list right away and its DOM is removed 2 seconds later.
   每則訊息各自計時；懸停時暫停、移開後繼續。點擊或時間到即開始關閉：立刻移出顯示中清單，2 秒後移除 DOM。
3. When the number of open messages exceeds the limit, the oldest ones are closed.
   顯示中的訊息超過上限時，從最舊的開始關閉。
4. Every change notifies `subscribe` listeners. The Vue adapter is one of them and keeps `status.count` / `status.maxItemNumber` in sync.
   每次變化都會通知 `subscribe` 的 listener；Vue 轉接層也是其中之一，用來同步 `status.count` / `status.maxItemNumber`。
