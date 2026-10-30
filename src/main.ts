import { createApp } from 'vue'
import App from '@/App.vue'
import '@/style.css'
import '@/prism.css'
import '@/prismSetup'
import '@/prism.js'

import PopoutMessagePlugin from 'akira-c-popout-message-box'

createApp(App).use(PopoutMessagePlugin).mount('#app')
