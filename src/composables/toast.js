import { reactive, readonly, markRaw } from 'vue'

// Toast bersama (satu toast pada satu waktu). Ditampilkan oleh <ToastHost /> di App.vue (publik)
// dan StaffLayout (staf).
// action opsional: { label, onClick } atau { label, to } (tautan router)
const state = reactive({ visible: false, message: '', tone: 'success', id: 0, action: null })
let timer = null

function show(message, { tone = 'success', duration = 3000, action = null } = {}) {
  if (!message) return
  state.message = message
  state.tone = tone
  state.action = action ? markRaw({ ...action }) : null
  state.visible = true
  state.id++
  clearTimeout(timer)
  timer = setTimeout(hide, duration)
}

function hide() {
  clearTimeout(timer)
  state.visible = false
}

// Jalankan aksi toast lalu sembunyikan
function runAction() {
  const action = state.action
  hide()
  if (action?.onClick) action.onClick()
}

const toast = { state: readonly(state), show, hide, runAction }

export function useToast() {
  return toast
}
