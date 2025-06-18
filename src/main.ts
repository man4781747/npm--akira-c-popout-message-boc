import { createApp } from 'vue'
import App from '@/App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@/style.css'

import PopoutMessagePlugin from 'akira-c-popout-message-box'

createApp(App).use(PopoutMessagePlugin).mount('#app')
