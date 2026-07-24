import { createApp } from 'vue'
import App from '@/App.vue'
import '@/style.css'

import PopoutMessagePlugin from 'akira-c-popout-message-box'

createApp(App).use(PopoutMessagePlugin).mount('#app')
