// Vue 轉接層：把核心的狀態同步成 Vue ref，並提供與先前版本相同的服務介面
// Vue adapter: syncs core state into Vue refs and keeps the same service interface as before
import { ref } from 'vue'
import { notify, type MessageHandle, type PopoutMessageOptions } from './popoutMessageCore'

const count = ref(notify.getCount())
const maxItemNumber = ref(notify.getMaxItemNumber())

notify.subscribe((state) => {
  count.value = state.count
  maxItemNumber.value = state.maxItemNumber
})

// 導出響應式狀態（唯讀用途，請透過 setMaxItemNumber 修改上限）
export const status = {
  count,
  maxItemNumber
}

// 定義 popoutMessage 所提供的方法介面：代表彈出訊息可使用的種類
// - mainString: 標題文字或主要訊息
// - despString: 補充說明（可選）
// - lifeTime: 彈出訊息存活時間（秒），省略時使用 duration 設定（預設 5 秒），0 代表不自動關閉
// 每個訊息方法都回傳 MessageHandle，可之後 close() 或 update()
export interface PopoutMessageMethods {
  success: (mainString: string, despString?: string, lifeTime?: number) => MessageHandle
  error: (mainString: string, despString?: string, lifeTime?: number) => MessageHandle
  info: (mainString: string, despString?: string, lifeTime?: number) => MessageHandle
  warning: (mainString: string, despString?: string, lifeTime?: number) => MessageHandle
  debug: (mainString: string, despString?: string, lifeTime?: number) => MessageHandle
  primary: (mainString: string, despString?: string, lifeTime?: number) => MessageHandle
  clear: () => void
  configure: (options: PopoutMessageOptions) => void
  setMaxItemNumber: (max: number) => void
  getMaxItemNumber: () => number
  status: {
    count: typeof count,
    maxItemNumber: typeof maxItemNumber,
  }
}

/*
  建立 popoutMessage 這個通知服務對象，實作 PopoutMessageMethods 介面
  - 每種通知方法直接交給核心 notify 處理
  - 這些方法可透過 provide/inject 系統傳遞給整個應用使用
*/
export const popoutMessage: PopoutMessageMethods = {
  success: notify.success,
  error: notify.error,
  info: notify.info,
  warning: notify.warning,
  debug: notify.debug,
  primary: notify.primary,
  clear: notify.clear,
  configure: notify.configure,
  setMaxItemNumber: notify.setMaxItemNumber,
  getMaxItemNumber: notify.getMaxItemNumber,
  status: status,
}
