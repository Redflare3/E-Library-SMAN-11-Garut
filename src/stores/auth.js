import { reactive, computed, readonly } from 'vue'
import * as authApi from '../api/auth.js'
import {
  getToken,
  setToken,
  clearToken,
  getCachedUser,
  setCachedUser,
  clearLegacyKeys
} from '../api/token.js'

// Store autentikasi tingkat modul (proyek tidak memakai Pinia)
const state = reactive({
  token: null,
  user: null,
  ready: false
})

let initPromise = null
let expiryTimer = null
let sessionExpiredHandler = null

// Ambil klaim `exp` (detik) dari payload JWT; null bila token tidak dapat dibaca
export function decodeExp(token) {
  try {
    const part = token.split('.')[1]
    if (!part) return null
    let base64 = part.replace(/-/g, '+').replace(/_/g, '/')
    while (base64.length % 4) base64 += '='
    const payload = JSON.parse(atob(base64))
    return typeof payload.exp === 'number' ? payload.exp : null
  } catch {
    return null
  }
}

function isExpired(token) {
  const exp = decodeExp(token)
  return exp === null || exp * 1000 <= Date.now()
}

function clearTimer() {
  if (expiryTimer) {
    clearTimeout(expiryTimer)
    expiryTimer = null
  }
}

function scheduleExpiry(token) {
  clearTimer()
  const exp = decodeExp(token)
  if (exp === null) return
  const ms = Math.min(exp * 1000 - Date.now(), 2 ** 31 - 1)
  expiryTimer = setTimeout(expireSession, Math.max(ms, 0))
}

function setSession(token, user) {
  state.token = token
  state.user = user
  setToken(token)
  setCachedUser(user)
  scheduleExpiry(token)
}

function logout() {
  clearTimer()
  state.token = null
  state.user = null
  clearToken()
}

// Token kedaluwarsa saat aplikasi berjalan: keluar dan beri tahu aplikasi (redirect ke login)
function expireSession() {
  if (!state.token) return
  logout()
  if (sessionExpiredHandler) sessionExpiredHandler()
}

// Timer bisa melenceng saat laptop tidur; periksa ulang saat tab kembali aktif
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && state.token && isExpired(state.token)) {
      expireSession()
    }
  })
}

async function restoreSession() {
  clearLegacyKeys()
  const token = getToken()
  if (!token) return
  if (isExpired(token)) {
    clearToken()
    return
  }

  state.token = token
  state.user = getCachedUser()
  try {
    const user = await authApi.me()
    setSession(token, user)
  } catch (err) {
    if (err.status === 0 || err.code === 'SERVER_UNREACHABLE') {
      // Backend sementara tidak terjangkau: pertahankan sesi dari cache
      scheduleExpiry(token)
    } else {
      logout()
    }
  }
}

function init() {
  if (!initPromise) {
    initPromise = restoreSession().finally(() => {
      state.ready = true
    })
  }
  return initPromise
}

async function login(username, password) {
  const { token, user } = await authApi.login(username, password)
  setSession(token, user)
  return user
}

const isLoggedIn = computed(() => !!state.token && !!state.user)
const isLibrarian = computed(() => state.user?.role === 'LIBRARIAN')
const isTeacher = computed(() => state.user?.role === 'TEACHER')
const isStaff = computed(() => isLibrarian.value || isTeacher.value)

function canEdit(item) {
  if (!item || !state.user) return false
  if (isLibrarian.value) return true
  return item.uploadedById != null && item.uploadedById === state.user.id
}

function homePath() {
  if (isLibrarian.value) return '/admin'
  if (isTeacher.value) return '/unggahan'
  return '/'
}

function onSessionExpired(fn) {
  sessionExpiredHandler = fn
}

export const auth = {
  state: readonly(state),
  isLoggedIn,
  isLibrarian,
  isTeacher,
  isStaff,
  canEdit,
  homePath,
  init,
  login,
  logout,
  onSessionExpired
}

export function useAuth() {
  return auth
}
