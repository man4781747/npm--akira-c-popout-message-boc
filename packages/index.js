import PopoutMessageBox from "../src/components/popoutMessageBox/popoutMessageBox.vue"
import PopoutMessagePlugin, { usePopoutMessage } from "../src/components/popoutMessageBox/PopoutMessagePlugin"

export { PopoutMessageBox, PopoutMessagePlugin, usePopoutMessage }

const components = [PopoutMessageBox]

const install = (App) => {
  components.forEach((item) => {
    App.component("PopoutMessageBox", PopoutMessageBox)
  })
  App.use(PopoutMessagePlugin)
}

export default {
  install,
  usePopoutMessage
}