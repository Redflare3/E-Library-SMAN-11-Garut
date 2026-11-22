import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { auth } from './stores/auth.js'
import { setUnauthorizedHandler } from './api/client.js'

// Sesi berakhir (401 dari backend atau JWT `exp` lewat): bersihkan sesi lalu ke halaman login
function handleSessionEnded() {
  auth.logout()
  const current = router.currentRoute.value
  if (current.name === 'Login') return
  router.push({
    name: 'Login',
    query: { redirect: current.fullPath, expired: '1' }
  })
}

setUnauthorizedHandler(handleSessionEnded)
auth.onSessionExpired(handleSessionEnded)
auth.init()

const app = createApp(App)
app.use(router)
app.mount('#app')
