import { createApp } from 'vue'
import App from './App.vue'

import router from './router'

import { addCollection } from '@iconify/vue'
import mdi from "@iconify-json/mdi/icons.json"

addCollection(mdi)

const app = createApp(App)
app.use(router)
app.mount('#app')
