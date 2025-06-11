import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'

const pinia = createPinia()
const app = createApp(App)

// Initialize Pinia first
app.use(pinia)
// Then initialize router
app.use(router)
// Finally mount the app
app.mount('#app')
