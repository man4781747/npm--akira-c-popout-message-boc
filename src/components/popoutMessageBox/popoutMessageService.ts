// 匯入 createApp 與 h 函數：
// - createApp: 用來動態建立一個新的 Vue 應用（Component 實例）
// - h: 是 Vue 的虛擬 DOM 建立函數 (hyperscript)，用於手動渲染元件
import { render, createVNode  } from 'vue'
// 匯入自定義的通知元件 PopoutMessageBox（彈出通知 UI）
import PopoutMessageBox from '@/components/popoutMessageBox/popoutMessageBox.vue'
// 匯入 uuid 套件來產生唯一 ID，避免 DOM 元素 ID 衝突，以及提供後續操作的依據
import { v4 as uuidv4 } from 'uuid'

import { ref } from 'vue'

const count = ref(0)

/* 
  建立或取得通知用的容器（div#popout-message-box-list）
  - 若已有該容器，直接回傳它；
  - 若尚未建立，則建立新的 div 加入至 <body>
*/
import { getPopoutRootApp } from './PopoutMessagePlugin'


function createMessageBoxContainer(): HTMLElement {
  let container = document.getElementById('popout-message-box-list')
  if (!container) {
    container = document.createElement('div')
    container.id = 'popout-message-box-list'
    document.body.appendChild(container)
  }
  return container
}

/*
  建立單一通知訊息元件：
  - messageType: 類型（如 success、error）
  - mainString: 主訊息
  - despString: 補充說明（可選）
  - lifeTime: 存活秒數（預設 5 秒）
*/
const createMessage = (
  messageType: string,
  mainString: string,
  despString?: string,
  lifeTime: number = 5
) => {
  const container = createMessageBoxContainer()  // 確保通知容器存在
  const tempID = uuidv4()   // 為每一個通知產生唯一的 ID
  const tempDiv = document.createElement('div') // 為單一通知建立專屬 DOM 容器
  tempDiv.id = tempID 
  tempDiv.className = 'popout-message-box' // 套用樣式類別，可在 CSS 控制外觀

  const vnode = createVNode(PopoutMessageBox, {
    eleID: tempID,
    messageType,
    mainString,
    despString: despString || '', // Ensure despString is not undefined
    lifeTime,
  })
  // const app = getPopoutRootApp()
  vnode.appContext = getPopoutRootApp()._context
  render(vnode, tempDiv)
  container.appendChild(tempDiv) // The original code used prepend, let's stick to that for consistency. container.prepend(tempDiv)
  container.prepend(tempDiv) // 原本使用 appendChild，但根據先前邏輯使用 prepend：讓新通知出現在最上方
}

// 導出響應式狀態 
export const status = {
  count
}

// 定義 popoutMessage 所提供的方法介面：代表彈出訊息可使用的種類
// - mainString: 標題文字或主要訊息
// - despString: 補充說明（可選）
// - lifeTime: 彈出訊息存活時間（秒），預設為 5 秒
export interface PopoutMessageMethods {
  success: (mainString: string, despString?: string, lifeTime?: number) => void
  error: (mainString: string, despString?: string, lifeTime?: number) => void
  info: (mainString: string, despString?: string, lifeTime?: number) => void
  warning: (mainString: string, despString?: string, lifeTime?: number) => void
  debug: (mainString: string, despString?: string, lifeTime?: number) => void
  primary: (mainString: string, despString?: string, lifeTime?: number) => void
  status: {
    count: typeof count,
  }
}

/*
  建立 popoutMessage 這個通知服務對象，實作 PopoutMessageMethods 介面
  - 每種通知方法都是呼叫 createMessage 並指定對應的樣式類型
  - 這些方法可透過 provide/inject 系統傳遞給整個應用使用
*/
export const popoutMessage: PopoutMessageMethods = {
  success: (mainString, despString, lifeTime) =>
    createMessage('success', mainString, despString, lifeTime),
  error: (mainString, despString, lifeTime) =>
    createMessage('fail', mainString, despString, lifeTime), // 'fail' was used in popoutMessageBox.vue styling & old index.ts
  info: (mainString, despString, lifeTime) =>
    createMessage('info', mainString, despString, lifeTime),
  warning: (mainString, despString, lifeTime) =>
    createMessage('warning', mainString, despString, lifeTime),
  debug: (mainString, despString, lifeTime) =>
    createMessage('debug', mainString, despString, lifeTime),
  primary: (mainString, despString, lifeTime) =>
    createMessage('primary', mainString, despString, lifeTime),
  status: status,
}