import { createApp } from 'vue'
import App from '@/App.vue'
import PopoutMessagePlugin from '@/components/popoutMessageBox/PopoutMessagePlugin'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@/style.css'

createApp(App).use(PopoutMessagePlugin).mount('#app')
