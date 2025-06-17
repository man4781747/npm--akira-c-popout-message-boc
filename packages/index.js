import PopoutMessageBox from "../src/components/popoutMessageBox/popoutMessageBox.vue"
import PopoutMessagePlugin from "../src/components/popoutMessageBox/PopoutMessagePlugin"

export { PopoutMessageBox, PopoutMessagePlugin }

const components = [PopoutMessageBox]

const install = (App) => {
  components.forEach((item) => {
    App.component("PopoutMessageBox", PopoutMessageBox)
  })
  App.use(PopoutMessagePlugin)
}

export default {
  install
}