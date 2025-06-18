import PopoutMessageBox from "../src/components/popoutMessageBox/popoutMessageBox.vue"
import PopoutMessagePlugin, { usePopoutMessage } from "../src/components/popoutMessageBox/PopoutMessagePlugin"
import 'bootstrap/dist/css/bootstrap.min.css'
import '../src/style.css'

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