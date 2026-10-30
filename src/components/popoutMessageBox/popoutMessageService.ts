// Vue 轉接層：把核心的狀態同步成 Vue ref，並提供與先前版本相同的服務介面
// Vue adapter: syncs core state into Vue refs and keeps the same service interface as before
import { ref } from 'vue'
import { notify } from './popoutMessageCore'

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
// - lifeTime: 彈出訊息存活時間（秒），預設為 5 秒
export interface PopoutMessageMethods {
  success: (mainString: string, despString?: string, lifeTime?: number) => void
  error: (mainString: string, despString?: string, lifeTime?: number) => void
  info: (mainString: string, despString?: string, lifeTime?: number) => void
  warning: (mainString: string, despString?: string, lifeTime?: number) => void
  debug: (mainString: string, despString?: string, lifeTime?: number) => void
  primary: (mainString: string, despString?: string, lifeTime?: number) => void
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
  setMaxItemNumber: notify.setMaxItemNumber,
  getMaxItemNumber: notify.getMaxItemNumber,
  status: status,
}
