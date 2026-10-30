// 必須在載入 prism.js 之前執行：關閉 Prism 的自動上色，改由頁面以 Prism.highlight() 產生 HTML
// Must run before prism.js loads: turn off Prism's automatic highlighting; the page calls Prism.highlight() itself
;(window as any).Prism = { manual: true }
