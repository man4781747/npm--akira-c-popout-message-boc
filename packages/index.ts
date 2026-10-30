// Vue 入口：akira-c-popout-message-box
import type { App } from 'vue'
import PopoutMessagePlugin, { usePopoutMessage } from "../src/components/popoutMessageBox/PopoutMessagePlugin"

export { PopoutMessagePlugin, usePopoutMessage }
// 在元件以外（如 axios 攔截器、router guard）也能直接使用，與 usePopoutMessage() 共用同一份狀態
export { notify } from "../src/components/popoutMessageBox/popoutMessageCore"
export type { PopoutMessageMethods } from "../src/components/popoutMessageBox/popoutMessageService"
export type {
  MessageType,
  PopoutMessageCore,
  PopoutMessageListener,
  PopoutMessageState,
} from "../src/components/popoutMessageBox/popoutMessageCore"

const install = (App: App) => {
  App.use(PopoutMessagePlugin)
}

export default {
  install,
  usePopoutMessage
}
