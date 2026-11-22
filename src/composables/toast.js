import { reactive, readonly } from 'vue'

// Toast bersama untuk area staf (satu toast pada satu waktu). Ditampilkan oleh <ToastHost />.
const state = reactive({ visible: false, message: '', tone: 'success', id: 0 })
let timer = null

function show(message, { tone = 'success', duration = 3000 } = {}) {
  if (!message) return
  state.message = message
  state.tone = tone
  state.visible = true
  state.id++
  clearTimeout(timer)
  timer = setTimeout(hide, duration)
}

function hide() {
  clearTimeout(timer)
  state.visible = false
}

const toast = { state: readonly(state), show, hide }

export function useToast() {
  return toast
}
