import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import ElementPlus from 'element-plus' 
import 'element-plus/dist/index.css'  
import router from './router/index'
const app = createApp(App)
app.use(createPinia())
app.use(ElementPlus)  
app.use(router)
app.mount('#app')

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}